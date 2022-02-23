import DayJsUtils from '@date-io/dayjs';
import { ParsableDate } from '@material-ui/pickers/constants/prop-types';
import { DatePickerView, KeyboardDatePicker } from '@material-ui/pickers/DatePicker/DatePicker';
import { KeyboardDateTimePicker } from '@material-ui/pickers/DateTimePicker/DateTimePicker';
import { MuiPickersUtilsProvider } from '@material-ui/pickers/MuiPickersUtilsProvider';
import * as dayjs from 'dayjs';
import { observer } from 'mobx-react-lite';
import * as React from 'react';

export type DatePickerProps = {
	className?: string;
	value: dayjs.Dayjs | null;
	onChange: (val: dayjs.Dayjs | null) => any;
	error?: boolean;
	label?: string;
	helperText?: string;
	views?: DatePickerView[];
	format?: string;
	fullWidth?: boolean;
	disableFuture?: boolean;
	disablePast?: boolean;
	minDate?: ParsableDate;
	maxDate?: ParsableDate;
	disabled?: boolean;
	style?: React.CSSProperties;
};

export const DatePicker = observer((props: DatePickerProps) =>
	<MuiPickersUtilsProvider
		utils={DayJsUtils}
		locale={dayjs.locale('ru')}>
		<KeyboardDatePicker
			disabled={props.disabled}
			variant='inline'
			autoOk
			style={props.style}
			disableFuture={props.disableFuture}
			disablePast={props.disablePast}
			minDate={props.minDate}
			maxDate={props.maxDate}
			format={props.format || 'YYYY.MM.DD'}
			views={props.views}
			className={props.className}
			value={props.value}
			onChange={props.onChange}
			error={props.error}
			label={props.label}
			helperText={props.helperText}
			fullWidth={props.fullWidth}
			KeyboardButtonProps={{ 'aria-label': props.label }}/>
	</MuiPickersUtilsProvider>
);

export const DateTimePicker = observer((props: DatePickerProps) =>
	<MuiPickersUtilsProvider
		utils={DayJsUtils}
		locale={dayjs.locale('ru')}>
		<KeyboardDateTimePicker
			variant='inline'
			disabled={props.disabled}
			autoOk
			format={props.format || 'YYYY.MM.DD hh:mm'}
			views={props.views}
			className={props.className}
			value={props.value}
			onChange={props.onChange}
			error={props.error}
			style={props.style}
			label={props.label}
			helperText={props.helperText}
			fullWidth={props.fullWidth}
			KeyboardButtonProps={{ 'aria-label': props.label }}/>
	</MuiPickersUtilsProvider>
);
