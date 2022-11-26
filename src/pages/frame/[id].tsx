import React, { useState, useEffect, useRef } from "react";
import type { NextPage, GetServerSideProps } from 'next';
import { FramePageProps } from "types/pages";
import { useRouter } from 'next/router';
import Styled from 'styled-components';
import { Frameslist, Frame as FrameType } from "types/services";
import { framelyApi } from "services";
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


const Frame:NextPage<FramePageProps> = ({ pagContent }) => {
  const [relatedFrames, setRelatedFrames] = useState<Frameslist[]|[]>([]);
  const [bookmark, setBookmark] = useState<string>("");
  const ref = useRef<HTMLDivElement|null>(null);
  const router = useRouter();

  const load_more_images = async(id:string):Promise<void> => {
    framelyApi.getRelatedImage(id, bookmark).then(r => {
      const splitedData = splitData(r.data.result);
      setRelatedFrames((currentFrames:Frameslist[]):Frameslist[] => {
        return currentFrames.map((col:FrameType[], idx:number):FrameType[] => {
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
    if (!pagContent?.relatedFrames) return;
    setRelatedFrames(pagContent.relatedFrames.result);
    setBookmark(pagContent.relatedFrames.bookmark);
  }, [pagContent]);


  return (
    <ViewPort>
      <Head>
        <title>Frame | {pagContent.title || pagContent.seo_title}</title>
      </Head>

      <FrameView frame={pagContent}/>
      <Related>
        <LabelWrapper>
          <Label>Related:</Label>
          {pagContent.pin_join?.visual_annotation.map((rel:string, i:number) => {
            if (i >= 5) return false;
            return (
              <Ship
                key={i}
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
  let pagContent:FrameType|null = null;

  if (!id) return { notFound:true };

  const KEY = `page::frame::${id}`;
  const cachedResponse:FrameType|null = cache.get(KEY) || null;

  if (cachedResponse) {
    pagContent = cachedResponse;
  } else {
    pagContent = await framelyApi.getImage(id).then(r => r.data).catch(err => null);
    if (pagContent) {
      pagContent.relatedFrames = await framelyApi.getRelatedImage(pagContent.id)
        .then(r => ({
          result: splitData(r.data.result),
          bookmark: r.data.bookmark
        }));
      cache.put(KEY, pagContent, 60 * 60000); // one hour total
    }
  }

  if(!pagContent) return { notFound:true };

  return {
    props: { pagContent }, // will be passed to the page component as props
  }
}
