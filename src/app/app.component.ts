import { Component, NgZone } from '@angular/core';
import { LocalStorageService } from 'angular-2-local-storage';
import math from 'mathjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  settings = {
    apiKey: null,
    secret: null
  };

  smallScreen = false;
  btc_usd = null;

  positions = [
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
    },

    {
      coin: 'CLAM',
      amount: 21.01552724,
      amount_btc: 0.01814082,
      rate_btc: null,
      worth_btc: null,
      change: null,
      pl: null
    },

    {
      coin: 'SDC',
      amount: 10.63784406,
      amount_btc: 0.01999999,
      rate_btc: null,
      worth_btc: null,
      change: null,
      pl: null
    },

    {
      coin: 'BCY',
      amount: 186.5066999,
      amount_btc: 0.02860704,
      rate_btc: null,
      worth_btc: null,
      change: null,
      pl: null
    }
  ];

  constructor(private localStorage: LocalStorageService, ngZone: NgZone) {
    window.onresize = (e) => {
      ngZone.run(() => {
        this.detectScreenSize();
      });
    };
  }

  ngOnInit(): void {
    this.detectScreenSize();
    this.loadSettings();
    this.updateTickerData();

    setTimeout(() => {
      setInterval(() => this.updateTickerData(), 10000);
    }, 10000);
  }

  detectScreenSize(): void {
    this.smallScreen = window.innerWidth <= 640;
  }

  loadSettings(): void {
    this.settings.apiKey = this.localStorage.get('api-key');
    this.settings.secret = this.localStorage.get('secret');

    // Promise
    //   .all([localforage.getItem('api-key'), localforage.getItem('secret')])
    //   .then(([key, secret]) => {
    //     if (key && secret) {
    //       this.settings.apiKey = key;
    //       this.settings.secret = secret;
    //     } else {
    //       this.info('Please set Poloniex API key and secret in the "Settings" section to unlock trading features.');
    //     }
    //   })
    //   .catch(err => this.error('Could not load settings'));
  }

  saveSettings(): void {
    console.log('Saving settings...');

    if (!this.settings.apiKey || !this.settings.secret) {
      console.log('The API key and secret cannot be empty!');
      return;
    }

    this.localStorage.set('api-key', this.settings.apiKey);
    this.localStorage.set('secret', this.settings.secret);

    // Promise.all([
    //   localforage.setItem('api-key', this.settings.apiKey),
    //   localforage.setItem('secret', this.settings.secret)
    // ])
    //   .then(values => this.info('Settings saved'))
    //   .catch(err => this.error('Could not save settings'));
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