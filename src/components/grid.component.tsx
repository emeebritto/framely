import React from "react";
import Styled from "styled-components";
import { GridFrame } from "components";
import { GridProps } from  "types/components";


const ViewPort = Styled.section`
	display: flex;
	justify-content: center;
	flex-wrap: wrap;
	width: 100%;
`

const Columm = Styled.div`
	display: flex;
	flex-direction: column;
	${(props:{margin?:string, numCol?:number}) => (`
		margin: ${props.margin};
		width: ${(100 / (props.numCol || 2)) - 2}%;
	`)}
`


const Grid:React.FC<GridProps> = ({ source, onSelect }) => {
	// // 2 % 3 == 0

	return (
		<ViewPort>
			{source.map((col_src, idx) => {
				return (
						<Columm numCol={source.length} margin="25px 6px" key={`col-${idx}`}>
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
