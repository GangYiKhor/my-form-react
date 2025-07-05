import { clsx } from '../utils';
import MyGeneralInputContainer from './components/MyGeneralInputContainer';
import useGeneralInput from './hooks/useGeneralInput';
import type { FieldBasicType, InputDelayType, ValidateImmediatelyType } from './utils';

type PropType = FieldBasicType &
	ValidateImmediatelyType &
	InputDelayType & {
		/** Default value for the field */
		defaultValue?: string;
		/** Rows of textarea */
		rows?: number;
		/** onChange event with parsed input value as second parameter */
		onChange?(event: React.ChangeEvent<HTMLTextAreaElement>, input: string): void;
		/** Validator for the field for form validations */
		validator?(input: string): boolean | string;
		/** Flex grow to fill right, will disable horizontal resize */
		fillRight?: boolean;
		/** Resize settings */
		resize?: 'both' | 'vertical' | 'horizontal' | 'none';
		/** Show line grid for the text area like a notepad */
		showGrid?: boolean;
	};

type HtmlProps = {
	inputProps?: Omit<React.HTMLAttributes<HTMLTextAreaElement>, keyof PropType | 'ref'>;
	containerProps?: React.HTMLAttributes<HTMLDivElement>;
};

/**
 * A simple textarea input with form handlers
 *
 * If `showGrid` is set to `true`,
 * the text area will have a line grid background like a notepad
 */
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
	fillRight = false,
	resize = 'both',
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
			className={clsx(fillRight && 'fill-right', showGrid && 'show-grid', `resize-${resize}`)}
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
