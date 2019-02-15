module.exports = function cat_breakdown_values(params, cat_graph_group, cat_bar_groups, num_nodes_index, is_downsampled, count_offset, bars_index, cluster_total){

  var bar_width = params.viz.cat_bar_width;
  var bar_height = params.viz.cat_bar_height;
  var offset_ds_count = 150;
  var binom_pval_index = 6;

  // Count Title
  cat_graph_group
    .append('text')
    .text('Count')
    .attr('transform', function(){
      var i_x = bar_width + count_offset;
      return 'translate('+ i_x +', 0)';
    });

  // Percentage Title
  cat_graph_group
    .append('text')
    .text('Pct')
    .attr('transform', function(){
      var i_x = bar_width + count_offset + 60;
      return 'translate('+ i_x +', 0)';
    });

  // Percentage Title
  cat_graph_group
    .append('text')
    .text('P-val')
    .attr('transform', function(){
      var i_x = bar_width + count_offset + 115;
      return 'translate('+ i_x +', 0)';
    });

  // Count Downsampled Title
  if (is_downsampled){
    cat_graph_group
      .append('text')
      .text('Clusters')
      .attr('transform', function(){
        var i_x = bar_width + offset_ds_count ;
        return 'translate('+ i_x +', 0)';
      });
  }

  // Counts
  /////////////////////////////
  var shift_count_num = 35;

  cat_bar_groups
    .append('text')
    .classed('count_labels', true)
    .text(function(d){
      var i_count = d[bars_index];
      i_count = i_count.toLocaleString();
      return String(i_count);
    })
    .attr('transform', function(){
      var i_x = bar_width + count_offset + shift_count_num;
      var i_y = 0.75 * bar_height;
      return 'translate('+ i_x +', ' + i_y + ')' ;
    })
    .attr('font-family', '"Helvetica Neue", Helvetica, Arial, sans-serif')
    .attr('font-weight', 400)
    .attr('text-anchor', 'end');


  // Percentage
  //////////////////////
  cat_bar_groups
    .append('text')
    .classed('count_labels', true)
    .text(function(d){
      // calculate the percentage relative to the current cluster
      var i_count = d[bars_index] / cluster_total * 100;
      i_count = Math.round(i_count * 10)/10;
      i_count = i_count.toLocaleString();
      return String(i_count);
    })
    .attr('transform', function(){
      var i_x = bar_width + count_offset + shift_count_num + 47;
      var i_y = 0.75 * bar_height;
      return 'translate('+ i_x +', ' + i_y + ')' ;
    })
    .attr('font-family', '"Helvetica Neue", Helvetica, Arial, sans-serif')
    .attr('font-weight', 400)
    .attr('text-anchor', 'end');

  // Binomial Test Pvals
  cat_bar_groups
    .append('text')
    .classed('count_labels', true)
    .text(function(d){
      var i_count = d[binom_pval_index];

      if (i_count<0.001){
        i_count = parseFloat(i_count.toPrecision(3));
        i_count = i_count.toExponential();
      } else {
        i_count = parseFloat(i_count.toPrecision(2));
      }
      return i_count;
    })
    .attr('transform', function(){
      var i_x = bar_width + count_offset + shift_count_num + 112;
      var i_y = 0.75 * bar_height;
      return 'translate('+ i_x +', ' + i_y + ')' ;
    })
    .attr('font-family', '"Helvetica Neue", Helvetica, Arial, sans-serif')
    .attr('font-weight', 400)
    .attr('text-anchor', 'end');

  if (is_downsampled){

    cat_bar_groups
      .append('text')
      .classed('count_labels', true)
      .text(function(d){
        return String(d[num_nodes_index].toLocaleString());
      })
      .attr('transform', function(){
        // downsampled cluster numbers are smaller and need less flexible offsetting
        var i_x = bar_width + shift_count_num + offset_ds_count  + 20;
        var i_y = 0.75 * bar_height;
        return 'translate('+ i_x +', ' + i_y + ')' ;
      })
      .attr('font-family', '"Helvetica Neue", Helvetica, Arial, sans-serif')
      .attr('font-weight', 400)
      .attr('text-anchor', 'end');

  }

};