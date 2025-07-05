import MyGeneralInputContainer from './components/MyGeneralInputContainer';
import MyPrefix from './components/MyPrefix';
import Suffix from './components/MySuffix';
import useGeneralInput from './hooks/useGeneralInput';
import type { FieldBasicType, FieldPrefixType, InputDelayType, ValidateImmediatelyType } from './utils';

const padMonth = (month: number) => {
	if (month < 10) return `0${month}`;
	else return month;
};

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
 * A simple month input with form handlers
 *
 * **TIMEZONE IS NOT HANDLED**
 */
export default function MyMonthInput({
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
		toString(v) {
			if (!v) return '';
			if (Number.isNaN(v.valueOf())) return '';
			const year = v.getFullYear();
			const month = v.getMonth() + 1;
			return `${year}-${padMonth(month)}`;
		},
		toInternal(v) {
			if (!v || Number.isNaN(v.valueOf())) return null;
			return v;
		},
		comparisor: (data, value) => {
			return data?.getFullYear() === value?.getFullYear() && data?.getMonth() === value?.getMonth();
		},
		onChange: _onChange,
		validator,
		isPartial: (v) => !v || Number.isNaN(v.valueOf()),
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
				type="month"
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
