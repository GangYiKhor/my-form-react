import MyGeneralInputContainer from './components/MyGeneralInputContainer';
import MyPrefix from './components/MyPrefix';
import Suffix from './components/MySuffix';
import useGeneralInput from './hooks/useGeneralInput';

type PropType = {
	/** ID of input */
	id: string;
	/** Name of the field */
	name: string;
	/** Prefix label for the input */
	prefix?: string | React.ReactNode;
	/** Suffix label for the input */
	suffix?: string | React.ReactNode;
	/** Default value for the field */
	defaultValue?: number;
	/** Minimum of the range input */
	min?: number;
	/** maximum of the range input */
	max?: number;
	/** Step of the range input */
	step?: number;
	/** onChange event with parsed input value as second parameter */
	onChange?(event: React.ChangeEvent<HTMLInputElement>, input: number | null): void;
	/** Validator for the field for form validations */
	validator?(input: number | null): boolean | string;
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
	inputProps?: Omit<React.InputHTMLAttributes<HTMLInputElement>, keyof PropType | 'type' | 'ref'>;
	containerProps?: React.HTMLAttributes<HTMLDivElement>;
};

export default function MyRangeInput({
	id,
	name,
	prefix,
	suffix,
	defaultValue,
	min,
	max,
	step,
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
	const { inputRef, onChange } = useGeneralInput<number>({
		name,
		defaultValue,
		required,
		persistOnUnmount,
		parser: (v) => {
			const value = parseFloat(v);
			return Number.isNaN(value) ? null : value;
		},
		toString: (v) => v?.toString() ?? '',
		toInternal: (v) => v ?? null,
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
				type="range"
				id={id}
				name={name}
				onChange={onChange}
				ref={inputRef}
				min={min}
				max={max}
				step={step}
				required={required}
				disabled={disabled}
			/>
			<Suffix id={id} suffix={suffix} />
		</MyGeneralInputContainer>
	);
}
