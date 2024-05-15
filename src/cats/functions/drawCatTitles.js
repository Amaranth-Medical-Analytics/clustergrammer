import vectorize_label from "../../matrixLabels/vectorizeLabel";
import makeCatPositionArray from "../../cats/manager/makeCatPositionArray";
import { MAX_LABEL_LENGTH } from "../../matrixLabels/labels.const";

// function to create category title inside canvas
export function drawCatTitles(regl, store, inst_axis, text, catIndex) {
  const {
    labels,
    visualization: { viz_dim },
    network,
    order,
  } = store.selectAll();

  const catArrs = makeCatPositionArray(store, inst_axis);
  const sortedCatArrs = catArrs.sort();
  const finalPosition = sortedCatArrs[sortedCatArrs.length - 1];

  const numLabels = labels["num_" + inst_axis];

  let catWidth;
  let matSize;
  if (inst_axis === "col") {
    matSize = viz_dim.heat_size.x;
    catWidth = matSize / 0.5 / numLabels / 2;
  } else {
    matSize = viz_dim.heat_size.y;
    catWidth = viz_dim.heat_size.y / 0.5 / numLabels / 2;
  }

  let scaleText = 40;

  if (text.length > MAX_LABEL_LENGTH) {
    text = text.substring(0, MAX_LABEL_LENGTH) + "...";
  }
  const textMesh = vectorize_label(null, inst_axis, `<b>${text}</b>`, false);

  const xOffset = store.select("visualization").viz_dim.mat_size.x + 0.02;
  const rowXOffset = xOffset - 0.074;
  const rowYOffset = 0.18;
  const colXOffset = -0.06;
  const colYOffset = 0.081;

  // Define rotation angle for row
  if (inst_axis === "row") {
    const angle = Math.PI * 1.5;
    textMesh.positions = textMesh.positions.map((position) => {
      const newX =
        Math.cos(angle) * position[0] - Math.sin(angle) * position[1];
      const newY =
        Math.sin(angle) * position[0] + Math.cos(angle) * position[1];

      return [newX, newY];
    });
  }

  const vertArg = `
      precision mediump float;
      attribute vec2 position;

      uniform vec2 inst_offset;
      uniform float y_offset;
      uniform float x_offset;
      uniform float scale_text;
      uniform float heat_size;
      varying float x_position;
      varying float y_position;
      uniform float shift_heat;
      uniform int inst_axis;

      void main () {

        y_position = y_offset;

        if(inst_axis == 1){

          //col
          x_position = position.x/scale_text + inst_offset[0] + shift_heat - x_offset;
  
          y_position = -position.y/scale_text - inst_offset[1] - y_offset;
  
          gl_Position = vec4(x_position,
                             y_position,
                             0,
                             1.0);
  
        }
        else{

          //row

          x_position = position.x/scale_text - inst_offset[1] - x_offset;
  
          y_position = -position.y/scale_text + 2.0 * inst_offset[0] - y_offset;
  
          gl_Position =   
                        vec4(x_position,
                             y_position,
                             0,
                             1.0);
  
        }
      }`;

  const fragArg = `
      precision mediump float;
      void main () {
        gl_FragColor = vec4(0.2, 0.2, 0.2, 1.0);
      }`;

  regl({
    vert: vertArg,
    frag: fragArg,
    attributes: {
      position: textMesh.positions,
    },
    elements: textMesh.cells,
    uniforms: {
      inst_axis: inst_axis === "row" ? 0 : 1,
      inst_offset: [finalPosition[0], catIndex * -catWidth],
      scale_text: scaleText,
      x_offset: inst_axis === "row" ? rowXOffset : colXOffset,
      y_offset:
        inst_axis === "row"
          ? store.select("visualization").viz_dim.heat_size.y - rowYOffset
          : -store.select("visualization").viz_dim.heat_size.y + colYOffset,
      heat_size: store.select("visualization").viz_dim.heat_size.x,
      shift_heat:
        store.select("visualization").viz_dim.mat_size.x -
        store.select("visualization").viz_dim.heat_size.x,
    },
    depth: {
      enable: true,
      mask: true,
      func: "less",
      range: [0, 1],
    },
  })();
}
