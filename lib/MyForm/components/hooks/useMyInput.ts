import { useRef } from 'react';
import { useFormComponent } from '../../MyFormComponentContext';
import { useSubForm } from '../../MySubFormContext';

export default function useMyInput<T = any, HTML = HTMLInputElement>(name: string) {
	const subFormId = useSubForm();
	if (subFormId) name = `${subFormId}__${name}`;
	const field = useFormComponent<T>(name);
	const inputRef = useRef<HTML>(null);

	return {
		ref: inputRef,
		fieldName: name,
		fieldData: field.fieldData,
		fieldValid: field.fieldValid,
		fieldInvalidReason: field.fieldInvalidReason,
		fieldProperties: field.fieldProperties,
		updateField: field.updateField,
		deleteField: field.deleteField,
		validateField: field.validateField,
		setFieldProperties: field.setFieldProperties,
	};
}
