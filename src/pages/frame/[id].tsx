import React, { useState, useEffect, useRef } from "react";
import type { NextPage, GetServerSideProps } from 'next';
import { useRouter } from 'next/router';
import Styled from 'styled-components';
import { istatic } from "services";
import { splitData } from "utils";
import cache from "memory-cache";
import Head from 'next/head';
import {
  SearchBar,
  Suggestions,
  Grid,
  GridFrame,
  FrameView,
  Footer
} from "components";


const ViewPort = Styled.section`
  display: flex;
  flex-direction: column;
  align-items: center;
`

// const FrameView = Styled.img`
//   min-height: 25vh;
//   max-height: 60vh;
// `

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
  padding: 30px 9% 0 9%;
  background-color: #000;
`

const LabelWrapper = Styled.section`
  display: flex;
  align-items: center;
  margin: 10px 0;
`

const Label = Styled.h2`
  color: #fff;
  margin: 0 15px;
`

const Ship = Styled.button`
  border: none;
  border-radius: 12px;
  font-size: 1em;
  margin: 0 5px;
  padding: 5px 10px;
  cursor: pointer;
`

const LoadNewZone = Styled.section`
  width: 40px;
  height: 40px;
  background-color: red;
`


const Frame: NextPage = ({ pagContent }) => {
  console.log({pagContent});
  const [relatedFrames, setRelatedFrames] = useState(pagContent.relatedFrames.result);
  const [bookmark, setBookmark] = useState(pagContent.relatedFrames.bookmark);
  const ref = useRef<HTMLDivElement | null>(null);
  const router = useRouter();


  const load_more_images = async(id:string) => {
    istatic.getRelatedImage(id, bookmark).then(r => {
      const splitedData = splitData(r.data.result);
      setRelatedFrames(currentFrames => {
        return currentFrames.map((col, idx) => {
          return [...col, ...splitedData[idx]];
        });
      });
      setBookmark(r.data.bookmark);
    });
  };

  useEffect(() => {
    const node = ref?.current // DOM Ref
    if (!node) return
    const intersectionObserver = new IntersectionObserver(entries => {
      if (entries.some(entry => entry.isIntersecting)) {
        load_more_images(pagContent.id);
      }
    })
    intersectionObserver.observe(node);
    return () => intersectionObserver.disconnect();
  }, [bookmark]);

  useEffect(() => {
    setRelatedFrames(pagContent.relatedFrames.result);
    setBookmark(pagContent.relatedFrames.bookmark);
  }, [pagContent]);


  if (!pagContent) {
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
        <title>Frame | {pagContent.title || pagContent.seo_title}</title>
      </Head>

      <FrameView frame={pagContent}/>
      <Related>
        <LabelWrapper>
          <Label>Related:</Label>
          {pagContent.pin_join.visual_annotation.map((rel, i) => {
            if (i >= 5) return false;
            return (
              <Ship
                onClick={() => {
                  router.push(`/?q=${rel.replace(/\s/gi, "::")}`);
                }}
              >
                { rel }
              </Ship>
            );
          })}
        </LabelWrapper>
        <Grid
          source={relatedFrames}
          FrameType={GridFrame}
          onSelect={src => router.push(`/frame/${src.id}`)}
        />
        <LoadNewZone ref={ref}/>
      </Related>
      <Footer/>
    </ViewPort>
  )
}

export default Frame;


export const getServerSideProps: GetServerSideProps = async(context) => {
  let id = String(context?.params?.id || '');
  let pagContent: any | null = null;

  if (!id) return { props: { pagContent } };

  const KEY = `image::${id}`;
  const cachedResponse = cache.get(KEY);

  if (cachedResponse) {
    pagContent = cachedResponse;
  } else {
    pagContent = await istatic.getImage(id).then(r => r.data).catch(err => null);
    if (pagContent) {
      pagContent.relatedFrames = await istatic.getRelatedImage(pagContent.id)
        .then(r => ({
          result: splitData(r.data.result),
          bookmark: r.data.bookmark
        }));
      cache.put(KEY, pagContent, 60 * 60000); // one hour total
    }
  }

  return {
    props: { pagContent }, // will be passed to the page component as props
  }
}
