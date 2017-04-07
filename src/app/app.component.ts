import { Component, NgZone } from '@angular/core';
import { LocalStorageService } from 'angular-2-local-storage';
import { BehaviorSubject } from 'rxjs/Rx';
import { PoloniexService } from './poloniex.service';
import Position from './position';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  providers: [PoloniexService]
})
export class AppComponent {
  settings = {
    apiKey: null,
    secret: null
  };

  smallScreen = false;
  btcRate: BehaviorSubject<number>;
  positions: Position[];

  constructor(
    private localStorage: LocalStorageService, private poloniex: PoloniexService, ngZone: NgZone) {
    window.onresize = (e) => {
      ngZone.run(() => {
        this.detectScreenSize();
      });
    };
  }

  ngOnInit(): void {
    this.detectScreenSize();
    this.loadSettings();

    this.poloniex.init(
      this.settings.apiKey, this.settings.secret,
      'http://207.154.233.85:3000/tradingApi'
    );

    this.btcRate = new BehaviorSubject(0);

    setTimeout(() => {
      setInterval(() => this.updateTickerData(), 10000);
    }, 10000);

    this.updatePositions();
  }

  updatePositions() {
    console.log('Loading positions...');
    this.positions = [];

    this.poloniex.getTradeHistory(new Date('2017-01-01')).subscribe(
      tradeHistory => {
        this.poloniex.getCompleteBalances().subscribe(
          balances => {
            for (let coin in balances) {
              if (balances[coin].available > 0 && coin !== 'BTC') {
                this.positions.push(new Position(
                  coin, 
                  balances[coin].available, 
                  tradeHistory[`BTC_${coin}`][0].total, 
                  this.btcRate
                ));
              }
            }

            this.updateTickerData();
          },

          err => console.log(`Failed to retrieve balances: ${err}`)
        );
      },

      err => console.log(`Could not donwload trade history: ${err}`)
    );
  }

  updateTickerData(): void {
    console.log('Updating ticker data...');

    fetch('https://poloniex.com/public?command=returnTicker')
      .then(resp => {
        if (resp.status !== 200) {
          console.log('Failed to retrieve ticker data from Poloniex');
          return;
        }

        resp.json().then(ticker => {
          this.btcRate.next(ticker['USDT_BTC'].highestBid);

          this.positions.forEach(pos => {
            pos.bid = ticker['BTC_' + pos.coin].highestBid;
          });
        });
      })
      .catch(err => {
        console.log(`Could not retrieve ticker: ${err}`);
      });
  }

  detectScreenSize(): void {
    this.smallScreen = window.innerWidth <= 700;
  }

  loadSettings(): void {
    this.settings.apiKey = this.localStorage.get('api-key');
    this.settings.secret = this.localStorage.get('secret');
  }

  saveSettings(): void {
    console.log('Saving settings...');

    if (!this.settings.apiKey || !this.settings.secret) {
      console.log('The API key and secret cannot be empty!');
      return;
    }

    this.localStorage.set('api-key', this.settings.apiKey);
    this.localStorage.set('secret', this.settings.secret);
  }
}