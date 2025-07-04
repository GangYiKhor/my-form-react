import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import MyFormProvider from '../lib/MyForm/MyFormProvider.tsx';
import App from './App.tsx';

const root = createRoot(document.getElementById('root')!);
root.render(
	<StrictMode>
		<MyFormProvider darkMode="class">
			<App />
		</MyFormProvider>
	</StrictMode>
);
