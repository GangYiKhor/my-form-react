import MyGeneralInputContainer from './components/MyGeneralInputContainer';
import MyPrefix from './components/MyPrefix';
import Suffix from './components/MySuffix';
import useGeneralInput from './hooks/useGeneralInput';

type PropType = {
	/** ID of input */
	id: string;
	/** Name of the field */
	name: string;
	/** Input type */
	type?: 'text' | 'email' | 'url' | 'tel' | 'search';
	/** Pattern for tel input type */
	pattern?: string;
	/** Prefix label for the input */
	prefix?: string | React.ReactNode;
	/** Suffix label for the input */
	suffix?: string | React.ReactNode;
	/** Default value for the field */
	defaultValue?: string;
	/** onChange event with parsed input value as second parameter */
	onChange?(event: React.ChangeEvent<HTMLInputElement>, input: string): void;
	/** Validator for the field for form validations */
	validator?(input: string): boolean | string;
	/** Validate the field immediately on type/change */
	validateImmediately?: boolean;
	/** Set the field as required */
	required?: boolean;
	/** If `true` the field will not be deleted from `formData` when unmount */
	persistOnUnmount?: boolean;
	/** Delay the onChange trigger to help reducing UI lag */
	inputDelay?: number;
	/** Remove the border for the input */
	noBorder?: boolean;
	/** Remove the background for the input */
	noBackground?: boolean;
	/** Disable the input */
	disabled?: boolean;
};

type HtmlProps = {
	inputProps?: Omit<React.InputHTMLAttributes<HTMLInputElement>, keyof PropType | 'ref'>;
	containerProps?: React.HTMLAttributes<HTMLDivElement>;
};

export default function MyTextInput({
	id,
	name,
	type = 'text',
	pattern,
	prefix,
	suffix,
	defaultValue = '',
	onChange: _onChange,
	validator,
	validateImmediately = false,
	required = false,
	persistOnUnmount = false,
	inputDelay,
	noBorder,
	noBackground,
	disabled = false,
	inputProps,
	containerProps,
}: PropType & HtmlProps) {
	const { inputRef, onChange } = useGeneralInput<string>({
		name,
		defaultValue,
		required,
		persistOnUnmount,
		parser: (v) => v,
		toString: (v) => v ?? '',
		toInternal: (v) => v ?? '',
		comparisor: (data, value) => data === value,
		onChange: _onChange,
		validator,
		validateImmediately,
		inputDelay,
		disabled,
	});

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
				type={type}
				id={id}
				name={name}
				onChange={onChange}
				ref={inputRef}
				pattern={pattern}
				required={required}
				disabled={disabled}
			/>
			<Suffix id={id} suffix={suffix} />
		</MyGeneralInputContainer>
	);
}
