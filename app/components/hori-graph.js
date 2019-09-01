import Ember from 'ember';
import jQuery from 'jquery'; 
import {
  select
} from 'd3-selection';

export default Ember.Component.extend({
  classNames: ['hori-graph'],
  init() {
    this._super(...arguments);
  },
  didReceiveAttrs() {
    this._super(...arguments);
  },
  didInsertElement() {
    var svg = select(this.$('.horizontal').get(0));
    console.log(this.get('average'));
    this.set("width", this.get('average') * 5);
    svg.append('rect')
        .attr('width', this.get('average') * 5)
        .attr('height', 15)
        .style('fill', this.get('color'));
  }
});
