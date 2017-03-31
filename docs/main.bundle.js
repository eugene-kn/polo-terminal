webpackJsonp([1,4],{

/***/ 215:
/***/ (function(module, exports) {

function webpackEmptyContext(req) {
	throw new Error("Cannot find module '" + req + "'.");
}
webpackEmptyContext.keys = function() { return []; };
webpackEmptyContext.resolve = webpackEmptyContext;
module.exports = webpackEmptyContext;
webpackEmptyContext.id = 215;


/***/ }),

/***/ 216:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(23);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__angular_platform_browser_dynamic__ = __webpack_require__(222);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__app_app_module__ = __webpack_require__(224);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__environments_environment__ = __webpack_require__(226);




if (__WEBPACK_IMPORTED_MODULE_3__environments_environment__["a" /* environment */].production) {
    __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["enableProdMode"])();
}
__webpack_require__.i(__WEBPACK_IMPORTED_MODULE_1__angular_platform_browser_dynamic__["a" /* platformBrowserDynamic */])().bootstrapModule(__WEBPACK_IMPORTED_MODULE_2__app_app_module__["a" /* AppModule */]);
//# sourceMappingURL=main.js.map

/***/ }),

/***/ 223:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(23);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_angular_2_local_storage__ = __webpack_require__(134);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_angular_2_local_storage___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1_angular_2_local_storage__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_mathjs__ = __webpack_require__(310);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_mathjs___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_2_mathjs__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__poloniex_service__ = __webpack_require__(225);
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
    function AppComponent(localStorage, poloniex, ngZone) {
        var _this = this;
        this.localStorage = localStorage;
        this.poloniex = poloniex;
        this.settings = {
            apiKey: null,
            secret: null
        };
        this.smallScreen = false;
        this.btc_usd = null;
        this.positions = [
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
                coin: 'SC',
                amount: 36944.44444444,
                amount_btc: 0.01999999,
                rate_btc: null,
                worth_btc: null,
                change: null,
                pl: null
            },
            {
                coin: 'ZEC',
                amount: 0.44373554,
                amount_btc: 0.02370973,
                rate_btc: null,
                worth_btc: null,
                change: null,
                pl: null
            },
            {
                coin: 'NAUT',
                amount: 220.36082474,
                amount_btc: 0.02999999,
                rate_btc: null,
                worth_btc: null,
                change: null,
                pl: null
            }
        ];
        // private localStorage: LocalStorageService, ngZone: NgZone) {
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
        this.poloniex.init(this.settings.apiKey, this.settings.secret);
        this.updateTickerData();
        setTimeout(function () {
            setInterval(function () { return _this.updateTickerData(); }, 10000);
        }, 10000);
        // console.log("Headers:", this.poloniex.getPrivateHeaders({ foo: 'bar' }));
    };
    AppComponent.prototype.detectScreenSize = function () {
        this.smallScreen = window.innerWidth <= 700;
    };
    AppComponent.prototype.loadSettings = function () {
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
    };
    AppComponent.prototype.saveSettings = function () {
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
            resp.json().then(function (data) {
                _this.btc_usd = data['USDT_BTC'].highestBid;
                _this.positions.forEach(function (pos) {
                    var rate = data['BTC_' + pos.coin].highestBid;
                    var worth = __WEBPACK_IMPORTED_MODULE_2_mathjs___default.a.round(rate * pos.amount, 8);
                    var change = __WEBPACK_IMPORTED_MODULE_2_mathjs___default.a.round(worth * 100 / pos.amount_btc - 100, 2);
                    pos.rate_btc = rate;
                    pos.worth_btc = worth;
                    pos.change = change;
                    pos.pl = __WEBPACK_IMPORTED_MODULE_2_mathjs___default.a.round((worth - pos.amount_btc) * _this.btc_usd, 2);
                    pos['cls'] = change > 5 ? 'green' : change < -5 ? 'red' : '';
                });
            });
        })
            .catch(function (err) {
            console.log("Could not connect to Poloniex (" + err + ")");
        });
    };
    return AppComponent;
}());
AppComponent = __decorate([
    __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Component"])({
        selector: 'app-root',
        template: __webpack_require__(684),
        styles: [__webpack_require__(307)],
        providers: [__WEBPACK_IMPORTED_MODULE_3__poloniex_service__["a" /* PoloniexService */]]
        // providers: []
    }),
    __metadata("design:paramtypes", [typeof (_a = typeof __WEBPACK_IMPORTED_MODULE_1_angular_2_local_storage__["LocalStorageService"] !== "undefined" && __WEBPACK_IMPORTED_MODULE_1_angular_2_local_storage__["LocalStorageService"]) === "function" && _a || Object, typeof (_b = typeof __WEBPACK_IMPORTED_MODULE_3__poloniex_service__["a" /* PoloniexService */] !== "undefined" && __WEBPACK_IMPORTED_MODULE_3__poloniex_service__["a" /* PoloniexService */]) === "function" && _b || Object, typeof (_c = typeof __WEBPACK_IMPORTED_MODULE_0__angular_core__["NgZone"] !== "undefined" && __WEBPACK_IMPORTED_MODULE_0__angular_core__["NgZone"]) === "function" && _c || Object])
], AppComponent);

var _a, _b, _c;
//# sourceMappingURL=app.component.js.map

/***/ }),

/***/ 224:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_platform_browser__ = __webpack_require__(74);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__angular_core__ = __webpack_require__(23);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__angular_forms__ = __webpack_require__(220);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__angular_http__ = __webpack_require__(221);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4_angular_2_local_storage__ = __webpack_require__(134);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4_angular_2_local_storage___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_4_angular_2_local_storage__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__app_component__ = __webpack_require__(223);
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
    __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_1__angular_core__["NgModule"])({
        declarations: [
            __WEBPACK_IMPORTED_MODULE_5__app_component__["a" /* AppComponent */]
        ],
        imports: [
            __WEBPACK_IMPORTED_MODULE_0__angular_platform_browser__["a" /* BrowserModule */],
            __WEBPACK_IMPORTED_MODULE_2__angular_forms__["a" /* FormsModule */],
            __WEBPACK_IMPORTED_MODULE_3__angular_http__["a" /* HttpModule */],
            __WEBPACK_IMPORTED_MODULE_4_angular_2_local_storage__["LocalStorageModule"].withConfig({
                prefix: 'polo-terminal',
                storageType: 'localStorage'
            })
        ],
        providers: [],
        bootstrap: [__WEBPACK_IMPORTED_MODULE_5__app_component__["a" /* AppComponent */]]
    })
], AppModule);

//# sourceMappingURL=app.module.js.map

/***/ }),

/***/ 225:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(23);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_crypto_js__ = __webpack_require__(284);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_crypto_js___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1_crypto_js__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return PoloniexService; });
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};


var PoloniexService = (function () {
    function PoloniexService() {
    }
    PoloniexService.prototype.init = function (key, secret) {
        this.key = key;
        this.secret = secret;
    };
    PoloniexService.prototype.getPrivateHeaders = function (parameters) {
        var paramString = Object.keys(parameters).map(function (param) {
            return encodeURIComponent(param) + '=' + encodeURIComponent(parameters[param]);
        }).join('&');
        return {
            Key: this.key,
            Sign: __WEBPACK_IMPORTED_MODULE_1_crypto_js__["HmacSHA512"](paramString, this.secret).toString()
        };
    };
    return PoloniexService;
}());
PoloniexService = __decorate([
    __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Injectable"])()
], PoloniexService);

//# sourceMappingURL=poloniex.service.js.map

/***/ }),

/***/ 226:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return environment; });
var environment = {
    production: true
};
//# sourceMappingURL=environment.js.map

/***/ }),

/***/ 307:
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(113)();
// imports


// module
exports.push([module.i, "table {\r\n    border: none;\r\n    width: 98%;\r\n    margin-left: auto;\r\n    margin-right: auto;\r\n    margin-top: 10px;\r\n}\r\n\r\nthead th {\r\n    background-color: lightgray;\r\n    color: black;\r\n    padding-bottom: 3px;\r\n    height: 30px;\r\n}\r\n\r\n.green {\r\n    background: #c5e1a5;\r\n}\r\n\r\n.red {\r\n    background: #ef9a9a;\r\n}\r\n\r\n#settings-tab .page-content {\r\n    padding: 10px;\r\n}\r\n\r\n#settings-tab .mdl-textfield {\r\n    width: 100%;\r\n}", ""]);

// exports


/*** EXPORTS FROM exports-loader ***/
module.exports = module.exports.toString();

/***/ }),

/***/ 684:
/***/ (function(module, exports) {

module.exports = "<!-- Simple header with fixed tabs. -->\n<div class=\"mdl-layout mdl-js-layout mdl-layout--fixed-header\n            mdl-layout--fixed-tabs\">\n  <header class=\"mdl-layout__header\">\n    <div class=\"mdl-layout__header-row\">\n      <!-- Title -->\n      <span class=\"mdl-layout-title\">Polo Terminal</span>\n    </div>\n    <!-- Tabs -->\n    <div class=\"mdl-layout__tab-bar mdl-js-ripple-effect\">\n      <a href=\"#overview-tab\" class=\"mdl-layout__tab is-active\">Overview</a>\n      <a href=\"#settings-tab\" class=\"mdl-layout__tab\">Settings</a>\n    </div>\n  </header>\n  <main class=\"mdl-layout__content\">\n    <section class=\"mdl-layout__tab-panel is-active\" id=\"overview-tab\">\n      <div class=\"page-content\">\n        <table class=\"mdl-data-table mdl-js-data-table mdl-shadow--2dp\">\n          <thead>\n            <tr>\n              <th class=\"mdl-data-table__cell--non-numeric\">Coin</th>\n              <th [hidden]=\"smallScreen\">Amount</th>\n              <th [hidden]=\"smallScreen\">Amount (BTC)</th>\n              <th [hidden]=\"smallScreen\">Rate (BTC)</th>\n              <th [hidden]=\"smallScreen\">Worth (BTC)</th>\n              <th>Change</th>\n              <th>P/L</th>\n            </tr>\n          </thead>\n          <tbody>\n            <tr *ngFor=\"let pos of positions\" [ngClass]=\"pos.cls\">\n              <td class=\"mdl-data-table__cell--non-numeric\">{{ pos.coin }}</td>\n              <td [hidden]=\"smallScreen\">{{ pos.amount }}</td>\n              <td [hidden]=\"smallScreen\">{{ pos.amount_btc }}</td>\n              <td [hidden]=\"smallScreen\">{{ pos.rate_btc }}</td>\n              <td [hidden]=\"smallScreen\">{{ pos.worth_btc }}</td>\n              <td>{{ pos.change }}</td>\n              <td>{{ pos.pl }}</td>\n            </tr>\n          </tbody>\n        </table>\n      </div>\n    </section>\n    <section class=\"mdl-layout__tab-panel\" id=\"settings-tab\">\n      <div class=\"page-content\">\n        <form action=\"#\">\n          <div class=\"mdl-textfield mdl-js-textfield mdl-textfield--floating-label\">\n            <input [(ngModel)]=\"settings.apiKey\" class=\"mdl-textfield__input\" type=\"text\" id=\"api-key\" [ngModelOptions]=\"{standalone: true}\">\n            <label class=\"mdl-textfield__label\" for=\"api-key\">API Key</label>\n          </div>\n          <div class=\"mdl-textfield mdl-js-textfield mdl-textfield--floating-label\">\n            <input [(ngModel)]=\"settings.secret\" class=\"mdl-textfield__input\" type=\"text\" id=\"secret\" [ngModelOptions]=\"{standalone: true}\">\n            <label class=\"mdl-textfield__label\" for=\"secret\">Secret</label>\n          </div>\n          <button (click)=\"saveSettings()\" class=\"mdl-button mdl-js-button mdl-button--raised mdl-button--colored\">\n            Save\n          </button>\n        </form>\n      </div>\n    </section>\n  </main>\n</div>"

/***/ }),

/***/ 712:
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(216);


/***/ })

},[712]);
//# sourceMappingURL=main.bundle.js.map