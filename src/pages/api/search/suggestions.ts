import type { NextApiRequest, NextApiResponse } from "next";
import suggestions from "data/framely_queries.json";
import { oneMinute } from "consts";
import cache from "memory-cache";
import axios from "axios";

interface Exception {
  msg:string;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<string[]|Exception>
) {
  const totalResult = parseInt(String(req.query?.total || 6));
  const KEY = `suggestions::${totalResult}`;

  const cachedResponse = cache.get(KEY);
  if (cachedResponse) {
    return res.status(200).json(cachedResponse);
  }

  const data:string[] = [];
  while (data.length <= totalResult && data.length < suggestions.length) {
    let randomNum = ~~(Math.random() * (suggestions.length - 1));
    data.push(suggestions[randomNum]);
  }

  cache.put(KEY, data, oneMinute);
  res.json(data);
}
