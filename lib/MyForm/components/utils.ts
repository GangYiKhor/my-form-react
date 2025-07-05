export const EMPTY_VALUE = {};
export type MyTimeType = { hour: number; minute: number };
export type MyWeekType = { year: number; week: number };
export type MyDateRangeType = { start?: Date; end?: Date };
export type MyColourType = `#${string}`;
export type FieldBasicType = {
	/** ID of input */
	id: string;
	/** Name of the field */
	name: string;
	/** Set the field as required */
	required?: boolean;
	/** If `true` the field will not be deleted from `formData` when unmount */
	persistOnUnmount?: boolean;
	/** Remove the border for the input */
	noBorder?: boolean;
	/** Remove the background for the input */
	noBackground?: boolean;
	/** Disable the input */
	disabled?: boolean;
};
export type FieldPrefixType = {
	/** Prefix label for the input */
	prefix?: string | React.ReactNode;
	/** Suffix label for the input */
	suffix?: string | React.ReactNode;
};
export type CommonComboBoxType = {
	/** Number of rows to show in the dropdown, default to 5 */
	optionRows?: number;
	/** Width of the dropdown, default to the same as the input size */
	optionWidth?: number | string;
	/** If `true`, filter the dropdown options while typing, instead of scroll to the option */
	filterOnType?: boolean;
	onType?(event: React.ChangeEvent<HTMLInputElement>): void;
	onFocus?(event: React.FocusEvent<HTMLInputElement>): void;
	onBlur?(): void;
	onClear?(event: React.MouseEvent<HTMLButtonElement>): void;
};
export type ValidateImmediatelyType = {
	/** Validate the field immediately on type/change */
	validateImmediately?: boolean;
};

export type InputDelayType = {
	/** Delay the onChange trigger to help reducing UI lag */
	inputDelay?: number;
};

function padDate(num: number) {
	if (num < 10) return `0${num}`;
	else return `${num}`;
}

/**
 * Format date into string with custom format, `''` for Invalid Date
 * @example
 * Acceptable keywords:
 * 'yyyy' = 'Full year (2025)'
 * 'y' = 'Short year (25)'
 * 'MM' = 'Padded month (05)'
 * 'M' = 'Month (5)'
 * 'dd' = 'Padded date (05)'
 * 'd' = 'Date (5)'
 * 'hh' = 'Padded hour (05)'
 * 'h' = 'Hour (15)'
 * 'mm' = 'Padded minute (05)'
 * 'm' = 'Minute (15)'
 * 'ss' = 'Padded second (05)'
 * 's' = 'Second (15)'
 * 'a' = 'AM/PM'
 */
export function dateFormatter(value: Date | null | undefined, format = 'yyyy-MM-dd'): string {
	if (!value || Number.isNaN(value.valueOf())) return '';

	let dateString = format ?? 'yyyy-MM-dd';

	const year = value.getFullYear().toString();
	dateString = dateString.replace('yyyy', year);
	dateString = dateString.replace('y', year.substring(2));

	const month = value.getMonth() + 1;
	dateString = dateString.replace('MM', padDate(month));
	dateString = dateString.replace('M', month.toString());

	const date = value.getDate();
	dateString = dateString.replace('dd', padDate(date));
	dateString = dateString.replace('d', date.toString());

	let hourNumber = value.getHours();
	if (dateString.includes('a')) {
		if (hourNumber >= 12) dateString = dateString.replace('a', 'PM');
		else dateString = dateString.replace('a', 'AM');
		if (hourNumber > 12) hourNumber -= 12;
	}

	const hour = hourNumber;
	dateString = dateString.replace('hh', padDate(hour));
	dateString = dateString.replace('h', hour.toString());

	const minute = value.getMinutes();
	dateString = dateString.replace('mm', padDate(minute));
	dateString = dateString.replace('m', minute.toString());

	const second = value.getSeconds();
	dateString = dateString.replace('ss', padDate(second));
	dateString = dateString.replace('s', second.toString());

	return dateString;
}
export function dateOperator(value: Date, count: number, unit: 'y' | 'M' | 'd' | 'h' | 'm' | 's' | 'ms'): Date {
	const newValue = new Date(value);
	const getOperator = {
		y: newValue.getFullYear,
		M: newValue.getMonth,
		d: newValue.getDate,
		h: newValue.getHours,
		m: newValue.getMinutes,
		s: newValue.getSeconds,
		ms: newValue.getMilliseconds,
	};
	const setOperator = {
		y: newValue.setFullYear,
		M: newValue.setMonth,
		d: newValue.setDate,
		h: newValue.setHours,
		m: newValue.setMinutes,
		s: newValue.setSeconds,
		ms: newValue.setMilliseconds,
	};

	count += getOperator[unit]();
	setOperator[unit](count);
	return newValue;
}

export function toDateOnly(value: Date): Date {
	value?.setHours(0, 0, 0, 0);
	return value;
}

export function isSameDay(date1: Date, date2: Date): boolean {
	if (date1 === date2) {
		return true;
	} else {
		const day1 = toDateOnly(new Date(date1))?.getTime();
		const day2 = toDateOnly(new Date(date2))?.getTime();
		if (day1 == undefined || day2 == undefined) return false;
		return day1 === day2;
	}
}

export function isSameDayOrAfter(date1: Date, date2: Date): boolean {
	if (date1 === date2) {
		return true;
	} else {
		const day1 = toDateOnly(new Date(date1))?.getTime();
		const day2 = toDateOnly(new Date(date2))?.getTime();
		if (day1 == undefined || day2 == undefined) return false;
		return day1 >= day2;
	}
}

export function isDayAfter(date1: Date, date2: Date): boolean {
	if (date1 === date2) {
		return true;
	} else {
		const day1 = toDateOnly(new Date(date1))?.getTime();
		const day2 = toDateOnly(new Date(date2))?.getTime();
		if (day1 == undefined || day2 == undefined) return false;
		return day1 > day2;
	}
}

export function isSameDayOrBefore(date1: Date, date2: Date): boolean {
	if (date1 === date2) {
		return true;
	} else {
		const day1 = toDateOnly(new Date(date1))?.getTime();
		const day2 = toDateOnly(new Date(date2))?.getTime();
		if (day1 == undefined || day2 == undefined) return false;
		return day1 <= day2;
	}
}

export function isDayBefore(date1: Date, date2: Date): boolean {
	if (date1 === date2) {
		return true;
	} else {
		const day1 = toDateOnly(new Date(date1))?.getTime();
		const day2 = toDateOnly(new Date(date2))?.getTime();
		if (day1 == undefined || day2 == undefined) return false;
		return day1 < day2;
	}
}
