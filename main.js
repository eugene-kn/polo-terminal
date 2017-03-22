window.onload = () => {
  localforage.config({
    driver: localforage.LOCALSTORAGE,
    name: 'polo-terminal'
  });

  Vue.use(vMediaQuery.default);

  let app = new Vue({
    el: '#app',

    data: {
      settings: {
        apiKey: null,
        secret: null
      },

      tab: 'overview',
      btc_usd: null,

      positions: [
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
          coin: 'XVC',
          amount: 213.14102564,
          amount_btc: 0.0099165,
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
          coin: 'C2',
          amount: 8750,
          amount_btc: 0.00999999,
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
        }
      ]
    },

    created: function () {
      this.loadSettings();
      this.updateTickerData();

      setTimeout(() => {
        setInterval(() => this.updateTickerData(), 60000);
      }, 60000);
    },

    computed: {
      btc_price: function () {
        return 'BTC/USD: $' + parseInt(this.btc_usd);
      }
    },

    methods: {
      updateTickerData() {
        console.log('Updating ticker data...');

        fetch('https://poloniex.com/public?command=returnTicker')
          .then(resp => {
            if (resp.status !== 200) {
              this.error('Failed to retrieve ticker data from Poloniex');
              return;
            }

            resp.json().then(data => {
              this.btc_usd = data['USDT_BTC'].highestBid;

              this.positions.forEach(pos => {
                let rate = data['BTC_' + pos.coin].highestBid;
                let worth = (rate * pos.amount).round(8);
                let change = (worth * 100 / pos.amount_btc - 100).round(2);
                pos.rate_btc = rate;
                pos.worth_btc = worth;
                pos.change = change;
                pos.pl = ((worth - pos.amount_btc) * this.btc_usd).round(2);
              });
            });
          })
          .catch(err => {
            this.error(`Could not connect to Poloniex (${err})`);
          });
      },

      loadSettings() {
        Promise
          .all([localforage.getItem('api-key'), localforage.getItem('secret')])
          .then(([key, secret]) => {
            if (key && secret) {
              this.settings.apiKey = key;
              this.settings.secret = secret;
            } else {
              this.info('Please set Poloniex API key and secret in the "Settings" section to unlock trading features.');
            }
          })
          .catch(err => this.error('Could not load settings'));
      },

      saveSettings() {
        if (!this.settings.apiKey || !this.settings.secret) {
          this.error('The API key and secret cannot be empty!');
          return;
        }

        Promise.all([
          localforage.setItem('api-key', this.settings.apiKey),
          localforage.setItem('secret', this.settings.secret)
        ])
          .then(values => this.info('Settings saved'))
          .catch(err => this.error('Could not save settings'));
      },

      getRowClassName(row, index) {
        if (row.change < -5) {
          return 'red';
        } else if (row.change > 5) {
          return 'green';
        }

        return '';
      },

      getChangeFormatter(row, column) {
        return row.change + '%';
      },

      getPLFormatter(row, column) {
        return row.pl < 0 ? '-$' + Math.abs(row.pl) : '$' + row.pl;
      },

      info(message) {
        this.$notify({ title: 'Info', message });
      },

      error(message) {
        this.$notify.error({ title: 'Error', message });
      },
    }
  });
};

Number.prototype.round = function (places) {
  return +(Math.round(this + "e+" + places) + "e-" + places);
}

Vue.component('animated-integer', {
  template: '<span>{{ tweeningValue }}</span>',
  props: {
    value: {
      type: Number,
      required: true
    }
  },
  data: function () {
    return {
      tweeningValue: 0
    }
  },
  watch: {
    value: function (newValue, oldValue) {
      this.tween(oldValue, newValue)
    }
  },
  mounted: function () {
    this.tween(0, this.value)
  },
  methods: {
    tween: function (startValue, endValue) {
      var vm = this
      var animationFrame
      function animate(time) {
        TWEEN.update(time)
        animationFrame = requestAnimationFrame(animate)
      }
      new TWEEN.Tween({ tweeningValue: startValue })
        .to({ tweeningValue: endValue }, 500)
        .onUpdate(function () {
          vm.tweeningValue = this.tweeningValue.toFixed(0)
        })
        .onComplete(function () {
          cancelAnimationFrame(animationFrame)
        })
        .start()
      animationFrame = requestAnimationFrame(animate)
    }
  }
})