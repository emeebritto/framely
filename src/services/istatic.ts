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

export interface ListRandImgResquest {
  page?:string | number;
  per_page?:string | number;
}


// API WRAPPER
class Istatic {
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
    this.random_counter = 0;
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
    return axios.get(`${this.baseUrl}/random/image/list?${config}`);
  }

  searchImage(query:string, cnf:{page?:string, per_page?:string}):Promise<any> {
    const queries = `query=${query}&page=${cnf?.page || 1}&per_page=${cnf?.per_page || 2}`;
    return axios.get(`${this.baseUrl}/search/images?${queries}`);
  }

  advancedtypeAhead(query:string): Promise<any> {
    return axios.get(`${this.baseUrl}/search/advancedtypeAhead?query=${query}`);
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

const istatic = new Istatic();
export default istatic;
