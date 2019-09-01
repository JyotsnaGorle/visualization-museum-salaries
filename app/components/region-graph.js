import Ember from 'ember';
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
  },
  didInsertElement() {

    var data = this.get('regions');

    var height = 12 * data.length;
    var div = select(this.$('.parent').get(0)).append("div")
      .attr("class", "tooltip")
      .style("opacity", 0)
      .style("position", "absolute");

    var svg = select(this.$('.jolly').get(0)).attr('height', height);
    svg.selectAll("rect")
      .data(data)
      .enter().append("rect")
      .attr("class", "bar")
      .attr("height", "5")
      .attr("width", function (d, i) {
        return (d.value)
      })
      .attr("x", function (d, i) {
        return 250
      })
      .attr("y", function (d, i) {
        return i + (i * 10);
      })
      .style("fill", this.get("color"))
      .on("mouseover", function (d, i) {
        // Use D3 to select element, change color and size
        select(this).attr(
          "fill", "orange"
        );
        div.style('transition-duration', '.5s')
          .style("opacity", .9);
        div.html(d.value.toFixed(2))
          .style("left", 300 + "px")
          .style("top", i + (i * 10) + 65 + "px");
      })
      .on("mouseout", function (d) {
        select(this).attr(
          "fill", "black"
        );
        div.style('transition-duration', '.5s')
          .style("opacity", 0);
      });
    if (this.get('name') === "starting") {
      svg.selectAll("text")
        .data(data)
        .enter().append("text")
        .text(function (d) {
          return d.city
        })
        .style("font-size", "12px")
        .attr("x", function (d, i) {
          return 10
        })
        .attr("y", function (d, i) {
          return i + (i * 10) + 10;
        });
    }
  },

});
