import { useState } from 'react';
import EyeClose from '../assets/eye-close.svg';
import EyeOpen from '../assets/eye-open.svg';
import MyGeneralInputContainer from './components/MyGeneralInputContainer';
import useGeneralInput from './hooks/useGeneralInput';

type PropType = {
	id: string;
	name: string;
	defaultValue?: string;
	onChange?(event: React.ChangeEvent<HTMLInputElement>, input: string): void;
	validator?(input: string): boolean | string;
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

export default function MyPasswordInput({
	id,
	name,
	defaultValue = '',
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
			/>
			<button
				type="button"
				onClick={(e) => {
					e.preventDefault();
					e.stopPropagation();
					setShowPass(!showPass);
				}}
				className="toggle-password"
				title={showPass ? 'Hide password' : 'Show password'}
			>
				<img src={showPass ? EyeOpen : EyeClose} alt={showPass ? 'Hide password' : 'Show password'} />
			</button>
		</MyGeneralInputContainer>
	);
}
