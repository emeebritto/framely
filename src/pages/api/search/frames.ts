import { SearchResponse, Frame, VideoInfor } from "types/services";
import type { NextApiRequest, NextApiResponse } from "next";
import { hlsV4to720p } from "utils";
import cache from "memory-cache";
import { oneHour } from "consts";
import axios from "axios";

interface Exception {
  msg:string;
}


interface LoadMoreParams {
  query:string;
  scope:string;
  bookmark:string;
}


interface UnsplashImgsParams {
  query:string;
  per_page:number;
  page:number;
}



const getUnsplashImgs = async({ query, per_page, page }:UnsplashImgsParams) => {
  if (!per_page) return [];
  const url = process.env.BASE_URL_UAPI_SPHOTO;
  const search = `?query=${query}&per_page=${per_page}&page=${page}`;
  const config = "&xp=unsplash-plus-0:Control";

  return axios({
    url: url + search + config,
    method: 'GET'
  }).then(res => res.data.results).catch(err => {
    console.log(err);
    return [];
  })
};



const getPinterestImgs = async({ query, scope="pins" }:{query:string, scope:string}) => {
  const url = process.env.BASE_URL_PSEARCH;
  const search = `?source_url=/search/pins/?q=${query}&rs=typed`;
  const config = `&data={%22options%22:{%22article%22:%22%22,%22appliedProductFilters%22:%22---%22,%22query%22:%22${query}%22,%22scope%22:%22${scope}%22,%22auto_correction_disabled%22:%22%22,%22top_pin_id%22:%22%22,%22filters%22:%22%22},%22context%22:{}}&_=1666411308222`;

  return axios({
    url: url + search + config,
    method: 'GET',
    headers: {
      "Host": process.env.BASE_URL_PRESOURCE_TARGET,
      "User-Agent": process.env.USER_AGENT,
      "Accept": "application/json, text/javascript, */*, q=0.01",
      "Accept-Language": "en-US,en;q=0.5",
      "Accept-Encoding": "gzip, deflate, br",
      "Referer": `https://${process.env.BASE_URL_PRESOURCE_TARGET}/`,
      "X-Requested-With": "XMLHttpRequest",
      "X-APP-VERSION": "24eed2c",
      "X-Pinterest-AppState": "active",
      "X-Pinterest-ExperimentHash": process.env.BASE_URL_PSEARCH_EXHASH,
      "X-Pinterest-Source-Url": `/search/pins/?q=${query}&rs=typed`,
      "X-Pinterest-PWS-Handler": "www/search/[scope].js",
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
  }).then(res => {
    return {
      data: res.data.resource_response.data.results,
      bookmark: res.data.resource_response.bookmark
    }
  }).catch(err => {
    console.log(err);
    return { data: [], bookmark: "" };
  })
};



const load_more_pins = async({ query, scope="pins", bookmark }:LoadMoreParams) => {
  const url = process.env.BASE_URL_PSEARCH;
  const params = new URLSearchParams();

  if (!url) return { data: [], bookmark: "" }

  params.append('source_url', `search/pins/?q=${query}&rs=typed`);
  params.append('data', `{
    "options": {
      "article":"",
      "appliedProductFilters":"---",
      "query": "${query}",
      "scope":"pins",
      "auto_correction_disabled":"",
      "top_pin_id":"",
      "filters":"",
      "bookmarks":["${bookmark}"]
    },
    "context":{}
  }`);

  return axios.post(url, params, {
    headers: {
      "Host": process.env.BASE_URL_PRESOURCE_TARGET,
      "User-Agent": process.env.USER_AGENT,
      "Accept": "application/json, text/javascript, */*, q=0.01",
      "Accept-Language": "en-US,en;q=0.5",
      "Accept-Encoding": "gzip, deflate, br",
      "Content-Type": "application/x-www-form-urlencoded",
      "Referer": `https://${process.env.BASE_URL_PRESOURCE_TARGET}/`,
      "X-Requested-With": "XMLHttpRequest",
      "X-APP-VERSION": "24eed2c",
      "X-CSRFToken": process.env.BASE_URL_PSEARCH_CSRFTOKEN,
      "X-Pinterest-AppState": "active",
      "X-Pinterest-ExperimentHash": process.env.BASE_URL_PSEARCH_EXHASH,
      "X-Pinterest-Source-Url": `/search/pins/?q=${query}&rs=typed`,
      "X-Pinterest-PWS-Handler": "www/search/[scope].js",
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
  }).then(res => {
    return {
      data: res.data.resource_response.data.results,
      bookmark: res.data.resource_response.bookmark
    }
  }).catch(err => {
    console.log(err);
    return { data: [], bookmark: "" };
  })
};



export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<SearchResponse|Exception>
) {
  const query_raw = String(req.query?.query || "");
  const scope = String(req.query?.scope || "pins");

  if (!query_raw) {
    res.status(404);
    res.json({ msg: "query is required" });
  }


  const query = query_raw.replace(/(::)+|(\s)+/gi, ' ').toLowerCase().trim();
  const per_page = parseInt(String(req.query?.per_page || 23));
  const bookmark = String(req.query?.bookmark || "");
  const page = parseInt(String(req.query?.page || 1));

  if (per_page < 23) {
    return res.status(401).json({
      "msg": "the min per page length is 23"
    });
  }

  const PKEY = `query::${query}::${bookmark}`;
  const UKEY = `query::${query}::${per_page}::${page}`;
  let pdata = {
    data: [] as Frame[],
    bookmark: ""
  };

  const cachedResponse = cache.get(PKEY);
  if (cachedResponse) {
    pdata = cachedResponse;
  } else {
    pdata = bookmark
      ? await load_more_pins({ query, scope, bookmark })
      : await getPinterestImgs({ query, scope })

    pdata.data = pdata.data.map((frame:Frame) => {
      frame.frameType = "Frame_p9";
      let frameVideo:VideoInfor|null = frame?.videos?.video_list?.V_HLSV4 || null;
      if (frameVideo) {
        frameVideo.url = hlsV4to720p(frameVideo.url);
        // delete frame.videos;
      }
      frame["video"] = frameVideo;
      return frame;
    });

    pdata.data = pdata.data.filter((frame:Frame) => frame.type == "pin");
    cache.put(PKEY, pdata, oneHour);
  }


  const per_page_mid = per_page - pdata.data.length;  

  let udata = await getUnsplashImgs({
    query: query,
    per_page: per_page_mid,
    page: page
  });



  udata = udata.map((frame:Frame) => {
    frame.frameType = "Frame_u8";
    return frame;
  })

  udata = udata.filter((frame:Frame) => !frame?.premium);


  res.json({
    query: `Results for: ${query}`,
    results: [...pdata.data, ...udata],
    bookmark: pdata.bookmark
  });
}
