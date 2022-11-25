import { Frame, RelatedFrames, BoardDataResult, BoardMetaData } from "types/services";
import type { NextApiRequest, NextApiResponse } from "next";
import { onlyValues, arrangeFrameVideo } from "utils";
import { twoHour } from "consts";
import cache from "memory-cache";
import axios from "axios";

interface Exception {
  msg:string;
}


const load_more_frames = async(
  boardMetaData:BoardMetaData,
  bookmark:string,
  BOOKMARK_KEY:string,
  page_size:number|string|null = null,
):Promise<BoardDataResult> => {
  const url = `${process.env.BASE_URL_BOARD_MORE_IMG}?source_url=${boardMetaData.url}&data={"options":{"add_vase":true,"board_id":"${boardMetaData.id}","field_set_key":"react_grid_pin","filter_section_pins":false,"is_react":true,"prepend":false,"page_size":${page_size},"bookmarks":["${bookmark}"]},"context":{}}&_=1669353221780`;
  const data = await axios({
    url: url,
    method: "GET",
    headers: {
      "Host": process.env.BASE_URL_PRESOURCE_TARGET,
      "User-Agent": process.env.USER_AGENT,
      "Accept": "application/json, text/javascript, */*, q=0.01",
      "Accept-Language": "en-US,en;q=0.5",
      "Accept-Encoding": "gzip, deflate, br",
      "Referer": `https://${process.env.BASE_URL_PRESOURCE_TARGET}`,
      "X-Requested-With": "XMLHttpRequest",
      "X-APP-VERSION": "a198310",
      "X-Pinterest-AppState": "active",
      "X-Pinterest-ExperimentHash": process.env.BASE_URL_BOARD_MORE_IMG_EXHASH,
      "X-Pinterest-Source-Url": boardMetaData.url,
      "X-Pinterest-PWS-Handler": "www/[username]/[slug].js",
      "DNT": "1",
      "Connection": "keep-alive",
      "Cookie": process.env.BASE_URL_PSEARCH_COOKIE,
      "Sec-Fetch-Dest": "empty",
      "Sec-Fetch-Mode": "cors",
      "Sec-Fetch-Site": "same-origin",
      "Sec-GPC": "1",
      "Pragma": "no-cache",
      "Cache-Control": "no-cache",
      "TE": "trailers"
    }
  }).then(r => r.data).catch(e => console.log(e));

  if (!data) throw new Error("data request failed!");
  let frames:Frame[] = data.resource_response.data;

  const boardFrames:BoardDataResult = {
    frames: arrangeFrameVideo(frames),
    bookmark: data.resource_response.bookmark
  };

  cache.put(BOOKMARK_KEY, boardFrames, twoHour);
  return boardFrames
};


const load_board = async(
  userName:string,
  boardName:string,
  BOARD_KEY:string
):Promise<BoardDataResult> => {
  const jsonDataPattern = /<script id=\"__PWS_DATA__\" type=\"application\/json\">(.+)<\/script><link data-chunk="DesktopUnauthPageWrapper"/g;
  const data = await axios({
    url: `https://${process.env.BASE_URL_PRESOURCE_TARGET}/${userName}/${boardName}/`,
    method: "GET"
  }).then(r => r.data).catch(e => console.log(e));

  if (!data) throw new Error("data request failed!");

  const matches = String(data).matchAll(jsonDataPattern);
  const match = matches.next();
  const dataObject = JSON.parse(match.value[1]);
  const boardData:BoardDataResult = {
    metadata: onlyValues(dataObject.props.initialReduxState.boards)[0],
    frames: arrangeFrameVideo(onlyValues(dataObject.props.initialReduxState.pins)),
    bookmark: onlyValues(dataObject.props.initialReduxState.resources.BoardFeedResource)[0]["nextBookmark"]
  };
  cache.put(BOARD_KEY, boardData, twoHour);
  return boardData;
};


export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<BoardDataResult|Exception>
) {
  const userName:string = String(req.query?.userName || "");
  const boardName:string = String(req.query?.boardName || "");
  const bookmark:string = String(req.query?.bookmark || "");

  const BOARD_KEY = `board::${userName}::${boardName}`;
  const BOOKMARK_KEY = `board::${userName}::${boardName}::${bookmark}`;

  const cachedBoard = cache.get(BOARD_KEY);
  const cachedBoardFrames = cache.get(BOOKMARK_KEY);

  try {
    const boardData:BoardDataResult = cachedBoard || await load_board(userName, boardName, BOARD_KEY);
    if (bookmark && boardData.metadata) {
      const boardFrames:BoardDataResult = cachedBoardFrames || await load_more_frames(boardData.metadata, bookmark, BOOKMARK_KEY);
      return res.json(boardFrames);
    }
    res.json(boardData);
  } catch(err) {
    console.log(err);
    res.status(501).json({ msg: "something is wrong (internal error)" });
  }
}
