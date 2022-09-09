import { select, selectAll } from "d3-selection";

export default (function display_and_position_tooltip(store) {
  // Display Tooltip
  // //////////////////////////////
  selectAll(".cgm-tooltip").style("display", "none");
  // display tooltip
  select(store.select("tooltip").tooltip_id)
    .style("opacity", 1)
    .style("display", "block")
    .style("z-index", 99);
  // Position Tooltip
  // //////////////////////////////
  // this is necessary to offset the tooltip correctly, probably due to the
  // padding in the tooltip or some related parameters
  // TODO: ???
  const magic_x_offset = 22;
  const d3_tip_width = parseFloat(
    select(store.select("tooltip").tooltip_id).style("width").replace("px", "")
  );
  const d3_tip_height = parseFloat(
    select(store.select("tooltip").tooltip_id).style("height").replace("px", "")
  );
  // need to set up custom positioning of the tooltip based on the mouseover type
  // upper left if on matrix-cell, upper right if on row label, lower left if on
  // column mouseover. Should be able to check store.select("tooltip").tooltip_type to
  // find out how to position the tooltip
  if (store.select("tooltip").tooltip_type === "matrix-cell") {
    select(store.select("tooltip").tooltip_id)
      .style("margin-left", function () {
        const total_x_offset =
          store.select("visualization").zoom_data.x.cursor_position -
          d3_tip_width +
          magic_x_offset;
        return total_x_offset + "px";
      })
      .style("margin-top", function () {
        const total_y_offset =
          store.select("visualization").zoom_data.y.cursor_position -
          d3_tip_height;
        return total_y_offset + "px";
      });
  } else if (store.select("tooltip").tooltip_type === "row-label") {
    select(store.select("tooltip").tooltip_id)
      .style("margin-left", function () {
        const total_x_offset = 150 + store.select("cat_data").row.length * 12;
        return total_x_offset + "px";
      })
      .style("margin-top", function () {
        const total_y_offset =
          store.select("visualization").zoom_data.y.cursor_position -
          d3_tip_height;
        return total_y_offset + "px";
      });
  } else if (store.select("tooltip").tooltip_type === "col-label") {
    select(store.select("tooltip").tooltip_id)
      .style("margin-left", function () {
        const total_x_offset =
          store.select("visualization").zoom_data.x.cursor_position -
          d3_tip_width +
          magic_x_offset;
        return total_x_offset + "px";
      })
      .style("margin-top", function () {
        const total_y_offset = 125 + store.select("cat_data").col.length * 12;
        return total_y_offset + "px";
      });
  } else if (store.select("tooltip").tooltip_type === "col-dendro") {
    select(store.select("tooltip").tooltip_id)
      .style("margin-left", function () {
        const total_x_offset =
          store.select("visualization").zoom_data.x.cursor_position -
          d3_tip_width / 2 +
          magic_x_offset;
        return total_x_offset + "px";
      })
      .style("margin-top", function () {
        const total_y_offset = 845 - d3_tip_height;
        return total_y_offset + "px";
      });
  } else if (store.select("tooltip").tooltip_type === "row-dendro") {
    select(store.select("tooltip").tooltip_id)
      .style("margin-left", function () {
        // var total_x_offset = params.visualization.zoom_data.x.cursor_position - d3_tip_width +
        //                      magic_x_offset;
        const total_x_offset = 870 - d3_tip_width;
        return total_x_offset + "px";
      })
      .style("margin-top", function () {
        const total_y_offset =
          store.select("visualization").zoom_data.y.cursor_position -
          d3_tip_height;
        return total_y_offset + "px";
      });
  } else if (store.select("tooltip").tooltip_type.includes("col-cat-")) {
    select(store.select("tooltip").tooltip_id)
      .style("margin-left", function () {
        const total_x_offset =
          store.select("visualization").zoom_data.x.cursor_position -
          d3_tip_width +
          magic_x_offset;
        return total_x_offset + "px";
      })
      .style("margin-top", function () {
        const total_y_offset = 125 + store.select("cat_data").col.length * 12;
        return total_y_offset + "px";
      });
  } else if (store.select("tooltip").tooltip_type.includes("row-cat-")) {
    select(store.select("tooltip").tooltip_id)
      .style("margin-left", function () {
        const total_x_offset = 150 + store.select("cat_data").row.length * 12;
        return total_x_offset + "px";
      })
      .style("margin-top", function () {
        const total_y_offset =
          store.select("visualization").zoom_data.y.cursor_position -
          d3_tip_height;
        return total_y_offset + "px";
      });
  }
});
