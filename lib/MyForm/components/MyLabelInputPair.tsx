import type { ReactNode } from 'react';
import { clsx } from '../utils';

type PropType = {
	/**
	 * Default `'vertical'`
	 *
	 * If `'horizontal'` the label-input pair will be arranged in left right
	 *
	 * If `'vertical'` the label-input pair willbe arranged in top bottom
	 */
	arrangement?: 'horizontal' | 'vertical';
	outerBorder?: boolean;
	/** If `true`, fill the whole container, only affect horizontal arrangement */
	fill?: boolean;
	margin?: string | number;
	children: ReactNode;
};

type HtmlProps = {
	containerProps?: React.HTMLAttributes<HTMLDivElement>;
};

/**
 * A simple wrapper div for Label-Input pair with predefined stylings
 */
export default function MyLabelInputPair({
	arrangement = 'vertical',
	outerBorder = false,
	fill = false,
	margin,
	containerProps,
	children,
}: PropType & HtmlProps) {
	const { style, className: containerClassName, ...props } = containerProps ?? {};
	const { margin: containerMargin, ...containerStyle } = style ?? {};

	return (
		<div
			{...props}
			className={clsx(
				'my-label-input-pair',
				fill && 'fill',
				`arrange-${arrangement}`,
				outerBorder && 'outer-border',
				containerClassName
			)}
			style={{ ...containerStyle, margin: margin ?? containerMargin }}
		>
			{children}
		</div>
	);
}
