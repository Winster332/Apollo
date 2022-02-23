import { TextField, TextFieldProps } from '@material-ui/core';
import { Autocomplete as MaterialUiAutocomplete } from '@material-ui/lab';
import * as React from 'react';
import { MarginTextField } from './Forms';

export type AutocompleteImplProps<T> = {
	value: T | null | undefined;
	options: T[];
	getOptionLabel: (option: T) => string;
	emptyText: string;
	fieldLabel: string;
	onSelect: (option: T | null, evt: React.ChangeEvent<unknown>) => void;
	textFieldProps?: Partial<TextFieldProps>;
	disabled?: boolean;
	renderOption?: (option: T) => React.ReactNode;
	withMargins?: boolean;
	style?: React.CSSProperties;
};

export const AutocompleteImpl = <T extends unknown>(props: AutocompleteImplProps<T>) =>
{
	const TextFieldComponent = props.withMargins ? MarginTextField : TextField;
	return <MaterialUiAutocomplete
		fullWidth
		disabled={props.disabled}
		value={props.value}
		multiple={false}
		options={props.options}
		getOptionLabel={props.getOptionLabel}
		style={props.style}
		renderOption={props.renderOption}
		noOptionsText={props.emptyText}
		onChange={(evt, option) => props.onSelect(option, evt)}
		renderInput={(params) =>
			<TextFieldComponent
				{...params}
				{...props.textFieldProps}
				label={props.fieldLabel}
				fullWidth />} />;
};