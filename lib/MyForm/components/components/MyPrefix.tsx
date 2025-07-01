type PropType = {
	id: string;
	prefix: string | React.ReactNode;
};

export default function MyPrefix({ id, prefix }: PropType) {
	return prefix ? (
		<label htmlFor={id} className="prefix">
			{prefix}
		</label>
	) : null;
}
