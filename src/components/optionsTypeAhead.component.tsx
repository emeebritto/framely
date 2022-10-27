import React from 'react';
import { useRouter } from 'next/router';
import { AppProps } from 'next/app';
import Link from 'next/link';
import Styled from 'styled-components';


const ViewPort = Styled.section`
	position: absolute;
	display: ${(props: {show?:boolean}) => (
		props?.show ? "" : "none"
	)};
	z-index: 100;
	color: #fff;
	overflow: hidden;
	background-color: #000005;
	border: 1px solid #191D1F;
	border-radius: 10px;
	box-shadow: 1px 1px 30px black;
	top: 50px;
	width: 485px;
	height: auto;

  @media(max-width: 1000px) {
    width: 100%;
  }
`
const Option = Styled.a`
  display: inline-block;
  text-decoration: none;
  color: #fff;
	width: 98%;
	cursor: pointer;
	padding: 4px 10px 4px 10px;
	font-family: 'Gill Sans', 'Gill Sans MT', Calibri, 'Trebuchet MS', sans-serif;
	overflow: hidden;
	white-space: nowrap;
  text-overflow: ellipsis;

	:hover {
		background-color: #0D0A0A;
	}
`

interface OptionsTypeAheadProps {
	show?:boolean;
	resource:Array<string>;
	onSelect:(s: string) => void;
}

const OptionsTypeAhead: React.FC<OptionsTypeAheadProps> = ({
	show=true,
	resource,
	onSelect
}) => {

  const router = useRouter();
  const src = [...resource].splice(0, 8);

	return(
		<ViewPort show={show}>
			{src.map((option, index) => {
				return(
					<Link href={`${router.route}?q=${option.query.replace(/\s/gi, '::')}`}>
						<Option onClick={(e) => {
							e.stopPropagation();
							onSelect(option.query);
						}}>
							{option.query}
						</Option>
					</Link>
				)
			})}
		</ViewPort>
	)
}

export default OptionsTypeAhead;
