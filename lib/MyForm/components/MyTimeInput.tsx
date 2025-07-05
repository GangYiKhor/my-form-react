import MyGeneralInputContainer from './components/MyGeneralInputContainer';
import MyPrefix from './components/MyPrefix';
import Suffix from './components/MySuffix';
import useGeneralInput from './hooks/useGeneralInput';
import type { FieldBasicType, FieldPrefixType, InputDelayType, MyTimeType, ValidateImmediatelyType } from './utils';

type PropType = FieldBasicType &
	FieldPrefixType &
	ValidateImmediatelyType &
	InputDelayType & {
		/** Default value for the field */
		defaultValue?: MyTimeType;
		/** onChange event with parsed input value as second parameter */
		onChange?(event: React.ChangeEvent<HTMLInputElement>, input: MyTimeType | null): void;
		/** Validator for the field for form validations */
		validator?(input: MyTimeType | null): boolean | string;
	};

type HtmlProps = {
	inputProps?: Omit<React.InputHTMLAttributes<HTMLInputElement>, keyof PropType | 'type' | 'ref'>;
	containerProps?: React.HTMLAttributes<HTMLDivElement>;
};

/**
 * A simple time input with form handlers
 *
 * The value will be in the format of
 * ```
 * { hour: number; minute: number }
 * ```
 */
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
