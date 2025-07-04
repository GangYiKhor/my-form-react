import MyGeneralInputContainer from './components/MyGeneralInputContainer';
import MyPrefix from './components/MyPrefix';
import Suffix from './components/MySuffix';
import useGeneralInput from './hooks/useGeneralInput';
import { type MyColourType } from './utils';

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
	defaultValue?: MyColourType;
	/** onChange event with parsed input (checked/unchecked) value as second parameter */
	onChange?(event: React.ChangeEvent<HTMLInputElement>, input: MyColourType): void;
	/** Validator for the field for form validations */
	validator?(input: MyColourType): boolean | string;
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

export default function MyColourInput({
	id,
	name,
	prefix,
	suffix,
	defaultValue = '#000000',
	onChange: _onChange,
	required = false,
	persistOnUnmount = false,
	inputDelay = 250,
	noBorder,
	noBackground,
	disabled = false,
	inputProps,
	containerProps,
}: PropType & HtmlProps) {
	const { inputRef, onChange } = useGeneralInput<MyColourType>({
		name,
		emptyValue: '#000000',
		defaultValue,
		required,
		persistOnUnmount,
		parser: (v) => v as MyColourType,
		toString: (v) => v ?? '',
		toInternal: (v) => v ?? '#000000',
		comparisor: (data, value) => data === value,
		onChange: _onChange,
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
				type="color"
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
