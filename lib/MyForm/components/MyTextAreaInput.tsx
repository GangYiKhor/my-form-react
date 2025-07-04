import { clsx } from '../utils';
import MyGeneralInputContainer from './components/MyGeneralInputContainer';
import useGeneralInput from './hooks/useGeneralInput';

type PropType = {
	/** ID of input */
	id: string;
	/** Name of the field */
	name: string;
	/** Default value for the field */
	defaultValue?: string;
	/** Rows of textarea */
	rows?: number;
	/** onChange event with parsed input value as second parameter */
	onChange?(event: React.ChangeEvent<HTMLTextAreaElement>, input: string): void;
	/** Validator for the field for form validations */
	validator?(input: string): boolean | string;
	/** Validate the field immediately on type/change */
	validateImmediately?: boolean;
	/** Set the field as required */
	required?: boolean;
	/** If `true` the field will not be deleted from `formData` when unmount */
	persistOnUnmount?: boolean;
	/** Delay the onChange trigger to help reducing UI lag */
	inputDelay?: number;
	/** Flex grow to fill right, will disable horizontal resize */
	fillRight?: boolean;
	/** Resize settings */
	resize?: 'both' | 'vertical' | 'horizontal' | 'none';
	/** Show line grid for the text area like a notepad */
	showGrid?: boolean;
	/** Remove the border for the input */
	noBorder?: boolean;
	/** Remove the background for the input */
	noBackground?: boolean;
	/** Disable the input */
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
