import React from "react";
import Styled from "styled-components";
import { istatic } from "services";


const ViewPort = Styled.section`
	display: flex;
	justify-content: center;
	align-items: center;
	position: fixed;
	z-index: 100;
	top: 0;
	left: 0;
	width: 100vw;
	height: 100vh;
	background-color: rgba(0, 0, 0, 90%);
`

const ImageWrapper = Styled.section`
	img {
		max-width: 80vw;
		max-height: 100vh;
		background-color: red;
	}
`

const CloseBtn = Styled.button`
	position: absolute;
	top: 4%;
	right: 4%;
	width: 40px;
	height: 40px;
	border: none;
	background: url(${istatic.iconUrl({ name: "close" })}) center/110% no-repeat;
	background-color: transparent;
	cursor: pointer;
`


interface FullViewProp {
	src?:any | null;
	onRequestClose?:((s?:any) => any);
}

const FullView: React.FC = ({ src, onRequestClose=(()=> ({}))}) => {

	return (
		<>
		{!!src &&
			<ViewPort onClick={onRequestClose}>
				<CloseBtn/>
				<ImageWrapper onClick={e => e.stopPropagation()}>
					<img src={src.images.orig.url} alt={src.grid_title}/>
				</ImageWrapper>
			</ViewPort>
		}
		</>
	);
}

export default FullView;
