import { useEffect, useRef } from 'react';
import { useFormComponent } from '../MyFormComponentContext';
import { useSubForm } from '../MySubFormContext';
import { isEqual } from '../utils';
import MyGeneralInputContainer from './components/MyGeneralInputContainer';
import MyPrefix from './components/MyPrefix';
import Suffix from './components/MySuffix';
import { EMPTY_VALUE, type FieldBasicType, type FieldPrefixType } from './utils';

type PropType<T = any> = FieldBasicType &
	FieldPrefixType & {
		/** Value of the radio button */
		value: T;
		/** Default value for the field */
		defaultValue?: T;
		/** onChange event with parsed input value as second parameter */
		onChange?(event: React.MouseEvent<HTMLInputElement>, input?: T): void;
	};

type HtmlProps = {
	inputProps?: Omit<React.InputHTMLAttributes<HTMLInputElement>, keyof PropType | 'text'>;
	containerProps?: React.HTMLAttributes<HTMLDivElement>;
};

/**
 * A simple radio input with form handlers
 *
 * When the input is checked, `value` will be assigned to the field data
 *
 * If the form is manually updated or updated by another field to the same checked value, the input will be checked automatically
 *
 * The data will be checked using deep equality checks
 */
export default function MyRadioInput<T = any>({
	id,
	name: _name,
	prefix,
	suffix,
	defaultValue,
	value,
	onChange: _onChange,
	required = false,
	persistOnUnmount = false,
	noBorder,
	noBackground,
	disabled = false,
	inputProps,
	containerProps,
}: PropType<T> & HtmlProps) {
	const subFormId = useSubForm();
	let name = _name;
	if (subFormId) name = `${subFormId}__${name}`;

	const { fieldData, updateField, deleteField, setFieldProperties } = useFormComponent<T>(name);
	const inputRef = useRef<HTMLInputElement>(null);

	const onClick = (e: React.MouseEvent<HTMLInputElement>) => {
		if (disabled) return;
		const target = e.target as HTMLInputElement;
		if (target.checked) {
			updateField({ value });
			_onChange?.(e, value);
		} else {
			_onChange?.(e);
		}
	};

	const _fieldData = fieldData ?? EMPTY_VALUE;
	useEffect(() => {
		inputRef.current!.checked = isEqual(fieldData, value);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [_fieldData, value]);

	useEffect(() => {
		setFieldProperties({ defaultValue, required });
	}, [name, defaultValue, required, setFieldProperties]);

	useEffect(() => {
		if (fieldData === undefined && isEqual(defaultValue, value)) {
			updateField({ value });
			inputRef.current!.checked = true;
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [name, defaultValue]);

	useEffect(() => {
		return () => {
			if (!persistOnUnmount) deleteField();
		};
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [name]);

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
				type="radio"
				id={id}
				name={name}
				onClick={onClick}
				ref={inputRef}
				required={required}
				disabled={disabled}
			/>
			<Suffix id={id} suffix={suffix} />
		</MyGeneralInputContainer>
	);
}
