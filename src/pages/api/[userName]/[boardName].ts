import type { NextApiRequest, NextApiResponse } from "next";
import axios from "axios";
import cache from "memory-cache";
// import { Frame } from "types/services";
import { onlyValues } from "utils";
import { twoHour } from "consts";

interface Exception {
  msg:string;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<any|Exception>
) {
  const userName:string = String(req.query?.userName || "");
  const boardName:string = String(req.query?.boardName || "");

  const KEY = `board::${userName}::${boardName}`;

  const cachedResponse = cache.get(KEY);
  if (cachedResponse) {
    return res.status(200).json(cachedResponse);
  }

  const jsonDataPattern = /<script id=\"__PWS_DATA__\" type=\"application\/json\">(.+)<\/script><link data-chunk="DesktopUnauthPageWrapper"/g;
  const data = await axios({
    url: `https://${process.env.BASE_URL_PRESOURCE_TARGET}/${userName}/${boardName}/`,
    method: "GET"
  }).then(r => r.data).catch(e => console.log(e));

  try {
    const matches = String(data).matchAll(jsonDataPattern);
    const match = matches.next();
    const dataObject = JSON.parse(match.value[1]);
    const boardData = {
      metadata: onlyValues(dataObject.props.initialReduxState.boards)[0],
      frames: onlyValues(dataObject.props.initialReduxState.pins)
    };
    cache.put(KEY, boardData, twoHour);
    res.json(boardData);
  } catch(err) {
    console.log(err);
    res.status(501).json({ msg: "something is wrong (internal error)" });
  }
}
