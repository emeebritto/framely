import type { NextApiRequest, NextApiResponse } from "next";
import axios from "axios";
import suggestions from "data/framely_queries.json";

interface Exception {
  msg:string;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<string[]|Exception>
) {
  console.log(suggestions);
  const totalResult = parseInt(String(req.query?.total || 6));
  const data:string[] = [];
  while (data.length <= totalResult && data.length < suggestions.length) {
    let randomNum = ~~(Math.random() * (suggestions.length - 1));
    data.push(suggestions[randomNum]);
  }
  
  res.json(data);
}
