import { useSwiperSlide, useSwiper } from 'swiper/react';
import React, { useState, useEffect } from "react";
import Styled from "styled-components";
import ReactPlayer from 'react-player';
import { SlideVideoPlayerProps } from "types/components";
import { VideoPlayer } from "components";


const PlayerWrapper = Styled.section`
  position: relative;
  border-radius: 10px;
  width: 100vw;
  min-height: 700px;
  overflow: hidden;
`
const Player = Styled(ReactPlayer)`
  position: absolute;
  top: 0;
  left: 0;
`

const SlideVideoPlayer:React.FC<SlideVideoPlayerProps> = ({ url }) => {
  const swiperSlide = useSwiperSlide();
  const [playing, setPlaying] = useState(false);
  useEffect(()=> {
    setPlaying(swiperSlide.isActive);
  },[swiperSlide.isActive]);
	return <VideoPlayer playing={playing} url={url}/>;
};

export default SlideVideoPlayer;
