import React, { useState, useEffect } from "react";
import styles from '../styles/Home.module.css';
import { useRouter } from 'next/router';
import Styled from 'styled-components';
import type { NextPage } from 'next';
import { istatic } from "services";
import Head from 'next/head';
import {
  SearchBar,
  Suggestions,
  Grid,
  GridFrame,
  Footer
} from "components";


const ViewPort = Styled.div`
  padding: 0 0 0 0;
  perspective: 1px;
  height: 100vh;
  transform-style: preserve-3d;
  overflow-y: scroll;
  overflow-x: hidden;
`

const Slogan = Styled.h1`
  font-size: 2em;
  z-index: 3;
  margin-bottom: 50px;
`

const Queries = Styled.main`
  position: relative;
  transform-style: inherit;
  box-sizing: border-box;
  padding: 0 0;
  height: 700px;
  display: flex;
  box-shadow: inset 0 0 50px #000;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  ::before {
    content: "";
    position: absolute;
    top: -785px;
    left: 0;
    right: 0;
    bottom: 0;
    display: block;
    background: url(${istatic.randomImage({
      width: 1600,
      height: 700
    })}) center no-repeat;
    transform-origin: center center 0;
    transform: translateZ(-1px) scale(2);
    z-index: -1;
    height: 700px;
    transition: 400ms;
  }

  @media(max-height: 1600px) {
    ::before {
      top: -310px;
    }
  }

  @media(max-height: 1300px) {
    ::before {
      top: -210px;
    }
  }

  @media(max-height: 1100px) {
    ::before {
      top: -110px;
    }
  }
`

const FadeOut = Styled.div`
  position: absolute;
  background-color: #000;
  opacity: 70%;
  z-index: 0;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
`

const Label = Styled.h2`
  color: #fff;
`

const Content = Styled.section`
  z-index: 2;
  position: absolute;
  top: 700px;
  line-height: 22px;
  padding: 30px 10% 0 10%;
  background-color: #000;
`


const Home: NextPage = () => {
  const [frames, setFrames] = useState([]);
  const [label, setLabel] = useState('');
  const [bookmark, setBookmark] = useState('');
  const router = useRouter();

  const load_images = async() => {
    istatic.listRandomImage({ per_page: 8 }).then(r => {
      setFrames(r.data);
      setLabel("Quick Picks");
    });
  };

  const search_images = async(query:string) => {
    istatic.searchImage(query, { per_page: 24 }).then(r => {
      setFrames(r.data.results);
      setBookmark(r.data.bookmark);
      setLabel(r.data.query);
    });
  };

  useEffect(() => {
  // The q changed!
  let { q } = router.query;
  if (q) { search_images(q); }
  else { load_images(); }
  }, [router.query.q])

  // useEffect(() => {
  //   load_images()
  // },[]);

  return (
    <ViewPort>
      <Head>
        <title>Framely</title>
        <meta name="description" content="Each frame, one History"/>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Content>
        <Label>{ label }</Label>
        <Grid source={frames} FrameType={GridFrame}/>
        <Footer/>
      </Content>


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
