import { Injectable } from '@angular/core';
import { Http, Response, Headers, RequestOptions, ResponseOptions } from '@angular/http';
import {Observable} from 'rxjs/Rx';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import * as CryptoJS from 'crypto-js';
import nonce from 'nonce';
import Position from './position';

@Injectable()
export class PoloniexService {
  private key: string;
  private secret: string;
  private apiUrl: string;
  private nonce: any;
  debug: boolean = false;

  constructor(private http: Http) { }

  init(key: string, secret: string, apiUrl: string) {
    this.key = key;
    this.secret = secret;
    this.apiUrl = apiUrl;
    this.nonce = nonce();

    if (this.debug) {
      this.apiUrl = 'http://localhost/tradingApi';
    }
  }

  getCompleteBalances(): Observable<Response> {
    return this.invokeTradingMethod('returnCompleteBalances');
  }

  getTradeHistory(start: Date): Observable<Response> {
    return this.invokeTradingMethod('returnTradeHistory', { 
      currencyPair: 'all',
      start: Math.floor(start.getTime() / 1000)
    });
  }

  getOpenOrders(): Observable<Response> {
    return this.invokeTradingMethod('returnOpenOrders', { currencyPair: 'all' });
  }

  closePosition(position: Position): Observable<Response> {
    return this.invokeTradingMethod('sell', {
      'currencyPair': `BTC_${position.coin}`,
      'amount': position.amount,
      'rate': position.bid * 0.9,
      'immediateOrCancel': 1
    });
  }

  addToPosition(position: Position, btcWorth: number): Observable<Response> {
    return this.invokeTradingMethod('buy', {
      'currencyPair': `BTC_${position.coin}`,
      'amount': btcWorth / position.bid,
      'rate': position.ask * 0.9,
      'immediateOrCancel': 1
    });
  }

  private invokeTradingMethod(method: string, params = {}) {
    params['command'] = method;
    params['nonce'] = this.nonce();

    let options = new RequestOptions({ headers: this.getHeaders(params) });

    return this.http.post(this.apiUrl, this.stringifyParams(params), options)
      .map((res: Response) => res.json())
      .catch((error: any) => Observable.throw(error.json().error || error));
  }

  private stringifyParams(params: {}): string {
    return Object.keys(params).map(function (param) {
      return encodeURIComponent(param) + '=' + encodeURIComponent(params[param]);
    }).join('&');
  }

  private getHeaders(params: {}): Headers {
    let paramString = this.stringifyParams(params);
    
    let headers = new Headers({
      'Key': this.key,
      'Sign': CryptoJS.HmacSHA512(paramString, this.secret).toString(),
      'Content-Type': 'application/x-www-form-urlencoded'
    });

    if (this.debug) {
      headers.append('X-Command', params['command']);
    }
    
    return headers;
  }
}
