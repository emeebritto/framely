import { Swiper, SwiperSlide } from 'swiper/react';
import { VideoPlayer } from "components";
import Styled from "styled-components";
import { Virtual } from "swiper";
import 'swiper/css/virtual';
import React from "react";
import 'swiper/css';


const ViewPort = Styled.section`
  width: 100%;
  min-height: 25vh;

  .swiper {
    width: 100%;
    height: 100%;
  }
`

const ViewWrapper = Styled.section`
	display: flex;
	justify-content: center;
	width: 100%;
	min-height: 25vh;
`

const Img = Styled.img`
  min-height: 25vh;
  max-height: 60vh;
`

const FrameStory:React.FC = ({ frame }) => {
	const pages = frame.story_pin_data.pages;
	return (
		<ViewPort>
		  <Swiper
	      slidesPerView={1}
	      direction={"horizontal"}
	      modules={[Virtual]}
	      virtual
	    >
	      {pages.map((page, i) => {
	      	const block = page.blocks[0];
	      	const vid = block?.video?.video_list?.V_EXP3;
	        return (
	          <SwiperSlide
	            key={i}
	            virtualIndex={i}
	          >
	          	<ViewWrapper>
		            {!vid && <Img src={block.image.images.originals.url} alt="thumbnail"/>}
		            {vid && <VideoPlayer url={vid.url}/>}
	          	</ViewWrapper>
	          </SwiperSlide>
	        );
	      })}
	    </Swiper>
    </ViewPort>
	);
};

const FrameVid:React.FC = ({ frame }) => {
	return (<></>);
};

const FrameView:React.FC = ({ frame }) => {
	if (frame.story_pin_data_id) return <FrameStory frame={frame}/>;
	if (frame.videos) return <FrameVid frame={frame}/>;
	return (
		<Img
			src={frame.images.orig.url}
    	alt={frame.grid_title}
    />
  );
};

export default FrameView;
