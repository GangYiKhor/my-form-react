import { createContext, useContext } from 'react';

export const FormTheme = createContext<string>('disabled');

export function useFormTheme() {
	return useContext(FormTheme);
}
