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

  constructor(private http: Http) { }

  init(key: string, secret: string, apiUrl: string) {
    this.key = key;
    this.secret = secret;
    this.apiUrl = apiUrl;
    this.nonce = nonce();
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

  // private invokeTradingMethodTest(method: string, params = {}): Observable<Response> {
  //   console.log("invokeTradingMethodTest", method, params);

  //   return new Observable(observer => {
  //     let json = `{"orderNumber":"35523807750","resultingTrades":[{"amount":"108.50874733","date":"2017-04-18 23:45:31","rate":"0.00002728","total":"0.00296011","tradeID":"3855488","type":"sell"},{"amount":"614.31733962","date":"2017-04-18 23:45:31","rate":"0.00002727","total":"0.01675243","tradeID":"3855489","type":"sell"}],"amountUnfilled":"0.00000000"}`;

  //     setTimeout(() => {
  //       observer.next(new Response(new ResponseOptions({ status: 200, body: json })))
  //     }, 2000);
  //   });
  // }

  private invokeTradingMethod(method: string, params = {}) {
    params['command'] = method;
    params['nonce'] = this.nonce();

    let options = new RequestOptions({ headers: this.getHeaders(params) });

    return this.http.post(this.apiUrl, this.stringifyParams(params), options)
      .map((res: Response) => res.json())
      .catch((error: any) => Observable.throw(error.json().error || 'Server error'));
  }

  private stringifyParams(params: {}): string {
    return Object.keys(params).map(function (param) {
      return encodeURIComponent(param) + '=' + encodeURIComponent(params[param]);
    }).join('&');
  }

  private getHeaders(params: {}): Headers {
    let paramString = this.stringifyParams(params);

    return new Headers({
      'Key': this.key,
      'Sign': CryptoJS.HmacSHA512(paramString, this.secret).toString(),
      'Content-Type': 'application/x-www-form-urlencoded'
    });
  }
}
