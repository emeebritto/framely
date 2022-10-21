import "../styles/globals.css";
import type { AppProps } from "next/app";
import Styled from 'styled-components';
import { Header } from "components";


const ViewPort = Styled.div`
  position: relative;
  padding: 0 0;
`


function MyApp({ Component, pageProps }: AppProps) {
  return (
    <ViewPort>
      <Header/>
      <Component {...pageProps} />
    </ViewPort>
  )
}

export default MyApp
