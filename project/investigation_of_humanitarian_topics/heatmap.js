var margin = {top: 120, right: 60, bottom: 80, left: 280},
	width = 700 - margin.left - margin.right,
	height = 670 - margin.top - margin.bottom,
	//gridSize = Math.floor(width / 8),
	gridSize = Math.floor(height / 8),
	legendElementWidth = gridSize/9*6,
	buckets = 9,
	//colors = ["#ffffd9","#edf8b1","#c7e9b4","#7fcdbb","#41b6c4","#1d91c0","#225ea8","#253494","#081d58"], 
	colors = ["#efee69","#ceef69","#adef69","#8bef69","#69efcc","#69ceef","#69adef","#698bef","#696aef"], 
	topics = ["Gender",
		"Localizing preparedness and response",
		"Global action to address the finance gap",
		"Developing new approaches for managing recurrent and protected crises",
		"Adapting the humanitarian system to new contexts, actors, and challenges",
		"Ensuring affected people, particularly women, have a stronger voice and greater role in humanitarian action",
		"Confronting international humanitarian law ('IHL') violations and finding new ways to protect and assist people in conflict",
		"Creating an enabling environment and investment in innovation to better deal with current and future humanitarian challenges"],
	categories = ["Public Input","WHS Output","Stakeholder Group","National Context","Regional Context","Uncategorized"];
var numbery=d3.scale.ordinal()
		.domain(topics)
		.range([1,2,3,4,5,6,7,8])
var numberx=d3.scale.ordinal()
		.domain(categories)
		.range([1,2,3,4,5,6])
var numberr=d3.scale.linear()
		.domain([22,551])
		.range([8,legendElementWidth/1.7])
// Define the div for the tooltip
var heatmapdiv = d3.select("#heatmap").append("div")	
    .attr("class", "tooltip")
    .style("opacity", 0);
    
d3.csv("heatmapdata.csv", function(d) {
	return {
	Count:+d.Count,
	Topic:d.Topic,
	Category:d.Category
	};
},
function(error, data) {
	var colorScale = d3.scale.quantile()
			.domain([0, buckets - 1, d3.max(data, function (d) { return d.Count; })])
			.range(colors);

	var svg = d3.select("#heatmap").append("svg")
			.attr("width", width + margin.left + margin.right)
			.attr("height", height + margin.top + margin.bottom)
			.append("g")
			.attr("transform", "translate(" + margin.left + "," + margin.top + ")");

	var topcLabels = svg.selectAll(".topcLabel")
			.data(topics)
			.enter().append("text")
			.text(function (d) { return d; })
			.attr("x", -270)
			.attr("y", function (d, i) { return i * gridSize; })
			.style("text-anchor", "start")
			.attr("transform", "translate(-6," + gridSize / 1.5 + ")")
			.call(wrap,270, -0.8);

	var cateLabels = svg.selectAll(".cateLabel")
			.data(categories)
			.enter().append("text")
			.text(function(d) { return d; })
			.attr("x", function(d, i) { return i * gridSize; })
			.attr("y", 0)
			.style("writing-mode", "tb") // set the writing mode
			.style("glyph-orientation-vertical", 90)
			.attr("textLength", "110") // set text length
			.attr("lengthAdjust", "spacing")
			.attr("dy", ".50em")   
			.style("text-anchor", "end")
			.attr("transform", "rotate(90)")
			.attr("transform", "translate(" + gridSize / 2 + ", -6)");

	var heatMapText = svg.selectAll(".maptext")
			.data(data)
			.enter().append("text")
			.text(function(d) { return d.Count; })
			.attr("id", "maptext")
			.attr("x", function(d) { return (numberx(d.Category) -0.5) * gridSize; })
			.attr("y", function(d) { return (numbery(d.Topic) - 0.5) * gridSize; })
			.style("text-anchor", "middle")
			.style("font-size","138%")
			.style("fill", function(d) { return colorScale(d.Count); })
			.style("opacity",0);
			
	var heatMapCircle = svg.selectAll(".mapcircle")
			.data(data)
			.enter().append("circle")
			.attr("id", "mapcircle")
			.attr("cx", function(d) { return (numberx(d.Category) -0.5) * gridSize; })
			.attr("cy", function(d) { return (numbery(d.Topic) - 0.5) * gridSize; })
			.attr("r", function(d) { return numberr(d.Count); })
			//.attr("class", "circle bordered")
			.attr("stroke", "#c2ddf8")
			.attr("stroke-width","4px")
			.attr("width", gridSize)
			.attr("height", gridSize)
			.style("fill", colors[0]);

	//var heatMap = svg.selectAll(".hour")
	//    .data(data)
	//  .enter().append("rect")
	//.attr("x", function(d) { return (numberx(d.Category) -1) * gridSize; })
	//.attr("y", function(d) { return (numbery(d.Topic) - 1) * gridSize; })
	//.attr("rx", 4)
	//.attr("ry", 4)
	//.attr("class", "hour bordered")
	//.attr("width", gridSize)
	//.attr("height", gridSize)
	//.style("fill", colors[0]);

	heatMapCircle.transition()
		.duration(1000)
		.style("fill", function(d) { return colorScale(d.Count); });

	//heatMapCircle.append("title").text(function(d) { return d.Count+" files"; });
	// mouse event
	topcLabels.on('mouseover',function(d) {
		heatMapCircle.filter(function(m){return m.Topic === d;}).transition()
			.ease("circle-in")
			.duration("100").style('opacity',0);
		heatMapText.filter(function(n){return n.Topic === d;}).transition()
			.ease("out")
			.delay("100")
			.duration("200").style('opacity',1);
		d3.select(this).style("fill","#696aef");
	});
	
	topcLabels.on('mouseout',function(d) {
		heatMapCircle.filter(function(m){return m.Topic === d;}).transition()
			.ease("cubic-in")
			.delay("100")
			.duration("100").style('opacity',"1");
		heatMapText.filter(function(n){return n.Topic === d;}).transition()
			.ease("out")
			.duration("100").style('opacity',"0");
		d3.select(this).style("fill","black");
	});

	cateLabels.on('mouseover',function(d) {
		heatMapCircle.filter(function(m){return m.Category === d;}).transition()
			.ease("circle-in")
			.duration("100").style('opacity',0);
		heatMapText.filter(function(n){return n.Category === d;}).transition()
			.ease("out")
			.delay("100")
			.duration("200").style('opacity',1);
		d3.select(this).style("fill","#696aef");
	});
	
	cateLabels.on('mouseout',function(d) {
		heatMapCircle.filter(function(m){return m.Category === d;}).transition()
			.ease("cubic-in")
			.delay("100")
			.duration("100").style('opacity',"1");
		heatMapText.filter(function(n){return n.Category === d;}).transition()
			.ease("out")
			.duration("100").style('opacity',"0");
		d3.select(this).style("fill","black");
	});
	
	heatMapCircle.on('mouseover',function(d) {
		d3.select(this).attr("stroke","#efee69");
		heatmapdiv.transition()		
            .duration("200")		
            .style("opacity", .9)
            .style('border-color',d3.select(this).style("fill"));
        heatmapdiv.html('<strong>'+ d.Count + " " + d.Category + '</strong> files related to <strong>' + d.Topic + '</strong>')
            .style("left", (d3.select(this).attr("cx")) + "px")			 
            .style("top", (d3.select(this).attr("cy")) + "px")
            .style("visibility", "visible");
	});
	
	heatMapCircle.on('mouseout',function(d) {
		d3.select(this).attr("stroke","#c2ddf8");
		heatmapdiv.style("visibility","hidden");
	});
	// mouse event: end
	var legend = svg.selectAll(".legend")
			.data([0].concat(colorScale.quantiles()), function(d) { return d; })
			.enter().append("g")
			.attr("class", "legend");

	legend.append("rect")
			.attr("x", function(d, i) { return legendElementWidth * i; })
			.attr("y", height)
			.attr("width", legendElementWidth)
			.attr("height", gridSize / 2)
			.style("fill", function(d, i) { return colors[i]; });

	legend.append("text")
			.attr("class", "mono")
			.text(function(d) { return "≥ " + Math.round(d); })
			.attr("x", function(d, i) { return legendElementWidth * i; })
			.attr("y", height + gridSize);
});


function wrap(text, width,dyvalue) {
	text.each(function () {
		var text = d3.select(this),
			words = text.text().split(/\s+/).reverse(),
			word,
			line = [],
			lineNumber = 0,
			lineHeight = 1.1, // ems
			x = text.attr("x"),
			y = text.attr("y"),
			dy = dyvalue, //parseFloat(text.attr("dy")),
			tspan = text.text(null)
					.append("tspan")
					.attr("x", x)
					.attr("y", y)
					.attr("dy", dy + "em");
		while (word = words.pop()) {
			line.push(word);
			tspan.text(line.join(" "));
			if (tspan.node().getComputedTextLength() > width) {
				line.pop();
				tspan.text(line.join(" "));
				line = [word];
				tspan = text.append("tspan")
							.attr("x", x)
							.attr("y", y)
							.attr("dy", ++lineNumber * lineHeight + dy + "em")
							.text(word);
			}
		}
	});
}