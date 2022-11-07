import React from "react";
import Image from "next/image";
import Styled from "styled-components";
import { istatic } from "services";
import { fromSecondsToTime } from "utils";
import { Frame_p9Props, FrameDurationProps } from "types/components";


const ViewPort = Styled.section`
	position: relative;
	width: 100%;
	background-color: rgba(255, 255, 255, 0.03);
	min-height: 10vh;
	border-radius: 20px;
	overflow: hidden;
`

const FadeOut = Styled.div`
  position: absolute;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  background-color: rgba(0, 0, 0, 0.0);
  z-index: 0;
  top: 5px;
  left: 0;
  width: 100%;
  height: calc(100% - 13px);
  box-shadow: inset 0 -60px 50px #000;
  cursor: pointer;
  transition: 400ms;

  :hover {
  	background-color: rgba(0, 0, 0, 0.5);
  }
`

const VideoInfor = Styled.section`
`

const Duration = Styled.p`
	display: inline-block;
	margin: 15px 10px;
	background-color: #000;
	border-radius: 14px;
	padding: 5px 10px;
`

const Profile = Styled.section`
	display: flex;
	align-items: center;
`

const ProfileImg = Styled.img`
	border-radius: 50%;
	height: 50px;
	margin: 15px 10px;
`

const Identify = Styled.section`
	display: flex;
	flex-direction: column;
	justify-content: space-around;
	height: 60%;
	margin-left: 10px;
`

const DisplayName = Styled.p`
	margin: 0;
`

const UserName = Styled.p`
	opacity: 80%;
	font-size: 0.8em;
	margin: 0;
`

const Img = Styled.img`
	width: 100%;
	margin: 5px 0;
	border-radius: 20px;
`


const Frame_p9: React.FC<Frame_p9Props> = ({ src, onSelect }) => {
	const FrameDuration: React.FC<FrameDurationProps> = ({ frame }) => {
		const video = src?.videos?.video_list?.V_EXP7;
		const stories = src?.story_pin_data?.pages;
		const first_story_video = stories ? stories[0]?.blocks[0]?.video?.video_list?.V_EXP7 : null;

		if (!video && !first_story_video) return (<></>);
		const video_duration = video?.duration || first_story_video?.duration;
		return (
			<Duration>{ fromSecondsToTime(video_duration / 1000) }</Duration>			
		);
	};

	return (
		<ViewPort onClick={e => {if (onSelect) onSelect(src)}}>
			<FadeOut>
				<VideoInfor>
					<FrameDuration frame={src}/>
				</VideoInfor>
				<Profile>
					<ProfileImg
						src={src.pinner.image_medium_url || src.pinner.image_large_url}
						alt={`${src.pinner.full_name} profile image`}
					/>
					<Identify>
						<DisplayName>{ src.pinner.full_name }</DisplayName>
						<UserName>{ src.pinner.username }</UserName>
					</Identify>
				</Profile>
			</FadeOut>
			<Img src={src.images.orig.url} alt={src.grid_title}/>
		</ViewPort>
	);
}

export default Frame_p9;
