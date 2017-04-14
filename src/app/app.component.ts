import { Component, NgZone } from '@angular/core';
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

  constructor(private poloniex: PoloniexService, ngZone: NgZone) {
    window.onresize = (e) => {
      ngZone.run(() => {
        this.detectScreenSize();
      });
    };
  }

  ngOnInit(): void {
    this.detectScreenSize();
    this.loadSettings();

    if (!this.settings.apiKey || !this.settings.secret) {
      alert('Missing Poloniex API key and secret!');
      return;
    }

    this.poloniex.init(
      this.settings.apiKey, this.settings.secret,
      'https://mastervip.xyz/tradingApi'
    );

    this.btcRate = new BehaviorSubject(0);
    this.updatePositions();

    setTimeout(() => {
      setInterval(() => this.updateTickerData(), 10000);
    }, 10000);
  }

  updatePositions() {
    console.log('Loading positions...');
    this.positions = [];

    this.poloniex.getTradeHistory(new Date('2017-01-01')).subscribe(
      tradeHistory => {
        this.poloniex.getCompleteBalances().subscribe(
          balances => {
            for (let coin in balances) {
              let availableBalance = parseFloat(balances[coin].available);

              if (availableBalance > 0 && coin !== 'BTC') {
                let amount = 0;
                let amountInBtc = 0;
                let i = 0;

                while (amount < availableBalance) {
                  amount += parseFloat(tradeHistory[`BTC_${coin}`][i].amount);
                  amountInBtc += parseFloat(tradeHistory[`BTC_${coin}`][i].total);
                  i++;
                }

                this.positions.push(new Position(
                  coin, 
                  availableBalance, 
                  amountInBtc, 
                  this.btcRate
                ));
              }
            }

            this.updateTickerData();
          },

          err => alert(`Failed to retrieve balances: ${err}`)
        );
      },

      err => alert(`Could not donwload trade history: ${err}`)
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
    console.log('Loading settings...');
    this.settings.apiKey = localStorage.getItem('polo-terminal.api-key');
    this.settings.secret = localStorage.getItem('polo-terminal.secret');
  }

  saveSettings(): void {
    console.log('Saving settings...');

    if (!this.settings.apiKey || !this.settings.secret) {
      console.log('The API key and secret cannot be empty!');
      return;
    }

    localStorage.setItem('polo-terminal.api-key', this.settings.apiKey);
    localStorage.setItem('polo-terminal.secret', this.settings.secret);
    window.location.reload();
  }
}