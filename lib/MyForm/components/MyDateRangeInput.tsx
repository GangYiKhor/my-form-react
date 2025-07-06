import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import ChevronUpIcon from '../assets/ChevronUpIcon';
import CloseIcon from '../assets/CloseIcon';
import { useFormComponent } from '../MyFormComponentContext';
import { useSubForm } from '../MySubFormContext';
import { clsx, debounce } from '../utils';
import MyGeneralInputContainer from './components/MyGeneralInputContainer';
import MyPrefix from './components/MyPrefix';
import Suffix from './components/MySuffix';
import {
	dateFormatter,
	EMPTY_VALUE,
	isDayAfter,
	isDayBefore,
	isSameDay,
	isSameDayOrAfter,
	isSameDayOrBefore,
	type FieldBasicType,
	type FieldPrefixType,
	type MyDateRangeType,
} from './utils';

const MONTH_NAME = [
	'January',
	'February',
	'March',
	'April',
	'May',
	'June',
	'July',
	'August',
	'September',
	'October',
	'November',
	'December',
];
const DAY_NAME = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
const generateCalendar = (startYear: number, startMonth: number) => {
	const curFirst = new Date(startYear, startMonth, 1);
	const curLast = new Date(startYear, startMonth + 1, 0);
	const firstDay = new Date(startYear, startMonth, 1 - (curFirst.getDay() || 7));
	const lastDay = new Date(startYear, startMonth + 1, 6 - curLast.getDay() || 7);
	const ptrDay = new Date(firstDay);
	const dates: Date[] = [];
	while (ptrDay <= lastDay) {
		dates.push(new Date(ptrDay));
		ptrDay.setDate(ptrDay.getDate() + 1);
	}
	return dates;
};

type PropType = FieldBasicType &
	FieldPrefixType & {
		/** Default value for the field */
		defaultValue?: MyDateRangeType;
		/** Minimum for the date range selection, won't affect manual updates */
		min?: Date;
		/** Maximum for the date range selection, won't affect manual updates */
		max?: Date;
		onFocus?(): void;
		onBlur?(): void;
		onClear?(event: React.MouseEvent<HTMLButtonElement | HTMLButtonElement>): void;
		/** Validator for the field for form validations */
		validator?(input: MyDateRangeType): boolean | string;
	};

type HtmlProps = {
	containerProps?: React.HTMLAttributes<HTMLDivElement>;
};

/**
 * A date range input with form handlers
 *
 * A custom calendar will be shown on focus for date range selections
 *
 * Min/Max property will hide the out of range dates from the calendars and prevent user inputs,
 * but it **does not** block manual updates and **does not** affect validators
 *
 * Required will be checked by identifying if any of the `start`/`end` value is `undefined`
 */
export default function MyDateRangeInput({
	id,
	name: _name,
	prefix,
	suffix,
	defaultValue,
	min: _min,
	max: _max,
	onFocus: _onFocus,
	onBlur: _onBlur,
	onClear,
	validator,
	required,
	persistOnUnmount,
	noBorder,
	noBackground,
	disabled = false,
	containerProps,
}: PropType & HtmlProps) {
	const subFormId = useSubForm();
	let name = _name;
	if (subFormId) name = `${subFormId}__${name}`;
	const { fieldData, updateField, deleteField, setFieldProperties } = useFormComponent<MyDateRangeType>(name);
	const inputButtonRef = useRef<HTMLButtonElement>(null);
	const startInputRef = useRef<HTMLInputElement>(null);
	const endInputRef = useRef<HTMLInputElement>(null);
	const internalRef = useRef<{ start?: Date; end?: Date }>({ start: undefined, end: undefined });
	const calendarRef = useRef<HTMLDivElement>(null);
	const yearDivRef = useRef<HTMLDivElement>(null);
	const monthDivRef = useRef<HTMLDivElement>(null);
	const initialisedRef = useRef(false);
	const dragTypeRef = useRef<'start' | 'end' | 'initialise' | '' | 'leftover'>('');
	const dragStartDateRef = useRef<Date>(null);
	const [startYear, setStartYear] = useState(new Date().getFullYear());
	const [startMonth, setStartMonth] = useState(new Date().getMonth());
	const [showCalendar, setShowCalendar] = useState(false);
	const [showMonth, setShowMonth] = useState(false);
	const [_, _rerender] = useState([]);
	const rerender = useCallback(() => _rerender([]), []);
	const hideCalendar = useCallback(() => {
		setShowCalendar(false);
		setShowMonth(false);
		_onBlur?.();
	}, [_onBlur]);
	const delayedHideCalendar = useMemo(() => debounce(hideCalendar, 100), [hideCalendar]);

	useEffect(() => {
		if (_min && _max && isDayBefore(_max, _min)) {
			console.warn(`Invalid min and max date for date range input "${id}"! Min max won't take effect!`);
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [JSON.stringify(_min), JSON.stringify(_max)]);

	let min = _min;
	let max = _max;
	if (min && max && isDayBefore(max, min)) {
		min = undefined;
		max = undefined;
	}

	const minYear = min?.getFullYear();
	const maxYear = max?.getFullYear();
	const minMonth = min?.getMonth();
	const maxMonth = max?.getMonth();
	const reachedMinYear = !!minYear && startYear - 1 < minYear;
	const reachedMaxYear = !!maxYear && startYear + 1 > maxYear;
	const reachedMinMonth = minYear === startYear && !!minMonth && minMonth >= startMonth;
	const reachedMaxMonth = maxYear === startYear && !!maxMonth && maxMonth <= startMonth;

	const retainFocus = () => {
		delayedHideCalendar.cancel();
	};

	const onBlur = () => {
		delayedHideCalendar();
	};

	const onSelect = (value: Date) => {
		if (disabled) return;
		delayedHideCalendar.cancel();
		if (dragTypeRef.current === 'leftover') {
			// If mouse up outside
			dragTypeRef.current = '';
			onDragEnter(value);
			onMouseUp();
			return;
		}

		if (internalRef.current?.start && internalRef.current?.end) internalRef.current = {};

		const dateString = dateFormatter(value, 'yyyy-MM-dd');
		if (!internalRef.current?.start) {
			startInputRef.current!.value = dateString;
			endInputRef.current!.value = '';
			internalRef.current = { start: value, end: undefined };
		} else if (isSameDayOrBefore(value, internalRef.current.start)) {
			endInputRef.current!.value = startInputRef.current!.value;
			startInputRef.current!.value = dateString;
			internalRef.current.end = internalRef.current.start;
			internalRef.current.start = value;
		} else {
			endInputRef.current!.value = dateString;
			internalRef.current.end = value;
		}
		updateField({ value: { ...internalRef.current }, valid: true });
	};

	const onDragStart = (value: Date) => {
		if (disabled) return;
		delayedHideCalendar.cancel();
		if (dragTypeRef.current !== '') {
			dragTypeRef.current = 'leftover';
			return;
		}
		if (internalRef.current.start && isSameDay(value, internalRef.current.start)) dragTypeRef.current = 'start';
		else if (internalRef.current.end && isSameDay(value, internalRef.current.end)) dragTypeRef.current = 'end';
		else dragTypeRef.current = 'initialise';
		dragStartDateRef.current = value;
	};

	const onDragEnter = (value: Date) => {
		if (disabled) return;
		delayedHideCalendar.cancel();
		switch (dragTypeRef.current) {
			case 'initialise': {
				if (isSameDayOrAfter(value, dragStartDateRef.current!)) {
					internalRef.current.start = dragStartDateRef.current!;
					internalRef.current.end = value;
					startInputRef.current!.value = dateFormatter(dragStartDateRef.current!, 'yyyy-MM-dd');
					endInputRef.current!.value = dateFormatter(value, 'yyyy-MM-dd');
				} else {
					internalRef.current.start = value;
					internalRef.current.end = dragStartDateRef.current!;
					startInputRef.current!.value = dateFormatter(value, 'yyyy-MM-dd');
					endInputRef.current!.value = dateFormatter(dragStartDateRef.current!, 'yyyy-MM-dd');
				}
				break;
			}

			case 'start': {
				if (isSameDayOrBefore(value, internalRef.current.end!)) {
					internalRef.current.start = value;
					startInputRef.current!.value = dateFormatter(value, 'yyyy-MM-dd');
				} else {
					internalRef.current.start = internalRef.current.end;
					internalRef.current.end = value;
					startInputRef.current!.value = dateFormatter(internalRef.current.start, 'yyyy-MM-dd');
					endInputRef.current!.value = dateFormatter(value, 'yyyy-MM-dd');
					dragTypeRef.current = 'end';
				}
				break;
			}

			case 'end': {
				if (isSameDayOrAfter(value, internalRef.current.start!)) {
					internalRef.current.end = value;
					endInputRef.current!.value = dateFormatter(value, 'yyyy-MM-dd');
				} else {
					internalRef.current.end = internalRef.current.start;
					internalRef.current.start = value;
					endInputRef.current!.value = dateFormatter(internalRef.current.end, 'yyyy-MM-dd');
					startInputRef.current!.value = dateFormatter(value, 'yyyy-MM-dd');
					dragTypeRef.current = 'start';
				}
				break;
			}

			default:
				return;
		}

		rerender();
	};

	const onMouseUp = () => {
		if (disabled) return;
		delayedHideCalendar.cancel();
		if (dragTypeRef.current === 'leftover') return;
		dragTypeRef.current = '';
		dragStartDateRef.current = null;
		updateField({ value: { ...internalRef.current }, valid: true });
	};

	const toggleDropdown = () => {
		setShowCalendar((show) => {
			show = !show;
			if (show) _onFocus?.();
			return show;
		});
		let date = internalRef.current.start ?? internalRef.current.end ?? new Date();
		if (min && isDayBefore(date, min)) date = min;
		else if (max && isDayAfter(date, max)) date = max;
		setStartYear(date.getFullYear());
		setStartMonth(date.getMonth());
	};

	const toggleMonth = () => {
		delayedHideCalendar.cancel();
		setShowMonth((show) => !show);
	};

	const setMonth = (month: number) => {
		delayedHideCalendar.cancel();
		if (reachedMinYear && month < minMonth!) return;
		if (reachedMaxYear && month > maxMonth!) return;
		setStartMonth(month);
		setShowMonth(false);
		inputButtonRef.current?.focus();
	};

	const clearDate = (e: React.MouseEvent<HTMLButtonElement>) => {
		if (disabled) return;
		startInputRef.current!.value = '';
		endInputRef.current!.value = '';
		internalRef.current = {};
		updateField({ value: { start: undefined, end: undefined }, valid: true });
		onClear?.(e);
		hideCalendar();
	};

	const clearCalendar = (e: React.MouseEvent<HTMLButtonElement>) => {
		if (disabled) return;
		delayedHideCalendar.cancel();
		startInputRef.current!.value = '';
		endInputRef.current!.value = '';
		internalRef.current = {};
		updateField({ value: { start: undefined, end: undefined }, valid: true });
		onClear?.(e);
	};

	const today = () => {
		delayedHideCalendar.cancel();
		const now = new Date();
		setStartYear(now.getFullYear());
		setStartMonth(now.getMonth());
	};

	const resetCalendar = (e: React.MouseEvent<HTMLButtonElement>) => {
		delayedHideCalendar.cancel();
		if (!defaultValue) {
			clearCalendar(e);
			today();
			return;
		}

		let year: number;
		let month: number;
		if (defaultValue.start) {
			startInputRef.current!.value = dateFormatter(defaultValue.start, 'yyyy-MM-dd');
			internalRef.current.start = defaultValue.start;
			year ??= defaultValue.start.getFullYear();
			month ??= defaultValue.start.getMonth();
		}
		if (defaultValue.end) {
			endInputRef.current!.value = dateFormatter(defaultValue.end, 'yyyy-MM-dd');
			internalRef.current.end = defaultValue.end;
			year ??= defaultValue.end.getFullYear();
			month ??= defaultValue.end.getMonth();
		}
		updateField({ value: defaultValue, valid: true });
		setStartYear(year!);
		setStartMonth(month!);
	};

	const animateYear = (type: 'prev' | 'next') => {
		yearDivRef.current?.classList.remove('scroll-prev-year');
		yearDivRef.current?.classList.remove('scroll-next-year');
		setTimeout(() => yearDivRef.current?.classList.add(`scroll-${type}-year`), 10);
		setTimeout(() => yearDivRef.current?.classList.remove(`scroll-${type}-year`), 510);
	};

	const animateMonth = (type: 'prev' | 'next') => {
		monthDivRef.current?.classList.remove('scroll-prev-month');
		monthDivRef.current?.classList.remove('scroll-next-month');
		setTimeout(() => monthDivRef.current?.classList.add(`scroll-${type}-month`), 10);
		setTimeout(() => monthDivRef.current?.classList.remove(`scroll-${type}-month`), 510);
	};

	const prevYear = () => {
		delayedHideCalendar.cancel();
		if (reachedMinYear) {
			inputButtonRef.current?.focus();
			return;
		}
		setStartYear(startYear - 1);
		animateYear('prev');
		if (minYear && startYear - 1 <= minYear && startMonth < minMonth!) setStartMonth(minMonth!);
	};

	const nextYear = () => {
		delayedHideCalendar.cancel();
		if (reachedMaxYear) {
			inputButtonRef.current?.focus();
			return;
		}
		setStartYear(startYear + 1);
		animateYear('next');
		if (maxYear && startYear + 1 >= maxYear && startMonth > maxMonth!) setStartMonth(maxMonth!);
	};

	const prevMonth = () => {
		delayedHideCalendar.cancel();
		if (reachedMinMonth) return;
		setStartMonth((month) => {
			month -= 1;
			if (month < 0) {
				month = 11;
				setStartYear(startYear - 1);
			}
			animateMonth('prev');
			return month;
		});
	};

	const nextMonth = () => {
		delayedHideCalendar.cancel();
		if (reachedMaxMonth) return;
		setStartMonth((month) => {
			month += 1;
			if (month > 11) {
				month = 0;
				setStartYear(startYear + 1);
			}
			animateMonth('next');
			return month;
		});
	};

	const _fieldData = fieldData ?? EMPTY_VALUE;
	useEffect(() => {
		const newData = fieldData ?? {};
		if (!isSameDay(internalRef.current.start!, newData.start!) || !isSameDay(internalRef.current.end!, newData.end!)) {
			updateField({ value: newData, valid: true });
			startInputRef.current!.value = dateFormatter(newData.start, 'yyyy-MM-dd');
			endInputRef.current!.value = dateFormatter(newData.end, 'yyyy-MM-dd');
			internalRef.current = newData;
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [_fieldData]);

	useEffect(() => {
		const requiredValidator = (value: { start?: Date; end?: Date }) => !!value?.start && !!value?.end;
		setFieldProperties({ defaultValue, required: required ? requiredValidator : false, validator });
	}, [name, defaultValue, required, validator, setFieldProperties]);

	useEffect(() => {
		if (initialisedRef.current) return;
		if (defaultValue) {
			let year: number;
			let month: number;
			if (defaultValue.start) {
				startInputRef.current!.value = dateFormatter(defaultValue.start, 'yyyy-MM-dd');
				internalRef.current.start = defaultValue.start;
				year ??= defaultValue.start.getFullYear();
				month ??= defaultValue.start.getMonth();
			}
			if (defaultValue.end) {
				endInputRef.current!.value = dateFormatter(defaultValue.end, 'yyyy-MM-dd');
				internalRef.current.end = defaultValue.end;
				year ??= defaultValue.end.getFullYear();
				month ??= defaultValue.end.getMonth();
			}
			updateField({ value: defaultValue, valid: true });
			setStartYear(year!);
			setStartMonth(month!);
		}
		initialisedRef.current = true;
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [name, defaultValue]);

	useEffect(() => {
		return () => {
			if (!persistOnUnmount) deleteField();
		};
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [name, deleteField]);

	const dates = generateCalendar(startYear, startMonth);
	return (
		<MyGeneralInputContainer
			name={name}
			containerProps={containerProps}
			noBorder={noBorder}
			noBackground={noBackground}
			disabled={disabled}
		>
			<MyPrefix id={id} prefix={prefix} />

			<div className="date-range-input-container">
				<button
					ref={inputButtonRef}
					id={id}
					type="button"
					className="date-range-input"
					onClick={toggleDropdown}
					onFocus={retainFocus}
					onBlur={onBlur}
					disabled={disabled}
				>
					<input
						type="date"
						id={`${id}_start`}
						name={`${name}_start`}
						ref={startInputRef}
						className="_date-range-input_"
						disabled
					/>
					<span aria-description="to">{'\u2013'}</span>
					<input
						type="date"
						id={`${id}_end`}
						name={`${name}_end`}
						ref={endInputRef}
						className="_date-range-input_"
						disabled
					/>
				</button>

				{showCalendar ? (
					<div ref={calendarRef} className="date-calendar" onClick={retainFocus} onFocus={retainFocus}>
						<div ref={yearDivRef} className="date-calendar-year">
							<button type="button" className="last-2-year" disabled aria-hidden>
								{startYear - 2}
							</button>

							<button
								type="button"
								onClick={prevYear}
								onFocus={retainFocus}
								onBlur={onBlur}
								className="last-year"
								disabled={reachedMinYear}
								aria-hidden={reachedMinYear}
							>
								{startYear - 1}
							</button>

							<button type="button" onClick={toggleMonth} onFocus={retainFocus} onBlur={onBlur} className="year">
								{startYear}
							</button>

							<button
								type="button"
								onClick={nextYear}
								onFocus={retainFocus}
								onBlur={onBlur}
								className="next-year"
								disabled={reachedMaxYear}
								aria-hidden={reachedMaxYear}
							>
								{startYear + 1}
							</button>

							<button type="button" className="next-2-year" disabled aria-hidden>
								{startYear + 2}
							</button>
						</div>

						<div ref={monthDivRef} className="date-calendar-month">
							<button
								type="button"
								onClick={showMonth ? prevYear : prevMonth}
								onFocus={retainFocus}
								onBlur={onBlur}
								className="prev-month my-form-small-button"
								title={showMonth ? 'Previous year' : 'Previous month'}
								disabled={showMonth ? reachedMinYear : reachedMinMonth}
							>
								<ChevronUpIcon style={{ rotate: '270deg' }} />
							</button>

							<div className="month">
								<button type="button" className="cur-month" onClick={toggleMonth} onFocus={retainFocus} onBlur={onBlur}>
									{showMonth ? 'Months' : MONTH_NAME[startMonth]}
								</button>
							</div>

							<button
								type="button"
								onClick={showMonth ? nextYear : nextMonth}
								onFocus={retainFocus}
								onBlur={onBlur}
								className="next-month my-form-small-button"
								title={showMonth ? 'Next year' : 'Next month'}
								disabled={showMonth ? reachedMaxYear : reachedMaxMonth}
							>
								<ChevronUpIcon style={{ rotate: '90deg' }} />
							</button>
						</div>

						<div className="date-calendar-table">
							{showMonth ? (
								<div className="date-calendar-months">
									{MONTH_NAME.map((month, index) => {
										const isCurrent = index === startMonth;
										const disabled = (reachedMinYear && index < minMonth!) || (reachedMaxYear && index > maxMonth!);
										return (
											<button
												key={month}
												type="button"
												onClick={() => setMonth(index)}
												className={clsx(isCurrent && 'selected')}
												disabled={disabled}
											>
												{month}
											</button>
										);
									})}
								</div>
							) : (
								<div className="date-calendar-dates">
									{DAY_NAME.map((day) => (
										<span key={day} title={day}>
											{day[0]}
										</span>
									))}

									{dates.map((date) => {
										const isSelected =
											(internalRef.current.start && isSameDay(date, internalRef.current.start)) ||
											(internalRef.current.end && isSameDay(date, internalRef.current.end));
										const isActive =
											internalRef.current.start &&
											internalRef.current.end &&
											isSameDayOrAfter(date, internalRef.current.start) &&
											isSameDayOrBefore(date, internalRef.current.end);
										const isDisabled = (min && isDayBefore(date, min)) || (max && isDayAfter(date, max));

										return (
											<button
												key={date.toISOString()}
												type="button"
												onClick={() => onSelect(date)}
												onFocus={retainFocus}
												onMouseDown={() => onDragStart(date)}
												onMouseEnter={() => onDragEnter(date)}
												onMouseUp={onMouseUp}
												onBlur={onBlur}
												className={clsx(
													date.getMonth() === startMonth && 'cur-month-date',
													isSelected && 'selected',
													isActive && 'active'
												)}
												disabled={isDisabled}
											>
												{date.getDate()}
											</button>
										);
									})}
								</div>
							)}
						</div>

						<div className="calendar-buttons">
							<button
								type="button"
								onFocus={retainFocus}
								onClick={resetCalendar}
								onBlur={onBlur}
								className="calendar-reset"
							>
								Reset
							</button>

							<button type="button" onFocus={retainFocus} onClick={today} onBlur={onBlur} className="calendar-today">
								Today
							</button>

							<button
								type="button"
								onFocus={retainFocus}
								onClick={clearCalendar}
								onBlur={onBlur}
								className="calendar-clear"
							>
								Clear
							</button>
						</div>
					</div>
				) : null}
			</div>

			<button type="button" onClick={clearDate} className="my-form-button" title="Clear dates">
				<CloseIcon />
			</button>

			<Suffix id={id} suffix={suffix} />
		</MyGeneralInputContainer>
	);
}
