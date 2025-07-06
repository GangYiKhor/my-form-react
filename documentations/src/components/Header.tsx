import DarkIcon from '../assets/moon.svg';
import LightIcon from '../assets/sun.svg';

type PropType = {
	darkMode: boolean;
	setDarkMode: React.Dispatch<React.SetStateAction<boolean>>;
};

export default function Header({ darkMode, setDarkMode }: PropType) {
	return (
		<div>
			<p className="title">My Form React</p>
			<button className="theme-toggler" onClick={() => setDarkMode((mode) => !mode)}>
				<img src={darkMode ? LightIcon : DarkIcon} />
			</button>
		</div>
	);
}
