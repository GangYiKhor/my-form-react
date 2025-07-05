import { useRef } from 'react';
import { useFormComponent } from '../../MyFormComponentContext';
import { useSubForm } from '../../MySubFormContext';

/**
 * Get field handlers and data for the component
 * @param name The name of the field (Excluding the subform ID, subform ID will be appended automatically)
 */
export default function useMyInput<T = any, HTML = HTMLInputElement>(name: string) {
	const subFormId = useSubForm();
	if (subFormId) name = `${subFormId}__${name}`;
	const field = useFormComponent<T>(name);
	const inputRef = useRef<HTML>(null);

	return {
		/** A Ref object for the input field */
		ref: inputRef,
		/** The name for the field, if this component is wrapped by a SubForm, the subform ID will be appended automatically */
		fieldName: name,
		/** The data for this input field */
		fieldData: field.fieldData,
		/** The valid status for this input field */
		fieldValid: field.fieldValid,
		/** The invalid reason for this input field */
		fieldInvalidReason: field.fieldInvalidReason,
		/** The properties (defaultValue, validator, required) for this input filed */
		fieldProperties: field.fieldProperties,
		/** An update function for this input field to update value and/or valid status */
		updateField: field.updateField,
		/** A delete function for this input field to delete this field entirely from the form, including the properties */
		deleteField: field.deleteField,
		/**
		 * A validate function for this input field to set the valid status to `true` or `false`
		 *
		 * If valid is not provided, the field will be set to valid
		 */
		validateField: field.validateField,
		/** A set function for this input field to update the field properties (defaultValue, required, validator) */
		setFieldProperties: field.setFieldProperties,
	};
}
