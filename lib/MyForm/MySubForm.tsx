import { useEffect, useState } from 'react';
import { useFormComponent } from './MyFormComponentContext';
import { useMyFullForm } from './MyFormContext';
import { SubForm, useSubForm } from './MySubFormContext';
import { EMPTY_VALUE } from './components/utils';

type PropType = {
	subFormId: string;
	children: React.ReactNode;
};

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
