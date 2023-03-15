import type { NextApiRequest, NextApiResponse } from "next";
import { VisualSearchResult, Frame } from "types/services";
import cache from "memory-cache";
import { oneMinute } from "consts";
import axios from "axios";

interface Exception {
  msg:string;
}

interface Crop {
  x:number;
  y:number;
  w:number;
  h:number;
  tab:number;
}


const getHearderResquest = (imageId:string, crop:Crop, bookmark:string="") => ({
  "Host": process.env.BASE_URL_PRESOURCE_TARGET,
  "User-Agent": process.env.USER_AGENT_MOBILE,
  "Accept": "application/json, text/javascript, */*, q=0.01",
  "Accept-Language": "en-US,en;q=0.5",
  "Accept-Encoding": "gzip, deflate, br",
  "Referer": `https://${process.env.BASE_URL_PRESOURCE_TARGET}/`,
  "X-Requested-With": "XMLHttpRequest",
  "X-APP-VERSION": "cb9005c",
  "X-Pinterest-AppState": "active",
  "X-Pinterest-ExperimentHash": process.env.BASE_URL_PVISUAL_IMG_EXHASH_THREE,
  "X-Pinterest-Source-Url": `/pin/${imageId}/visual-search/?x=${crop.x}&y=${crop.y}&h=${crop.h}&w=${crop.w}&tab=0`,
  "X-Pinterest-PWS-Handler": "www/pin/[id]/visual-search.js",
  "DNT": "1",
  "Sec-Fetch-Dest": "empty",
  "Sec-Fetch-Mode": "cors",
  "Sec-Fetch-Site": "same-origin",
  "Sec-GPC": "1",
  "Connection": "keep-alive",
  "Cookie": process.env.BASE_URL_PVISUAL_COOKIE,
  "Pragma": "no-cache",
  "Cache-Control": "no-cache",
  "TE": "trailers"
});



export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<VisualSearchResult|Exception>
) {
  const imageId = String(req.query?.id || "");
  const x = Number(req.query?.x || -1);
  const y = Number(req.query?.y || -1);
  const w = Number(req.query?.w || -1);
  const h = Number(req.query?.h || -1);
  const tab = Number(req.query?.tab || 0);
  const bookmark = String(req.query?.bookmark || "");

  const KEY = `visual-search::${imageId}:${x}:${y}:${w}:${h}:${tab}:${bookmark}`;
  if (!imageId) return res.status(404).json({ msg: "imageId is required" });
  if (x <= -1 || y <= -1 || w <= -1 || h <= -1) return res.status(400).json({ msg: "invalid values (crop)" });

  const cachedResponse = cache.get(KEY);
  if (cachedResponse) {
    return res.status(200).json(cachedResponse);
  }

  const apiUrl = process.env.BASE_URL_PVISUAL_IMG;
  const params = new URLSearchParams();
  const source_url = `?source_url=/pin/${imageId}/visual-search/`

  const crop:Crop = { x, y, h, w, tab };

  params.append("x", `${crop.x}`);
  params.append("y", `${crop.y}`);
  params.append("h", `${crop.h}`);
  params.append("w", `${crop.w}`);
  params.append("tab", `0`);
  params.append('data', `{
    "options": {
      "pin_id":"${imageId}",
      "crop": {
        "x":${crop.x},
        "y":${crop.y},
        "w":${crop.w},
        "h":${crop.h}
      },
      "crop_source":6,
      "bookmarks":["${bookmark}"]
    },
    "context":{}
  }`);
  params.append("&_", "1678847106088")

  const data = await axios({
    url: apiUrl + source_url + "?" + params.toString(),
    method: "GET",
    headers: getHearderResquest(imageId, crop, bookmark)
  }).then(r => r.data).catch(e => console.log(e));

  if (!data) return res.status(404).json({ msg: "content not found (something is wrong)" });

  const result:VisualSearchResult = {
    query_frame: data.resource_response.data.query_pin,
    results: data.resource_response.data.results,
    bookmark: data.resource_response.bookmark
  }

  cache.put(KEY, result, oneMinute);
  res.json(result)
}
