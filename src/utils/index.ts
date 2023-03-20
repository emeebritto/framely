import { Frame, Frameslist, VideoInfor } from "types/services";

export interface Obj {
  [key:string]:any;
}


export const splitData = (data:Frame[], num:number=2):Frameslist[] => {
  const cols = [];
  const medium = Math.floor(data.length / num);
  for (let i=0; i < num; i++) {
    cols.push([...data].splice(medium * i, medium * (i+1)))
  }
  return cols;
};

export const fromSecondsToTime = (secondsRaw:number):string => {
  let sec_num = Number(secondsRaw.toFixed(0));
  let hours:number | string = Math.floor(sec_num / 3600);
  let minutes:number | string = Math.floor((sec_num - (hours * 3600)) / 60);
  let seconds:number | string = sec_num - (hours * 3600) - (minutes * 60);

  if (hours   < 10) {hours   = 0 + hours;}
  if (minutes < 10) {minutes = "0" + minutes;}
  if (seconds < 10) {seconds = "0" + seconds;}
  return `${(hours ? (hours + ':') : '') + minutes + ':' + seconds}`;
}

export const onlyValues = (obj:any):any[] => {
  const list = []
  for (const [key, value] of Object.entries(obj)) {
    if (!value) continue;
    list.push(value);
  }
  return list;
}

export const hlsV4to720p = (url:string):string => {
  url = url.replace("/hls/", "/720p/");
  url = url.replace(".m3u8", ".mp4");
  return url;
}

export const arrangeFrameVideo = (frames:Frame[]):Frame[] => {
  return frames.map((frame:Frame, idx:number):Frame => {
    let frameVideo:VideoInfor|null = frame?.videos?.video_list?.V_HLSV4 || null;
    if (frameVideo) {
      frameVideo.url = hlsV4to720p(frameVideo.url);
      delete frame.videos;
    }
    frame["video"] = frameVideo;
    return frame;
  })
}

export const mapObjValues = (obj:Obj | undefined, type:(s:any) => any) => {
  if (!obj) return {};
  const newObj:Obj = {};
  for (const [key, value] of Object.entries(obj)) {
    if ([null, undefined, NaN].includes(value)) continue;
    newObj[key] = type(value);
  }

  return newObj;
};

export const createUrlParams = (obj:Obj | undefined): string => {
  if (!obj) return '';
  obj = mapObjValues(obj, value => String(value));
  return new URLSearchParams(obj).toString();
}

export function restructVideo(frame:Frame):VideoInfor|null {
  let frameVideo:VideoInfor|null = frame?.videos?.video_list?.V_HLSV4 || null;
  if (frameVideo) {
    frameVideo.url = hlsV4to720p(frameVideo.url);
    // delete frame.videos;
  }
  return frameVideo;
}

export function story2Videos(frame:Frame):VideoInfor[]|[] {
  const storyPages = frame?.story_pin_data?.pages || null;
  if (!storyPages) return [];
  const pagesBlocks = storyPages.map(d => d.blocks).flat();
  if (!pagesBlocks) return [];
  const videos = pagesBlocks.map(d => d?.video?.video_list["V_HLSV3_MOBILE"] || null);
  return videos.filter(v => !!v).map(v => {
    v.url = hlsV4to720p(v.url);
    return v;
  });
}
