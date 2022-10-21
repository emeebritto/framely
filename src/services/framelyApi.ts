import axios from 'axios';


export interface DictionaryResponse {
  data:Array<{
    glossary:string;
    meta: {
      synsetType:string;
    }
  }>;
}

export interface TranslateResponse {
  data: {
    text:string;
  };
}


export interface RandomImageRequest {
  width:string | number;
  height:string | number;
}


// API WRAPPER
class FramelyApi {
  public devENV:boolean;
  private istaticDEV:string;
  private istaticPROD:string;
  public baseUrl:string;
  private staticSourcesUrl:string;
  constructor() {
    this.devENV = process.env.NODE_ENV === 'development';
    this.istaticDEV = `http://localhost:${9872}`;
    this.istaticPROD = 'https://cdn-istatics.herokuapp.com';
    this.baseUrl = this.devENV ? this.istaticDEV : this.istaticPROD;
    this.staticSourcesUrl = `${this.baseUrl}/static`;
  }

  profileImg(id:null | string = null): string {
    return `${this.baseUrl}/user-img/guest_temp`;
  }

  iconUrl({
    name, color='white', format='svg', dp=24
  }:{
    name:string,
    color?:string,
    format?:string,
    dp?:number
  }):string {
    return `${this.staticSourcesUrl}/icons/${name}_${color}_${dp}dp.${format}`;
  }

  imgUrl({ path }:{ path:string }): string {
    return `${this.staticSourcesUrl}/imgs/${path}`;
  }

  randomImage({ width, height }:RandomImageRequest) {
    return `${this.baseUrl}/random/image?width=${width}&height=${height}`
  }

  animatedSvgUrl({ name }:{ name:string }): string {
    return `${this.staticSourcesUrl}/icons/AnimatedSvg/${name}.svg`;
  }

  staticPath(pathName:string): Promise<any> {
    return axios.get(`${this.staticSourcesUrl}/${pathName}`);
  }

  dictionary({ word }:{ word:string }): Promise<DictionaryResponse> {
    return axios.get(`${this.baseUrl}/itools/dictionary?word=${word}`);
  }

  translate({ text }:{ text:string }): Promise<TranslateResponse> {
    return axios.post(`${this.baseUrl}/translate?to=pt`, { text });
  }
}

const framelyApi = new FramelyApi();
export default framelyApi;
