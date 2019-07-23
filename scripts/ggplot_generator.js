Blockly.JavaScript['ggplot_histogram'] = function(block) {
  
  var argument0 =  Blockly.JavaScript.valueToCode(block, 'Columns', Blockly.JavaScript.ORDER_NONE)
  argument0 = argument0.replace(/row./gi, "")
  var argument1 =  block.getFieldValue("bins")
  
  var histogram = `SPLIT 
  let spec = {
    "width": 700,
    "height": 200,
    "data": { "values": dfArray },
    "mark": "bar",
    "encoding": {
      "x": { "bin": {"maxbins": ${argument1}}, "field": "${argument0}", "type": "quantitative"},
      "y": { "aggregate": "count", "type": 'quantitative'},
      "tooltip": null

    }
  }
  vegaEmbed("#plotOutput", spec, {})`
  return histogram
};

Blockly.JavaScript['ggplot_bar'] = function(block) {
  
    var argument0 =  Blockly.JavaScript.valueToCode(block, 'X', Blockly.JavaScript.ORDER_NONE)
    argument0 = argument0.replace(/row./gi, "")
    var argument1 =  Blockly.JavaScript.valueToCode(block, 'Y', Blockly.JavaScript.ORDER_NONE);
    argument1 = argument1.replace(/row./gi, "")

    var bar = `SPLIT 
    let spec = {
      "width": 700,
      "height": 200,
      "data": { "values": dfArray },
      "mark": "bar",
      "encoding": {
      "x": {"field": "${argument0}", "type": "ordinal"},
      "y": {"field": "${argument1}", "type": "quantitative"},
      "tooltip": {"field": "${argument1}", "type": "quantitative"}
    }
  }  
    vegaEmbed("#plotOutput", spec, {})`
   console.log(bar)
  return bar
  };


  Blockly.JavaScript['ggplot_box'] = function(block) {
  
    var argument0 =  Blockly.JavaScript.valueToCode(block, 'X', Blockly.JavaScript.ORDER_NONE)
    argument0 = argument0.replace(/row./gi, "")
    var argument1 =  Blockly.JavaScript.valueToCode(block, 'Y', Blockly.JavaScript.ORDER_NONE);
    argument1 = argument1.replace(/row./gi, "")

    var bar = `SPLIT 
    let spec = {
      "width": 700,
      "data": { "values": dfArray },
        "mark": {
          "type": "boxplot",
          "extent": 1.5
        },
        "encoding": {
          "x": {"field": "${argument0}","type": "ordinal"},
          "y": {
            "field": "${argument1}",
            "type": "quantitative",
          }
        }
      }
    vegaEmbed("#plotOutput", spec, {})`
   console.log(bar)
  return bar
  };

  Blockly.JavaScript['ggplot_scatter'] = function(block) {
  
    var argument0 =  Blockly.JavaScript.valueToCode(block, 'X', Blockly.JavaScript.ORDER_NONE)
    argument0 = argument0.replace(/row./gi, "")
    var argument1 =  Blockly.JavaScript.valueToCode(block, 'Y', Blockly.JavaScript.ORDER_NONE);
    argument1 = argument1.replace(/row./gi, "")

    var argument2 = Blockly.JavaScript.valueToCode(block, 'color', Blockly.JavaScript.ORDER_NONE);
    argument2 = argument2.replace(/row./gi, "")
    
    var bar = []

    if (block.getFieldValue('lm') == 'FALSE') {
      bar = `SPLIT 
      let spec = {
        "width": 700,
        "data": { "values": dfArray },
        "mark": "point",
        "encoding": {
          "x": {"field": "${argument0}","type": "quantitative"},
          "y": {"field": "${argument1}","type": "quantitative"},
          "color": {"field": "${argument2}", "type": "nominal"}
        }
      }
      vegaEmbed("#plotOutput", spec, {})`
  
     console.log(bar)
     return bar
     
  } else {
  
  bar = `SPLIT
    var result = dfArray.reduce(function(obj, current) { //Reduce the array to an object
      Object.keys(current).forEach(function(key) { //Each key
          obj[key] = obj[key] || []; //Has to be an array if not exists
          obj[key] = Array.isArray(obj[key]) ? obj[key] : [obj[key]]; //Has to be an array if not an array
          obj[key].push(current[key]); //Add current item to array of matching key
      });
      return obj; //Continue to the next object in the array
  });
  
  function findLineByLeastSquares(values_x, values_y) {
      var x_sum = 0;
      var y_sum = 0;
      var xy_sum = 0;
      var xx_sum = 0;
      var count = 0;
  
      /*
       * The above is just for quick access, makes the program faster
       */
      var x = 0;
      var y = 0;
      var values_length = values_x.length;
  
      if (values_length != values_y.length) {
          throw new Error('The parameters values_x and values_y need to have same size!');
      }
  
      /*
       * Above and below cover edge cases
       */
      if (values_length === 0) {
          return [ [], [] ];
      }
  
      /*
       * Calculate the sum for each of the parts necessary.
       */
      for (let i = 0; i< values_length; i++) {
          x = values_x[i];
          y = values_y[i];
          x_sum+= x;
          y_sum+= y;
          xx_sum += x*x;
          xy_sum += x*y;
          count++;
      }
  
      /*
       * Calculate m and b for the line equation:
       * y = x * m + b
       */
      var m = (count*xy_sum - x_sum*y_sum) / (count*xx_sum - x_sum*x_sum);
      var b = (y_sum/count) - (m*x_sum)/count;
  
      // solve for x and y intercept
      return [m, b]
  }
  
  const lineDat = findLineByLeastSquares(result.${argument0}, result.${argument1})

    let spec = {
      "width": 700,
      "layer": [
      { 
         "data": { "values": dfArray },
          "mark": "point",
          "encoding": {
            "x": {"field": "${argument0}","type": "quantitative"},
            "y": {"field": "${argument1}","type": "quantitative"},
            "color": {"field": "${argument2}", "type": "nominal"}
          }
      },
        {
          "data": {
            "values": [
              {"x": 0, "y": lineDat[1]},
              {"x": Math.max.apply(Math, result.${argument0}), 
              "y": (Math.max.apply(Math, result.${argument0}))*lineDat[0]+lineDat[1]}
            ]
          },
          "mark": {"type": "line"},
          "encoding": {
            "x": {"type": "quantitative", "field": "x"},
            "y": {"type": "quantitative", "field": "y"},
            "color": {"value": "red"}
          }
        }
      ]
    }
    
    vegaEmbed("#plotOutput", spec, {})`

  console.log(bar)
  return bar

  }
}