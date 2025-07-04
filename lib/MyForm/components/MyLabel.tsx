import { useFormTheme } from '../MyFormTheme';
import { clsx } from '../utils';

type PropType = {
	for: string;
	required?: boolean;
	children: string | React.ReactNode;
};

type LabelProps = Omit<React.HTMLAttributes<HTMLLabelElement>, keyof PropType>;

export default function MyLabel({
	for: htmlFor,
	required,
	children,
	labelProps,
}: PropType & { labelProps?: LabelProps }) {
	const darkMode = useFormTheme();
	const { className: labelClassName, ..._labelProps } = labelProps ?? {};
	return (
		<label htmlFor={htmlFor} {..._labelProps} className={clsx('my-form-label', `dark-${darkMode}`, labelClassName)}>
			{children}

			<span
				className={clsx('required-label', required && 'required')}
				title="Required"
				aria-description="Required"
				aria-hidden={!required}
			>
				*
			</span>
		</label>
	);
}
