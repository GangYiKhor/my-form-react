import { clsx } from '../../utils';

type PropType = {
	showOptions: boolean;
	optionsRef: React.RefObject<HTMLDivElement | null>;
	optionRows: number;
	OPTION_HEIGHT: number;
	optionWidth?: number | string;
	optionContainerProps?: Omit<React.HTMLAttributes<HTMLDivElement>, 'ref'>;
	noWrapRow?: boolean;
	children: React.ReactNode;
};

export default function MyComboBoxOptionsContainer({
	showOptions,
	optionsRef,
	optionRows,
	OPTION_HEIGHT,
	optionWidth,
	optionContainerProps: _optionContainerProps,
	noWrapRow,
	children,
}: PropType) {
	const { className: optionContainerClassName, ...optionContainerProps } = _optionContainerProps ?? {};
	return showOptions ? (
		<div
			{...optionContainerProps}
			ref={optionsRef}
			className={clsx('combobox-options small-scrollbar', noWrapRow && 'nowrap', optionContainerClassName)}
			style={{
				maxHeight: OPTION_HEIGHT * Math.max(optionRows, 1),
				minWidth: optionWidth,
				width: optionWidth,
				maxWidth: optionWidth,
			}}
		>
			{children}
		</div>
	) : null;
}
