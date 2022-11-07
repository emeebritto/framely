import React, { createContext, useState } from 'react';
import { useDebounce } from 'use-debounce';
import { SearchContextData } from "types/contexts";
import { TypeAheadList } from "types/services";

export const SearchContext = createContext<SearchContextData>({} as SearchContextData);
SearchContext.displayName = 'Search';

interface LayoutProps {
	children:React.ReactNode;
}

export const SearchProvider:React.FC<LayoutProps> = ({ children }) => {
	const [inputData, setInputData] = useState('');
	const [isTyping, setIsTyping] = useState(false);
  const [typeAhead, setTypeAhead] = useState<TypeAheadList>([]);
  const [queriesSuggestions, setQueriesSuggestions] = useState<string[]>([]);
  const [ inputDebounce ] = useDebounce(inputData, 900);

	return (
		<SearchContext.Provider value={{
			inputData,
			inputDebounce,
			setInputData,
			isTyping,
			setIsTyping,
			typeAhead,
			setTypeAhead,
			queriesSuggestions,
			setQueriesSuggestions
		}}>
			{ children }
		</SearchContext.Provider>
	)
}