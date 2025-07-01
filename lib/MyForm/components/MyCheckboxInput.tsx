import { useEffect, useRef } from 'react';
import { useFormComponent } from '../MyFormComponentContext';
import { isEqual } from '../utils';
import MyGeneralInputContainer from './components/MyGeneralInputContainer';
import MyPrefix from './components/MyPrefix';
import Suffix from './components/MySuffix';
import { EMPTY_VALUE } from './utils';

type PropType<T1 = any, T2 = any> = {
	id: string;
	name: string;
	uncheckValue?: T1 | T2 | null;
	checkedValue: T1;
	prefix?: string | React.ReactNode;
	suffix?: string | React.ReactNode;
	defaultValue?: T1;
	onChange?(event: React.ChangeEvent<HTMLInputElement>, input?: T1 | T2 | null): void;
	required?: boolean;
	persistOnUnmount?: boolean;
	noBorder?: boolean;
	noBackground?: boolean;
	disabled?: boolean;
};

type HtmlProps = {
	inputProps?: Omit<React.InputHTMLAttributes<HTMLInputElement>, keyof PropType | 'text'>;
	containerProps?: React.HTMLAttributes<HTMLDivElement>;
};

export default function MyCheckboxInput<CheckedValue = any, UncheckedValue = any>({
	id,
	name,
	uncheckValue = null,
	checkedValue,
	prefix,
	suffix,
	defaultValue,
	onChange: _onChange,
	required = false,
	persistOnUnmount = false,
	noBorder,
	noBackground,
	disabled = false,
	inputProps,
	containerProps,
}: PropType<CheckedValue, UncheckedValue> & HtmlProps) {
	const { fieldData, updateField, deleteField, setFieldProperties } = useFormComponent<CheckedValue | UncheckedValue>(
		name
	);
	const inputRef = useRef<HTMLInputElement>(null);

	const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		if (disabled) return;
		const value = e.target.checked ? checkedValue : uncheckValue ?? null;
		updateField({ value });
		_onChange?.(e, value);
	};

	const _fieldData = fieldData ?? EMPTY_VALUE;
	useEffect(() => {
		inputRef.current!.checked = isEqual(fieldData, checkedValue);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [_fieldData, checkedValue]);

	useEffect(() => {
		setFieldProperties({ defaultValue, required });
	}, [name, defaultValue, required, setFieldProperties]);

	useEffect(() => {
		if (!inputRef.current!.checked && isEqual(defaultValue, checkedValue)) inputRef.current!.checked = true;
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [name, defaultValue]);

	useEffect(() => {
		return () => {
			if (!persistOnUnmount) deleteField();
		};
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [name]);

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
				type="checkbox"
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
