import { useEffect, useMemo } from 'react';
import { FormComponent } from './MyFormComponentContext';
import { useMyForm } from './MyFormContext';
import { clsx } from './utils';

type PropType<T = { [key: string]: any }> = {
	/** ID of the form, can be a plain string or get from `useMyForm('formId').formId` */
	formId: string;
	/** onSubmit handler, the formData will be passed as second argument, only trigger when the form is valid */
	onSubmit?(event: React.FormEvent<HTMLFormElement>, formData: T): void;
	/** Action for form element */
	action?: string;
	/** Method for form element */
	method?: string;
	/** Always call `e.preventDefault()` and disable native validation (`noValidate` in `<form>`) */
	disableNativeForm?: boolean;
	/** Call onSubmit() only if the clicked button's ID is in `submitButtonId` */
	submitButtonId?: string | string[] | Set<string>;
	/** If `true` the form will not be deleted from `formData` when unmount */
	persistOnUnmount?: boolean;
	/** Ref Element for Form to trigger native form actions such as `submit` */
	formRef?: React.RefObject<HTMLFormElement>;
	children: React.ReactNode;
};
type FormProps = Omit<React.HTMLAttributes<HTMLFormElement>, keyof PropType>;

/**
 * Wrap the components in a `<form>` element and group all input field data into same form object
 *
 * Providing both default form submission handler and a custom `onSubmit` function handler
 *
 * @example
 * <MyForm formId="formA" onSubmit={(data) => save(data)} disableNativeForm>
 * 	<MyTextInput {...props} />
 * </MyForm>
 */
export default function MyForm<T extends { [key: string]: any } = { [key: string]: any }>({
	formId,
	onSubmit: _onSubmit,
	action,
	method,
	disableNativeForm = false,
	submitButtonId,
	formProps,
	persistOnUnmount = false,
	formRef,
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
		if (disableNativeForm) e.preventDefault();

		if (submitButtonId && !isSubmitter) {
			e.preventDefault();
		} else if (form.validateForm()) {
			_onSubmit?.(e, form.getFormData() as T);
		} else {
			e.preventDefault();
		}
	};

	useEffect(() => {
		return () => {
			if (!persistOnUnmount) form.deleteForm();
		};
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [form.deleteForm]);

	const { className: formClassName, ..._formProps } = formProps ?? {};
	return (
		<FormComponent.Provider value={value}>
			<form
				{..._formProps}
				ref={formRef}
				onSubmit={onSubmit}
				action={action}
				method={method}
				className={clsx('my-form', formClassName)}
				noValidate={disableNativeForm}
			>
				{children}
			</form>
		</FormComponent.Provider>
	);
}
