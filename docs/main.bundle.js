webpackJsonp([1,4],{

/***/ 1013:
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(271);


/***/ }),

/***/ 270:
/***/ (function(module, exports) {

function webpackEmptyContext(req) {
	throw new Error("Cannot find module '" + req + "'.");
}
webpackEmptyContext.keys = function() { return []; };
webpackEmptyContext.resolve = webpackEmptyContext;
module.exports = webpackEmptyContext;
webpackEmptyContext.id = 270;


/***/ }),

/***/ 271:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(38);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__angular_platform_browser_dynamic__ = __webpack_require__(276);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__app_app_module__ = __webpack_require__(278);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__environments_environment__ = __webpack_require__(281);




if (__WEBPACK_IMPORTED_MODULE_3__environments_environment__["a" /* environment */].production) {
    __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["a" /* enableProdMode */])();
}
__webpack_require__.i(__WEBPACK_IMPORTED_MODULE_1__angular_platform_browser_dynamic__["a" /* platformBrowserDynamic */])().bootstrapModule(__WEBPACK_IMPORTED_MODULE_2__app_app_module__["a" /* AppModule */]);
//# sourceMappingURL=main.js.map

/***/ }),

/***/ 277:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(38);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_rxjs_Rx__ = __webpack_require__(236);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_rxjs_Rx___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1_rxjs_Rx__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__poloniex_service__ = __webpack_require__(279);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__position__ = __webpack_require__(280);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return AppComponent; });
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};




var AppComponent = (function () {
    function AppComponent(poloniex, ngZone) {
        var _this = this;
        this.poloniex = poloniex;
        this.settings = {
            apiKey: null,
            secret: null
        };
        this.smallScreen = false;
        window.onresize = function (e) {
            ngZone.run(function () {
                _this.detectScreenSize();
            });
        };
    }
    AppComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.detectScreenSize();
        this.loadSettings();
        if (!this.settings.apiKey || !this.settings.secret) {
            alert('Missing Poloniex API key and secret!');
            return;
        }
        this.poloniex.init(this.settings.apiKey, this.settings.secret, 'https://mastervip.xyz/tradingApi');
        this.btcRate = new __WEBPACK_IMPORTED_MODULE_1_rxjs_Rx__["BehaviorSubject"](0);
        this.updatePositions();
        setTimeout(function () {
            setInterval(function () { return _this.updateTickerData(); }, 10000);
        }, 10000);
    };
    AppComponent.prototype.updatePositions = function () {
        var _this = this;
        console.log('Loading positions...');
        this.positions = [];
        this.poloniex.getTradeHistory(new Date('2017-01-01')).subscribe(function (tradeHistory) {
            _this.poloniex.getCompleteBalances().subscribe(function (balances) {
                for (var coin in balances) {
                    var availableBalance = parseFloat(balances[coin].available);
                    if (availableBalance > 0 && coin !== 'BTC') {
                        var amount = 0;
                        var amountInBtc = 0;
                        var i = 0;
                        while (amount < availableBalance) {
                            amount += parseFloat(tradeHistory["BTC_" + coin][i].amount);
                            amountInBtc += parseFloat(tradeHistory["BTC_" + coin][i].total);
                            i++;
                        }
                        _this.positions.push(new __WEBPACK_IMPORTED_MODULE_3__position__["a" /* default */](coin, availableBalance, amountInBtc, _this.btcRate));
                    }
                }
                _this.updateTickerData();
            }, function (err) { return alert("Failed to retrieve balances: " + err); });
        }, function (err) { return alert("Could not donwload trade history: " + err); });
    };
    AppComponent.prototype.updateTickerData = function () {
        var _this = this;
        console.log('Updating ticker data...');
        fetch('https://poloniex.com/public?command=returnTicker')
            .then(function (resp) {
            if (resp.status !== 200) {
                console.log('Failed to retrieve ticker data from Poloniex');
                return;
            }
            resp.json().then(function (ticker) {
                _this.btcRate.next(ticker['USDT_BTC'].highestBid);
                _this.positions.forEach(function (pos) {
                    pos.bid = ticker['BTC_' + pos.coin].highestBid;
                });
            });
        })
            .catch(function (err) {
            console.log("Could not retrieve ticker: " + err);
        });
    };
    AppComponent.prototype.detectScreenSize = function () {
        this.smallScreen = window.innerWidth <= 700;
    };
    AppComponent.prototype.loadSettings = function () {
        console.log('Loading settings...');
        this.settings.apiKey = localStorage.getItem('polo-terminal.api-key');
        this.settings.secret = localStorage.getItem('polo-terminal.secret');
    };
    AppComponent.prototype.saveSettings = function () {
        console.log('Saving settings...');
        if (!this.settings.apiKey || !this.settings.secret) {
            console.log('The API key and secret cannot be empty!');
            return;
        }
        localStorage.setItem('polo-terminal.api-key', this.settings.apiKey);
        localStorage.setItem('polo-terminal.secret', this.settings.secret);
        window.location.reload();
    };
    return AppComponent;
}());
AppComponent = __decorate([
    __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["_4" /* Component */])({
        selector: 'app-root',
        template: __webpack_require__(739),
        styles: [__webpack_require__(361)],
        providers: [__WEBPACK_IMPORTED_MODULE_2__poloniex_service__["a" /* PoloniexService */]]
    }),
    __metadata("design:paramtypes", [typeof (_a = typeof __WEBPACK_IMPORTED_MODULE_2__poloniex_service__["a" /* PoloniexService */] !== "undefined" && __WEBPACK_IMPORTED_MODULE_2__poloniex_service__["a" /* PoloniexService */]) === "function" && _a || Object, typeof (_b = typeof __WEBPACK_IMPORTED_MODULE_0__angular_core__["k" /* NgZone */] !== "undefined" && __WEBPACK_IMPORTED_MODULE_0__angular_core__["k" /* NgZone */]) === "function" && _b || Object])
], AppComponent);

var _a, _b;
//# sourceMappingURL=app.component.js.map

/***/ }),

/***/ 278:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_platform_browser__ = __webpack_require__(90);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__angular_core__ = __webpack_require__(38);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__angular_forms__ = __webpack_require__(275);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__angular_http__ = __webpack_require__(165);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__app_component__ = __webpack_require__(277);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return AppModule; });
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};





var AppModule = (function () {
    function AppModule() {
    }
    return AppModule;
}());
AppModule = __decorate([
    __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_1__angular_core__["b" /* NgModule */])({
        declarations: [
            __WEBPACK_IMPORTED_MODULE_4__app_component__["a" /* AppComponent */]
        ],
        imports: [
            __WEBPACK_IMPORTED_MODULE_0__angular_platform_browser__["a" /* BrowserModule */],
            __WEBPACK_IMPORTED_MODULE_2__angular_forms__["a" /* FormsModule */],
            __WEBPACK_IMPORTED_MODULE_3__angular_http__["a" /* HttpModule */]
        ],
        providers: [],
        bootstrap: [__WEBPACK_IMPORTED_MODULE_4__app_component__["a" /* AppComponent */]]
    })
], AppModule);

//# sourceMappingURL=app.module.js.map

/***/ }),

/***/ 279:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(38);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__angular_http__ = __webpack_require__(165);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_rxjs_Rx__ = __webpack_require__(236);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_rxjs_Rx___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_2_rxjs_Rx__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_rxjs_add_operator_map__ = __webpack_require__(239);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_rxjs_add_operator_map___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_3_rxjs_add_operator_map__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4_rxjs_add_operator_catch__ = __webpack_require__(238);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4_rxjs_add_operator_catch___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_4_rxjs_add_operator_catch__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5_crypto_js__ = __webpack_require__(338);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5_crypto_js___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_5_crypto_js__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6_nonce__ = __webpack_require__(737);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6_nonce___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_6_nonce__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return PoloniexService; });
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};







var PoloniexService = (function () {
    function PoloniexService(http) {
        this.http = http;
    }
    PoloniexService.prototype.init = function (key, secret, apiUrl) {
        this.key = key;
        this.secret = secret;
        this.apiUrl = apiUrl;
        this.nonce = __WEBPACK_IMPORTED_MODULE_6_nonce___default()();
    };
    PoloniexService.prototype.getCompleteBalances = function () {
        return this.invokeTradingMethod('returnCompleteBalances');
    };
    PoloniexService.prototype.getTradeHistory = function (start) {
        return this.invokeTradingMethod('returnTradeHistory', {
            currencyPair: 'all',
            start: Math.floor(start.getTime() / 1000)
        });
    };
    PoloniexService.prototype.getOpenOrders = function () {
        return this.invokeTradingMethod('returnOpenOrders', { currencyPair: 'all' });
    };
    PoloniexService.prototype.invokeTradingMethod = function (method, params) {
        if (params === void 0) { params = {}; }
        params['command'] = method;
        params['nonce'] = this.nonce();
        var options = new __WEBPACK_IMPORTED_MODULE_1__angular_http__["b" /* RequestOptions */]({ headers: this.getHeaders(params) });
        return this.http.post(this.apiUrl, this.stringifyParams(params), options)
            .map(function (res) { return res.json(); })
            .catch(function (error) { return __WEBPACK_IMPORTED_MODULE_2_rxjs_Rx__["Observable"].throw(error.json().error || 'Server error'); });
    };
    PoloniexService.prototype.stringifyParams = function (params) {
        return Object.keys(params).map(function (param) {
            return encodeURIComponent(param) + '=' + encodeURIComponent(params[param]);
        }).join('&');
    };
    PoloniexService.prototype.getHeaders = function (params) {
        var paramString = this.stringifyParams(params);
        return new __WEBPACK_IMPORTED_MODULE_1__angular_http__["c" /* Headers */]({
            'Key': this.key,
            'Sign': __WEBPACK_IMPORTED_MODULE_5_crypto_js__["HmacSHA512"](paramString, this.secret).toString(),
            'Content-Type': 'application/x-www-form-urlencoded'
        });
    };
    return PoloniexService;
}());
PoloniexService = __decorate([
    __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["c" /* Injectable */])(),
    __metadata("design:paramtypes", [typeof (_a = typeof __WEBPACK_IMPORTED_MODULE_1__angular_http__["d" /* Http */] !== "undefined" && __WEBPACK_IMPORTED_MODULE_1__angular_http__["d" /* Http */]) === "function" && _a || Object])
], PoloniexService);

var _a;
//# sourceMappingURL=poloniex.service.js.map

/***/ }),

/***/ 280:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_mathjs__ = __webpack_require__(364);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_mathjs___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_mathjs__);

var Position = (function () {
    function Position(coin, amount, amountInBtc, btcRate) {
        this.coin = coin;
        this.amount = amount;
        this.amountInBtc = amountInBtc;
        this.bid = 0;
        this.btcRate = btcRate;
    }
    Object.defineProperty(Position.prototype, "worthInBtc", {
        get: function () {
            return __WEBPACK_IMPORTED_MODULE_0_mathjs___default.a.round(this.bid * this.amount, 8);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Position.prototype, "change", {
        get: function () {
            return __WEBPACK_IMPORTED_MODULE_0_mathjs___default.a.round(this.worthInBtc * 100 / this.amountInBtc - 100, 2);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Position.prototype, "pl", {
        get: function () {
            return __WEBPACK_IMPORTED_MODULE_0_mathjs___default.a.round((this.worthInBtc - this.amountInBtc) * this.btcRate.getValue(), 2);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Position.prototype, "cls", {
        get: function () {
            return this.change > 5 ? 'green' : this.change < -5 ? 'red' : '';
        },
        enumerable: true,
        configurable: true
    });
    return Position;
}());
/* harmony default export */ __webpack_exports__["a"] = Position;
//# sourceMappingURL=position.js.map

/***/ }),

/***/ 281:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return environment; });
var environment = {
    production: true
};
//# sourceMappingURL=environment.js.map

/***/ }),

/***/ 361:
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(139)();
// imports


// module
exports.push([module.i, "table {\r\n    border: none;\r\n    width: 98%;\r\n    margin-left: auto;\r\n    margin-right: auto;\r\n    margin-top: 10px;\r\n}\r\n\r\nthead th {\r\n    background-color: lightgray;\r\n    color: black;\r\n    padding-bottom: 3px;\r\n    height: 30px;\r\n}\r\n\r\n.green {\r\n    background: #c5e1a5;\r\n}\r\n\r\n.red {\r\n    background: #ef9a9a;\r\n}\r\n\r\n#settings-tab .page-content {\r\n    padding: 10px;\r\n}\r\n\r\n#settings-tab .mdl-textfield {\r\n    width: 100%;\r\n}", ""]);

// exports


/*** EXPORTS FROM exports-loader ***/
module.exports = module.exports.toString();

/***/ }),

/***/ 739:
/***/ (function(module, exports) {

module.exports = "<!-- Simple header with fixed tabs. -->\n<div class=\"mdl-layout mdl-js-layout mdl-layout--fixed-header\n            mdl-layout--fixed-tabs\">\n  <header class=\"mdl-layout__header\">\n    <div class=\"mdl-layout__header-row\">\n      <!-- Title -->\n      <span class=\"mdl-layout-title\">Polo Terminal</span>\n    </div>\n    <!-- Tabs -->\n    <div class=\"mdl-layout__tab-bar mdl-js-ripple-effect\">\n      <a href=\"#overview-tab\" class=\"mdl-layout__tab is-active\">Overview</a>\n      <a href=\"#settings-tab\" class=\"mdl-layout__tab\">Settings</a>\n    </div>\n  </header>\n  <main class=\"mdl-layout__content\">\n    <section class=\"mdl-layout__tab-panel is-active\" id=\"overview-tab\">\n      <div class=\"page-content\">\n        <table class=\"mdl-data-table mdl-js-data-table mdl-shadow--2dp\">\n          <thead>\n            <tr>\n              <th class=\"mdl-data-table__cell--non-numeric\">Coin</th>\n              <th [hidden]=\"smallScreen\">Amount</th>\n              <th [hidden]=\"smallScreen\">Paid (BTC)</th>\n              <th [hidden]=\"smallScreen\">Bid (BTC)</th>\n              <th [hidden]=\"smallScreen\">Worth (BTC)</th>\n              <th>Change (%)</th>\n              <th>P/L ($)</th>\n            </tr>\n          </thead>\n          <tbody>\n            <tr *ngFor=\"let pos of positions\" [ngClass]=\"pos.cls\">\n              <td class=\"mdl-data-table__cell--non-numeric\">{{ pos.coin }}</td>\n              <td [hidden]=\"smallScreen\">{{ pos.amount }}</td>\n              <td [hidden]=\"smallScreen\">{{ pos.amountInBtc }}</td>\n              <td [hidden]=\"smallScreen\">{{ pos.bid }}</td>\n              <td [hidden]=\"smallScreen\">{{ pos.worthInBtc }}</td>\n              <td>{{ pos.change }}</td>\n              <td>{{ pos.pl }}</td>\n            </tr>\n          </tbody>\n        </table>\n      </div>\n    </section>\n    <section class=\"mdl-layout__tab-panel\" id=\"settings-tab\">\n      <div class=\"page-content\">\n        <form action=\"#\">\n          <div class=\"mdl-textfield mdl-js-textfield mdl-textfield--floating-label\">\n            <input [(ngModel)]=\"settings.apiKey\" class=\"mdl-textfield__input\" type=\"text\" name=\"api-key\">\n            <label class=\"mdl-textfield__label\" for=\"api-key\">API Key</label>\n          </div>\n          <div class=\"mdl-textfield mdl-js-textfield mdl-textfield--floating-label\">\n            <input [(ngModel)]=\"settings.secret\" class=\"mdl-textfield__input\" type=\"text\" name=\"secret\">\n            <label class=\"mdl-textfield__label\" for=\"secret\">Secret</label>\n          </div>\n          <button (click)=\"saveSettings()\" class=\"mdl-button mdl-js-button mdl-button--raised mdl-button--colored\">\n            Save\n          </button>\n        </form>\n      </div>\n    </section>\n  </main>\n</div>"

/***/ })

},[1013]);
//# sourceMappingURL=main.bundle.js.map