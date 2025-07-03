import MyGeneralInputContainer from './components/MyGeneralInputContainer';
import MyPrefix from './components/MyPrefix';
import Suffix from './components/MySuffix';
import useGeneralInput from './hooks/useGeneralInput';
import type { TimeType } from './utils';

type PropType = {
	id: string;
	name: string;
	prefix?: string | React.ReactNode;
	suffix?: string | React.ReactNode;
	defaultValue?: TimeType;
	parseAsUtc?: boolean;
	onChange?(event: React.ChangeEvent<HTMLInputElement>, input: TimeType | null): void;
	validator?(input: TimeType | null): boolean | string;
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
	const { inputRef, onChange } = useGeneralInput<TimeType>({
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
