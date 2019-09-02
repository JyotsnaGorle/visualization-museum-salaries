import Ember from 'ember';
import jQuery from 'jquery';

export default Ember.Route.extend({

  setupController(controller) {
    var colors = ['#ef9a9a', '#f48fb1', '#b39ddb', '#90caf9', '#80deea', '#80cbc4', '#c5e1a5', '#fff59d', '#ffcc80', '#ffab91'];
    this.controller.set('testing', "00dlaksjdsa");
    this.controller.set("rolesData", null);
    jQuery.getJSON(`http://localhost:5000/getData`).then(countries => {
      countries.map(each => {
        each.country = each.country.toLowerCase();
        each.city = each.city.toLowerCase();
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
          if (each.startingSalary.match(/[+-]?\d+(?:\.\d+)?/g) != null) {
            let val = each.startingSalary.match(/[+-]?\d+(?:\.\d+)?/g)[0];
            if (each.startingSalary.match(/[+-]?\d+(?:\.\d+)?/g)[1]) {
              val = val + each.startingSalary.match(/[+-]?\d+(?:\.\d+)?/g)[1];
            }
            if (val > 20000) {
              val = val / 2080;
            }
            if (val > 2000) {
              val = val / 173;
            }
            each.value2 = parseInt(val);
            return each;
          }
        });
        countries[b].map(each => {

          if (each.country === "united kingdom" || each.country === "uk") {
            each.value = each.value * 1.11;
            each.value2 = each.value2 * 1.11;
          }

          if (each.country === "belgium" || each.country === "netherlands" || each.country === "italy" || each.country === "germany") {
            each.value = each.value * 0.64;
            each.value2 = each.value2 * 0.64;
          }
          return each;
        });

        let allSum = countries[b].reduce(function (sum, b) {
          return sum + b.value ? parseInt(b.value) : 0;
        });
        let avg = allSum / countries[b].length;
        countries[b].average = avg ? avg : countries[b][0].value;

        let allSum2 = countries[b].reduce(function (sum, b) {
          return sum + b.value2 ? parseInt(b.value2) : 0;
        });
        let avg2 = allSum2 / countries[b].length;
        countries[b].average2 = avg2 ? avg2 : countries[b][0].value2;
        finalArray.push({
          name: b,
          value: countries[b].average,
          value2: countries[b].average2,
          currentSalary: this._cleanData(countries[b], "value"),
          startingSalary: this._cleanData(countries[b], "value2"),
          color: colors[(i++) % 10],
          roles: countries[b]
        });
      }

      let allSum = finalArray.reduce(function (sum, b) {
        return sum + b.value ? parseInt(b.value) : 0;
      });

      let allSum2 = finalArray.reduce(function (sum, b) {
        return sum + b.value2 ? parseInt(b.value2) : 0;
      });

      finalArray.map(each => {
        each.percentage = each.value / allSum * 100;
        if (each.percentage > 100) {
          each.percentage = each.percentage / 100;
        }
        each.percentage2 = each.value2 / allSum2 * 100;
        if (each.percentage2 > 100) {
          each.percentage2 = each.percentage2 / 100;
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
    },
    showTreeMap(tag) {
      this.controller.set("rolesData", (Ember.get(tag, "roles")));
    }
  },
  _cleanData(regions, valueKey) {
    let cleanedUpValues = regions.map(each => {
      each[valueKey] = each[valueKey] ? each[valueKey] : 0;
      each[valueKey] = each[valueKey] < 0 ? each[valueKey] * -1 : each[valueKey];
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
      m[d.city][valueKey] += d[valueKey];
      m[d.city].count += 1;
      return m;
    }, {});

    const data = Object.keys(reducedArray).map((k) => {
      const item = reducedArray[k];
      return {
        city: item.city,
        value: item[valueKey] / item.count,
      }
    });
    return data;
  }
});
