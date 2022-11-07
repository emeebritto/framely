import React from 'react';
import Styled from 'styled-components';


const PlatformName = Styled.h4`
  margin-left: 0.5rem;
`

const ViewPort = Styled.footer`
  display: flex;
  flex: 1;
  padding: 0.5rem 0;
  border-top: 1px solid #262639;
  justify-content: center;
  align-items: center;

  a {
    display: flex;
    justify-content: center;
    align-items: center;
    flex-grow: 1;
  }
`


const Footer:React.FC = () => {
	return (
    <ViewPort>
      <a
        href="https://www.linkedin.com/in/emerson-britto/"
        target="_blank"
        rel="noopener noreferrer"
      >
        Powered by{' '}
        <PlatformName>emee</PlatformName>
      </a>
    </ViewPort>
	)
}

export default Footer;
