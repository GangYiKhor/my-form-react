import { useEffect, useState } from 'react';
import ChevronUpIcon from '../assets/ChevronUpIcon';
import CloseIcon from '../assets/CloseIcon';
import { useFormComponent } from '../MyFormComponentContext';
import { useSubForm } from '../MySubFormContext';
import { clsx, get, isEqual } from '../utils';
import MyComboBoxOptionsContainer from './components/MyComboBoxOptionsContainer';
import MyGeneralInputContainer from './components/MyGeneralInputContainer';
import MyPrefix from './components/MyPrefix';
import Suffix from './components/MySuffix';
import useGeneralComboBox from './hooks/useGeneralComboBox';
import { EMPTY_VALUE } from './utils';

const OPTION_HEIGHT = 23;

type PropType<T = any> = {
	/** ID of input */
	id: string;
	/** Name of the field */
	name: string;
	/** Prefix label for the input */
	prefix?: string | React.ReactNode;
	/** Suffix label for the input */
	suffix?: string | React.ReactNode;
	/** Unique key of the option to identify if an option is selected */
	optionKey: (value: T) => string;
	/**
	 * String value to be displayed on each column
	 *
	 * Can either be a function to return custom string, or specify the path of the object to get the string value
	 *
	 * @example
	 * [
	 * 	(data) => data.column_a,
	 * 	'column_b',
	 * 	'my_array.property.0', // Will get `data.my_array.property[0]`
	 * ]
	 */
	columns: (((value: T) => string) | string)[];
	/** Option values for the combobox */
	options: T[];
	/** Number of rows to show in the dropdown, default to 5 */
	optionRows?: number;
	/** Width of the dropdown, default to the same as the input size */
	optionWidth?: number | string;
	/** Default value for the field */
	defaultValue?: T;
	/** If `true`, filter the dropdown options while typing, instead of scroll to the option */
	filterOnType?: boolean;
	onType?(event: React.ChangeEvent<HTMLInputElement>): void;
	onFocus?(event: React.FocusEvent<HTMLInputElement>): void;
	onBlur?(): void;
	onClear?(event: React.MouseEvent<HTMLButtonElement | HTMLButtonElement>): void;
	/** Set the field as required */
	required?: boolean;
	/** If `true` the field will not be deleted from `formData` when unmount */
	persistOnUnmount?: boolean;
	/** If `true` the options dropdown will be set to `'nowrap'` */
	noWrapRow?: boolean;
	/** Remove the border for the input */
	noBorder?: boolean;
	/** Remove the background for the input */
	noBackground?: boolean;
	/** If `true`, when manually updated value is not found in options, it will be set to undefined */
	setUndefinedIfManualUpdateIsInvalid?: boolean;
	/** Disable the input */
	disabled?: boolean;
};

type HtmlProps = {
	inputProps?: Omit<React.InputHTMLAttributes<HTMLInputElement>, keyof PropType | 'type' | 'ref' | 'onChange'>;
	containerProps?: React.HTMLAttributes<HTMLDivElement>;
	optionContainerProps?: Omit<React.HTMLAttributes<HTMLDivElement>, 'ref'>;
};

export default function MyColumnComboBoxInput<T = any>({
	id,
	name: _name,
	prefix,
	suffix,
	optionKey,
	columns,
	options,
	optionRows = 5,
	optionWidth,
	defaultValue,
	filterOnType,
	onType: _onType,
	onFocus: _onFocus,
	onBlur: _onBlur,
	onClear,
	required = false,
	persistOnUnmount = false,
	noWrapRow = false,
	noBorder,
	noBackground,
	setUndefinedIfManualUpdateIsInvalid = false,
	disabled = false,
	inputProps,
	containerProps,
	optionContainerProps,
}: PropType<T> & HtmlProps) {
	const subFormId = useSubForm();
	let name = _name;
	if (subFormId) name = `${subFormId}__${name}`;

	const { fieldData, updateField } = useFormComponent<T>(name);
	const [internalOptions, setInternalOptions] = useState<T[]>([]);

	const {
		inputRef,
		internalRef,
		optionsRef,
		noScrollRef,
		showOptions,
		rerender,
		delayedRerender,
		delayedHideOptions,
		onFocus,
		onBlur,
		onSelect,
		toggleDropdown,
		clearComboBox,
	} = useGeneralComboBox<T>({
		name,
		defaultValue,
		onFocus: _onFocus,
		onBlur: _onBlur,
		onClear,
		required,
		disabled,
		persistOnUnmount,
	});

	useEffect(() => {
		if (JSON.stringify(internalOptions) === JSON.stringify(options)) return;
		const existings = new Set<string>();
		for (const option of options) {
			const key = optionKey(option);
			if (existings.has(key)) {
				console.warn(`Duplicated key "${key}" for ComboBox "${id}"!`);
				break;
			}
			existings.add(key);
		}
		setInternalOptions(options);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [options]);

	const onType = (e: React.ChangeEvent<HTMLInputElement>) => {
		if (disabled) return;
		delayedHideOptions.cancel();
		const foundOption = internalOptions.find((value) => optionKey(value) === e.target.value);
		if (foundOption) {
			internalRef.current = foundOption;
			updateField({ value: foundOption, valid: true });
		} else {
			delayedRerender();
		}
		_onType?.(e);
	};

	const _fieldData = fieldData ?? EMPTY_VALUE;
	useEffect(() => {
		const newData = fieldData ?? null;
		if (newData === null) {
			if (inputRef.current?.value === '') return;
			inputRef.current!.value = '';
			internalRef.current = null;
		} else if (!isEqual(internalRef.current, newData)) {
			const found = internalOptions.find((value) => isEqual(value, newData));
			if (!found) {
				inputRef.current!.value = '';
				if (setUndefinedIfManualUpdateIsInvalid) {
					internalRef.current = null;
					updateField({ value: null, valid: true });
				} else {
					internalRef.current = newData;
				}
			} else {
				inputRef.current!.value = optionKey(found);
				internalRef.current = found;
			}
		}
		rerender();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [_fieldData]);

	useEffect(() => {
		if (defaultValue && internalRef.current == undefined) {
			const found = internalOptions.find((value) => isEqual(value, defaultValue));
			if (!found) return;
			inputRef.current!.value = optionKey(found);
			internalRef.current = found;
			updateField({ value: found, valid: true });
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [JSON.stringify(defaultValue)]);

	const optionElement = (value: T, index: number) => {
		const isSelected = isEqual(value, internalRef.current);
		const key = optionKey(value);

		return (
			<tr
				key={`${key}_${index}`}
				role="option"
				className={clsx('combobox-row small-scrollbar', isSelected && 'active')}
				onClick={() => onSelect(value, key)}
				onBlur={onBlur}
				onScroll={delayedHideOptions.cancel}
			>
				{columns.map((fn, index) => {
					if (typeof fn === 'string') {
						const columnValue = get(value, fn) ?? '';
						return <td key={`${key}-col-${index}`}>{columnValue}</td>;
					}
					return <td key={`${key}-col-${index}`}>{fn(value)}</td>;
				})}
			</tr>
		);
	};

	let filteredOptions = internalOptions;
	let filterIndex = 0;
	const regex = new RegExp(inputRef.current?.value ?? '', 'i');
	const isEmpty = (inputRef.current?.value ?? '') === '';
	if (noScrollRef.current) {
		//
	} else if (filterOnType) {
		filteredOptions = internalOptions.filter((value) => {
			if (isEmpty) return true;
			return !!optionKey(value).match(regex);
		});
	} else {
		filterIndex = internalOptions.findIndex((value) => {
			if (isEmpty) return true;
			return !!optionKey(value).match(regex);
		});
	}

	if (!noScrollRef.current && filterIndex) {
		optionsRef.current?.scrollTo({ top: filterIndex * OPTION_HEIGHT });
	}

	noScrollRef.current = false;
	return (
		<MyGeneralInputContainer
			name={name}
			containerProps={containerProps}
			noBorder={noBorder}
			noBackground={noBackground}
			disabled={disabled}
		>
			<MyPrefix id={id} prefix={prefix} />

			<div className="combobox-input">
				<input
					{...inputProps}
					type="text"
					id={id}
					name={name}
					onChange={onType}
					onFocus={onFocus}
					onBlur={onBlur}
					ref={inputRef}
					required={required}
					disabled={disabled}
				/>

				<div className="input-button-container">
					<button type="button" onClick={toggleDropdown} onBlur={onBlur} className="my-form-small-button">
						<ChevronUpIcon style={{ rotate: showOptions ? '' : '180deg' }} />
					</button>

					<button type="button" onClick={clearComboBox} className="my-form-small-button" title="Clear selection">
						<CloseIcon />
					</button>
				</div>

				<MyComboBoxOptionsContainer
					showOptions={showOptions}
					optionsRef={optionsRef}
					optionRows={optionRows}
					OPTION_HEIGHT={OPTION_HEIGHT}
					optionWidth={optionWidth}
					optionContainerProps={optionContainerProps}
					noWrapRow={noWrapRow}
				>
					<table>
						<tbody>{filteredOptions.map(optionElement)}</tbody>
					</table>
				</MyComboBoxOptionsContainer>
			</div>

			<Suffix id={id} suffix={suffix} />
		</MyGeneralInputContainer>
	);
}
