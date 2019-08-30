import Ember from 'ember';
import {
  select
} from 'd3-selection';
import {
  max
} from 'd3-array';
import {
  stack
} from 'd3-shape';
import {
  scaleLinear,
  scaleBand
} from 'd3-scale';
import {
  axisBottom,
  axisLeft
} from 'd3-axis';

export default Ember.Component.extend({
  classNames: ['stacked-graph'],
  init() {
    this._super(...arguments);
  },
  didReceiveAttrs() {
    this._super(...arguments);
  },
  didInsertElement() {
    let region1 = this.get('regions1');
    let region2 = this.get('regions2');

    let data = [];

    region1.forEach(each => {
      let a = {}
      region2.forEach(each2 => {
        if (each.city === each2.city) {
          a = {
            city: each.city,
            currentSalary: each.value,
            startingSalary: each2.value
          }
        }
      });
      data.push(a);
    })


    var color = ['#ef9a9a', '#f48fb1', '#b39ddb', '#90caf9', '#80deea', '#80cbc4', '#c5e1a5', '#fff59d', '#ffcc80', '#ffab91'];

    var margin = {
        top: 40,
        right: 20,
        bottom: 30,
        left: 20
      },
      width = 550 - margin.left - margin.right,
      height = data.length * 12 - margin.top - margin.bottom;

    var xScale = scaleLinear().range([0, width]);
    var yScale = scaleBand().rangeRound([height, 0]).padding(0.2);

    // var color = scale.category20();


    var svg = select("body");

    var svg = select(this.$('.jolly').get(0)).attr('height', height+100).attr('width', width);
    var g = svg.append("g").attr("transform", "translate(" + 120 + "," + margin.top + ")");
    

    var stack = d3.stack()
      .keys(["currentSalary", "startingSalary"])
      .order(d3.stackOrderNone)
      .offset(d3.stackOffsetNone);

    var series = stack(data);

    yScale.domain(data.map(function (d) {
      return d.city;
    }));
    xScale.domain([0, max(series[series.length - 1], function (d) {
      return d[0] + d[1];
    })]).nice();
    
    var yAxis = axisLeft(yScale).tickSize(0);    

    g.selectAll(".series")
      .data(series)
      .enter().append("g")
      .attr("class", "series")
      .attr("fill", function (d, i) {
        return color[i];
      })
      .selectAll("rect")
      .data(function (d) {
        return d;
      })
      .enter().append("rect")
      .attr("y", function (d, i) {
        return yScale(d.data.city);
      })
      .attr("x", function (d) {
        return xScale(d[0]);
      })
      .attr("height", yScale.bandwidth())
      .attr("width", function (d) {
        return xScale(d[1]) - xScale(d[0])
      });


    g.append("g")
      .call(yAxis);
  },

});
