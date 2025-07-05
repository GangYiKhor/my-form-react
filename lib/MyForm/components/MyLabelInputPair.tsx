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
	margin?: string | number;
	children: ReactNode;
};

type HtmlProps = {
	containerProps?: React.HTMLAttributes<HTMLDivElement>;
};

/**
 * A simple wrapper div for Label-Input pair with predefined stylings
 */
export default function MylabelInputPair({
	arrangement = 'vertical',
	outerBorder = false,
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
