export const isClient = () => {
	return typeof document !== 'undefined' && !!document.createElement;
};