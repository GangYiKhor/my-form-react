import { createContext, useContext } from 'react';

export const SubForm = createContext<string | undefined>(undefined);

export function useSubForm() {
	return useContext(SubForm);
}
