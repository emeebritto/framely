import type { NextPage } from 'next';
import Head from 'next/head';
import Styled from 'styled-components';
import styles from '../styles/Home.module.css';
import { istatic } from "services";
import { SearchBar, Suggestions } from "components";


const ViewPort = Styled.div`
  padding: 0 0 0 0;
  min-height: 100vh;
`

const Slogan = Styled.h1`
  font-size: 2em;
  z-index: 3;
  margin-bottom: 50px;
`

const Queries = Styled.main`
  position: relative;
  padding: 0 0;
  height: 60vh;
  display: flex;
  background: url(${istatic.randomImage({
    width: 1600,
    height: 700
  })}) center no-repeat;
  box-shadow: inset 0 0 50px #000;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`


const FadeOut = Styled.div`
  position: absolute;
  background-color: #000;
  opacity: 60%;
  z-index: 0;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
`


const Home: NextPage = () => {
  return (
    <ViewPort>
      <Head>
        <title>Framely</title>
        <meta name="description" content="Each frame, one History"/>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Queries>
        <FadeOut/>
        <Slogan>Each Frame, One History</Slogan>
        <SearchBar/>
        <Suggestions/>
      </Queries>
    </ViewPort>
  )
}

export default Home;
