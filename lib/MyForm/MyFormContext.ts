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
type SpecificForm<T extends { [key: string]: { [key: string]: any } }> = {
	[K in keyof T]: (formId: K) => {
		formData: FieldType<T[K]>;
		formProperties: PropertiesType<T[K]>;
		initialiseForm: (data: Partial<T[K]>) => void;
		updateField: (data: ConvertToUnionSingleUpdate<T[K]>) => void;
		deleteField: ({ name }: ConvertToUnionSingleDelete<T[K]>) => void;
		validateField: (name: Extract<keyof T[K], string>, valid?: boolean) => void;
		resetForm: () => void;
		clearForm: () => void;
		emptyForm: (data: Partial<T[K]>) => void;
		deleteForm: () => void;
		getFormData: () => T[K];
		getFormValid: () => ValidType<T[K]>;
		validateForm: () => boolean;
		setFieldProperties: (data: ConvertToUnionSingleProperties<T[K]>) => void;
	};
}[keyof T];
export type GetFormDataType<T extends { [key: string]: { [key: string]: any } }> = {
	[K in keyof T]: (formId: K) => T[K];
}[keyof T];
export type GetFormValidType<T extends { [key: string]: { [key: string]: any } }> = {
	[K in keyof T]: (formId: K) => ValidType<T[K]>;
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
	getFormData: (() => T) | GetFormDataType<T>;
	getFormValid: (() => { [key: string]: ValidType<T> }) | GetFormValidType<T>;
	validateForm(formId: string): boolean;
	setFieldProperties({ formId, name, required, validator }: ConvertToUnionProperties<T>): void;
	setSubForm(formId: string, prefix: string): void;
	deleteSubForm(formId: string, prefix: string): void;
	form: SpecificForm<T>;
};

export const Form = createContext<ContextType | undefined>(undefined);

export function useMyFullForm<T extends { [key: string]: { [key: string]: any } } = FormDataType>() {
	const form = useContext(Form) as ContextType<T> | undefined;
	if (!form) console.error('Form is not initialised! Have you wrap the component with MyFormProvider?');
	const {
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
		setSubForm,
		deleteSubForm,
		form: _form,
	} = form!;

	return {
		/**
		 * Internal data values, consists of `{ value, valid, invalidReason }`
		 * @example
		 * formData.myform.myfield.value;
		 * formData.myform.myfield.valid;
		 * formData.myform.myfield.invalidReason;
		 */
		formData,
		/**
		 * Internal field properties, consists of `{ defaultValue, required, validator }`
		 * @example
		 * formData.myform.myfield.defaultValue;
		 * formData.myform.myfield.required;
		 * formData.myform.myfield.validator;
		 */
		formProperties,
		/**
		 * Initialise form data, will replace all existing data
		 * @example
		 * initialiseForm({ formId: 'myform', data: { myfield: 1 } });
		 */
		initialiseForm,
		/**
		 * Update field data, or set valid status, set `skipRender = true` to skip rerender
		 * @example
		 * updateField({ formId: 'myform', name: 'myfield', value: 20 });
		 * updateField({ formId: 'myform', name: 'myfield', valid: false });
		 * updateField({ formId: 'myform', name: 'myfield', value: 500, skipRender: false }); // Does not trigger rerender
		 */
		updateField,
		/**
		 * Delete a field, including it's value and properties
		 * @example
		 * deleteField({ formId: 'myform', name: 'myfield' });
		 */
		deleteField,
		/**
		 * Set the valid status of the field, if valid is not given, it is default to `true`
		 * @example
		 * validateField({ formId: 'myform', name: 'myfield' }); // Set field to valid
		 * validateField({ formId: 'myform', name: 'myfield', valid: true }); // Set field to valid
		 * validateField({ formId: 'myform', name: 'myfield', valid: false }); // Set field to invalid
		 */
		validateField,
		/**
		 * Reset form to their default values, or `undefined` if no default values
		 * @example
		 * resetForm('myform');
		 */
		resetForm,
		/**
		 * Clear the form, result in an empty object `{}` for the cleared form
		 * @example
		 * clearForm('myform');
		 */
		clearForm,
		/**
		 * Empty the form, all fields will be undefined. If data is passed, the passed fields will be initialised
		 * @example
		 * emptyForm('myform');
		 * emptyForm('myform', { field_a: 1 }); // { field_a: 1, field_b: undefined }
		 */
		emptyForm,
		/**
		 * Delete the from entirely, the form will become `undefined` unlike `clearForm`
		 * @example
		 * deleteForm('myform');
		 */
		deleteForm,
		/**
		 * Get data of the form or all forms (Including subforms), without valid status and other property values
		 * @example
		 * getFormData().myform.myfield; // 'Input Value'
		 * getFormData('myform').myfield; // 'Input Value'
		 */
		getFormData,
		/**
		 * Get the valid status of all fields for one form or all forms
		 * @example
		 * getFormValid().myform.myfield; // true
		 * getFormValid('myform').myfield; // true
		 */
		getFormValid,
		/**
		 * Validate a specific form, updating the valid status of all fields, and return whether the form (all fields) is valid
		 * @example
		 * validateForm('myform'); // true
		 */
		validateForm,
		/**
		 * Set the `defaultValue`, `required`, and/or `validator` for a field.
		 *
		 * Might get overridden by the input components, which is triggered by a `useEffect` depending on the properties
		 *
		 * @example
		 * setFieldProperties({ formId: 'myform', name: 'myfield', defaultValue: 20 });
		 */
		setFieldProperties,
		/**
		 * Manually define a subform, subform fields are identified from the beginning of a field name
		 *
		 * A subform ID of `'customer'` will group all `'customer__XXX'` fields as children of `'customer'`
		 *
		 * Recommended to use `<MySubForm></<MySubForm>` instead
		 */
		setSubForm,
		/**
		 * Manually delete a subform
		 */
		deleteSubForm,
		/**
		 * Get a set of similar functions with `formId` automatically passed to the functions
		 *
		 * Acts like `useMyForm()` with the flexibility of dynamically passing in formId instead of a static `useMyForm()` hook
		 */
		form: _form,
	};
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
		(name: Extract<keyof T, string>, valid?: boolean) => {
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
		(emptyForm?: Partial<T>) => {
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
			/**
			 * Internal data values, consists of `{ value, valid, invalidReason }`
			 * @example
			 * formData.myfield.value;
			 * formData.myfield.valid;
			 * formData.myfield.invalidReason;
			 */
			formData,
			/**
			 * Internal field properties, consists of `{ defaultValue, required, validator }`
			 * @example
			 * formData.myfield.defaultValue;
			 * formData.myfield.required;
			 * formData.myfield.validator;
			 */
			formProperties,
			/**
			 * Initialise form data, will replace all existing data
			 * @example
			 * initialiseForm({ myfield: 1 });
			 */
			initialiseForm,
			/**
			 * Update field data, or set valid status, set `skipRender = true` to skip rerender
			 * @example
			 * updateField({ name: 'myfield', value: 20 });
			 * updateField({ name: 'myfield', valid: false });
			 * updateField({ name: 'myfield', value: 500, skipRender: false }); // Does not trigger rerender
			 */
			updateField,
			/**
			 * Delete a field, including it's value and properties
			 * @example
			 * deleteField({ name: 'myfield' });
			 */
			deleteField,
			/**
			 * Set the valid status of the field, if valid is not given, it is default to `true`
			 * @example
			 * validateField({ name: 'myfield' }); // Set field to valid
			 * validateField({ name: 'myfield', valid: true }); // Set field to valid
			 * validateField({ name: 'myfield', valid: false }); // Set field to invalid
			 */
			validateField,
			/**
			 * Reset form to their default values, or `undefined` if no default values
			 * @example
			 * resetForm();
			 */
			resetForm,
			/**
			 * Clear the form, result in an empty object `{}` for the cleared form
			 * @example
			 * clearForm();
			 */
			clearForm,
			/**
			 * Empty the form, all fields will be undefined. If data is passed, the passed fields will be initialised
			 * @example
			 * emptyForm();
			 * emptyForm({ field_a: 1 }); // { field_a: 1, field_b: undefined }
			 */
			emptyForm,
			/**
			 * Delete the from entirely, the form will become `undefined` unlike `clearForm`
			 * @example
			 * deleteForm();
			 */
			deleteForm,
			/**
			 * Get data of the form (Including subforms), without valid status and other property values
			 * @example
			 * getFormData().myfield; // 'Input Value'
			 */
			getFormData,
			/**
			 * Get the valid status of all fields
			 * @example
			 * getFormValid().myfield; // true
			 */
			getFormValid,
			/**
			 * Validate the form, updating the valid status of all fields, and return whether the form (all fields) is valid
			 * @example
			 * validateForm(); // true
			 */
			validateForm,
			/**
			 * Set the `defaultValue`, `required`, and/or `validator` for a field.
			 *
			 * Might get overridden by the input components, which is triggered by a `useEffect` depending on the properties
			 *
			 * @example
			 * setFieldProperties({ name: 'myfield', defaultValue: 20 });
			 */
			setFieldProperties,
			/** The `formId` that is passed into this hook, can be used as a prop for `MyForm` */
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
