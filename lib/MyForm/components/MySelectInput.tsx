import { useCallback, useEffect, useRef, useState } from 'react';
import CloseIcon from '../assets/CloseIcon';
import { useFormComponent } from '../MyFormComponentContext';
import { useSubForm } from '../MySubFormContext';
import { clsx, isEqual } from '../utils';
import MyGeneralInputContainer from './components/MyGeneralInputContainer';
import MyPrefix from './components/MyPrefix';
import Suffix from './components/MySuffix';
import { EMPTY_VALUE } from './utils';

type PropType<T = any> = {
	id: string;
	name: string;
	prefix?: string | React.ReactNode;
	suffix?: string | React.ReactNode;
	placeholder?: string;
	options: { label: string; value: T }[];
	defaultValue?: T;
	onChange?(event: React.ChangeEvent<HTMLSelectElement>, input: T | null): void;
	onClick?(event: React.MouseEvent<HTMLSelectElement>): void;
	onClear?(event: React.MouseEvent<HTMLButtonElement>): void;
	required?: boolean;
	persistOnUnmount?: boolean;
	noBorder?: boolean;
	noBackground?: boolean;
	setUndefinedIfManualUpdateIsInvalid?: boolean;
	disabled?: boolean;
};

type HtmlProps = {
	selectProps?: Omit<React.HTMLAttributes<HTMLSelectElement>, keyof PropType | 'ref'>;
	placeholderOptionProps?: Omit<React.HTMLAttributes<HTMLOptionElement>, 'value' | 'disabled'>;
	optionProps?: Omit<React.HTMLAttributes<HTMLOptionElement>, 'value'>;
	containerProps?: React.HTMLAttributes<HTMLDivElement>;
};

export default function MySelectInput<T = any>({
	id,
	name: _name,
	prefix,
	suffix,
	placeholder,
	options,
	defaultValue,
	onChange: _onChange,
	onClick,
	onClear,
	required = false,
	persistOnUnmount = false,
	noBorder,
	noBackground,
	setUndefinedIfManualUpdateIsInvalid = false,
	disabled = false,
	selectProps,
	placeholderOptionProps,
	optionProps,
	containerProps,
}: PropType<T> & HtmlProps) {
	const subFormId = useSubForm();
	let name = _name;
	if (subFormId) name = `${subFormId}_${name}`;

	const { fieldData, updateField, deleteField, setFieldProperties } = useFormComponent<T>(name);
	const inputRef = useRef<HTMLSelectElement>(null);
	const internalRef = useRef<T | null | undefined>(undefined);
	const [internalOptions, setInternalOptions] = useState<{ label: string; value: T }[]>([]);
	const [_, _rerender] = useState([]);

	const rerender = useCallback(() => {
		_rerender([]);
	}, []);

	useEffect(() => {
		if (JSON.stringify(options) === JSON.stringify(internalOptions)) return;
		const existings = new Set<string>();
		for (const option of options) {
			if (existings.has(option.label)) {
				console.warn(`Duplicated label "${option.label}" for SelectInput "${id}"!`);
				break;
			}
			existings.add(option.label);
		}
		setInternalOptions(options);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [options]);

	const onChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
		if (disabled) return;
		let value: T | null;
		if (e.target.value === '') {
			value = null;
		} else {
			const index = parseInt(e.target.value);
			value = options[index]?.value ?? null;
		}
		updateField({ value });
		internalRef.current = value;
		_onChange?.(e, value);
	};

	const clearSelect = (e: React.MouseEvent<HTMLButtonElement>) => {
		if (disabled) return;
		inputRef.current!.value = '';
		internalRef.current = null;
		updateField({ value: null });
		onClear?.(e);
	};

	const _fieldData = fieldData ?? EMPTY_VALUE;
	useEffect(() => {
		const newData = fieldData ?? null;
		if (newData === null) {
			if (inputRef.current?.value === '') return;
			inputRef.current!.value = '';
			internalRef.current = null;
		} else {
			const foundIndex = options.findIndex(({ value }) => isEqual(value, newData));
			if (foundIndex === -1) {
				inputRef.current!.value = '';
				if (setUndefinedIfManualUpdateIsInvalid) {
					internalRef.current = null;
					updateField({ value: null, valid: true });
				} else {
					internalRef.current = newData;
				}
			} else {
				inputRef.current!.value = `${foundIndex}`;
				internalRef.current = newData;
			}
		}
		rerender();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [_fieldData]);

	useEffect(() => {
		setFieldProperties({ defaultValue, required });
	}, [name, defaultValue, required, setFieldProperties]);

	useEffect(() => {
		if (defaultValue && internalRef.current == undefined) {
			const foundIndex = options.findIndex(({ value }) => isEqual(value, defaultValue));
			if (foundIndex === -1) return;
			inputRef.current!.value = `${foundIndex}`;
			internalRef.current = defaultValue;
			updateField({ value: defaultValue });
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [name, JSON.stringify(defaultValue)]);

	useEffect(() => {
		return () => {
			if (!persistOnUnmount) deleteField();
		};
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [name]);

	const isPlaceholder = (inputRef.current?.value ?? '-') === '';
	const { className: selectClassName, ..._selectProps } = selectProps ?? {};
	return (
		<MyGeneralInputContainer
			name={name}
			containerProps={containerProps}
			noBorder={noBorder}
			noBackground={noBackground}
			disabled={disabled}
		>
			<MyPrefix id={id} prefix={prefix} />

			<select
				{..._selectProps}
				id={id}
				name={name}
				onChange={onChange}
				onClick={onClick}
				ref={inputRef}
				required={required}
				disabled={disabled}
				className={clsx(isPlaceholder && 'placeholder-shown', selectClassName)}
			>
				<option {...placeholderOptionProps} value="" disabled={required}>
					{placeholder ?? ''}
				</option>

				{(options ?? []).map(({ label }, index) => (
					<option {...optionProps} key={`${label}_${index}`} value={index}>
						{label}
					</option>
				))}
			</select>

			<button type="button" onClick={clearSelect} className="my-form-small-button" title="Clear selection">
				<CloseIcon />
			</button>

			<Suffix id={id} suffix={suffix} />
		</MyGeneralInputContainer>
	);
}
