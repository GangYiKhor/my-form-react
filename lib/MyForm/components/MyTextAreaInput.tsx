import { clsx } from '../utils';
import MyGeneralInputContainer from './components/MyGeneralInputContainer';
import useGeneralInput from './hooks/useGeneralInput';

type PropType = {
	id: string;
	name: string;
	defaultValue?: string;
	rows?: number;
	onChange?(event: React.ChangeEvent<HTMLTextAreaElement>, input: string): void;
	validator?(input: string): boolean | string;
	validateImmediately?: boolean;
	required?: boolean;
	persistOnUnmount?: boolean;
	inputDelay?: number;
	fillRight?: boolean;
	nonResizeable?: boolean;
	showGrid?: boolean;
	noBorder?: boolean;
	noBackground?: boolean;
	disabled?: boolean;
};

type HtmlProps = {
	inputProps?: Omit<React.HTMLAttributes<HTMLTextAreaElement>, keyof PropType | 'ref'>;
	containerProps?: React.HTMLAttributes<HTMLDivElement>;
};

export default function MyTextAreaInput({
	id,
	name,
	defaultValue = '',
	rows,
	onChange: _onChange,
	validator,
	validateImmediately = false,
	required = false,
	persistOnUnmount = false,
	inputDelay,
	fillRight,
	nonResizeable,
	showGrid,
	noBorder,
	noBackground,
	disabled = false,
	inputProps,
	containerProps,
}: PropType & HtmlProps) {
	const { inputRef, onChange } = useGeneralInput<string, HTMLTextAreaElement>({
		name,
		defaultValue,
		required,
		persistOnUnmount,
		parser: (v) => v,
		toString: (v) => v ?? '',
		toInternal: (v) => v ?? '',
		comparisor: (data, value) => data === value,
		onChange: _onChange,
		validator,
		validateImmediately,
		inputDelay,
		disabled,
	});

	return (
		<MyGeneralInputContainer
			name={name}
			containerProps={containerProps}
			className={clsx(fillRight && 'fill-right', nonResizeable && 'non-resizeable', showGrid && 'show-grid')}
			noBorder={noBorder}
			noBackground={noBackground}
			disabled={disabled}
		>
			<textarea
				{...inputProps}
				id={id}
				name={name}
				onChange={onChange}
				ref={inputRef}
				rows={rows}
				required={required}
				disabled={disabled}
			></textarea>
		</MyGeneralInputContainer>
	);
}
