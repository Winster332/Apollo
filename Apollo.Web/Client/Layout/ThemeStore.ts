import { isClient } from '@Shared/Environment';
import {autorun, computed, makeObservable, observable} from 'mobx';
import { AppTheme } from './CommonStore';
// import {fromClient, fromServer} from "@Shared/ClientServerTransform";

type LocalStoreTheme = {
	value: AppTheme;
};

export class ThemeStore {
	@observable
	private readonly theme: LocalStoreTheme;
	private static readonly localStorageKey = 'apolloThemeStorage';
	public onChanged?: (newTheme: AppTheme) => void;

	constructor() {
		makeObservable(this);
		this.theme = ({
			value: AppTheme.Light
		});

		if (isClient()) {
			const savedThemeJson = window.localStorage.getItem(ThemeStore.localStorageKey);
			if (savedThemeJson) {
				const localStoreTheme = JSON.parse(savedThemeJson) as LocalStoreTheme;
				this.setTheme(localStoreTheme.value);
			}

			autorun(() => {
				const appTheme = JSON.stringify(this.theme);
				window.localStorage.setItem(ThemeStore.localStorageKey, appTheme);
			});
		}
	}

	@computed
	public get current() {
		return this.theme.value;
	}

	public setTheme(theme: AppTheme) {
		this.theme.value = theme;

		if (this.onChanged) {
			this.onChanged(this.theme.value);
		}
	}
}
