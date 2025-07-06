import { useEffect } from 'react';
import { useFormComponent } from '../MyFormComponentContext';
import { useSubForm } from '../MySubFormContext';
import MyGeneralInputContainer from './components/MyGeneralInputContainer';
import MyPrefix from './components/MyPrefix';
import Suffix from './components/MySuffix';
import type { FieldBasicType, FieldPrefixType, ValidateImmediatelyType } from './utils';

type PropType = FieldBasicType &
	FieldPrefixType &
	ValidateImmediatelyType & {
		/** onChange event with parsed input value as second parameter */
		onChange?(event: React.ChangeEvent<HTMLInputElement>, input: File[] | null): void;
		/** Default value for the field */
		validator?(input: File[] | null): boolean | string;
		/** Validate the field immediately on type/change */
		multiple?: boolean;
	};

type HtmlProps = {
	inputProps?: Omit<React.InputHTMLAttributes<HTMLInputElement>, keyof PropType | 'type'>;
	containerProps?: React.HTMLAttributes<HTMLDivElement>;
};

/**
 * A simple file input with form handlers
 *
 * The data is always `undefined` or an array `File[]`
 * regardless of the number of file uploaded
 *
 * A manual update of the field won't trigger this input to
 * capture the filenames due to browser security implementations
 */
export default function MyFileInput({
	id,
	name: _name,
	prefix,
	suffix,
	onChange: _onChange,
	validator,
	validateImmediately = false,
	multiple = false,
	required = false,
	persistOnUnmount = false,
	noBorder,
	noBackground,
	disabled = false,
	inputProps,
	containerProps,
}: PropType & HtmlProps) {
	const subFormId = useSubForm();
	let name = _name;
	if (subFormId) name = `${subFormId}__${name}`;

	const { fieldValid, updateField, deleteField, setFieldProperties } = useFormComponent<File[]>(name);

	const validate = (input: File[] | null) => {
		if (!validateImmediately) {
			if (!fieldValid) updateField({ value: input, valid: true });
			return;
		}

		const isValid = validator?.(input) ?? true;
		updateField({ value: input, valid: isValid === true });
	};

	const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		if (disabled) return;
		const files = e.target.files;
		let value: File[] | null;
		if (files?.length) value = [...files];
		else value = null;
		updateField({ value: value });
		_onChange?.(e, value);
		validate(value);
	};

	useEffect(() => {
		setFieldProperties({ required, validator });
	}, [name, required, setFieldProperties, validator]);

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
				type="file"
				id={id}
				name={name}
				onChange={onChange}
				multiple={multiple}
				required={required}
				disabled={disabled}
			/>
			<Suffix id={id} suffix={suffix} />
		</MyGeneralInputContainer>
	);
}
