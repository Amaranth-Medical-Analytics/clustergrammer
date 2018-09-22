module.exports = function calc_cursor_relative(zoom_data, viz_dim_heat){

  var cursor_relative = {};

  // tracking cursor position relative to the minimum
  cursor_relative.min = zoom_data.cursor_position - viz_dim_heat.min - zoom_data.viz_offcenter;

  /* Cursor restriction does not seem to be doing anything */

  // restrict cursor_relative.min
  if (cursor_relative.min < 0){
    cursor_relative.min = 0;
    // console.log('LOWER than min ############################')
  } else if (cursor_relative.min > viz_dim_heat.max){
    cursor_relative.min = viz_dim_heat.max;
    // console.log('HIGHER than min ############################')
  }

  // tracking cursor position relative to the maximum
  /* trying to fix zoom in outside of matrix and zoom out inside of matrix bugn */
  cursor_relative.max = viz_dim_heat.max + zoom_data.heat_offset - zoom_data.cursor_position +  zoom_data.viz_offcenter;

  // restrict cursor_relative.max
  if (cursor_relative.max < 0){
    cursor_relative.max = 0;
    // console.log('LOWER than max ############################')
  } else if (cursor_relative.max > viz_dim_heat.max + zoom_data.heat_offset){
    cursor_relative.max = viz_dim_heat.max + zoom_data.heat_offset;
    // console.log('HIGHER than max ############################')
  }

  return cursor_relative;

}