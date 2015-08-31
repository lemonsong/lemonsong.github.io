var margin = {top: 10, right: 100, bottom: 55, left: 50},
    width = 1350 - margin.left - margin.right,
    height =420 - margin.top - margin.bottom;

var x = d3.scale.ordinal()
    .rangeRoundBands([0, width], .1);

var y = d3.scale.linear()
    .rangeRound([height, 0]);

var color = d3.scale.ordinal()
    .range(["#097ACC", "#CC0A00"]);

var xAxis = d3.svg.axis()
    .scale(x)
    .orient("bottom")
    .tickValues(['19-Sep-14','22-Sep-14','28-Oct-14','4-Nov-14','11-Nov-14','23-Dec-14','27-Jan-15','29-Jan-15','12-Mar-15'])
;

var yAxis = d3.svg.axis()
    .scale(y)
    .orient("left")
    .tickFormat(d3.format(".2s"));


var tip = d3.tip()
  .attr('class', 'd3-tip')
  .offset([-10, 0])
  .html(function(d) {
    return "<strong>"+d.name +":</strong><span style='color:red'>" + (-1*((d.y0) - (d.y1))) + "</span>" 
    //+ "<br> <strong>Percent:</strong> <span style='color:red'>" + "tbd" + "</span>"
    ;
  })
  

var svg = d3.select("body").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

svg.call(tip);

d3.csv("data/sum_of_attitude.csv", function(error, data) {
  color.domain(d3.keys(data[0]).filter(function(key) { return key !== "Date"; }));

  data.forEach(function(d) {
    var y0 = 0;
    d.types = color.domain().map(function(name) { return {name: name, y0: y0, y1: y0 += +d[name]}; });
    d.total = d.types[d.types.length - 1].y1;
  });

  //data.sort(function(a, b) { return b.total - a.total; });

  x.domain(data.map(function(d) { return d.Date; }));
  y.domain([0, d3.max(data, function(d) { return d.total; })]);

  svg.append("g")
      .attr("class", "x axis")
      .attr("transform", "translate(0," + height + ")")
      .call(xAxis)
      //rotate text and add hyperlink
      .selectAll("text")	
        .style("text-anchor", "end")
      .style("fill","#DE3378")
        .attr("dx", "-.8em")
        .attr("dy", ".15em")
        .attr("transform", function(d) {
            return "rotate(-35)"
        });

   d3.selectAll("text")
    .filter(function(d){ return typeof(d) == "string"; })
    .style("cursor", "pointer")
    .on("click", function(d){
        document.location.href = d+'.html';
    }); 

svg.append("g")
    .attr("class", "y axis")
    .call(yAxis)
    .style("fill","#DE3378")
    .append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 6)
      .attr("dy", ".71em")
      .style("text-anchor", "end")
      .style("fill", "#097ACC")
      .text("Attitude");

var date = svg.selectAll(".Date")
    .data(data)
    .enter().append("g")
        .attr("class", "g")
        .attr("transform", function(d) { return "translate(" + x(d.Date) + ",0)"; });

date.selectAll("rect")
  .data(function(d) { return d.types; })
  .enter().append("rect")
  
  //.attr("class", "bar")
  .attr("width", x.rangeBand())
  .attr("y", function(d) { return y(d.y1); })
  .attr("height", function(d) { return y(d.y0) - y(d.y1); })
  .style("fill", function(d) { return color(d.name); })
  //.on('click',clickMe)	  
  //.on('mouseover', tip.show)
  //.on('mouseout', tip.hide)
  .on("mouseover", function(d){
            tip.show(d) ;
            var xPos = parseFloat(d3.select(this).attr("x"));
            var yPos = parseFloat(d3.select(this).attr("y"));
            var height = parseFloat(d3.select(this).attr("height"))
            d3.select(this).attr("stroke","blue").attr("stroke-width",0.8)})
            
  .on("mouseout", function(d){
        tip.hide(d);
        d3.select(this).attr("stroke","pink").attr("stroke-width",0.2);})		
  


var legend = svg.selectAll(".legend")
  .data(color.domain().slice().reverse())
.enter().append("g")
  .attr("class", "legend")
  .attr("transform", function(d, i) { return "translate(75," + i * 20 + ")"; });

legend.append("rect")
  .attr("x", width - 58)
  .attr("width", 18)
  .attr("height", 18)
  .style("fill", color);

legend.append("text")
  .attr("x", width - 64)
  .attr("y", 9)
  .attr("dy", ".25em")
  .style("text-anchor", "end")
  .style("fill",color)
  .text(function(d) { return d; });
  
//function clickMe(){alert("name")}
});

