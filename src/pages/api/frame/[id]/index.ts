import type { NextApiRequest, NextApiResponse } from "next";
import axios from "axios";
import cache from "memory-cache";
import { Frame } from "types/services";
import { twoHour } from "consts";

interface Exception {
	msg: string;
}

export default async function handler(
	req: NextApiRequest,
	res: NextApiResponse<any | Exception>
) {
	const frameId: string = String(req.query?.id || "");

	const KEY = `frame::${frameId}`;
	if (!frameId) return res.status(404).json({ msg: "id is required" });

	const cachedResponse = cache.get(KEY);
	if (cachedResponse) {
		return res.status(200).json(cachedResponse);
	}

	// const jsonDataPattern = /<script id=\"__PWS_DATA__\" type=\"application\/json\">(.+)<\/script><link data-chunk="DesktopUnauthPageWrapper"/g;
	const jsonDataPattern = /<script id=\"__PWS_INITIAL_PROPS__\" type=\"application\/json\">(.+)<\/script><template id="__PWS_INITIAL_PROPS_COMPLETE__">/g;

	return axios({
		url: `https://${process.env.BASE_URL_PRESOURCE_TARGET}/pin/${frameId}/`,
		method: "GET",
		headers: {
			"Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
			"Accept-Language": "en-US,en;q=0.5",
			"Accept-Encoding": "gzip, deflate, br",
			"Connection": "keep-alive",
			"Cookie": process.env.PSEARCH_COOKIE_251124,
			"DNT": "1",
			"Host": "au.pinterest.com",
			"Sec-Fetch-Dest": "document",
			"Sec-Fetch-Mode": "navigate",
			"Sec-Fetch-Site": "none",
			"Sec-Fetch-User": "?1",
			"Sec-GPC": "1",
			"User-Agent": process.env.USER_AGENT,
		}
	}).then(r => {
		try {
			const matches = String(r.data).matchAll(jsonDataPattern);
			const match = matches.next();
			if (!!match?.value) {
				const dataObject = JSON.parse(match.value[1]);
				const frameData = dataObject.initialReduxState.pins[frameId];
				cache.put(KEY, frameData, twoHour);
				return res.json(frameData);
			}

			res.json({});
		} catch (err) {
			console.log({ err });
			res.status(501).json({ msg: "an error while processing the data." });
		}
	}).catch(err => {
		console.log({ err });
		res.status(501).json({ msg: "something is wrong (internal error)" });
	});
}
