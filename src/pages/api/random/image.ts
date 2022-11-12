import type { NextApiRequest, NextApiResponse } from "next";
import axios from "axios";

interface Exception {
  msg:string;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Buffer|Exception>
) {
  const width = req.query?.width;
  const height = req.query?.height;

  if (!width || !height) {
    res.status(404)
    res.json({ msg: "width and height queries is required" })
  }

  const data = await axios({
    url: `${process.env.BASE_URL_RIMG}/${width}/${height}/?random`,
    method: 'GET',
    responseType: "stream"
  }).then(res => res.data).catch(err => console.warn(err))

  data.pipe(res);
}
