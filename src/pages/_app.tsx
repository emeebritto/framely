import "../styles/globals.css";
import type { AppProps } from "next/app";
import { SearchProvider } from "contexts/providers";
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
        <SearchProvider>
          <Component {...pageProps} />
        </SearchProvider>
    </ViewPort>
  )
}

export default MyApp
