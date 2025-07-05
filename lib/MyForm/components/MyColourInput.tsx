import MyGeneralInputContainer from './components/MyGeneralInputContainer';
import MyPrefix from './components/MyPrefix';
import Suffix from './components/MySuffix';
import useGeneralInput from './hooks/useGeneralInput';
import { type FieldBasicType, type FieldPrefixType, type MyColourType, type ValidateImmediatelyType } from './utils';

type PropType = FieldBasicType &
	FieldPrefixType &
	ValidateImmediatelyType & {
		/** Default value for the field, default to black */
		defaultValue?: MyColourType;
		/** onChange event with parsed input (checked/unchecked) value as second parameter */
		onChange?(event: React.ChangeEvent<HTMLInputElement>, input: MyColourType): void;
		/** Validator for the field for form validations */
		validator?(input: MyColourType): boolean | string;
		/** Delay the onChange trigger to help reducing UI lag, default to 250ms */
		inputDelay?: number;
	};

type HtmlProps = {
	inputProps?: Omit<React.InputHTMLAttributes<HTMLInputElement>, keyof PropType | 'type' | 'ref'>;
	containerProps?: React.HTMLAttributes<HTMLDivElement>;
};

/**
 * A simple colour input with form handlers
 *
 * An input delay of 250ms is applied by default to reduce lag
 * when user drag across the colour palette
 */
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
