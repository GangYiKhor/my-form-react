import { useEffect, useRef } from 'react';
import { useFormComponent } from '../MyFormComponentContext';
import { useSubForm } from '../MySubFormContext';
import { isEqual } from '../utils';
import MyGeneralInputContainer from './components/MyGeneralInputContainer';
import MyPrefix from './components/MyPrefix';
import Suffix from './components/MySuffix';
import { EMPTY_VALUE, type FieldBasicType, type FieldPrefixType } from './utils';

type PropType<T1 = any, T2 = any> = FieldBasicType &
	FieldPrefixType & {
		/** Value when checkbox is unchecked */
		uncheckValue?: T1 | T2 | null;
		/** Value when checkbox is checked */
		checkedValue: T1;
		/** Default value for the field */
		defaultValue?: T1;
		/** onChange event with parsed input (checked/unchecked) value as second parameter */
		onChange?(event: React.ChangeEvent<HTMLInputElement>, input?: T1 | T2 | null): void;
	};

type HtmlProps = {
	inputProps?: Omit<React.InputHTMLAttributes<HTMLInputElement>, keyof PropType | 'text'>;
	containerProps?: React.HTMLAttributes<HTMLDivElement>;
};

/**
 * A simple checkbox input with form handlers
 *
 * When the input is checked, `checkedValue` will be assigned to the field data
 *
 * When the input is unchecked, `uncheckValue` or `undefined` will be assigned to the field data
 *
 * If the form is manually updated or updated by another field to the same checked value,
 * the input will be checked automatically
 *
 * The data will be checked using deep equality checks
 */
export default function MyCheckboxInput<CheckedValue = any, UncheckedValue = any>({
	id,
	name: _name,
	uncheckValue = null,
	checkedValue,
	prefix,
	suffix,
	defaultValue,
	onChange: _onChange,
	required = false,
	persistOnUnmount = false,
	noBorder,
	noBackground,
	disabled = false,
	inputProps,
	containerProps,
}: PropType<CheckedValue, UncheckedValue> & HtmlProps) {
	const subFormId = useSubForm();
	let name = _name;
	if (subFormId) name = `${subFormId}__${name}`;

	const { fieldData, updateField, deleteField, setFieldProperties } = useFormComponent<CheckedValue | UncheckedValue>(
		name
	);
	const inputRef = useRef<HTMLInputElement>(null);

	const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		if (disabled) return;
		const value = e.target.checked ? checkedValue : uncheckValue ?? null;
		updateField({ value });
		_onChange?.(e, value);
	};

	const _fieldData = fieldData ?? EMPTY_VALUE;
	useEffect(() => {
		inputRef.current!.checked = isEqual(fieldData, checkedValue);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [_fieldData, checkedValue]);

	useEffect(() => {
		setFieldProperties({ defaultValue, required });
	}, [name, defaultValue, required, setFieldProperties]);

	useEffect(() => {
		if (!inputRef.current!.checked && isEqual(defaultValue, checkedValue)) inputRef.current!.checked = true;
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [name, defaultValue]);

	useEffect(() => {
		return () => {
			if (!persistOnUnmount) deleteField();
		};
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [name, deleteField]);

	return (
		<MyGeneralInputContainer
			name={name}
			containerProps={containerProps}
			noBorder={noBorder}
			noBackground={noBackground}
			disabled={disabled}
		>
			<MyPrefix id={id} prefix={prefix} />
			<input
				{...inputProps}
				type="checkbox"
				id={id}
				name={name}
				onChange={onChange}
				ref={inputRef}
				required={required}
				disabled={disabled}
			/>
			<Suffix id={id} suffix={suffix} />
		</MyGeneralInputContainer>
	);
}
