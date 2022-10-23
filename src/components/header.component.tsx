import React from 'react';
import Link from 'next/link';
import Styled from 'styled-components';


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
  margin-left: 3em;
  cursor: pointer;
`

const BrandingName = Styled.h4`
  font-weight: bold;
  font-size: 1.5em;
`



const Header: React.FC = () => {
	return (
    <ViewPort>
      <Link href="/">
        <Branding>
          <BrandingName>Framely</BrandingName>
        </Branding>
      </Link>
    </ViewPort>
	)
}

export default Header;
