import { useFormComponent } from '../../MyFormComponentContext';
import { useFormTheme } from '../../MyFormTheme';
import { useSubForm } from '../../MySubFormContext';
import { clsx } from '../../utils';

type PropType = {
	name: string;
	containerProps?: React.HTMLAttributes<HTMLDivElement>;
	className?: string;
	noBorder?: boolean;
	noBackground?: boolean;
	disabled?: boolean;
	children: React.ReactNode;
};

export default function MyGeneralInputContainer({
	name: _name,
	containerProps: _containerProps,
	className,
	noBorder,
	noBackground,
	disabled = false,
	children,
}: PropType) {
	const darkMode = useFormTheme();
	const subFormId = useSubForm();
	let name = _name;
	if (subFormId) name = `${subFormId}_${name}`;

	const { fieldValid, fieldInvalidReason } = useFormComponent(name);
	const _fieldValid = fieldValid ?? true;
	const { className: containerClassName, ...containerProps } = _containerProps ?? {};
	const title = _fieldValid ? '' : fieldInvalidReason ?? '';
	return (
		<div
			{...containerProps}
			className={clsx(
				'my-form-input',
				noBorder || 'my-form-border',
				noBackground || 'my-form-background',
				_fieldValid || 'invalid',
				disabled && 'disabled',
				`dark-${darkMode}`,
				className,
				containerClassName
			)}
			title={title}
		>
			{children}
		</div>
	);
}
