import { VideoPlayerProps } from "types/components";
import React, { useState, useEffect } from "react";
import Styled from "styled-components";
import ReactPlayer from 'react-player';


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

const VideoPlayer:React.FC<VideoPlayerProps> = ({ playing=false, url }) => {
	return (
		<PlayerWrapper>
			<Player
        playing={playing}
        url={url}
        width='100%'
        height='100%'
        config={{
          file: {
            attributes: { autoPlay: 0, controls: 1 },
          }
        }}
      />
		</PlayerWrapper>
	);
};

export default VideoPlayer;