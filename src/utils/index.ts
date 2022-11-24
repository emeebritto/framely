import { Frame, Frameslist } from "types/services";



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