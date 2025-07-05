import { useEffect, useState } from 'react';
import ChevronUpIcon from '../assets/ChevronUpIcon';
import CloseIcon from '../assets/CloseIcon';
import { useFormComponent } from '../MyFormComponentContext';
import { useSubForm } from '../MySubFormContext';
import { clsx, isEqual } from '../utils';
import MyComboBoxOptionsContainer from './components/MyComboBoxOptionsContainer';
import MyGeneralInputContainer from './components/MyGeneralInputContainer';
import MyPrefix from './components/MyPrefix';
import Suffix from './components/MySuffix';
import useGeneralComboBox from './hooks/useGeneralComboBox';
import { EMPTY_VALUE, type CommonComboBoxType, type FieldBasicType, type FieldPrefixType } from './utils';

const OPTION_HEIGHT = 23;

type PropType<T = any> = FieldBasicType &
	FieldPrefixType &
	CommonComboBoxType & {
		/** Unique key of the option to identify if an option is selected */
		optionKey: (value: T) => string;
		/** Custom function to generate the element for dropdown option row */
		optionElement: (value: T) => string | React.ReactNode;
		/** Option values for the combobox */
		options: T[];
		/** Default value for the field */
		defaultValue?: T;
		/** If `true`, when manually updated value is not found in options, it will be set to undefined */
		setUndefinedIfManualUpdateIsInvalid?: boolean;
	};

type HtmlProps<T = any> = {
	inputProps?: Omit<React.InputHTMLAttributes<HTMLInputElement>, keyof PropType | 'type' | 'ref' | 'onChange'>;
	containerProps?: React.HTMLAttributes<HTMLDivElement>;
	optionContainerProps?: Omit<React.HTMLAttributes<HTMLDivElement>, 'ref'>;
	optionProps?(
		value: T
	): Omit<React.HTMLAttributes<HTMLButtonElement>, 'type' | 'role' | 'onClick' | 'onBlur' | 'onScroll'>;
};

/**
 * A custom combo box input with the options element generated using `optionElement()` property
 *
 * Unlike `<MySimpleComboBoxInput />` and `<MyColumnComboBoxInput />`,
 * this component provide the customisability for the option rows
 *
 * When `setUndefinedIfManualUpdateIsInvalid` is `true`,
 * the field data will be set to undefined if the field data that is
 * updated manually or updated by another component will be overwritten as `undefined`
 */
export default function MyComboBoxInput<T = any>({
	id,
	name: _name,
	prefix,
	suffix,
	optionKey,
	optionElement: _optionElement,
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
	noBorder,
	noBackground,
	setUndefinedIfManualUpdateIsInvalid = false,
	disabled = false,
	inputProps,
	containerProps,
	optionContainerProps,
	optionProps,
}: PropType<T> & HtmlProps<T>) {
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
		const props = optionProps?.(value) ?? {};
		const { className, ..._props } = props;
		const key = optionKey(value);

		return (
			<button
				{..._props}
				key={`${key}_${index}`}
				type="button"
				role="option"
				className={clsx('combobox-option small-scrollbar', isSelected && 'active', className)}
				onClick={() => onSelect(value, key)}
				onBlur={onBlur}
				onScroll={delayedHideOptions.cancel}
			>
				{_optionElement(value)}
			</button>
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
				>
					{filteredOptions.map(optionElement)}
				</MyComboBoxOptionsContainer>
			</div>

			<Suffix id={id} suffix={suffix} />
		</MyGeneralInputContainer>
	);
}
