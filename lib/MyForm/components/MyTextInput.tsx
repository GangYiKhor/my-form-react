import MyGeneralInputContainer from './components/MyGeneralInputContainer';
import MyPrefix from './components/MyPrefix';
import Suffix from './components/MySuffix';
import useGeneralInput from './hooks/useGeneralInput';

type PropType = {
	id: string;
	name: string;
	type?: 'text' | 'email' | 'url' | 'tel' | 'search';
	pattern?: string;
	prefix?: string | React.ReactNode;
	suffix?: string | React.ReactNode;
	defaultValue?: string;
	onChange?(event: React.ChangeEvent<HTMLInputElement>, input: string): void;
	validator?(input: string): boolean | string;
	validateImmediately?: boolean;
	required?: boolean;
	persistOnUnmount?: boolean;
	inputDelay?: number;
	noBorder?: boolean;
	noBackground?: boolean;
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
