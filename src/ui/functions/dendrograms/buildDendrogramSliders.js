import { select } from "d3-selection";
import * as _ from "underscore";
import buildSingleDendroSlider from "./buildSingleDendroSlider";
import { DENDROGRAM_SLIDER_LENGTH } from "./dendrogram.draw.const";

export default function build_dendrogram_sliders(regl, store) {
  // Add sliders on top of the canvas
  // ///////////////////////////////////
  // slider containers
  let axis_slider_container;
  // hardwiring dendro slider position
  _.each(["row", "col"], function (inst_axis) {
    axis_slider_container = select(
      store.select("visualization").rootElementId + " .canvas-container"
    )
      .append("svg")
      .style("height", DENDROGRAM_SLIDER_LENGTH + "px")
      .style("width", "20px")
      .style("position", "absolute")
      .attr("class", inst_axis + "_dendro_slider_svg")
      .attr("transform", function () {
        if (inst_axis === "col") {
          return "rotate(-90) scale(-1,1)";
        }
      })
      .style("-webkit-transform", function () {
        if (inst_axis === "col") {
          return "rotate(-90deg) scale(-1,1)";
        }
      });
    if (inst_axis === "row") {
      axis_slider_container.style("right", "-40px").style("top", "80px");
    } else {
      axis_slider_container.style("left", "110px").style("bottom", "-65px");
    }
    buildSingleDendroSlider(regl, store, inst_axis);
  });
}
