import React from "react";
import Image from "next/image";
import Styled from "styled-components";
import { istatic } from "services";
import { GridFrameProps } from "types/components";
import { Frame_p9, Frame_u8 } from "./frames";


const ViewPort = Styled.section`
	position: relative;
	width: 100%;
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
	margin: 5px 0;
`


const GridFrame:React.FC<GridFrameProps> = ({ type, src, onSelect }) => {

	if (type == "Frame_p9") return <Frame_p9 onSelect={onSelect} src={src}/>
	if (type == "Frame_u8") return <Frame_u8 onSelect={onSelect} src={src}/>

	return (<></>);
}

export default GridFrame;
