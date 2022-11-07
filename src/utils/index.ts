import { Frame, Frameslist } from "types/services";



export const splitData = (data:Frame[]):Frameslist[] => {
  const medium = Math.floor(data.length / 2);
  const first_column = [...data].splice(0, medium);
  const second_column = [...data].splice(medium, medium * 2);
  return [first_column, second_column];
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
