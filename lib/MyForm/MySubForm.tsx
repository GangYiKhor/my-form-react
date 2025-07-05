import { useEffect, useState } from 'react';
import { useFormComponent } from './MyFormComponentContext';
import { useMyFullForm } from './MyFormContext';
import { SubForm, useSubForm } from './MySubFormContext';
import { EMPTY_VALUE } from './components/utils';

type PropType = {
	/**
	 * Subform fields are identified from the beginning of a field name
	 *
	 * A subform ID of `'customer'` will group all `'customer__XXX'` fields as children of `'customer'`
	 */
	subFormId: string;
	children: React.ReactNode;
};

/**
 * Wrap the children in a subform, all predefined `<MyInputs />` component will be using `'subformid__XXX'` name
 *
 * When `form.getFormData()` or `form.getFormValid()` is called, subform fields will be grouped into one object
 *
 * ```
 * {
 * 	'field_1': ...,
 * 	'subform_1': {
 * 		'field_1': ...,
 * 		'field_2': ...,
 * 	},
 * }
 * ```
 */
export default function MySubForm({ subFormId, children }: PropType) {
	const existingId = useSubForm();
	const formId = useFormComponent('').formId;
	const { setSubForm, deleteSubForm } = useMyFullForm();
	const [_subFormId, setSubFormId] = useState<string>(subFormId);

	const _existingId = existingId ?? EMPTY_VALUE;
	useEffect(() => {
		if (existingId) console.warn('SubForm within SubForm is not supported! Only the innermost SubForm will be used!');
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [_existingId]);

	useEffect(() => {
		setSubFormId(subFormId);
	}, [subFormId]);

	useEffect(() => {
		setSubForm(formId, subFormId);

		return () => {
			deleteSubForm(formId, subFormId);
		};
	}, [formId, subFormId, setSubForm, deleteSubForm]);

	return <SubForm.Provider value={_subFormId}>{children}</SubForm.Provider>;
}
