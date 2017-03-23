'use strict';

class Poloniex {
  constructor(key, secret) {
    if (!key || !secret) {
      throw 'Poloniex: Error. API key and secret required';
    }

    this.key = key;
    this.secret = secret;
  }

  _getPrivateHeaders(parameters) {
    let paramString = Object.keys(parameters).map(function (param) {
      return encodeURIComponent(param) + '=' + encodeURIComponent(parameters[param]);
    }).join('&');

    return {
      Key: this.key,
      Sign: CryptoJS.HmacSHA512(paramString, this.secret).toString()
    };
  }
}