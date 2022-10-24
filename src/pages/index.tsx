import React, { useState, useEffect, useRef } from "react";
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
  padding: 30px 9% 0 9%;
  background-color: #000;
`

const LoadNewZone = Styled.section`
  width: 40px;
  height: 40px;
  background-color: red;
`


const Home: NextPage = () => {
  const [frames, setFrames] = useState([[], []]);
  const [label, setLabel] = useState('');
  const [bookmark, setBookmark] = useState('');
  const ref = useRef<HTMLDivElement | null>(null);
  const router = useRouter();

  const splitData = (data:any[]):any[] => {
    const medium = Math.floor(data.length / 2);
    const first_column = [...data].splice(0, medium);
    const second_column = [...data].splice(medium, medium * 2);
    return [first_column, second_column];
  };

  const load_images = async() => {
    istatic.listRandomImage({ per_page: 8 }).then(r => {
      const splitedData = splitData(r.data);
      setFrames(splitedData);
      setLabel("Quick Picks");
    });
  };

  const search_images = async(query:string) => {
    istatic.searchImage(query, { per_page: 23 }).then(r => {
      const splitedData = splitData(r.data.results);
      setFrames(splitedData);
      setBookmark(r.data.bookmark);
      setLabel(r.data.query);
    });
  };

  const load_more_images = (query:string) => {
    istatic.searchImage(query, { per_page: 23, bookmark }).then(r => {
      const splitedData = splitData(r.data.results);
      setFrames(currentFrames => {
        return [
          [...currentFrames[0], ...splitedData[0]],
          [...currentFrames[1], ...splitedData[1]]
        ]
      });
      setBookmark(r.data.bookmark);
    });
  };

  useEffect(() => {
    const node = ref?.current // DOM Ref
    if (!node) return
    const intersectionObserver = new IntersectionObserver(entries => {
      if (entries.some(entry => entry.isIntersecting)) {
        let { q } = router.query;
        if (q) load_more_images(q);
      }
    })
    intersectionObserver.observe(node);
    return () => intersectionObserver.disconnect();
  }, [router.query.q, bookmark]);

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
        <LoadNewZone ref={ref}/>
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
