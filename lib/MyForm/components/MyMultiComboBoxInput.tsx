import { useEffect, useState } from 'react';
import ChevronUp from '../assets/chevron-up.svg';
import CloseIcon from '../assets/close.svg';
import { useFormComponent } from '../MyFormComponentContext';
import { useSubForm } from '../MySubFormContext';
import { clsx, isEqual } from '../utils';
import MyComboBoxOptionsContainer from './components/MyComboBoxOptionsContainer';
import MyGeneralInputContainer from './components/MyGeneralInputContainer';
import MyPrefix from './components/MyPrefix';
import Suffix from './components/MySuffix';
import useGeneralMultiComboBox from './hooks/useGeneralMultiComboBox';
import { EMPTY_VALUE } from './utils';

const OPTION_HEIGHT = 23;

type PropType<T = any> = {
	id: string;
	name: string;
	prefix?: string | React.ReactNode;
	suffix?: string | React.ReactNode;
	optionKey: (value: T) => string;
	optionElement: (value: T) => string | React.ReactNode;
	options: T[];
	optionRows?: number;
	optionWidth?: number | string;
	defaultValue?: T[];
	filterOnType?: boolean;
	onType?(event: React.ChangeEvent<HTMLInputElement>): void;
	onFocus?(event: React.FocusEvent<HTMLInputElement>): void;
	onBlur?(): void;
	onClear?(event: React.MouseEvent<HTMLButtonElement | HTMLButtonElement>): void;
	required?: boolean;
	persistOnUnmount?: boolean;
	noBorder?: boolean;
	noBackground?: boolean;
	disabled?: boolean;
};

type HtmlProps<T = any> = {
	inputProps?: Omit<React.InputHTMLAttributes<HTMLInputElement>, keyof PropType | 'type' | 'ref' | 'onChange'>;
	containerProps?: React.HTMLAttributes<HTMLDivElement>;
	optionContainerProps?: Omit<React.HTMLAttributes<HTMLDivElement>, 'ref'>;
	optionProps?(
		value: T
	): Omit<React.HTMLAttributes<HTMLButtonElement>, 'type' | 'role' | 'onClick' | 'onBlur' | 'onScroll'>;
};

export default function MyMultiComboBoxInput<T = any>({
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
	disabled = false,
	inputProps,
	containerProps,
	optionContainerProps,
	optionProps,
}: PropType<T> & HtmlProps<T>) {
	const subFormId = useSubForm();
	let name = _name;
	if (subFormId) name = `${subFormId}_${name}`;

	const { fieldData, updateField } = useFormComponent<T[]>(name);
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
		onDelete,
		toggleDropdown,
		clearComboBox,
	} = useGeneralMultiComboBox<T>({
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
				console.warn(`Duplicated key "${key}" for MultiComboBox "${id}"!`);
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
		delayedRerender();
		_onType?.(e);
	};

	const _fieldData = fieldData ?? EMPTY_VALUE;
	useEffect(() => {
		const newData = fieldData ?? null;
		if (newData === null) {
			if (internalRef.current.length === 0) return;
			internalRef.current = [];
		} else {
			const found = newData.map((newV) => internalRef.current.find((oldV) => isEqual(newV, oldV)));
			if (found.every((v) => v !== undefined)) return;
			const setData = found.map((v) => internalOptions.find((opV) => isEqual(v, opV))).filter((v) => v !== undefined);
			internalRef.current = setData;
		}
		rerender();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [_fieldData]);

	useEffect(() => {
		if (defaultValue && internalRef.current.length === 0) {
			const found = defaultValue
				.map((dV) => internalOptions.find((opV) => isEqual(dV, opV)))
				.filter((v) => v !== undefined);
			if (found.length === 0) return;
			internalRef.current = found;
			updateField({ value: found, valid: true });
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [JSON.stringify(defaultValue)]);

	const optionElement = (value: T, index: number) => {
		const isSelected = internalRef.current.find((v) => isEqual(v, value)) !== undefined;
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
				onClick={() => onSelect(value)}
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

			<div className="multicombobox">
				<div className="multicombobox-selected">
					{internalRef.current.map((value, index) => (
						<div key={optionKey(value)}>
							<span>{optionKey(value)}</span>
							<button type="button" onClick={() => onDelete(index)}>
								<img src={CloseIcon} alt="Delete selection" />
							</button>
						</div>
					))}
				</div>

				<div className="multicombobox-input">
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
						<button type="button" onClick={toggleDropdown} onBlur={onBlur} className="dropdown-chevron">
							<img src={ChevronUp} alt="Show options" style={{ rotate: showOptions ? '' : '180deg' }} />
						</button>

						<button type="button" onClick={clearComboBox} className="clear-select" title="Clear selection">
							<img src={CloseIcon} alt="Clear select" />
						</button>
					</div>
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
