import React, { useState } from "react";
import { useRouter } from 'next/router';
import { useSearchContext } from "contexts";
import Styled from "styled-components";



const ViewPort = Styled.section`
	display: flex;
	flex-wrap: wrap;
	justify-content: space-around;
	width: 50%;
	z-index: 2;
`

const Suggestion = Styled.p`
  color: #fff;
  padding: 3px 10px;
  margin: 2px 0;
  background-color: #1E1E1E;
  border-radius: 13px;
  font-size: 1.1em;
  font-family: 'Gill Sans', 'Gill Sans MT', Calibri, 'Trebuchet MS', sans-serif;
  cursor: pointer;
  transition: 400ms;

  :hover {
    background-color: #111111;
  }
`


const Suggestions = () => {
	const { setInputData, queriesSuggestions } = useSearchContext();
	const router = useRouter();

	return (
		<ViewPort>
			{queriesSuggestions.map((option, i) => {
				return (
					<Suggestion
						onClick={e => {
							setInputData(option);
			        router.push(
			          `${router.route}/?q=${option.replace(/\s/gi, "::")}`,
			          undefined,
			          { shallow: true }
			        )
						}}
						key={i}
					>
						{option}
					</Suggestion>
				)
			})}
		</ViewPort>
	);
}

export default Suggestions;
