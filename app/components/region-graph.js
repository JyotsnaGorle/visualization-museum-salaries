import Ember from 'ember';
import jQuery from 'jquery'; 
import {
  select
} from 'd3-selection';

export default Ember.Component.extend({
  classNames: ['region-graph'],
  init() {
    this._super(...arguments);
  },
  didReceiveAttrs() {
    this._super(...arguments);
    console.log(this.get('regions'));
    
  },

});
