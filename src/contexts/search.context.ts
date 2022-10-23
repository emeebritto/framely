import { useContext, useEffect } from 'react';
import { SearchContext } from './providers';
import { useRouter } from 'next/router';
import { istatic } from "services";


export function useSearchContext(){
	const {
		inputData,
		inputDebounce,
		setInputData,
		isTyping,
		setIsTyping,
		typeAhead,
		setTypeAhead
	} = useContext(SearchContext);


// =============================================================

	const router = useRouter();

  const selectTypeAhead = (option: string): void => {
    setInputData(option);
    setIsTyping(false);
    setTypeAhead([]);
  }

  const filterSearch = async (value: string): Promise<void> => {
    if (value.length > 0 && isTyping) {
      setTypeAhead(await istatic.advancedtypeAhead(value).then(r => r.data));
    } else if (!value.length) {
    	router.push('/');
    } else {
      setTypeAhead([]);
    }
  }

  useEffect(() => {
    filterSearch(inputDebounce);
  }, [inputDebounce])


	return {
		inputData,
		setInputData,
		isTyping,
		setIsTyping,
		typeAhead,
		setTypeAhead,
		selectTypeAhead,
		filterSearch
	}
}
