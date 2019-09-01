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
  classNames: ['tree-map'],
  init() {
    this._super(...arguments);
  },
  didReceiveAttrs() {
    this._super(...arguments);
  },
  didInsertElement() {
    const data = this.get("data");
    let result = data.reduce(function (r, a) {
      r[a.roleCategory] = r[a.roleCategory] || [];
      a.name = a.role;
      r[a.roleCategory].push(a);
      return r;
    }, Object.create(null));

    let groupedArray = [];
    for (let b in result) {
      groupedArray.push({
        "name": b,
        "children": result[b]
      })
    }

    let finalObject = {
      "name": "Whole",
      "children": groupedArray
    };

    var svg = select(this.$('.jolly').get(0)).attr('height', 500).attr('width', 500),
      width = svg.attr("width"),
      height = svg.attr("height");

    var fader = function (color) {
        return d3.interpolateRgb(color, "#fff")(0.2);
      },
      color = d3.scaleOrdinal().range(['#ef9a9a', '#f48fb1', '#b39ddb', '#90caf9', '#80deea', '#80cbc4', '#c5e1a5', '#fff59d', '#ffcc80', '#ffab91']),
      format = d3.format(",d");

    var treemap = d3.treemap()
      .tile(d3.treemapResquarify)
      .size([width, height])
      .round(true)
      .paddingInner(1);

    var root = d3.hierarchy(finalObject)
      .eachBefore(function (d) {
        d.data.id = (d.parent ? d.parent.data.id + "." : "") + d.data.name;
      })
      .sum(function (d) {
        return d.value;
      })
      .sort(function (a, b) {
        return b.height - a.height || b.value - a.value;
      });
    treemap(root);

    var cell = svg.selectAll("g")
      .data(root.leaves())
      .enter().append("g")
      .attr("transform", function (d) {
        return "translate(" + d.x0 + "," + d.y0 + ")";
      });
    cell.append("rect")
      .attr("id", function (d) {
        return d.data.id;
      })
      .attr("width", function (d) {
        return d.x1 - d.x0;
      })
      .attr("height", function (d) {
        return d.y1 - d.y0;
      })
      .attr("fill", function (d) {
        return color(d.parent.data.id);
      });
    cell.append("clipPath")
      .attr("id", function (d) {
        return "clip-" + d.data.id;
      })
      .append("use")
      .attr("xlink:href", function (d) {
        return "#" + d.data.id;
      });
    cell.append("text")
      .attr("clip-path", function (d) {
        return "url(#clip-" + d.data.id + ")";
      })
      .style("font-size", "8px")
      .selectAll("tspan")
      .data(function (d) {
        return d.data.role.split(/(?=[A-Z][^A-Z])/g);
      })
      .enter().append("tspan")
      .attr("x", 4)
      .attr("y", function (d, i) {
        return 13 + i * 10;
      })
      .text(function (d) {
        return d;
      });
    cell.append("title")
      .text(function (d) {
        return d.data.id + "\n" + format(d.value) + " $ per hour";
      });
    d3.selectAll("input")
      .data([sumBySize, sumByCount], function (d) {
        return d ? d.name : this.value;
      })
      .on("change", changed);
    var timeout = d3.timeout(function () {
      d3.select("input[value=\"sumByCount\"]")
        .property("checked", true)
        .dispatch("change");
    }, 2000);

    function changed(sum) {
      timeout.stop();
      treemap(root.sum(sum));
      cell.transition()
        .duration(750)
        .attr("transform", function (d) {
          return "translate(" + d.x0 + "," + d.y0 + ")";
        })
        .select("rect")
        .attr("width", function (d) {
          return d.x1 - d.x0;
        })
        .attr("height", function (d) {
          return d.y1 - d.y0;
        });
    }

    function sumByCount(d) {
      return d.children ? 0 : 1;
    }

    function sumBySize(d) {
      return d.value;
    }
  },

});
