import { useEffect } from 'react';
import { useFormComponent } from '../MyFormComponentContext';
import { useSubForm } from '../MySubFormContext';
import MyGeneralInputContainer from './components/MyGeneralInputContainer';
import MyPrefix from './components/MyPrefix';
import Suffix from './components/MySuffix';

type PropType = {
	id: string;
	name: string;
	prefix?: string | React.ReactNode;
	suffix?: string | React.ReactNode;
	onChange?(event: React.ChangeEvent<HTMLInputElement>, input: File[] | null): void;
	validator?(input: File[] | null): boolean | string;
	validateImmediately?: boolean;
	multiple?: boolean;
	required?: boolean;
	persistOnUnmount?: boolean;
	noBorder?: boolean;
	noBackground?: boolean;
	disabled?: boolean;
};

type HtmlProps = {
	inputProps?: Omit<React.InputHTMLAttributes<HTMLInputElement>, keyof PropType | 'type'>;
	containerProps?: React.HTMLAttributes<HTMLDivElement>;
};

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
	if (subFormId) name = `${subFormId}_${name}`;

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
