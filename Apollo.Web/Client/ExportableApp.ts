import * as fs from 'fs';
import * as path from 'path';

const read = require('recursive-readdir-sync');

export class ExportableApp {
	constructor(filePath: string) {
		this.appName = ExportableApp.replaceAll(filePath.replace('.tsx', '').replace('Apps' + path.sep, ''), path.sep, '');
		this.className = filePath.substr(filePath.lastIndexOf(path.sep) + 1).replace('.tsx', '');
		this.cssClassName = this.appName.replace('App', '');
		const importFromTemplate = '.' + path.sep + filePath.replace('.tsx', '');
		this.importFrom = path.sep !== '/' ? ExportableApp.replaceAll(importFromTemplate, path.sep, '/') : importFromTemplate;
	}

	public appName: string;
	private className: string;
	private importFrom: string;
	private cssClassName: string;

	public getImport() {
		return `import { ${this.className} as ${this.appName} } from \'${this.importFrom}\';`;
	}

	public getExport() {
		return `'${this.appName}': { app: ${this.appName}, cssClass: '${this.cssClassName}' },`;
	}

	private static replaceAll(where: string, what: string, to: string) {
		while (-1 !== where.indexOf(what)) {
			where = where.replace(what, to);
		}

		return where;
	}
}

export class ImportFile {
	constructor(private readonly fileName: string) {}

	public generate(apps: ExportableApp[]) {
		let content = 'import { AppNames } from \'./AppNames\';\r\n';

		apps.forEach((app) => {
			content += app.getImport() + '\r\n';
		});

		content += 'import { StaticApp } from \'./StaticApp\';\r\n\r\n';

		content += 'export const Apps = {\r\n';

		apps.forEach((app) => {
			content += `\t${app.getExport()}\r\n`;
		});

		content += '} as { [key in AppNames]: { app: StaticApp, cssClass: string } };';

		fs.writeFileSync(this.fileName, content);
	}
}

export class AppNamesFile {
	constructor(private readonly fileName: string) {}

	public generate(apps: ExportableApp[]) {
		let content = 'export type AppNames =\r\n';
		content += apps.map(app => '\t\'' + app.appName + '\'').join(' |\r\n');
		content += ';';
		fs.writeFileSync(this.fileName, content);
	}

}

export const getApps = () => {
	const testFolder = './Apps/';
	const files: string[] = read(testFolder);

	return files
		.filter(file => file.endsWith('App.tsx'))
		.map(file => new ExportableApp(file));
};