import type { NextPage, GetServerSideProps } from 'next';
import React, { useState, useEffect } from "react";
import { useRouter } from 'next/router';
import Styled from 'styled-components';
import { istatic } from "services";
import cache from "memory-cache";
import Head from 'next/head';
import {
  SearchBar,
  Suggestions,
  Grid,
  GridFrame,
  Footer
} from "components";


const ViewPort = Styled.section`
  display: flex;
  flex-direction: column;
  align-items: center;
`

const Alert = Styled.section`
  display: flex;
  justify-content: center;
  align-items: center;
  position: absolute;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-color: #020309;
  font-family: 'Gill Sans', 'Gill Sans MT', Calibri, 'Trebuchet MS', sans-serif;
  cursor: pointer;
  z-index: 97;
`

const Related = Styled.section`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px 0 0 0;
  background-color: #090E19;
`


const Frame: NextPage = ({ pageContent }) => {
  console.log({pageContent});
  const [relatedFrames, setRelatedFrames] = useState([]);
  const [bookmark, setBookmark] = useState([]);
  const router = useRouter();

  // useEffect(()=>{
  //     istatic.getRelatedImage(pageContent.id).then(r => {
  //       setRelatedFrames(r.data.results);
  //       setBookmark(r.data.bookmark);
  //     });
  // },[])

  if (!pageContent) {
    return (
      <>
      <Head>
        <title>Framely - 404</title>
      </Head>
      <Alert>
        Framely - Sorry, we don't found it (404)
      </Alert>
      </>
    )
  }

  return (
    <ViewPort>
      <Head>
        <title>Framely</title>
      </Head>

      <img src={pageContent.images.orig.url} alt={pageContent.grid_title}/>
      <Related>
        <h2>Related</h2>
        <Grid
          source={pageContent.relatedFrames.result}
          FrameType={GridFrame}
          onSelect={src => router.push(`/frame/${src.id}`)}
        />
      </Related>
      <Footer/>
    </ViewPort>
  )
}

export default Frame;


export const getServerSideProps: GetServerSideProps = async(context) => {
  let id = String(context?.params?.id || '');
  let pageContent: any | null = null;

  if (!id) return { props: { pageContent } };

  const splitData = (data:any[]):any[] => {
    const medium = Math.floor(data.length / 2);
    const first_column = [...data].splice(0, medium);
    const second_column = [...data].splice(medium, medium * 2);
    return [first_column, second_column];
  };

  const KEY = `image::${id}`;
  const cachedResponse = cache.get(KEY);

  if (cachedResponse) {
    pageContent = cachedResponse;
  } else {
    pageContent = await istatic.getImage(id).then(r => r.data).catch(err => null);
    if (pageContent) {
      pageContent.relatedFrames = await istatic.getRelatedImage(pageContent.id)
        .then(r => ({
          result: splitData(r.data.result),
          bookmark: r.data.bookmark
        }));
      cache.put(KEY, pageContent, 60 * 60000); // one hour total
    }
  }

  return {
    props: { pageContent }, // will be passed to the page component as props
  }
}
