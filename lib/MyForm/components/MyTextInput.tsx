import MyGeneralInputContainer from './components/MyGeneralInputContainer';
import MyPrefix from './components/MyPrefix';
import Suffix from './components/MySuffix';
import useGeneralInput from './hooks/useGeneralInput';
import type { FieldBasicType, FieldPrefixType, InputDelayType, ValidateImmediatelyType } from './utils';

type PropType = FieldBasicType &
	FieldPrefixType &
	ValidateImmediatelyType &
	InputDelayType & {
		/** Input type */
		type?: 'text' | 'email' | 'url' | 'tel' | 'search';
		/** Pattern for tel input type */
		pattern?: string;
		placeholder?: string;
		/** Default value for the field */
		defaultValue?: string;
		/** onChange event with parsed input value as second parameter */
		onChange?(event: React.ChangeEvent<HTMLInputElement>, input: string): void;
		/** Validator for the field for form validations */
		validator?(input: string): boolean | string;
	};

type HtmlProps = {
	inputProps?: Omit<React.InputHTMLAttributes<HTMLInputElement>, keyof PropType | 'ref'>;
	containerProps?: React.HTMLAttributes<HTMLDivElement>;
};

/**
 * A simple text-based input with form handlers,
 * including `'text'`, `'email'`, `'tel'`, `'url'` and `'search'`
 */
export default function MyTextInput({
	id,
	name,
	type = 'text',
	pattern,
	placeholder,
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
				placeholder={placeholder}
			/>
			<Suffix id={id} suffix={suffix} />
		</MyGeneralInputContainer>
	);
}
