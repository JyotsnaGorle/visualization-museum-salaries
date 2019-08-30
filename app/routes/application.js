import Ember from 'ember';
import jQuery from 'jquery';

export default Ember.Route.extend({

  setupController(controller) {
    var colors = ['#ef9a9a', '#f48fb1', '#b39ddb', '#90caf9', '#80deea', '#80cbc4', '#c5e1a5', '#fff59d', '#ffcc80', '#ffab91'];
    this.controller.set('testing', "00dlaksjdsa");
    jQuery.getJSON(`http://localhost:5000/getData`).then(countries => {
      countries.map(each => {
        each.country = each.country.toLowerCase();
        return each;
      })

      countries = countries.reduce(function (r, a) {
        r[a.country] = r[a.country] || [];
        r[a.country].push(a);
        return r;
      }, Object.create(null));

      let finalArray = [];
      let i = 0;
      for (let b in countries) {
        countries[b].map(each => {
          if (each.currentSalary.match(/[+-]?\d+(?:\.\d+)?/g) != null) {
            let val = each.currentSalary.match(/[+-]?\d+(?:\.\d+)?/g)[0];
            if (each.currentSalary.match(/[+-]?\d+(?:\.\d+)?/g)[1]) {
              val = val + each.currentSalary.match(/[+-]?\d+(?:\.\d+)?/g)[1];
            }
            if (val > 20000) {
              val = val / 2080;
            }
            if (val > 2000) {
              val = val / 173;
            }
            each.value = parseInt(val);
            return each;
          }
        });
        countries[b].map(each => {

          if (each.currentSalary.includes('£')) {
            each.value = each.value * 1.11
          }

          if (each.currentSalary.includes('NZD') || each.currentSalary.includes('NZ')) {
            each.value = each.value * 0.64
          }
          return each;
        });

        let allSum = countries[b].reduce(function (sum, b) {
          return sum + b.value ? parseInt(b.value) : 0;
        });
        let avg = allSum / countries[b].length;
        countries[b].average = avg ? avg : countries[b][0].value;

        let cleanedUpData = this._cleanData(countries[b])
        finalArray.push({
          name: b,
          value: countries[b].average,
          regions: cleanedUpData,
          color: colors[(i++) % 10]
        });
      }

      let allSum = finalArray.reduce(function (sum, b) {
        return sum + b.value ? parseInt(b.value) : 0;
      });
      finalArray.map(each => {
        each.percentage = each.value / allSum * 100;
        if (each.percentage > 100) {
          each.percentage = each.percentage / 100;
        }
        each.expand = false;
        each.stacked = false;
        each.showJoin = false;
        return each;
      });
      this.controller.set('results', finalArray);
    });
  },
  actions: {
    expandBox(tag) {
      Ember.set(tag, "expand", !(Ember.get(tag, "expand")));
      if ((Ember.get(tag, "expand"))) {
        Ember.set(tag, "showJoin", true);
      }
      if (!(Ember.get(tag, "expand")) && !(Ember.get(tag, "stacked"))) {
        Ember.set(tag, "showJoin", false);
      }
      Ember.set(tag, "stacked", false);
    },
    showStackedGraph(tag) {
      Ember.set(tag, "expand", !(Ember.get(tag, "expand")));
      Ember.set(tag, "stacked", !(Ember.get(tag, "stacked")));
    }
  },
  _cleanData(regions) {
    let cleanedUpValues = regions.map(each => {
      each.value = each.value ? each.value : 0;
      each.value = each.value < 0 ? each.value * -1 : each.value;
      return each;
    });

    const reducedArray = cleanedUpValues.reduce((m, d) => {
      if (!m[d.city]) {
        m[d.city] = {
          ...d,
          count: 1
        };
        return m;
      }
      m[d.city].value += d.value;
      m[d.city].count += 1;
      return m;
    }, {});

    const data = Object.keys(reducedArray).map((k) => {
      const item = reducedArray[k];
      return {
        city: item.city,
        value: item.value / item.count,
      }
    });
    return data;
  }
});
