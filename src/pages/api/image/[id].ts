import type { NextApiRequest, NextApiResponse } from "next";
import axios from "axios";
import { Frame } from "types/services";

interface Exception {
  msg:string;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Frame|Exception>
) {
  const imageId:string = String(req.query?.id || "");
  const jsonDataPattern = /<script id=\"__PWS_DATA__\" type=\"application\/json\">(.+)<\/script><link data-chunk="DesktopUnauthPageWrapper"/g;
  if (!imageId) return res.status(404).json({ msg: "imageId is required" });
  const data = await axios({
    url: `https://${process.env.BASE_URL_PRESOURCE_TARGET}/pin/${imageId}/?mt=login`,
    method: "GET"
  }).then(r => r.data).catch(e => console.log(e));

  try {
    const matches = String(data).matchAll(jsonDataPattern);
    const match = matches.next();
    // console.log([...matches][0][1]);
    const dataObject = JSON.parse(match.value[1]);
    const imageData = dataObject.props.initialReduxState.pins[imageId];
    res.json(imageData);
  } catch(err) {
    console.log(err);
    res.status(501).json({ msg: "something is wrong (internal error)" });
  }
}
