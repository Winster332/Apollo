

type App<T> = React.FC<T>
	& {
		getTitle: (props: T) => string;
	};

export const createApp = <T>(app: (props: T) => JSX.Element, titleGetter: (props: T) => string): App<T> => {
	const unknownApp: any = app;
	unknownApp.getTitle = titleGetter;
	return unknownApp;
};