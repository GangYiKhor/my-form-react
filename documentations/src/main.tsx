import React, { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { HashRouter, Route, Routes } from 'react-router';
import MyFormProvider from '../../lib/MyForm/MyFormProvider.tsx';
import './index.scss';
import BaseLayout from './layouts/BaseLayout.tsx';
import { routes as _routes } from './route.ts';

function loopRoutes(routes: typeof _routes, level: number = 0) {
	const navItems: { path: string; element: React.ReactNode }[] = [];
	for (const route of routes) {
		if (route.path && route.element) navItems.push({ path: route.path, element: <route.element /> });
		if (route.pages) navItems.push(...loopRoutes(route.pages, level + 1));
	}
	return navItems;
}

const NAV_ITEMS = loopRoutes(_routes, 0);

const root = createRoot(document.getElementById('root')!);
root.render(
	<StrictMode>
		<MyFormProvider darkMode="class">
			<HashRouter>
				<BaseLayout>
					<Routes>
						{NAV_ITEMS.map(({ path, element }) => (
							<Route path={path} element={element} />
						))}
					</Routes>
				</BaseLayout>
			</HashRouter>
		</MyFormProvider>
	</StrictMode>
);
