import MyGeneralInputContainer from './components/MyGeneralInputContainer';
import MyPrefix from './components/MyPrefix';
import Suffix from './components/MySuffix';
import useGeneralInput from './hooks/useGeneralInput';
import type { FieldBasicType, FieldPrefixType, InputDelayType, ValidateImmediatelyType } from './utils';

type PropType = FieldBasicType &
	FieldPrefixType &
	ValidateImmediatelyType &
	InputDelayType & {
		/** Default value for the field */
		defaultValue?: number;
		/** onChange event with parsed input value as second parameter */
		onChange?(event: React.ChangeEvent<HTMLInputElement>, input: number | null): void;
		/** Validator for the field for form validations */
		validator?(input: number | null): boolean | string;
	};

type HtmlProps = {
	inputProps?: Omit<React.InputHTMLAttributes<HTMLInputElement>, keyof PropType | 'type' | 'ref' | 'min'>;
	containerProps?: React.HTMLAttributes<HTMLDivElement>;
};

/**
 * A simple number input with form handlers disallowing `'-'` character
 */
export default function MyPositiveNumberInput({
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

	const { onKeyDown: _onKeyDown, ..._inputProps } = inputProps ?? {};
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
				{..._inputProps}
				type="number"
				id={id}
				name={name}
				onChange={onChange}
				ref={inputRef}
				required={required}
				disabled={disabled}
				min={0}
				onKeyDown={(e) => {
					if (e.key === '-') {
						e.preventDefault();
						_onKeyDown?.(e);
					}
				}}
			/>
			<Suffix id={id} suffix={suffix} />
		</MyGeneralInputContainer>
	);
}
