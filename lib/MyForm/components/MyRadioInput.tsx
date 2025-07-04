import { useEffect, useRef } from 'react';
import { useFormComponent } from '../MyFormComponentContext';
import { useSubForm } from '../MySubFormContext';
import { isEqual } from '../utils';
import MyGeneralInputContainer from './components/MyGeneralInputContainer';
import MyPrefix from './components/MyPrefix';
import Suffix from './components/MySuffix';
import { EMPTY_VALUE } from './utils';

type PropType<T = any> = {
	/** ID of input */
	id: string;
	/** Name of the field */
	name: string;
	/** Value of the radio button */
	value: T;
	/** Prefix label for the input */
	prefix?: string | React.ReactNode;
	/** Suffix label for the input */
	suffix?: string | React.ReactNode;
	/** Default value for the field */
	defaultValue?: T;
	/** onChange event with parsed input value as second parameter */
	onChange?(event: React.MouseEvent<HTMLInputElement>, input?: T): void;
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

type HtmlProps = {
	inputProps?: Omit<React.InputHTMLAttributes<HTMLInputElement>, keyof PropType | 'text'>;
	containerProps?: React.HTMLAttributes<HTMLDivElement>;
};

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
