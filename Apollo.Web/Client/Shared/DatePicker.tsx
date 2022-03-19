import DayJsUtils from '@date-io/dayjs';
import { ParsableDate } from '@material-ui/pickers/constants/prop-types';
import { DatePickerView, KeyboardDatePicker } from '@material-ui/pickers/DatePicker/DatePicker';
import { KeyboardDateTimePicker } from '@material-ui/pickers/DateTimePicker/DateTimePicker';
import { MuiPickersUtilsProvider } from '@material-ui/pickers/MuiPickersUtilsProvider';
import * as dayjs from 'dayjs';
import { observer } from 'mobx-react-lite';
import * as React from 'react';
import {IconButton} from "@material-ui/core";
import {makeObservable, observable} from "mobx";

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

class DatePickerRangeStore {
	constructor(from: dayjs.Dayjs | null, to: dayjs.Dayjs | null) {
		makeObservable(this);
		
		this.fromDate = from;
		this.toDate = to;
	}
	
	@observable
	public fromDate: dayjs.Dayjs | null;
	@observable
	public toDate: dayjs.Dayjs | null;

	public formatWeekSelectLabel = () => {
		if (this.fromDate !== null && this.toDate !== null) {
			return `${this.fromDate.format('DD.MM.YYYY')} - ${this.toDate.format('DD.MM.YYYY')}`
		}
		
		return 'Промежуток не указан'
	};

	public handleWeekChange = (date: dayjs.Dayjs) => {
		if (this.fromDate !== null && this.toDate !== null) {
			this.fromDate = null;
			this.toDate = null;
		}
		
		if (this.fromDate === null && this.toDate === null) {
			this.fromDate = date?.clone()?.set('hours', 0)?.set('minutes', 0).set('seconds', 0) || null;
		}
		else if (this.fromDate !== null && this.toDate === null) {
			const dateTo = date?.clone()?.set('hours', 23)?.set('minutes', 59).set('seconds', 59) || null;
			
			if (dateTo !== null) {
				if (dateTo.isBefore(this.fromDate)) {
					this.toDate = this.fromDate.clone();
					this.fromDate = dateTo;
				} else {
					this.toDate = dateTo;
				}
			}
		}
	};
	
	public styles: any = ({
		start: ({
			background: '#48aafaa8',
			borderRadius: '50%',
		}),
		first: ({
			background: '#48aafaa8',
			borderTopLeftRadius: '50%',
			borderBottomLeftRadius: '50%'
		}),
		last: ({
			background: '#48aafaa8',
			borderTopRightRadius: '50%',
			borderBottomRightRadius: '50%'
		}),
		middle: ({
			background: '#48aafaa8',
		})
	})

	private isEqual = (first: dayjs.Dayjs, second: dayjs.Dayjs) => {
		return first.format('DD.MM.YYYY') === second.format('DD.MM.YYYY')
	};

	private isBetween = (date: dayjs.Dayjs, from: dayjs.Dayjs, to: dayjs.Dayjs) => {
		return date.isAfter(from) && date.isBefore(to) && !this.isEqual(date, to)
	};

	public renderWrappedWeekDay = (date: dayjs.Dayjs, selectedDate: dayjs.Dayjs, dayInCurrentMonth: boolean) => {
		if (selectedDate === undefined) {
			return <></>;
		}
		
		let dateClone = date.clone();
		let style: (any | undefined) = undefined;
		const isReverse = (this.fromDate !== null && this.toDate !== null ? this.fromDate.isAfter(this.toDate) : false);
		const fromDate = isReverse ? this.toDate : this.fromDate;
		const toDate = isReverse ? this.fromDate : this.toDate;

		if (this.toDate === null && fromDate !== null && this.isEqual(fromDate, date)) {
			style = this.styles.start;
		}
		else if (fromDate !== null && this.isEqual(fromDate, date)) {
			style = this.styles.first;
		}
		else if (toDate !== null && this.isEqual(toDate, date)) {
			style = this.styles.last;
		}
		else if (toDate !== null && fromDate !== null && this.isBetween(date, fromDate, toDate)) {
			style = this.styles.middle;
		}

		return (
			<div style={{
				marginTop: '2px',
				marginBottom: '2px',
				...style
			}}>
				<IconButton style={{padding: '13px'}} disabled={!dayInCurrentMonth}>
					<span style={{fontSize: '13px'}}>{dateClone.format("DD")} </span>
				</IconButton>
			</div>
		);
	};
}

export type DatePickerRangeProps = {
	className?: string;
	valueFrom: dayjs.Dayjs | null;
	valueTo: dayjs.Dayjs | null;
	onChange: (valFrom: dayjs.Dayjs | null, valTo: dayjs.Dayjs | null) => any;
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

export const DatePickerRange = observer((props: DatePickerRangeProps) => {
	const store = React.useState(() => new DatePickerRangeStore(props.valueFrom, props.valueTo))[0];
	
	return <MuiPickersUtilsProvider
		utils={DayJsUtils}
		locale={dayjs.locale('ru')}>
		<KeyboardDatePicker
			value={store.fromDate}
			disabled={props.disabled}
			variant='inline'
			// autoOk
			style={props.style}
			disableFuture={props.disableFuture}
			disablePast={props.disablePast}
			minDate={props.minDate}
			maxDate={props.maxDate}
			format={props.format || 'YYYY.MM.DD'}
			views={props.views}
			className={props.className}
			// value={props.value}
			onChange={(date: dayjs.Dayjs) => {
				store.handleWeekChange(date);
				
				if (store.fromDate !== null && store.toDate !== null) {
					props.onChange(store.fromDate, store.toDate);
				}
			}}
			// onChange={props.onChange}
			error={props.error}
			renderDay={store.renderWrappedWeekDay}
			labelFunc={store.formatWeekSelectLabel}
			label={props.label}
			helperText={props.helperText}
			fullWidth={props.fullWidth}
			KeyboardButtonProps={{ 'aria-label': props.label }}/>
	</MuiPickersUtilsProvider>
});
