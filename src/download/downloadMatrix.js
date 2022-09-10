import { saveAs } from "file-saver";

import make_matrix_string from "./makeMatrixString";

export default (function download_matrix(store) {
  const matrix_string = make_matrix_string(store);
  const blob = new Blob([matrix_string], { type: "text/plain;charset=utf-8" });
  let file_type = store.select("download").delimiter_name;
  if (file_type === "tuple") {
    file_type = "tsv";
  }
  saveAs(blob, "clustergrammer." + file_type);
});
