import React from "react";
import Styled from "styled-components";
import { GridFrame } from "components";


const ViewPort = Styled.section`
	display: flex;
	justify-content: center;
	width: 100%;
`

const Columm = Styled.div`
	display: flex;
	flex-direction: column;
	margin: ${(props:{margin?:string}) => (props.margin)};
	max-width: 50%;
`


const Grid = ({ source, FrameType }) => {
	const medium = Math.floor(source.length / 2) + 1;
	const first_column = [...source].splice(0, medium);
	const second_column = [...source].splice(medium, medium * 2);
	// // 2 % 3 == 0


	return (
		<ViewPort>
			<Columm margin="20px 15px 25px 0">
				{first_column.map((frame, i) => {
					return (
						<GridFrame type={frame.frameType} src={frame} key={i}/>
					);
				})}
			</Columm>
			<Columm margin="20px 0 25px 0">
				{second_column.map((frame, i) => {
					return (
						<GridFrame type={frame.frameType} src={frame} key={i}/>
					);
				})}
			</Columm>
		</ViewPort>
	);
}

export default Grid;
