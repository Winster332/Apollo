import { Card, Divider, Paper, Table, TextField } from '@material-ui/core';
import styled from 'styled-components';

export const MarginTextField = styled(TextField)`
	margin-bottom: 15px;
	display: block;
	width: 100%;
	.MuiInput-root {
		width: 100%;
	}
`;

export const VerticalMarginDiv = styled.div`
	margin-top: 15px;
	margin-bottom: 15px;
`;

export const MarginDivider = styled(Divider)`
	margin-bottom: 15px;
`;

export const MarginCard = styled(Card)`
	margin-bottom: 15px;
`;

export const HeadPaper = styled(Paper)`
	margin-bottom: ${props => props.theme.spacing(1)}px;
	padding: ${props => props.theme.spacing(1)}px ${props => props.theme.spacing(2)}px;
`;

export const KeyValueTable = styled(Table)`
	tbody > tr > td:first-child {
		width: 30%;
		color: ${props => props.theme.palette.text.secondary}
	}
`;