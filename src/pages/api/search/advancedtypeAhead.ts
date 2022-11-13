import type { NextApiRequest, NextApiResponse } from "next";
import { TypeAhead } from "types/services";
import { oneMinute } from "consts";
import cache from "memory-cache";
import axios from "axios";

interface Exception {
  msg:string;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<TypeAhead[]|Exception>
) {
  const query = String(req.query?.query || "");

  if (!query) {
    res.status(404);
    res.json({ msg: "query is required" });
  }

  const KEY = `query::${query.toLowerCase().trim()}`;

  const cachedResponse = cache.get(KEY);
  if (cachedResponse) {
    return res.status(200).json(cachedResponse);
  }

  const url = process.env.BASE_URL_PTYPEAHEAD_RESOURCE;
  const search = `?source_url=/ideas/`;
  const config = `&data={%22options%22:{%22count%22:5,%22term%22:%22${query}%22,%22pin_scope%22:%22pins%22},%22context%22:{}}&_=1666411047053`;

  const ahead = await axios({
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
  })
  .then(res => res.data.resource_response.data.items)
  .catch(err => console.log(err))

  if (!ahead) return res.json({ msg: "request failed" });
  const result = ahead.filter((frame:TypeAhead) => frame.type == "query");
  cache.put(KEY, result, oneMinute);
  res.json(result);
}
