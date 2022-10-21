import React from "react";
import Image from "next/image";
import Styled from "styled-components";
import { istatic } from "services";


const ViewPort = Styled.section`
	position: relative;
	width: 100%
`

const FadeOut = Styled.div`
  position: absolute;
  background-color: #000;
  opacity: 0;
  z-index: 0;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  cursor: pointer;
  transition: 400ms;

  :hover {
  	opacity: 50%;
  }
`

const Img = Styled.img`
	width: 100%;
	margin: 10px 0;
`


const GridFrame = ({ src }) => {

	return (
		<ViewPort>
			<FadeOut/>
			<Img src={src.url} alt="Ramdom Image"/>
		</ViewPort>
	);
}

export default GridFrame;
