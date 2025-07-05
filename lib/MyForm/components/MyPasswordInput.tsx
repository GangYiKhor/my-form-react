import { useState } from 'react';
import EyeCloseIcon from '../assets/EyeCloseIcon';
import EyeOpenIcon from '../assets/EyeOpenIcon';
import MyGeneralInputContainer from './components/MyGeneralInputContainer';
import useGeneralInput from './hooks/useGeneralInput';
import type { FieldBasicType, InputDelayType, ValidateImmediatelyType } from './utils';

type PropType = FieldBasicType &
	ValidateImmediatelyType &
	InputDelayType & {
		/** Default value for the field */
		defaultValue?: string;
		placeholder?: string;
		/** onChange event with parsed input value as second parameter */
		onChange?(event: React.ChangeEvent<HTMLInputElement>, input: string): void;
		/** Validator for the field for form validations */
		validator?(input: string): boolean | string;
	};

type HtmlProps = {
	inputProps?: Omit<React.InputHTMLAttributes<HTMLInputElement>, keyof PropType | 'type' | 'ref'>;
	containerProps?: React.HTMLAttributes<HTMLDivElement>;
};

/**
 * A simple password input with form handlers
 *
 * An eye icon to toggle the visibility of password is provided
 */
export default function MyPasswordInput({
	id,
	name,
	defaultValue = '',
	placeholder,
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
	const [showPass, setShowPass] = useState(false);

	const { inputRef, onChange } = useGeneralInput<string>({
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
			noBorder={noBorder}
			noBackground={noBackground}
			disabled={disabled}
		>
			<input
				{...inputProps}
				type={showPass ? 'text' : 'password'}
				id={id}
				name={name}
				onChange={onChange}
				ref={inputRef}
				required={required}
				disabled={disabled}
				placeholder={placeholder}
			/>
			<button
				type="button"
				onClick={(e) => {
					e.preventDefault();
					e.stopPropagation();
					setShowPass(!showPass);
				}}
				className="toggle-password my-form-button"
				title={showPass ? 'Hide password' : 'Show password'}
			>
				{showPass ? <EyeOpenIcon /> : <EyeCloseIcon />}
			</button>
		</MyGeneralInputContainer>
	);
}
