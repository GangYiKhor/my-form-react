import { useState } from 'react';
import Header from '../components/Header';
import Navbar from '../components/Navbar';

export default function BaseLayout({ children }: { children: React.ReactNode }) {
	const [darkMode, setDarkMode] = useState(true);

	return (
		<div className={'app ' + (darkMode ? 'dark' : 'light')}>
			<header>
				<Header darkMode={darkMode} setDarkMode={setDarkMode} />
			</header>
			<div className="body">
				<Navbar />
				<main>{children}</main>
			</div>
		</div>
	);
}
