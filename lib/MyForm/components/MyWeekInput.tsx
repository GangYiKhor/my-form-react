import MyGeneralInputContainer from './components/MyGeneralInputContainer';
import MyPrefix from './components/MyPrefix';
import Suffix from './components/MySuffix';
import useGeneralInput from './hooks/useGeneralInput';

type PropType = {
	id: string;
	name: string;
	prefix?: string | React.ReactNode;
	suffix?: string | React.ReactNode;
	defaultValue?: { year: number; week: number };
	onChange?(event: React.ChangeEvent<HTMLInputElement>, input: { year: number; week: number }): void;
	validator?(input: { year: number; week: number }): boolean | string;
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
	const { inputRef, onChange } = useGeneralInput<{ year: number; week: number }>({
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
