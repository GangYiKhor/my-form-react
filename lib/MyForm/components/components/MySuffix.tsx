type PropType = {
	id: string;
	suffix: string | React.ReactNode;
};

export default function MyPrefix({ id, suffix }: PropType) {
	return suffix ? (
		<label htmlFor={id} className="suffix">
			{suffix}
		</label>
	) : null;
}
