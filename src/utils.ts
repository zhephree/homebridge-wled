import axios, {isCancel, AxiosError} from 'axios';
import { Logger } from 'homebridge';


export class wledAPI {
  private baseUrl: string;

  constructor(public readonly host: string, public readonly log: Logger){
    this.host = host;
    this.baseUrl = `http://${this.host}/json`;
    this.log = log;
  }

  async get(method: string){
    try {
      const response = await axios.get(`${this.baseUrl}/${method}`);
      return response.data;
    }catch(err: unknown){
      this.log.error('Could not make API request to method:', method);
      let error;
      if(typeof err === 'string'){
        error = err;
      }else if(err instanceof Error){
        error = err.message;
      }
      this.log.error(error);
    }
  }

  async post(method: string, data: object = {}){
    try {
      const response = await axios.post(`${this.baseUrl}/${method}`, data);
      return response.data;
    }catch(err: unknown){
      this.log.error('Could not make API request to method:', method);
      let error;
      if(typeof err === 'string'){
        error = err;
      }else if(err instanceof Error){
        error = err.message;
      }
      this.log.error(error);

    }
  }

  async state(json?: object){
    if(!json){
      return await this.get('state');
    }else{
      return await this.post('state', json);
    }
  }

  async info(){
    return await this.get('info');
  }

  async effects(){
    return await this.get('effects');
  }

  async palettes(){
    return await this.get('palettes');
  }

  async turnOn(){
    return await this.state({'on': true});
  }

  async turnOff(){
    return await this.state({'on': false});
  }

  async toggle(){
    return await this.state({'on': 't'});
  }

  /**
   * Set brightness of instance
   * @param value number - between 0 and 255
   * @returns Promise
   */
  async brightness(value: number){
    return await this.state({'bri': value});
  }

  async preset(value: number){
    return await this.state({'ps': value});
  }

  /* SEGMENT METHODS */
  async segmentOn(segment: number){
    return await this.state({
      'seg': [
        {
          'id': segment,
          'on': true,
        },
      ],
    });
  }

  async segmentOff(segment: number){
    return await this.state({
      'seg': [
        {
          'id': segment,
          'on': false,
        },
      ],
    });
  }

  async segmentToggle(segment: number){
    return await this.state({
      'seg': [
        {
          'id': segment,
          'on': 't',
        },
      ],
    });
  }

  async segmentBrightness(segment: number, value: number){
    return await this.state({
      'seg': [
        {
          'id': segment,
          'bri': value,
        },
      ],
    });
  }
}