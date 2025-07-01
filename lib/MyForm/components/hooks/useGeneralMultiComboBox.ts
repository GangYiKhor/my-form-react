import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useFormComponent } from '../../MyFormComponentContext';
import { useSubForm } from '../../MySubFormContext';
import { debounce, isEqual } from '../../utils';

type PropType<T = any> = {
	name: string;
	defaultValue?: T[];
	onFocus?(event: React.FocusEvent<HTMLInputElement>): void;
	onBlur?(): void;
	onClear?(event: React.MouseEvent<HTMLButtonElement | HTMLButtonElement>): void;
	required?: boolean;
	disabled?: boolean;
	persistOnUnmount?: boolean;
	multi?: boolean;
};

export default function useGeneralMultiComboBox<T = any>({
	name: _name,
	defaultValue,
	onFocus: _onFocus,
	onBlur: _onBlur,
	onClear,
	required,
	disabled,
	persistOnUnmount,
}: PropType<T>) {
	const subFormId = useSubForm();
	let name = _name;
	if (subFormId) name = `${subFormId}_${name}`;

	const { updateField, deleteField, setFieldProperties } = useFormComponent<T[]>(name);
	const inputRef = useRef<HTMLInputElement>(null);
	const internalRef = useRef<T[]>([]);
	const optionsRef = useRef<HTMLDivElement>(null);
	const noScrollRef = useRef(false);
	const [showOptions, setShowOptions] = useState(false);
	const [_, _rerender] = useState([]);
	const rerender = useCallback(() => _rerender([]), []);
	const delayedRerender = useMemo(() => debounce(rerender, 250), [rerender]);
	const hideOptions = useCallback(() => {
		setShowOptions(false);
		_onBlur?.();
	}, [_onBlur]);
	const delayedHideOptions = useMemo(() => debounce(hideOptions, 100), [hideOptions]);

	const onFocus = (e: React.FocusEvent<HTMLInputElement>) => {
		delayedHideOptions.cancel();
		setShowOptions(true);
		_onFocus?.(e);
	};

	const onBlur = () => {
		delayedHideOptions();
	};

	const onSelect = (value: T) => {
		if (disabled) return;
		delayedHideOptions.immediate();

		if (internalRef.current.length === 0) {
			internalRef.current = [value];
		} else {
			const found = internalRef.current.find((v) => isEqual(v, value));
			if (found) internalRef.current = internalRef.current.filter((v) => v !== found);
			else internalRef.current.push(value);
		}
		inputRef.current!.value = '';
		noScrollRef.current = true;
		updateField({ value: [...internalRef.current] });
	};

	const onDelete = (index: number) => {
		if (disabled) return;
		delayedHideOptions.immediate();
		internalRef.current = internalRef.current.filter((_, i) => i !== index);
		noScrollRef.current = true;
		updateField({ value: [...internalRef.current] });
	};

	const toggleDropdown = () => {
		setShowOptions((show) => !show);
	};

	const clearComboBox = (e: React.MouseEvent<HTMLButtonElement>) => {
		if (disabled) return;
		inputRef.current!.value = '';
		internalRef.current = [];
		updateField({ value: [] });
		onClear?.(e);
	};

	useEffect(() => {
		setFieldProperties({ defaultValue, required });
	}, [name, defaultValue, required, setFieldProperties]);

	useEffect(() => {
		return () => {
			if (!persistOnUnmount) deleteField();
		};
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [name]);

	return {
		inputRef,
		internalRef,
		optionsRef,
		noScrollRef,
		showOptions,
		rerender,
		delayedRerender,
		delayedHideOptions,
		onFocus,
		onBlur,
		onSelect,
		onDelete,
		toggleDropdown,
		clearComboBox,
	};
}
