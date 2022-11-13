import type { NextApiRequest, NextApiResponse } from "next";
import cache from "memory-cache";
import { thirtyMinutes } from "consts";
import axios from "axios";

interface Exception {
  msg:string;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<any[]|Exception>
) {
  const per_page = req.query?.per_page || 15;
  const page = req.query?.page || 1;

  const KEY = `ramdom::images::${page}::${per_page}`;

  const cachedResponse = cache.get(KEY);
  if (cachedResponse) {
    return res.status(200).json(cachedResponse);
  }

  const data = await axios({
    url: `${process.env.BASE_URL_RIMG}/v2/list?page=${page}&limit=${per_page}`,
    method: 'GET'
  }).then(res => res.data).catch(err => console.warn(err))

  if (!data) {
    return res.status(500).json({ msg: "failed request (internal error)" })
  }

  for (let i=0; i < data.length; i++) {
    data[i]["url"] = data[i]["download_url"];
  }

  cache.put(KEY, data, thirtyMinutes);
  res.json(data);
}
