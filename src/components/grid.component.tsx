import React from "react";
import Styled from "styled-components";
import { GridFrame } from "components";


const ViewPort = Styled.section`
	display: flex;
	justify-content: center;
	flex-wrap: wrap;
	width: 100%;
`

const Columm = Styled.div`
	display: flex;
	flex-direction: column;
	margin: ${(props:{margin?:string}) => (props.margin)};
	width: 48%;
`


const Grid = ({ source, FrameType, onSelect }) => {
	// // 2 % 3 == 0

	return (
		<ViewPort>
			{source.map((col_src, idx) => {
				return (
						<Columm margin="25px 6px" key={`col-${idx}`}>
							{col_src.map((frame, i) => {
								return (
									<GridFrame
										onSelect={onSelect}
										type={frame.frameType}
										src={frame}
										key={i}
									/>
								);
							})}
						</Columm>
					);
			})}
		</ViewPort>
	);
}

export default Grid;
