import { SearchProvider } from "contexts/providers";
import type { AppProps } from "next/app";
import Styled from 'styled-components';
import { Header } from "components";
import "../styles/globals.css";
import Head from 'next/head';


const ViewPort = Styled.div`
  position: relative;
  padding: 0 0;
`


function MyApp({ Component, pageProps }: AppProps) {
  return (
    <ViewPort>
      <Head>
        <title>Framely</title>
        <meta name="description" content="Each frame, one History"/>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Header/>
        <SearchProvider>
          <Component {...pageProps} />
        </SearchProvider>
    </ViewPort>
  )
}

export default MyApp
