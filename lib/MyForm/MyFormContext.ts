import { createContext, useCallback, useContext, useMemo } from 'react';

export type DataType = { [key: string]: any };
export type FormDataType<T extends DataType = DataType> = { [key: string]: T };

export type ValidType<T extends { [key: string]: any } = DataType> = { [K in keyof T]: boolean };

export type PropertiesType<T extends DataType = DataType> = {
	[K in keyof T]: {
		defaultValue: T[K];
		required: boolean | ((value: T[K]) => boolean);
		validator: (input: T[K]) => boolean | string;
	};
};
export type FormPropertiesType<T extends FormDataType = FormDataType> = { [K in keyof T]: PropertiesType<T[K]> };

export type FieldType<T extends DataType = DataType> = {
	[K in keyof T]: { value: T[K] | undefined; valid: boolean; invalidReason?: string };
};
export type FormFieldType<T extends FormDataType = FormDataType> = { [K in keyof T]: FieldType<T[K]> };

export type ConvertToUnionSingleDelete<T extends { [key: string]: any }> = {
	[K in keyof T]: { name: K };
}[keyof T];
export type ConvertToUnionDelete<T extends { [key: string]: { [key: string]: any } }> = {
	[K in keyof T]: { formId: K } & ConvertToUnionSingleDelete<T[K]>;
}[keyof T];
export type ConvertToUnionSingleUpdate<T extends { [key: string]: any }> = {
	[K in keyof T]: { name: K; value?: T[K] | null; valid?: boolean; skipRender?: boolean };
}[keyof T];
export type ConvertToUnionUpdate<T extends { [key: string]: { [key: string]: any } }> = {
	[K in keyof T]: { formId: K } & ConvertToUnionSingleUpdate<T[K]>;
}[keyof T];
export type ConvertToUnionInitialise<T extends { [key: string]: { [key: string]: any } }> = {
	[K in keyof T]: { formId: K; data?: Partial<T[K]> };
}[keyof T];
export type ConvertToUnionSingleProperties<T extends { [key: string]: any }> = {
	[K in keyof T]: {
		name: K;
		defaultValue?: T[K];
		required?: boolean | ((value: T[K]) => boolean);
		validator?: (input: T[K]) => boolean | string;
	};
}[keyof T];
export type ConvertToUnionProperties<T extends { [key: string]: any }> = {
	[K in keyof T]: { formId: K } & ConvertToUnionSingleProperties<T[K]>;
}[keyof T];

export type ContextType<T extends FormDataType = FormDataType> = {
	formData: FormFieldType<T>;
	formProperties: React.RefObject<FormPropertiesType<T>>;
	initialiseForm({ formId, data }: ConvertToUnionInitialise<T>): void;
	updateField({ formId, name, value, valid, skipRender }: ConvertToUnionUpdate<T>): void;
	deleteField({ formId, name }: ConvertToUnionDelete<T>): void;
	validateField(formId: string, name: string, valid?: boolean): void;
	resetForm(formId: string): void;
	clearForm(formId: string): void;
	emptyForm(formId: string, emptyForm?: { [key: string]: any }): void;
	deleteForm(formId: string): void;
	getFormData(formId: string): T | T[keyof T];
	getFormValid(formId: string): { [K in keyof T]: ValidType<T[K]> } | ValidType<T>;
	validateForm(formId: string): boolean;
	setFieldProperties({ formId, name, required, validator }: ConvertToUnionProperties<T>): void;
	setSubForm(formId: string, prefix: string): void;
	deleteSubForm(formId: string, prefix: string): void;
};

export const Form = createContext<ContextType | undefined>(undefined);

export function useMyFullForm<T extends { [key: string]: { [key: string]: any } } = FormDataType>() {
	const form = useContext(Form) as ContextType<T> | undefined;
	if (!form) console.error('Form is not initialised! Have you wrap the component with MyFormProvider?');
	return form!;
}

export function useMyForm<T extends { [key: string]: any } = DataType>(formId: string) {
	const form = useContext(Form) as ContextType<{ [formId]: T }> | undefined;
	if (!form) console.error('Form is not initialised! Have you wrap the component with MyFormProvider?');

	const {
		formData: _formData,
		formProperties: _formProperties,
		initialiseForm: _initialiseForm,
		updateField: _updateField,
		deleteField: _deleteField,
		validateField: _validateField,
		resetForm: _resetForm,
		clearForm: _clearForm,
		emptyForm: _emptyForm,
		deleteForm: _deleteForm,
		getFormData: _getFormData,
		getFormValid: _getFormValid,
		validateForm: _validateForm,
		setFieldProperties: _setFieldProperties,
	} = form!;

	const formData = _formData[formId];
	const formProperties = _formProperties.current[formId];

	const initialiseForm = useCallback(
		(data: Partial<T>) => {
			_initialiseForm?.({ formId, data });
		},
		[_initialiseForm, formId]
	);

	const updateField = useCallback(
		({ name, value, valid, skipRender }: ConvertToUnionSingleUpdate<T>) => {
			_updateField?.({ formId, name: name as string, value, valid, skipRender });
		},
		[_updateField, formId]
	);

	const deleteField = useCallback(
		({ name }: ConvertToUnionSingleUpdate<T>) => {
			_deleteField?.({ formId, name: name as string });
		},
		[_deleteField, formId]
	);

	const validateField = useCallback(
		(name: string, valid?: boolean) => {
			_validateField?.(formId, name, valid);
		},
		[_validateField, formId]
	);

	const resetForm = useCallback(() => {
		_resetForm?.(formId);
	}, [_resetForm, formId]);

	const clearForm = useCallback(() => {
		_clearForm?.(formId);
	}, [_clearForm, formId]);

	const emptyForm = useCallback(
		(emptyForm?: DataType) => {
			_emptyForm?.(formId, emptyForm);
		},
		[_emptyForm, formId]
	);

	const deleteForm = useCallback(() => {
		_deleteForm?.(formId);
	}, [_deleteForm, formId]);

	const getFormData = useCallback(() => {
		return _getFormData?.(formId) as T;
	}, [_getFormData, formId]);

	const getFormValid = useCallback(() => {
		return _getFormValid?.(formId) as ValidType;
	}, [_getFormValid, formId]);

	const validateForm = useCallback(() => {
		return _validateForm?.(formId);
	}, [_validateForm, formId]);

	const setFieldProperties = useCallback(
		({ name, defaultValue, required, validator }: ConvertToUnionProperties<T>) => {
			return _setFieldProperties?.({ formId, name: name as string, defaultValue, required, validator });
		},
		[_setFieldProperties, formId]
	);

	const value = useMemo(
		() => ({
			formData,
			formProperties,
			initialiseForm,
			updateField,
			deleteField,
			validateField,
			resetForm,
			clearForm,
			emptyForm,
			deleteForm,
			getFormData,
			getFormValid,
			validateForm,
			setFieldProperties,
			formId,
		}),
		[
			formData,
			formProperties,
			initialiseForm,
			updateField,
			deleteField,
			validateField,
			resetForm,
			clearForm,
			emptyForm,
			deleteForm,
			getFormData,
			getFormValid,
			validateForm,
			setFieldProperties,
			formId,
		]
	);

	return value;
}
