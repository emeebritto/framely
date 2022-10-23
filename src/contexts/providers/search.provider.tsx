import React, { createContext, useState } from 'react';
import { useDebounce } from 'use-debounce';

export const SearchContext = createContext();
SearchContext.displayName = 'Search';

export default function SearchProvider({ children }){
	const [inputData, setInputData] = useState('');
	const [isTyping, setIsTyping] = useState(false);
  const [typeAhead, setTypeAhead] = useState([]);
  const [ inputDebounce ] = useDebounce(inputData, 900);

	return (
		<SearchContext.Provider value={{
			inputData,
			inputDebounce,
			setInputData,
			isTyping,
			setIsTyping,
			typeAhead,
			setTypeAhead
		}}>
			{ children }
		</SearchContext.Provider>
	)
}