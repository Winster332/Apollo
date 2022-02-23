import * as React from 'react';

export type StaticApp = React.FC<any> & {
	getTitle: (props: any) => string;
};