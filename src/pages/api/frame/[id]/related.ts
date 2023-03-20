import type { NextApiRequest, NextApiResponse } from "next";
import { RelatedFrames, Frame } from "types/services";
import { restructVideo, story2Videos } from "utils";
import cache from "memory-cache";
import { twoHour } from "consts";
import axios from "axios";

interface Exception {
  msg:string;
}


const getHearderResquest = (imageId:string, bookmark:string="") => ({
  "Host": process.env.BASE_URL_PRESOURCE_TARGET,
  "User-Agent": process.env.USER_AGENT,
  "Accept": "application/json, text/javascript, */*, q=0.01",
  "Accept-Language": "en-US,en;q=0.5",
  "Accept-Encoding": "gzip, deflate, br",
  "Referer": `https://${process.env.BASE_URL_PRESOURCE_TARGET}/`,
  "X-Requested-With": "XMLHttpRequest",
  "X-APP-VERSION": "9bdae68",
  "X-Pinterest-AppState": bookmark ? "background" : "active",
  "X-Pinterest-ExperimentHash": bookmark ? process.env.BASE_URL_PREL_IMG_EXHASH_ONE : process.env.BASE_URL_PREL_IMG_EXHASH_TWO,
  "X-Pinterest-Source-Url": `/pin/${imageId}/?mt=login`,
  "X-Pinterest-PWS-Handler": "www/pin/[id].js",
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
});



export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<RelatedFrames|Exception>
) {
  const imageId = String(req.query?.id || "");
  const bookmark = String(req.query?.bookmark || "");

  const KEY = `related::${imageId}::${bookmark}`;
  if (!imageId) return res.status(404).json({ msg: "imageId is required" });

  const cachedResponse = cache.get(KEY);
  if (cachedResponse) {
    return res.status(200).json(cachedResponse);
  }

  const apiUrl = process.env.BASE_URL_PREL_IMG;
  const query = `?source_url=/pin/${imageId}/?mt=login`;
  const config = bookmark
    ? `&data={"options":{"field_set_key":"unauth_react","page_size":16,"pin":"${imageId}","prepend":false,"add_vase":true,"show_seo_canonical_pins":true,"source":"unknown","top_level_source":"unknown","top_level_source_depth":1,"bookmarks":["${bookmark}"]},"context":{}}&_=1666770896008`
    : `&data={"options":{"field_set_key":"unauth_react","page_size":16,"pin":"${imageId}","prepend":false,"add_vase":true,"show_seo_canonical_pins":true,"source":"unknown","top_level_source":"unknown","top_level_source_depth":1},"context":{}}&_=1666770789401`;

  const data = await axios({
    url: apiUrl + query + config,
    method: "GET",
    headers: getHearderResquest(imageId, bookmark)
  }).then(r => r.data).catch(e => console.log(e));


  if (!data) return res.status(404).json({ msg: "content not found (something is wrong)" });  

  const frames = data.resource_response.data.map((frame:Frame) => {
    frame.frameType = "Frame_p9";
    frame["video"] = frame?.videos ? restructVideo(frame) : story2Videos(frame)[0];
    return frame;
  }).filter((frame:Frame) => frame.type == "pin");

  const result = {
    result: frames,
    bookmark: data.resource_response.bookmark
  }

  cache.put(KEY, result, twoHour);
  res.json(result)
}
