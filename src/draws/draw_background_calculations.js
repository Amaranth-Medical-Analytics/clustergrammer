var draw_commands = require('./draw_commands');
var vectorize_label = require('./../matrix_labels/vectorize_label');

module.exports = function draw_background_calculations(regl, params){

  /*

    Set up something to run background calculations if
    necessary when the visualization is not being updated. For instance,
    we could calculate the text triangles of all rows a little at a time
    in the background.

  */

  var updated_labels = false;
  _.each(['row', 'col'], function(inst_axis){
    if (params.label_high_queue[inst_axis].length > 0){

      var inst_name = params.label_high_queue[inst_axis][0];

      if (inst_name in params.text_triangles[inst_axis] === false){

        params.text_triangles[inst_axis][inst_name] = vectorize_label(params, inst_axis, inst_name);
        updated_labels = true;

        console.log(inst_name, params.label_high_queue[inst_axis].length)

        /*
          updated the text_triangles axis, but need to update the draw
        */

      } else {
        console.log('already found triangle', params.label_high_queue[inst_axis].length)
      }
    }
  });

  // run draw in the same loop, do not wait until next animation loop
  if (updated_labels){
    // console.log('draw updated labels')
    draw_commands(regl, params);
  }

};