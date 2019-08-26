import Ember from 'ember';
import jQuery from 'jquery';
// import yourData from 'demo-app/salaries.js';

export default Ember.Route.extend({

  setupController(controller) {
    this.controller.set('testing', "00dlaksjdsa");
    console.log("sajdgasjdg")
    jQuery.getJSON(`http://localhost:5000/getData`).then(countries => {
      let finalArray = [];
      for (let b in countries) {
        countries[b].map(each => {
          if (each.amount.match(/[+-]?\d+(?:\.\d+)?/g) != null) {
            let val = each.amount.match(/[+-]?\d+(?:\.\d+)?/g)[0];
            if (each.amount.match(/[+-]?\d+(?:\.\d+)?/g)[1]) {
              val = val + each.amount.match(/[+-]?\d+(?:\.\d+)?/g)[1];
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
  
          if (each.amount.includes('£')) {
              each.value = each.value * 1.11
          }
  
          if (each.amount.includes('NZD') || each.amount.includes('NZ')) {
              each.value = each.value * 0.64
          }
          return each;
        });
        
        let allSum = countries[b].reduce(function (sum, b) {
          return sum + b.value ? parseInt(b.value) : 0;
        });
        let avg = allSum / countries[b].length;
        countries[b].average = avg ? avg : countries[b][0].value;
        finalArray.push({name: b, value: countries[b].average, regions: countries[b]});
      }
      
      let allSum = finalArray.reduce(function (sum, b) {
        return sum + b.value ? parseInt(b.value) : 0;
      });
      finalArray.map(each => {
        each.percentage = each.value/allSum * 100;
        if(each.percentage > 100) {
          each.percentage = each.percentage / 100;
        }
        each.expand = false;
        return each;
      });
      this.controller.set('results', finalArray);
    });
  },
  actions: {
    expandBox(name) {
      let finalarray = this.controller.get('results');
      finalarray.map(each => {
        if(each.name === name) {
          Ember.set(each, "expand", !(Ember.get(each, "expand")));
        }
        return each;
      });
      console.log(finalarray);
      this.controller.set('results', finalarray);
    }
  }
});
