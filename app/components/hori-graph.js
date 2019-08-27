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
    svg.append('rect')
        .attr('width', this.get('average'))
        .attr('height', 30)
        .style('fill', this.get('color'));
  }
});
