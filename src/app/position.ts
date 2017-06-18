import { BehaviorSubject } from 'rxjs/Rx';
import MathJS from 'mathjs';

export default class Position {
  readonly coin: string;
  readonly amount: number;
  readonly amountInBtc: number;
  bid: number;
  ask: number;
  btcRate: BehaviorSubject<number>;

  constructor(coin: string, amount: number, amountInBtc: number, btcRate?: BehaviorSubject<number>) {
    this.coin = coin;
    this.amount = amount;
    this.amountInBtc = amountInBtc;
    this.bid = 0;
    this.ask = 0;
    this.btcRate = btcRate;
  }

  get size(): number {
    return MathJS.round(this.amountInBtc, 2);
  }

  get worthInBtc(): number {
    return MathJS.round(this.bid * this.amount, 8);
  }

  get change(): number {
    return MathJS.round(this.worthInBtc * 100 / this.amountInBtc - 100, 2);
  }

  get pl(): number {
    return MathJS.round((this.worthInBtc - this.amountInBtc) * this.btcRate.getValue(), 2);
  }
}