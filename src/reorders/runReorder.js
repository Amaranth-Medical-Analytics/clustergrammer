import { select } from "d3-selection";
import { cloneDeep } from "lodash";
import updateTextTriangleOrder from "../matrixLabels/updateTextTriangleOrder";
import reorderCatArgs from "./reorderCatArgs";
import reorderMatrixArgs from "./reorderMatrixArgs";

export default (function runReorder(
  regl,
  store,
  catArgsManager,
  camerasManager,
  inst_axis,
  ini_new_order
) {
  const dispatch = store.dispatch;
  const new_order = ini_new_order
    .replace("sum", "rank")
    .replace("var", "rankvar");
  if (new_order !== "clust") {
    select("." + inst_axis + "_dendro_slider_svg").style("display", "none");
  }

  dispatch(store.actions.mutateAnimationState({ run_animation: true }));
  dispatch(
    store.actions.mutateOrderState({
      new: {
        [inst_axis]: new_order,
      },
    })
  );
  reorderMatrixArgs(regl, store, camerasManager);
  reorderCatArgs(store, catArgsManager);

  const reorderedState = store.selectAll();
  const newVisualizationState = cloneDeep(reorderedState.visualization);
  // either update the existing draw text_triangles or trash them
  if (
    newVisualizationState.text_triangles.draw[inst_axis] !== false &&
    reorderedState.labels["num_" + inst_axis] <=
      reorderedState.visualization.max_num_text
  ) {
    newVisualizationState.text_triangles.draw[inst_axis] =
      updateTextTriangleOrder(store, inst_axis);
  } else {
    newVisualizationState.text_triangles.draw[inst_axis] = false;
  }
  dispatch(store.actions.setVisualizationState(newVisualizationState));
});
