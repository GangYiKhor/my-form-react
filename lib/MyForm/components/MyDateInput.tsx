import MyGeneralInputContainer from './components/MyGeneralInputContainer';
import MyPrefix from './components/MyPrefix';
import Suffix from './components/MySuffix';
import useGeneralInput from './hooks/useGeneralInput';
import { dateFormatter } from './utils';

type PropType = {
	id: string;
	name: string;
	prefix?: string | React.ReactNode;
	suffix?: string | React.ReactNode;
	defaultValue?: Date;
	onChange?(event: React.ChangeEvent<HTMLInputElement>, input: Date | null): void;
	validator?(input: Date | null): boolean | string;
	validateImmediately?: boolean;
	required?: boolean;
	persistOnUnmount?: boolean;
	inputDelay?: number;
	noBorder?: boolean;
	noBackground?: boolean;
	disabled?: boolean;
};

type HtmlProps = {
	inputProps?: Omit<React.InputHTMLAttributes<HTMLInputElement>, keyof PropType | 'type' | 'ref'>;
	containerProps?: React.HTMLAttributes<HTMLDivElement>;
};

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
