import MyGeneralInputContainer from './components/MyGeneralInputContainer';
import MyPrefix from './components/MyPrefix';
import Suffix from './components/MySuffix';
import useGeneralInput from './hooks/useGeneralInput';
import type { MyTimeType } from './utils';

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
	defaultValue?: MyTimeType;
	/** onChange event with parsed input value as second parameter */
	onChange?(event: React.ChangeEvent<HTMLInputElement>, input: MyTimeType | null): void;
	/** Validator for the field for form validations */
	validator?(input: MyTimeType | null): boolean | string;
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

export default function MyTimeInput({
	id,
	name,
	prefix,
	suffix,
	defaultValue,
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
	const { inputRef, onChange } = useGeneralInput<MyTimeType>({
		name,
		defaultValue,
		required,
		persistOnUnmount,
		parser(v) {
			const time = v.split(':');
			if (time.length !== 2) return null;
			const hour = parseInt(time[0]);
			const minute = parseInt(time[1]);
			return { hour, minute };
		},
		toString: (v) => (!v ? '' : `${v.hour}:${v.minute}`),
		toInternal: (v) => v ?? null,
		comparisor: (data, value) => data?.hour === value?.hour && data?.minute === value?.minute,
		onChange: _onChange,
		validator,
		isPartial: (v) => !v?.hour || !v?.minute,
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
				type="time"
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
