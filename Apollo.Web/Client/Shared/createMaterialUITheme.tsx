import { Theme, createMuiTheme } from '@material-ui/core/styles';

export const createLightMaterialUITheme: () => Theme = () => createMuiTheme({
	palette: {
		primary: {
			main: '#727272'
		},
		secondary: {
			main: '#c10914'
		},
		text: {
			primary: '#333',
			secondary: '#666',
			disabled: '#ccc',
			hint: '#999'
		}
	}
});

export const createDarkMaterialUITheme: () => Theme = () => createMuiTheme({
	palette: {
		type: 'dark',
		background: {
			default: '#0a1929',
			paper: '#0a1929'
		},
		primary: {
			main: '#90caf9',
			dark: '#CCC',
			light: '#52a0e8'
		},
		secondary: {
			main: '#52b552',
			dark: '#CCC',
			light: '#82e582'
		},
		error: {
			main: '#e00000',
			dark: '#CCC',
			light: '#a25c5c'
		},
		text: {
			primary: 'rgb(178, 186, 194)',
			secondary: '#fff',
			disabled: '#ccc',
			hint: '#fff'
		}
	},
	
	overrides: {
		MuiAppBar: {
			colorPrimary: {
				backgroundColor: 'rgba(10, 25, 41, 0.7)'
			}
			// : '';
		},
		MuiTableRow: {
			root: {
				'&:last-child td': {
					borderBottom: 0,
				},
			}
		},
		MuiButton: {
			root: {
				outlinedPrimary: {
					color: '#ccc'
				}
			}
		},
		MuiTypography: {
			root: {
				h6: '#CCC'
			}
		}
	}
});
