import MyGeneralInputContainer from './components/MyGeneralInputContainer';
import MyPrefix from './components/MyPrefix';
import Suffix from './components/MySuffix';
import useGeneralInput from './hooks/useGeneralInput';
import {
	dateFormatter,
	type FieldBasicType,
	type FieldPrefixType,
	type InputDelayType,
	type ValidateImmediatelyType,
} from './utils';

type PropType = FieldBasicType &
	FieldPrefixType &
	ValidateImmediatelyType &
	InputDelayType & {
		/** Default value for the field */
		defaultValue?: Date;
		/** onChange event with parsed input value as second parameter */
		onChange?(event: React.ChangeEvent<HTMLInputElement>, input: Date | null): void;
		/** Validator for the field for form validations */
		validator?(input: Date | null): boolean | string;
	};

type HtmlProps = {
	inputProps?: Omit<React.InputHTMLAttributes<HTMLInputElement>, keyof PropType | 'type' | 'ref'>;
	containerProps?: React.HTMLAttributes<HTMLDivElement>;
};

/**
 * A simple date input with form handlers
 *
 * **TIMEZONE IS NOT HANDLED**
 */
export default function MyDateInput({
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
	const { inputRef, onChange } = useGeneralInput<Date>({
		name,
		defaultValue,
		required,
		persistOnUnmount,
		parser(v) {
			const value = new Date(v);
			return Number.isNaN(value) ? null : value;
		},
		toString: (v) => dateFormatter(v, 'yyyy-MM-dd'),
		toInternal(v) {
			if (!v || Number.isNaN(v.valueOf())) return null;
			return v;
		},
		comparisor: (data, value) => data?.valueOf() === value?.valueOf(),
		onChange: _onChange,
		validator,
		isPartial: (input) => !input || Number.isNaN(input?.valueOf()),
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
				type="date"
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
