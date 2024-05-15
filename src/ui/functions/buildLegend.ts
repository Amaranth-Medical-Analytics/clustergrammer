import { flatten } from "lodash";
import rgbArrayToString from "../../colors/rgbArrayToString";
import { ClustergrammerProps } from "../../index.types";
import { NamespacedStore } from "../../state/store/store";
import customRound from "../../utils/customRound";
import { CANVAS_CONTAINER_CLASSNAME } from "../ui.const";

export const LEGEND_HEIGHT = "50%";
export const LEGEND_WIDTH = "30px";

export const buildLegend = (store: NamespacedStore) => {
  const args = store.select("args") as ClustergrammerProps;
  const colors = store.select("cat_viz").mat_colors;
  const mat = store.select("network").mat;
  const flatMat = flatten<number>(mat);
  const min = customRound(Math.min(...flatMat), 2);
  const max = customRound(Math.max(...flatMat), 2);
  const containerId = store.select("visualization").rootElementId;

  const legend = document.createElement("div");
  legend.id = `${containerId}-legend`;
  legend.style.height = args.legend?.height
    ? String(args.legend?.height)
    : LEGEND_HEIGHT;
  legend.style.width = LEGEND_WIDTH;
  legend.style.position = "absolute";
  legend.style.top = args.legend?.y ? String(args.legend?.y) : "0";
  const side = args.legend?.side ?? "left";
  legend.style[side] = `calc(-${LEGEND_WIDTH} + ${args.legend?.x ?? "0px"}`;
  legend.style.display = "flex";
  legend.style.flexDirection = "column";
  legend.style.alignItems = "center";
  legend.style.justifyContent = "flex-end";
  legend.style.fontSize = "0.8rem";

  const legendColors = document.createElement("div");
  legendColors.id = `${legend.id}-colors`;
  legendColors.style.height = "50%";
  legendColors.style.width = `calc(${LEGEND_WIDTH} * 0.5)`;
  legendColors.style.background = "white";
  const maxColor = max > 0 ? rgbArrayToString(colors.pos_rgb) : "";
  const minColor = min < 0 ? rgbArrayToString(colors.neg_rgb) : "";
  const gradient = `linear-gradient(
    ${maxColor && `${maxColor}, `}
    white
    ${minColor && `, ${minColor}`}
  )`;
  legendColors.style.backgroundImage = gradient;

  legend.innerHTML += "<b><p>Max</p></b>";
  legend.append(document.createTextNode(`${flatMat ? max : "-"}`));
  legend.append(legendColors);
  legend.append(document.createTextNode(`${flatMat ? min : "-"}`));
  legend.innerHTML += "<b><p>Min</p></b>";

  const canvasContainer = document.querySelector(
    `${containerId} .${CANVAS_CONTAINER_CLASSNAME}`
  );

  if (canvasContainer) {
    canvasContainer.appendChild(legend);
  }
};
