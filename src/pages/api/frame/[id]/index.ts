import type { NextApiRequest, NextApiResponse } from "next";
import axios from "axios";
import cache from "memory-cache";
import { Frame } from "types/services";
import { twoHour } from "consts";

interface Exception {
  msg:string;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Frame|Exception>
) {
  const frameId:string = String(req.query?.id || "");

  const KEY = `frame::${frameId}`;
  if (!frameId) return res.status(404).json({ msg: "id is required" });

  const cachedResponse = cache.get(KEY);
  if (cachedResponse) {
    return res.status(200).json(cachedResponse);
  }

  const jsonDataPattern = /<script id=\"__PWS_DATA__\" type=\"application\/json\">(.+)<\/script><link data-chunk="DesktopUnauthPageWrapper"/g;
  const data = await axios({
    url: `https://${process.env.BASE_URL_PRESOURCE_TARGET}/pin/${frameId}/?mt=login`,
    method: "GET"
  }).then(r => r.data).catch(e => console.log(e));

  try {
    const matches = String(data).matchAll(jsonDataPattern);
    const match = matches.next();
    const dataObject = JSON.parse(match.value[1]);
    const frameData = dataObject.props.initialReduxState.pins[frameId];
    cache.put(KEY, frameData, twoHour);
    res.json(frameData);
  } catch(err) {
    console.log(err);
    res.status(501).json({ msg: "something is wrong (internal error)" });
  }
}
