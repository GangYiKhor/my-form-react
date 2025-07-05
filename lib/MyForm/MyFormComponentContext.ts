import { createContext, useCallback, useContext, useMemo } from 'react';
import type {
	ConvertToUnionSingleDelete,
	ConvertToUnionSingleProperties,
	ConvertToUnionSingleUpdate,
	DataType,
	FieldType,
	PropertiesType,
	ValidType,
} from './MyFormContext';

type ConvertToUnionFieldUpdate<T extends { [key: string]: any }> = {
	[K in keyof T]: { value?: T[K] | null; valid?: boolean; skipRender?: boolean };
}[keyof T];
type ConvertToUnionFieldProperties<T extends { [key: string]: any }> = {
	[K in keyof T]: {
		defaultValue?: T[K];
		required?: boolean | ((value: T[K]) => boolean);
		validator?: (input: T[K]) => boolean | string;
	};
}[keyof T];

type FormComponentContextType<T extends DataType = DataType> = {
	formData: FieldType<T>;
	formProperties: PropertiesType<T>;
	updateField({ name, value, valid, skipRender }: ConvertToUnionSingleUpdate<T>): void;
	deleteField({ name }: ConvertToUnionSingleDelete<T>): void;
	validateField(name: keyof T, valid?: boolean): void;
	getFormData(): DataType;
	getFormValid(): ValidType;
	setFieldProperties({ name, defaultValue, required, validator }: ConvertToUnionSingleProperties<T>): void;
	formId: string;
};

export const FormComponent = createContext<FormComponentContextType | undefined>(undefined);

export function useFormComponent<T = any>(name: string) {
	type P = { [name]: T };
	const form = useContext(FormComponent)! as FormComponentContextType<P>;

	const {
		formData: _formData,
		formProperties: _formProperties,
		updateField: _updateField,
		deleteField: _deleteField,
		validateField: _validateField,
		setFieldProperties: _setFieldProperties,
		formId,
	} = form;

	const fieldData = _formData?.[name]?.value;
	const fieldValid = _formData?.[name]?.valid;
	const fieldInvalidReason = _formData?.[name]?.invalidReason;
	const fieldProperties = _formProperties?.[name];

	const updateField = useCallback(
		({ value, valid, skipRender }: ConvertToUnionFieldUpdate<P>) => {
			_updateField({ name, value, valid, skipRender });
		},
		[_updateField, name]
	);

	const deleteField = useCallback(() => {
		_deleteField({ name });
	}, [_deleteField, name]);

	const validateField = useCallback(
		(valid?: boolean) => {
			_validateField(name, valid);
		},
		[_validateField, name]
	);

	const setFieldProperties = useCallback(
		({ defaultValue, required, validator }: ConvertToUnionFieldProperties<P>) => {
			_setFieldProperties({ name, defaultValue, required, validator });
		},
		[_setFieldProperties, name]
	);

	const value = useMemo(
		() => ({
			updateField,
			deleteField,
			validateField,
			setFieldProperties,
			formId,
		}),
		[updateField, deleteField, validateField, setFieldProperties, formId]
	);

	return { fieldData, fieldValid, fieldInvalidReason, fieldProperties, ...value };
}
