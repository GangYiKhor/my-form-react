import MyGeneralInputContainer from './components/MyGeneralInputContainer';
import MyPrefix from './components/MyPrefix';
import Suffix from './components/MySuffix';
import useGeneralInput from './hooks/useGeneralInput';
import type { FieldBasicType, FieldPrefixType, InputDelayType, MyWeekType, ValidateImmediatelyType } from './utils';

type PropType = FieldBasicType &
	FieldPrefixType &
	ValidateImmediatelyType &
	InputDelayType & {
		/** Default value for the field */
		defaultValue?: MyWeekType;
		/** onChange event with parsed input value as second parameter */
		onChange?(event: React.ChangeEvent<HTMLInputElement>, input: MyWeekType): void;
		/** Validator for the field for form validations */
		validator?(input: MyWeekType): boolean | string;
	};

type HtmlProps = {
	inputProps?: Omit<React.InputHTMLAttributes<HTMLInputElement>, keyof PropType | 'type' | 'ref'>;
	containerProps?: React.HTMLAttributes<HTMLDivElement>;
};

/**
 * A simple week input with form handlers
 *
 * The value will be in the format of
 * ```
 * { year: number; week: number }
 * ```
 */
export default function MyWeekInput({
	id,
	name,
	prefix,
	suffix,
	defaultValue,
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
	const { inputRef, onChange } = useGeneralInput<MyWeekType>({
		name,
		emptyValue: '',
		defaultValue,
		required,
		persistOnUnmount,
		parser: (v) => {
			const dates = v.split('-W');
			if (dates.length !== 2) return null;
			return { year: parseInt(dates[0]), week: parseInt(dates[1]) };
		},
		toString: (v) => (v ? `${v.year}-W${v.week}` : ''),
		toInternal: (v) => v ?? null,
		comparisor: (data, value) => data?.year === value?.year && data?.week === value?.week,
		onChange: _onChange,
		isPartial: (v) => !v?.year || !v?.week,
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
				type="week"
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
