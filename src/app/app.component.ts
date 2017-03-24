import { Component, NgZone } from '@angular/core';
import math from 'mathjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  smallScreen = false;
  title = 'app works!';
  btc_usd = null;

  positions = [
    {
      coin: 'BBR',
      amount: 71.24999999,
      amount_btc: 0.01998983,
      rate_btc: null,
      worth_btc: null,
      change: null,
      pl: null
    },

    {
      coin: 'VRC',
      amount: 339.40115685,
      amount_btc: 0.00996635,
      rate_btc: null,
      worth_btc: null,
      change: null,
      pl: null
    },

    {
      coin: 'MYR',
      amount: 41562.49999999,
      amount_btc: 0.00999999,
      rate_btc: null,
      worth_btc: null,
      change: null,
      pl: null
    },

    {
      coin: 'NXC',
      amount: 363.918278,
      amount_btc: 0.01989786,
      rate_btc: null,
      worth_btc: null,
      change: null,
      pl: null
    },

    {
      coin: 'QTL',
      amount: 779.60140679,
      amount_btc: 0.01999999,
      rate_btc: null,
      worth_btc: null,
      change: null,
      pl: null
    },

    {
      coin: 'QORA',
      amount: 249375,
      amount_btc: 0.02,
      rate_btc: null,
      worth_btc: null,
      change: null,
      pl: null
    },

    {
      coin: 'RIC',
      amount: 1558.59375,
      amount_btc: 0.01967177,
      rate_btc: null,
      worth_btc: null,
      change: null,
      pl: null
    }
  ];

  constructor(ngZone: NgZone) {
    window.onresize = (e) => {
      ngZone.run(() => {
        this.detectScreenSize();
      });
    };
  }

  ngOnInit(): void {
    this.detectScreenSize();
    this.updateTickerData();

    setTimeout(() => {
      setInterval(() => this.updateTickerData(), 10000);
    }, 10000);
  }

  detectScreenSize(): void {
    this.smallScreen = window.innerWidth <= 640;
  }

  updateTickerData(): void {
    console.log('Updating ticker data...');

    fetch('https://poloniex.com/public?command=returnTicker')
      .then(resp => {
        if (resp.status !== 200) {
          console.log('Failed to retrieve ticker data from Poloniex');
          return;
        }

        resp.json().then(data => {
          this.btc_usd = data['USDT_BTC'].highestBid;

          this.positions.forEach(pos => {
            let rate = data['BTC_' + pos.coin].highestBid;
            let worth = math.round(rate * pos.amount, 8);
            let change = math.round(worth * 100 / pos.amount_btc - 100, 2);
            pos.rate_btc = rate;
            pos.worth_btc = worth;
            pos.change = change;
            pos.pl = math.round((worth - pos.amount_btc) * this.btc_usd, 2);
            pos['cls'] = change > 5 ? 'green' : change < -5 ? 'red' : '';
          });
        });
      })
      .catch(err => {
        console.log(`Could not connect to Poloniex (${err})`);
      });
  }
}