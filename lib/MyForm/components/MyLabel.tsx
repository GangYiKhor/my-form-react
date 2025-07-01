import { clsx } from '../utils';

type PropType = {
	htmlFor: string;
	required?: boolean;
	children: string | React.ReactNode;
};

type LabelProps = Omit<React.HTMLAttributes<HTMLLabelElement>, keyof PropType>;

export default function MyLabel({ htmlFor, required, children, labelProps }: PropType & { labelProps?: LabelProps }) {
	const { className: labelClassName, ..._labelProps } = labelProps ?? {};
	return (
		<label htmlFor={htmlFor} {..._labelProps} className={clsx('my-form-label', labelClassName)}>
			{children}

			{required ? (
				<span className="required-label" title="Required" aria-description="Required">
					*
				</span>
			) : null}
		</label>
	);
}
