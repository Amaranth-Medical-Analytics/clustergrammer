var m3 = require('./mat3_transform');

module.exports = function make_tooltip_text_args(regl, params, zoom_function){

  // prevent text from getting too large when zooming
  params.text_scale.row = d3.scale.linear()
      .domain([1, 10])
      .range([1, 10/params.allowable_zoom_factor]);

  var total_zoom = params.zoom_data.y.total_zoom;

  // smaller scale_text -> larger text
  var limited_scaling = params.text_scale.row(total_zoom);
  var scale_text = 40; //params.text_zoom.row.scaled_num * params.text_scale.row(total_zoom);

  // scale_text is applying a zoom to x and y
  // needs to be scaled by scale_text
  var mat_rotate = m3.rotation(Math.PI/2);

  var vert_arg = `
      precision mediump float;
      attribute vec2 position;
      uniform vec2 offset;
      uniform float x_offset;
      uniform float scale_text;
      uniform mat3 mat_rotate;
      uniform float heat_size;
      varying float x_position;
      varying float y_position;
      varying float shift_text;
      uniform float shift_heat;
      uniform float limited_scaling;

      // vec3 tmp = vec3(1,1,1);

      void main () {

        // reverse y position to get words to be upright

        shift_text = -1.0;

        // the x position is constant for all row labels
        //-----------------------------------------------
        // x_position = position.x +
        //              x_offset * scale_text +
        //              shift_text * limited_scaling;

        x_position =  position.x;

        // the y position varies for all row labels
        //-----------------------------------------------
        // y_position = -position.y + 2.0 * offset[1] * scale_text * heat_size - shift_heat * scale_text ;
        y_position = -position.y;

        gl_Position =
                      vec4(
                           x_position,
                           y_position,
                           // depth
                           0.50,
                           scale_text);
      }`;

  var frag_arg =  `
      precision mediump float;
      void main () {
        gl_FragColor = vec4(0.2, 0.2, 0.2, 1.0);
      }`;

  var args = {
    vert: vert_arg,
    frag: frag_arg,
    attributes: {
      position: regl.prop('positions')
    },
    elements: regl.prop('cells'),
    uniforms: {
      offset: regl.prop('offset'),
      scale_text: scale_text,
      limited_scaling: limited_scaling,
      x_offset: -params.mat_size.x,
      heat_size: params.heat_size.y,
      shift_heat: params.mat_size.y - params.heat_size.y,
      mat_rotate: mat_rotate
    },
    depth: {
      enable: true,
      mask: true,
      func: 'less',
      // func: 'greater',
      range: [0, 1]
    },
  };

  return args;

};