import { useFormTheme } from '../MyFormTheme';
import { clsx } from '../utils';

type PropType = {
	/** htmlFor */
	for: string;
	/** Show required icon */
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
	const { className: labelClassName, title: labelTitle, ..._labelProps } = labelProps ?? {};
	return (
		<label
			htmlFor={htmlFor}
			{..._labelProps}
			title={required ? (labelTitle ? `${labelTitle} (Required)` : 'Required') : labelTitle}
			className={clsx('my-form-label', `dark-${darkMode}`, labelClassName)}
		>
			{children}

			<span
				className={clsx('required-label', required && 'required')}
				title={required ? 'Required' : ''}
				aria-description="Required"
				aria-hidden={!required}
			>
				*
			</span>
		</label>
	);
}
