import { useEffect, useMemo, useRef } from 'react';
import { useFormComponent } from '../../MyFormComponentContext';
import { useSubForm } from '../../MySubFormContext';
import { debounce } from '../../utils';
import { EMPTY_VALUE } from '../utils';

type PropType<T = any, HTML = HTMLInputElement> = {
	name: string;
	emptyValue?: string;
	nullValue?: T | null;
	defaultValue?: T;
	required?: boolean;
	persistOnUnmount?: boolean;
	parser(input: string): T | null;
	toString(value?: T | null): string;
	toInternal(formData: T | undefined): T | null;
	comparisor(formData: T | null, internalValue: T | null | undefined): boolean;
	onChange?(event: React.ChangeEvent<HTML>, input: T | null): void;
	validator?(input: T | null): boolean | string;
	isPartial?(input: T | null): boolean;
	validateImmediately?: boolean;
	inputDelay?: number;
	disabled?: boolean;
};

export default function useGeneralInput<
	T = any,
	HTML extends HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement = HTMLInputElement
>({
	name: _name,
	emptyValue = '',
	defaultValue,
	required,
	persistOnUnmount,
	parser,
	toString,
	toInternal,
	comparisor,
	onChange: _onChange,
	validator,
	isPartial,
	validateImmediately,
	inputDelay = 0,
	disabled = false,
}: PropType<T, HTML>) {
	const subFormId = useSubForm();
	let name = _name;
	if (subFormId) name = `${subFormId}_${name}`;

	const { fieldData, fieldValid, updateField, deleteField, setFieldProperties } = useFormComponent<T>(name);
	const inputRef = useRef<HTML>(null);
	const internalRef = useRef<T | null | undefined>(null);
	const delayedUpdate = useMemo(
		() => debounce(updateField, inputDelay > 0 ? inputDelay : 0),
		[inputDelay, updateField]
	);

	useEffect(() => {
		if (inputDelay < 0) console.warn(`Invalid inputDelay ${inputDelay}! Switched to 0ms!`);
	}, [inputDelay]);

	const validate = (input: T | null, immediate = false) => {
		if (!validateImmediately) {
			if (!fieldValid) {
				if (immediate) delayedUpdate.immediate({ value: input, valid: true });
				else delayedUpdate({ value: input, valid: true });
			}
			return;
		}
		const isValid = validator?.(input) ?? true;
		if (immediate) delayedUpdate.immediate({ value: input, valid: isValid === true });
		else delayedUpdate({ value: input, valid: isValid === true });
	};

	const onChange = (e: React.ChangeEvent<HTML>) => {
		if (disabled) return;
		const value = parser(e.target.value);
		if (!isPartial?.(value)) {
			delayedUpdate({ value });
			internalRef.current = value;
			_onChange?.(e, value);
			validate(value);
		} else {
			delayedUpdate.immediate({ value: null, skipRender: true });
		}
	};

	const _fieldData = fieldData ?? EMPTY_VALUE;
	useEffect(() => {
		const newData = toInternal(fieldData);
		if (!comparisor(newData, internalRef.current)) {
			delayedUpdate.cancel();
			inputRef.current!.value = toString(newData);
			internalRef.current = newData;
			validate(newData, true);
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [_fieldData]);

	useEffect(() => {
		setFieldProperties({ defaultValue, required, validator });
	}, [name, defaultValue, required, setFieldProperties, validator]);

	useEffect(() => {
		if (inputRef.current!.value === emptyValue) {
			inputRef.current!.value = toString(defaultValue);
			internalRef.current = defaultValue;
			delayedUpdate.immediate({ value: defaultValue });
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [name, defaultValue]);

	useEffect(() => {
		return () => {
			if (!persistOnUnmount) {
				delayedUpdate.cancel();
				deleteField();
			}
		};
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [name]);

	return { inputRef, onChange };
}
