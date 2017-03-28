import { Injectable } from '@angular/core';
import * as CryptoJS from 'crypto-js';

@Injectable()
export default class PoloniexService {
  private key: string;
  private secret: string;

  init(key: string, secret: string) {
    this.key = key;
    this.secret = secret;
  }

  getPrivateHeaders(parameters: {}): { Key: string, Sign: string } {
    let paramString = Object.keys(parameters).map(function (param) {
      return encodeURIComponent(param) + '=' + encodeURIComponent(parameters[param]);
    }).join('&');

    return {
      Key: this.key,
      Sign: CryptoJS.HmacSHA512(paramString, this.secret).toString()
    };
  }
}
