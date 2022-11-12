import type { NextApiRequest, NextApiResponse } from "next";
import axios from "axios";
// import { TypeAhead } from "types/services";

interface Exception {
  msg:string;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<any[]|Exception>
) {
  const per_page = req.query?.per_page || 15;
  const page = req.query?.page || 1;

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

  res.json(data);
}
