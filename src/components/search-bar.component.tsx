import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Styled from 'styled-components';
import { useSearchContext } from "contexts";
import { OptionsTypeAhead } from "components";
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
  background-color: rgba(0, 0, 0, 40%);
  padding: 0px 11px 0px 11px;
  outline: none;
  color: white;
  border: none;
  width: 87%;
  height: 100%;
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
  height: 100%;
  cursor: pointer;
  border-radius: 0px 6px 0px 0px;
  border: 2px solid #fff;
  transition: 500ms;

  :hover {
    background-color: #fff;
  }

  :hover img {
    filter: invert(100%);
  }
`

const Image = Styled.img`
`


const SearchBar:React.FC = () => {
  const {
    inputData,
    setInputData,
    setIsTyping,
    typeAhead,
    setTypeAhead,
    selectTypeAhead
  } = useSearchContext();
  const router = useRouter();


	return (
    <ViewPort>
      <SearchInput 
	      type="text"
	      name="seach" 
	      value={inputData}
	      onInput={e => {
          let target = e.target as HTMLInputElement;
          setIsTyping(true);
          setInputData(target.value);
        }}
        onBlur={e => {
          setTimeout(() => {
            setIsTyping(false);
            setTypeAhead([]);
          }, 200);
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
        <Image src="/icons/search_white_24dp.svg" alt="search icon"/>
      </BtnSearch>
      <OptionsTypeAhead
        show={!!typeAhead.length}
        resource={typeAhead} 
        onSelect={selectTypeAhead}
      />
    </ViewPort>
	);
}

export default SearchBar;
