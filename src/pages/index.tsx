import type { NextPage } from 'next';
import Head from 'next/head';
import Styled from 'styled-components';
import styles from '../styles/Home.module.css';
import { SearchBar } from "components";


const ViewPort = Styled.div`
  padding: 70px 0 0 0;
  min-height: 100vh;
`

const Slogan = Styled.h1`
  font-size: 2em;
  margin-bottom: 40px;
`

const SearchField = Styled.main`
  padding: 4rem 0;
  height: 50vh;
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`


const Home: NextPage = () => {
  return (
    <ViewPort>
      <Head>
        <title>Framely</title>
        <meta name="description" content="Each frame, one History"/>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <SearchField>
        <Slogan>Each Frame, One History</Slogan>
        <SearchBar/>
      </SearchField>
    </ViewPort>
  )
}

export default Home;
