var margin0 = {top0: 5, right0: 100, bottom0: 80, left0: 50},
    width0 = 1350 - margin0.left0 - margin0.right0,
    height0 = 180 - margin0.top0 - margin0.bottom0;

var parseDate = d3.time.format("%d-%b-%y").parse;

var x0 = d3.time.scale().range([44, width0-44]);
var y2 = d3.scale.linear().range([height0, 0]);
var y3 = d3.scale.linear().range([height0, 0]);

var xAxis0 = d3.svg.axis().scale(x0)
    .orient("bottom").ticks(5);

var yAxisleft = d3.svg.axis().scale(y2)
    .orient("left").ticks(5);

var yAxisright = d3.svg.axis().scale(y3)
    .orient("right").ticks(5); 

var valueline = d3.svg.line()
    .x(function(d) { return x0(d.date2); })
    .y(function(d) { return y2(d.price); });
    
var valueline2 = d3.svg.line()
    .x(function(d) { return x0(d.date2); })
    .y(function(d) { return y3(d.count); });
  
var svg2 = d3.select("body")
    .append("svg")
        .attr("width", width0 + margin0.left0 + margin0.right0)
        .attr("height", height0 + margin0.top0 + margin0.bottom0)
    .append("g")
        .attr("transform", "translate(" + margin0.left0 + "," + margin0.top0 + ")");

// Get the data
d3.csv("data/price.csv", function(error, data) {
    data.forEach(function(d) {
        d.date2 = parseDate(d.date2);
        d.price = +d.price;
        d.count = +d.count;
    });

    // Scale the range of the data
    x0.domain(d3.extent(data, function(d) { return d.date2; }));
    y2.domain([d3.min(data, function(d) {
		return Math.min(d.price); })
		, d3.max(data, function(d) {
		return Math.max(d.price); })]); 
    y3.domain([d3.min(data, function(d) { 
		return Math.min(d.count); })
		, d3.max(data, function(d) { 
		return Math.max(d.count); })]);

    svg2.append("path")        // Add the valueline path.
        .style("stroke", "#097ACC")
        .attr("d", valueline(data))
        ;

    svg2.append("path")        // Add the valueline2 path.
        .style("stroke", "#CC0A00")
        .attr("d", valueline2(data));

    svg2.append("g")            // Add the X Axis
        .attr("class", "x axis")
        .attr("transform", "translate(0," + height0 + ")")
        .call(xAxis0)
        .selectAll("text")	
        .style("text-anchor", "end")
      .style("fill","#DE3378")
        .attr("dx", "-.8em")
        .attr("dy", ".15em")
        .attr("transform", function(d) {
            return "rotate(-35)"
        });

    svg2.append("g")
        .attr("class", "y axis")
        .style("fill", "#097ACC")
        .call(yAxisleft)
        .append("text")
            .attr("transform", "rotate(-90)")
            .attr("y", 6)
            .attr("dy", ".71em")
            .style("text-anchor", "end")
            .style("fill", "#097ACC")
            .text("Stock Price");

    svg2.append("g")				
        .attr("class", "y axis")	
        .attr("transform", "translate(" + width0 + " ,0)")	
        .style("fill", "#CC0A00")		
        .call(yAxisright)
        .append("text")
            .attr("transform", "rotate(-90)")
            .attr("y", 6)
            .attr("dy", "-.71em")
            .style("text-anchor", "end")
            .style("fill", "#CC0A00")
            .text("Number of Tweets");

});