import axios from 'axios';
import { Frame, TypeAheadList } from "types/services";


export interface RelatedFramesResponse {
  data: {
    result:Frame[];
    bookmark:string;
  };
};

export interface RandomImageRequest {
  width:string | number;
  height:string | number;
}

export interface ListRandImgResquest {
  page?:string | number;
  per_page?:string | number;
}


// API WRAPPER
class FramelyApi {
  public devENV:boolean;
  private fapiDEV:string;
  private fapiPROD:string;
  public baseUrl:string;
  private staticSourcesUrl:string;
  private random_counter:number;
  constructor() {
    this.devENV = process.env.NODE_ENV === 'development';
    this.fapiDEV = `http://localhost:${3000}/api`;
    this.fapiPROD = 'https://framely.vercel.app/api';
    this.baseUrl = this.devENV ? this.fapiDEV : this.fapiPROD;
    this.staticSourcesUrl = `${this.baseUrl}/static`;
    this.random_counter = 0;
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

  imgUrl({ path }:{ path:string }):string {
    return `${this.staticSourcesUrl}/imgs/${path}`;
  }

  randomImage({ width, height }:RandomImageRequest):string {
    // random_counter to prevent browser cache.
    this.random_counter += 1;
    const config = `width=${width}&height=${height}&random=${this.random_counter}`;
    return `${this.baseUrl}/random/image?${config}`;
  }

  listRandomImage(cnf:ListRandImgResquest):Promise<any> {
    const config = `page=${cnf?.page || 1}&limit=${cnf?.per_page || 15}`;
    return axios.get(`${this.baseUrl}/random/images?${config}`);
  }

  searchImage(
    query:string,
    cnf:{page?:string, per_page?:string|number, bookmark?:string}
  ):Promise<any> {
    const queries = `query=${query}&page=${cnf?.page || 1}&per_page=${cnf?.per_page || 2}&bookmark=${cnf?.bookmark || ''}`;
    return axios.get(`${this.baseUrl}/search/images?${queries}`);
  }

  getImage(id:string):Promise<{data:Frame}> {
    return axios.get(`${this.baseUrl}/image/${id}`);
  }

  getRelatedImage(id:string, bookmark:string=""):Promise<RelatedFramesResponse> {
    return axios.get(`${this.baseUrl}/image/${id}/related?bookmark=${bookmark}`);
  }

  advancedtypeAhead(query:string): Promise<{data:TypeAheadList}> {
    return axios.get(`${this.baseUrl}/search/advancedtypeAhead?query=${query}`);
  }

  images_queries(q:{totalResult?:number}):Promise<{data:string[]}> {
    return axios.get(`${this.baseUrl}/search/suggestions?totalResult=${q?.totalResult || ""}`);
  }
}

const framelyApi = new FramelyApi();
export default framelyApi;
