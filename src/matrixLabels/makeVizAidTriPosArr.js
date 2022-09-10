export default (function make_viz_aid_tri_pos_arr(store, inst_axis) {
  const inst_order = store.select("order").inst[inst_axis];
  const num_labels = store.select("labels")["num_" + inst_axis];
  let heat_size;
  let tri_width;
  let heat_shift;
  // keep positioned at matrix not heatmap (make room for categories)
  // making triangle smaller
  if (inst_axis === "row") {
    heat_size = store.select("visualization").viz_dim.heat_size.y;
    tri_width = heat_size / num_labels;
    heat_shift =
      store.select("visualization").viz_dim.mat_size.y -
      store.select("visualization").viz_dim.heat_size.y;
  } else {
    heat_size = store.select("visualization").viz_dim.heat_size.x;
    tri_width = heat_size / num_labels;
    heat_shift = -(
      store.select("visualization").viz_dim.mat_size.x -
      store.select("visualization").viz_dim.heat_size.x
    );
  }
  // make viz_aid triangle array
  // ///////////////////////////////
  const tri_offset_array = [];
  let i;
  let inst_index;
  let order_index;
  for (i = 0; i < num_labels; i++) {
    order_index = store.select("network")[inst_axis + "_nodes"][i][inst_order];
    if (inst_axis === "row") {
      inst_index = num_labels - order_index - 1;
    } else {
      inst_index = order_index;
    }
    // shift the viz aid triangles because of smaller size of the heatmap
    tri_offset_array[i] = heat_size - heat_shift - 2 * tri_width * inst_index;
  }
  return tri_offset_array;
});
