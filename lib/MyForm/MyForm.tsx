import { useMemo } from 'react';
import { FormComponent } from './MyFormComponentContext';
import { useMyForm } from './MyFormContext';
import { clsx } from './utils';

type PropType<T = { [key: string]: any }> = {
	/** ID of the form, can be a plain string or get from `useMyForm('formId').formId` */
	formId: string;
	/** Function when on submit */
	onSubmit?(event: React.FormEvent<HTMLFormElement>, formData: T): void;
	/** Action for form element */
	action?: string;
	/** Method for form element */
	method?: string;
	/** Always call `e.preventDefault()` */
	disableNativeForm?: boolean;
	/** Call onSubmit() only if the clicked button's ID is in `submitButtonId` */
	submitButtonId?: string | string[] | Set<string>;
	children: React.ReactNode;
};
type FormProps = Omit<React.HTMLAttributes<HTMLFormElement>, keyof PropType>;

export default function MyForm<T extends { [key: string]: any } = { [key: string]: any }>({
	formId,
	onSubmit: _onSubmit,
	action,
	method,
	disableNativeForm = false,
	submitButtonId,
	formProps,
	children,
}: PropType<T> & { formProps?: FormProps }) {
	const form = useMyForm(formId);
	const value = useMemo(() => form, [form]);

	const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
		const nativeEvent = e.nativeEvent as unknown as { submitter: HTMLButtonElement };
		const submitter = nativeEvent.submitter;

		let isSubmitter = false;
		if (typeof submitButtonId === 'string') isSubmitter = submitter.id === submitButtonId;
		else if (submitButtonId instanceof Array) isSubmitter = submitButtonId.includes(submitter.id);
		else if (submitButtonId instanceof Set) isSubmitter = submitButtonId.has(submitter.id);
		else if (submitButtonId !== undefined) console.warn('Invalid submitButtonId! All button will be rejected!');

		if (!action) e.preventDefault();

		if (submitButtonId && !isSubmitter) {
			e.preventDefault();
		} else if (disableNativeForm) {
			e.preventDefault();
			if (_onSubmit && form.validateForm()) _onSubmit(e, form.getFormData() as T);
		} else if (form.validateForm()) {
			_onSubmit?.(e, form.getFormData() as T);
		} else {
			e.preventDefault();
		}
	};

	const { className: formClassName, ..._formProps } = formProps ?? {};
	return (
		<FormComponent.Provider value={value}>
			<form
				{..._formProps}
				onSubmit={onSubmit}
				action={action}
				method={method}
				className={clsx('my-form', formClassName)}
			>
				{children}
			</form>
		</FormComponent.Provider>
	);
}
