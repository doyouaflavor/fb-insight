var statArray=null;
getStatObjFromDate=function(strDate){
	timestamp=(new Date(strDate)).getTime()
	for (var i = 0; i < statArray.length; i++) {
		if(timestamp>=statArray[i].timeFrom&&timestamp<statArray[i].timeTo)
			return statArray[i]
	};
	return null
}
/*
$(document).ready(function() {
	d3.csv("http://junsuwhy.github.io/swim-to-green-island/data.csv",function(){
		console.log("yo");
	})
});

*/

$(function(){
    update_form();
    $('input').change(update_form);
});

function update_form(){
    xaxis = $('input:radio[name=xaxis]:checked').val();
    yaxis = $('input:radio[name=yaxis]:checked').val();
    group_tag = $('input:radio[name=group]:checked').val();

    update_graph();
}

function update_graph(){
    $('svg').remove();
    
    var margin = {top: 20, right: 20, bottom: 30, left: 40},
        width = 960 - margin.left - margin.right,
        height = 500 - margin.top - margin.bottom;

    /* 
     * value accessor - returns the value to encode for a given data object.
     * scale - maps value to a visual display encoding, such as a pixel position.
     * map function - maps from data value to display value
     * axis - sets up axis
     */ 

    // http://bl.ocks.org/weiglemc/6185069

    // setup fill color
    var cValue = function(d) {
        /*
        if( d['Post Message'].search("剛勇") > -1){
            return "剛勇"
        }else if( d['Post Message'].search("阿德") > -1){
            return "阿德"
        }else if( d['Post Message'].search("大伯") > -1){
            return "大伯"
        }else if( d['Post Message'].search("小寶") > -1){
            return "小寶"
        }else{
            return "0"
        }*/

        /*
        if( d['Post Message'].search("校長") > -1){
            return "校長"
        }else if( d['Post Message'].search("小明") > -1){
            return "小明"
        }else if( d['Post Message'].search("小樺") > -1){
            return "小樺"
        }else if( d['Post Message'].search("阿美") > -1){
            return "阿美"
        }else{
            return "0"
        }
        */

        return d[group_tag];
    },
        color = d3.scale.category10();
        color(1);

    // setup x 
    var xValue = function(d) { return d[xaxis];}, // data -> value
        xScale = d3.scale.linear().range([0, width]), // value -> display
        xMap = function(d) { return xScale(xValue(d));}, // data -> display
        xAxis = d3.svg.axis().scale(xScale).orient("bottom");

    // setup y
    var yValue = function(d) { return d[yaxis];}, // data -> value
        yScale = d3.scale.linear().range([height, 0]), // value -> display
        yMap = function(d) { return yScale(yValue(d));}, // data -> display
        yAxis = d3.svg.axis().scale(yScale).orient("left");

    // add the graph canvas to the body of the webpage
    var svg = d3.select("body").append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
      .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    // add the tooltip area to the webpage
    var tooltip = d3.select("body").append("div")
        .attr("class", "tooltip")
        .style("opacity", 0);

    // load data
    d3.csv("data.csv", function(error, data) {

      // change string (from CSV) into number format
      data.forEach(function(d) {
    //    d.like = +d.like;
    //    d["share"] = +d["share"];
    //    console.log(d);
      });

      // don't want dots overlapping axis, so add in buffer to data domain
      xScale.domain([d3.min(data, xValue)-1, d3.max(data, xValue)+1]);
      yScale.domain([d3.min(data, yValue)-1, d3.max(data, yValue)+1]);

      // x-axis
      svg.append("g")
          .attr("class", "x axis")
          .attr("transform", "translate(0," + height + ")")
          .call(xAxis)
        .append("text")
          .attr("class", "label")
          .attr("x", width)
          .attr("y", -6)
          .style("text-anchor", "end")
          .text(xaxis);

      // y-axis
      svg.append("g")
          .attr("class", "y axis")
          .call(yAxis)
        .append("text")
          .attr("class", "label")
          .attr("transform", "rotate(-90)")
          .attr("y", 6)
          .attr("dy", ".71em")
          .style("text-anchor", "end")
          .text(yaxis);

      // draw dots
      svg.selectAll(".dot")
          .data(data)
        .enter().append("a")
          .attr("xlink:href",function(d){return d['Permalink']})
          .attr("target","_blank")
          .append("circle")
          .attr("class", "dot")
          .attr("r", 3.5)
          .attr("cx", xMap)
          .attr("cy", yMap)
          .style("fill", function(d) { return color(cValue(d));}) 
          .on("mouseover", function(d) {
              tooltip.transition()
                   .duration(200)
                   .style("opacity", .9);
              tooltip.html(function(){
                  var text = "(" + xaxis + ":" + xValue(d) + ", " + yaxis + ":" + yValue(d) + ")<br/>"; 
                  text += d['Post Message'].substring(0,100) + "...";
                  return text;
              })
                   .style("left", (d3.event.pageX + 5) + "px")
                   .style("top", (d3.event.pageY - 28) + "px");
          })
          .on("mouseout", function(d) {
              tooltip.transition()
                   .duration(500)
                   .style("opacity", 0);
          });

      // draw legend
      var legend = svg.selectAll(".legend")
          .data(color.domain())
        .enter().append("g")
          .attr("class", "legend")
          .attr("transform", function(d, i) { return "translate(0," + i * 20 + ")"; });

      // draw legend colored rectangles
      legend.append("rect")
          .attr("x", width - 18)
          .attr("width", 18)
          .attr("height", 18)
          .style("fill", color);

      // draw legend text
      legend.append("text")
          .attr("x", width - 24)
          .attr("y", 9)
          .attr("dy", ".35em")
          .style("text-anchor", "end")
          .text(function(d) { return d;})
    });



    /*
    google.load('visualization', '1.1', {packages: ['scatter']});
    google.setOnLoadCallback(function() {
    $(document).ready(function() {
        xmlhttp=new XMLHttpRequest();
        xmlhttp.open("GET","data.csv",true);
        xmlhttp.send();

        xmlhttp.onreadystatechange=function(e){
            if(xmlhttp.readyState==4){
                xmlDoc=xmlhttp.responseText;
                var data = CSVToArray(xmlDoc);
                newData = new Array();
                newData.push(['like','share']);
                for(var i = 1; i < data.length; i++){
                    newData.push([ parseInt(data[i][7]), parseInt(data[i][8]) ]);
                }

                drawChart();



            }

        };
    });

    });
    */
}

function drawChart() {
        var data = google.visualization.arrayToDataTable(newData);

        var options = {
          title: 'Like and Share comparison',
          hAxis: {title: 'Like', minValue: 0, maxValue: 50},
          vAxis: {title: 'Share', minValue: 0, maxValue: 50},
          legend: 'none'
        };

        var chart = new google.charts.Scatter (document.getElementById('chart_div'));

        chart.draw(data, options);
      }



function CSVToArray( strData, strDelimiter ){
        // Check to see if the delimiter is defined. If not,
        // then default to comma.
        strDelimiter = (strDelimiter || ",");

        // Create a regular expression to parse the CSV values.
        var objPattern = new RegExp(
            (
                // Delimiters.
                "(\\" + strDelimiter + "|\\r?\\n|\\r|^)" +

                // Quoted fields.
                "(?:\"([^\"]*(?:\"\"[^\"]*)*)\"|" +

                // Standard fields.
                "([^\"\\" + strDelimiter + "\\r\\n]*))"
            ),
            "gi"
            );


        // Create an array to hold our data. Give the array
        // a default empty first row.
        var arrData = [[]];

        // Create an array to hold our individual pattern
        // matching groups.
        var arrMatches = null;


        // Keep looping over the regular expression matches
        // until we can no longer find a match.
        while (arrMatches = objPattern.exec( strData )){

            // Get the delimiter that was found.
            var strMatchedDelimiter = arrMatches[ 1 ];

            // Check to see if the given delimiter has a length
            // (is not the start of string) and if it matches
            // field delimiter. If id does not, then we know
            // that this delimiter is a row delimiter.
            if (
                strMatchedDelimiter.length &&
                strMatchedDelimiter !== strDelimiter
                ){

                // Since we have reached a new row of data,
                // add an empty row to our data array.
                arrData.push( [] );

            }

            var strMatchedValue;

            // Now that we have our delimiter out of the way,
            // let's check to see which kind of value we
            // captured (quoted or unquoted).
            if (arrMatches[ 2 ]){

                // We found a quoted value. When we capture
                // this value, unescape any double quotes.
                strMatchedValue = arrMatches[ 2 ].replace(
                    new RegExp( "\"\"", "g" ),
                    "\""
                    );

            } else {

                // We found a non-quoted value.
                strMatchedValue = arrMatches[ 3 ];

            }


            // Now that we have our value string, let's add
            // it to the data array.
            arrData[ arrData.length - 1 ].push( strMatchedValue );
        }

        // Return the parsed data.
        var returnData = new Array();
        var arrItem = new Array();
        for(var i = 1;i<arrData.length;i++){
            for(var j = 0; j< arrData[0].length; j++){
                arrItem[arrData[0][j]] = arrData[i][j];
            }
            returnData.push(arrData);
            
        }
    
    
        return( returnData );
    }