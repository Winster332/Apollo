import { Theme } from '@material-ui/core';
import { DefaultTheme } from 'styled-components';

export const createStyledComponentsTheme: (materialTheme: Theme) => DefaultTheme = (materialTheme: Theme) => ({
	...materialTheme,
	sidebarWidth: '240px'
});