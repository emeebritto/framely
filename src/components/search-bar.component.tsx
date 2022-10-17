import React, { useState, useEffect } from 'react';
import { useDebounce } from 'use-debounce';
import { useRouter } from 'next/router';
import Styled from 'styled-components';
import { istatic } from "services";
// import Image from 'next/image';


const ViewPort = Styled.section`
  display: flex;
  position: relative;
  align-items: center;
  width: 560px;
  height: 45px;
  margin-bottom: 40px;

  @media(max-width: 1000px) {
    width: 90%;
    margin-bottom: 25px;
  }
`

const SearchInput = Styled.input`
  background-color: transparent;
  padding: 0px 11px 0px 11px;
  outline: none;
  color: white;
  border: none;
  width: 87%;
  height: 95%;
  border-radius: 6px 0px 0px 0px;
  border-top: 2px solid #fff;
  border-left: 2px solid #fff;
  border-bottom: 2px solid #fff;
  font-size: 1.2em;
  font-family: 'Gill Sans', 'Gill Sans MT', Calibri, 'Trebuchet MS', sans-serif;

  ::-webkit-input-placeholder {
    color: #A9A9A9;
  }

  :-moz-placeholder { /* Firefox 18- */
    color: #A9A9A9;  
  }

  ::-moz-placeholder {  /* Firefox 19+ */
    color: #A9A9A9;  
  }

  :-ms-input-placeholder {  
    color: #A9A9A9;  
  }
`

const BtnSearch = Styled.button`
  background-color: transparent;
  width: 13%;
  height: 99%;
  cursor: pointer;
  border-radius: 0px 6px 0px 0px;
  border: 2px solid #fff;
  transition: 500ms;
`


const SearchBar = () => {
	const [inputData, setInputData] = useState('');
	const [ inputDebounce ] = useDebounce(inputData, 900);
  const router = useRouter();
  let { q } = router.query;

  // const filterSearch = async (value: string): Promise<void> => {
  //   if (value.length > 1) {
  //     setOptionsToComplete(await musiky.api.autoComplete({ input: value }).then(r => r.data));
  //   } else {
  //     setOptionsToComplete([]);
  //     router.push('/search');
  //   }
  // }

  useEffect(() => {
  // The q changed!
  }, [router.query.q])

  // useEffect(() => {
  //   filterSearch(inputDebounce);
  // }, [inputDebounce])

	return (
    <ViewPort>
      <SearchInput 
	      type="text" 
	      name="seach" 
	      value={inputData} 
	      onInput={e => {
          let target = e.target as HTMLInputElement;
          setInputData(target.value);
        }} 
	      placeholder="What are you looking for?"
      />
      <BtnSearch onClick={e=> {
        router.push(
          `${router.route}/?q=${inputData}`,
          undefined,
          { shallow: true }
        )
      }}>
        <img src={istatic.iconUrl({ name: "search" })} alt="search icon"/>
      </BtnSearch>
    </ViewPort>
	);
}

export default SearchBar;
