import { Link, useLocation } from 'react-router';
import { routes as _routes } from '../route';

type BasicRouteType = {
	title: string;
	path?: string;
	pages: any;
};

function loopRoutes(routes: BasicRouteType[], level: number = 0) {
	const navItems: { title: string; path?: string; level: number; hasChildren: boolean }[] = [];
	for (const route of routes) {
		const page = { title: route.title, path: route.path, level, hasChildren: !!route.pages };
		navItems.push(page);
		if (route.pages) navItems.push(...loopRoutes(route.pages, level + 1));
	}
	return navItems;
}

const NAV_ITEMS = loopRoutes(_routes as BasicRouteType[], 0);

export default function Navbar() {
	const curPath = useLocation();
	return (
		<nav className="scrollbar">
			{NAV_ITEMS.map(({ title, path, level }) => {
				const style = { paddingLeft: 12 * (level + 1) };
				if (curPath.pathname === path) {
					return (
						<div key={title} className="nav-item cur-path">
							<Link to={path} style={style}>
								{title}
							</Link>
						</div>
					);
				} else if (path) {
					return (
						<div key={title} className="nav-item">
							<Link to={path} style={style}>
								{title}
							</Link>
						</div>
					);
				} else {
					return (
						<div key={title} style={style} className="nav-item">
							{title}
						</div>
					);
				}
			})}
		</nav>
	);
}
