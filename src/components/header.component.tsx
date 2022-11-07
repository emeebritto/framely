import Styled from 'styled-components';
import { istatic } from "services";
import Link from 'next/link';
import React from 'react';


const ViewPort = Styled.header`
  display: flex;
  position: fixed;
  z-index: 3;
  top: 0;
  left: 0;
  justify-content: space-between;
  align-items: center;
  width: 100vw;
  height: 70px;
`

const Branding = Styled.span`
  display: flex;
  justify-content: center;
  align-items: center;
  overflow: hidden;
  margin-left: 3em;
  cursor: pointer;
`

const BrandingImg = Styled.img`
  height: 90px;
`



const Header:React.FC = () => {
	return (
    <ViewPort>
      <Link href="/">
        <Branding>
          <BrandingImg
            src={istatic.imgUrl({ path: "branding/Framely.png" })}
            alt="Framely Branding"
          />
        </Branding>
      </Link>
    </ViewPort>
	)
}

export default Header;
