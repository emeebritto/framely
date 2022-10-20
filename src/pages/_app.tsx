import "../styles/globals.css";
import type { AppProps } from "next/app";
import Styled from 'styled-components';
import { Header, Footer } from "components";


const ViewPort = Styled.div`
  position: relative;
  padding: 0 0;
`


function MyApp({ Component, pageProps }: AppProps) {
  return (
    <ViewPort>
      <Header/>
      <Component {...pageProps} />
      <Footer/>
    </ViewPort>
  )
}

export default MyApp
