import { Component, NgZone } from '@angular/core';
import { BehaviorSubject } from 'rxjs/Rx';
import MathJS from 'mathjs';
import { PoloniexService } from './poloniex.service';
import Position from './position';

declare var TradingView: any;

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
  btc: BehaviorSubject<number>;
  usd: BehaviorSubject<number>;
  btcRate: BehaviorSubject<number>;
  positions: Position[];
  currentPosition: Position;

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

    // this.poloniex.debug = true;

    this.poloniex.init(
      this.settings.apiKey, this.settings.secret,
      'https://mastervip.xyz/tradingApi'
    );

    this.btc = new BehaviorSubject(0);
    this.usd = new BehaviorSubject(0);
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
            let btcBalance = 0;

            for (let coin in balances) {
              let availableBalance = parseFloat(balances[coin].available);

              if (availableBalance > 0) {
                if (coin == 'BTC') {
                  btcBalance += availableBalance + parseFloat(balances[coin].onOrders);
                } else {
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

                  btcBalance += parseFloat(balances[coin].btcValue);
                }
              }
            }

            btcBalance = MathJS.round(btcBalance, 8);
            this.btc.next(btcBalance);
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
          this.usd.next(MathJS.round(this.btc.getValue() * this.btcRate.getValue(), 2));

          this.positions.forEach(pos => {
            pos.bid = ticker['BTC_' + pos.coin].highestBid;
            pos.ask = ticker['BTC_' + pos.coin].lowestAsk;
          });
        });
      })
      .catch(err => {
        console.log(`Could not retrieve ticker: ${err}`);
      });
  }

  closePosition(pos: Position) {
    if (!confirm(`About to market-sell ${pos.amount} of ${pos.coin}. OK?`)) {
      return;
    }

    this.poloniex.closePosition(pos).subscribe(resp => {
      let tradeLog = "Latest Trades:\n\n";
      let trades = resp['resultingTrades'];

      for (let i = 0; i < trades.length; i++) {
        tradeLog += `${trades[i].date} - sold ${trades[i].amount} of ${pos.coin} at ${trades[i].rate}\n`;
      }

      alert(tradeLog);
      this.updatePositions();
      this.closePositionDialog();
    });
  }

  addToPosition(pos: Position, btcWorth: number) {
    if (!confirm(`About to market-buy ${btcWorth} BTC of ${pos.coin}. OK?`)) {
      return;
    }

    this.poloniex.addToPosition(pos, btcWorth).subscribe(resp => {
      let tradeLog = "Latest Trades:\n\n";
      let trades = resp['resultingTrades'];

      for (let i = 0; i < trades.length; i++) {
        tradeLog += `${trades[i].date} - bought ${trades[i].amount} of ${pos.coin} at ${trades[i].rate}\n`;
      }

      alert(tradeLog);
      this.updatePositions();
      this.closePositionDialog();
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

  openPositionDialog(pos: Position): void {
    this.currentPosition = pos;

    new TradingView.widget({
      "container_id": "chartContainer",
      "autosize": true,
      "symbol": "POLONIEX:" + pos.coin + "BTC",
      "interval": "D",
      "timezone": "Etc/UTC",
      "theme": "White",
      "style": "1",
      "locale": "en",
      "toolbar_bg": "#f1f3f6",
      "enable_publishing": false,
      "allow_symbol_change": true,
      "hideideas": true
    });

    let dialog: any = <any>document.querySelector('dialog');
    dialog.showModal();
  }

  closePositionDialog(): void {
    let dialog: any = <any>document.querySelector('dialog');
    dialog.close();
  }
}