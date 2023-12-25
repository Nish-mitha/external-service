import { Injectable } from '@nestjs/common';
import axios, { AxiosHeaders } from 'axios';
import { Obj } from 'src/util';

@Injectable()
export class ApiService {
  headers: Obj;

  constructor() {
    this.headers = {
      'PRIVATE-TOKEN': process.env.PROJECT_ACCESS_TOKEN
    }
  }

  /**
   * Function to GET Data
   * @param url 
   * @returns Response
   */
  public async fetchData(url: string): Promise<any> {
    try {
      const response = await axios.get(url, { headers: this.headers });
      return response.data;
    } catch (error) {
      throw new Error(`Failed to fetch data: ${error.message}`);
    }
  }
    
  /**
   * Function to PUT data
   * @param url 
   * @param data 
   * @returns Response
   */
  public async putData(url: string, data: Obj): Promise<any> {
    try {
      const response = await axios.put(url, data, { headers: this.headers });
      return response.data;
    } catch (error) {
      throw new Error(`Failed to put data: ${error.message}`);
    }
  }

  /**
   * Function to POST Data
   * @param url 
   * @param data 
   * @returns Response
   */
  public async postData(url: string, data?: Obj): Promise<any> {
    try {
      const response = await axios.post(url, data, { headers: this.headers });
      return response.data;
    } catch (error) {
      throw new Error(`Failed to post data: ${error.message}`);
    }
  }
}
