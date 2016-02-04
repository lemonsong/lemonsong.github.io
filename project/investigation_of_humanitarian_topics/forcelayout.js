var margin = {top: 0, right: 0, bottom: 10, left: 0},
    width = 800- margin.left - margin.right,
	height = 630- margin.top - margin.bottom;

var nodessize =  d3.scale.linear()
	.domain([3,206])
	.range([3,15]),
	color = d3.scale.ordinal()
	.domain(["Creating an enabling environment and investment in innovation to better deal with current and future humanitarian challenges",
	"Confronting international humanitarian law ('IHL') violations and finding new ways to protect and assist people in conflict",
	"Ensuring affected people, particularly women, have a stronger voice and greater role in humanitarian action",
	"Adapting the humanitarian system to new contexts, actors, and challenges",
	"Developing new approaches for managing recurrent and protected crises",
	"Global action to address the finance gap",
	"Localizing preparedness and response",
	"Gender"
	])
	.range(["#ef696a","#efee69","#69efee","#696aef","#efab69","#adef69","#ab69ef","#69adef"]);

var strokeopacity =  d3.scale.pow()
	.domain([1,153])
	.range([0.1,0.88]),
	strokewidth =  d3.scale.quantile()
	.domain([1,153])
	.range([0.3,1.8]);

var distance = d3.scale.linear()
	.domain([1,153])
	.range([50,600]),
	graphcharge = d3.scale.linear()
	.domain([1,153])
	.range([-50,50]);

var force = d3.layout.force()
	.linkStrength(0.1)
	.friction(0.9)
	.linkStrength(0.3)
	.theta(0.8)
	.size([width, height*0.9]);


// Define the div for the tooltip
var forcediv = d3.select("#forcelayout").append("div")	
    .attr("class", "tooltip")
    .style("opacity", 0)
    .style('margin-left','1cm');
    
var svg = d3.select("#forcelayout").append("svg")
	.attr("width", width)
	.attr("height", height);



d3.json("forcelayout.json", function(error, graph) {
	if (error) throw error;
	
force
	.nodes(graph.nodes)
	.links(graph.links)
	.linkDistance(function(d) { return distance(d.weight); })
	.charge(function(d) { return graphcharge(d.weight); })
	.start();

var link = svg.selectAll(".link")
	.data(graph.links)
	.enter().append("line")
	.attr("class", "link")
	.style("stroke-opacity", function(d) { return strokeopacity(d.weight); })
	.style("stroke-width", function(d) { return strokewidth(d.weight); });

var node = svg.selectAll(".node")
	.data(graph.nodes)
	.enter().append("circle")
	.attr("class", "node")
	.attr("r", function(d) { return nodessize(d.Count); })
	.style("fill", function(d) { return color(d.Topics); })
	.call(force.drag);



node.on('mouseover', function(d) {
	node.style('opacity',function(n) {
		if ( n === d)
			return 1;
		else
			return 0.5;
	});
	link.style('stroke-width', function(l) {
		if (d === l.source || d === l.target)
			return 4;
		else
			return 0.5;
	})
	.style('stroke', function(l) {
		if (d === l.source || d === l.target)
			return color(d.Topics);
		else
			return "#999";
	});
	forcediv.transition()		
        .duration("200")		
        .style("opacity", .8)
        .style('border-color',d3.select(this).style("fill"));
    forcediv.html('<strong>'+ d.Count + '</strong> files belong to<br><strong>' + d.Subtopic + '</strong> subtopic')
        .style("left", (d3.select(this).attr("cx")) + "px")			 
        .style("top", (d3.select(this).attr("cy")) + "px")
        .style("visibility", "visible");
});



// Set the stroke width back to normal when mouse leaves the node.
node.on('mouseout', function() {
	node.style('opacity',1);
	link.style('stroke-width', function(d) { return strokewidth(d.weight); })
		.style('stroke', "#999")
		.style("stroke-opacity", function(d) { return strokeopacity(d.weight); });
	forcediv.transition()		
        .duration("200")		
        .style("visibility", "hidden");
});


link.on('mouseover', function(d) {
	node.style('opacity', function(n) {
		if (d.source === n || d.target === n)
			return 1;
		else
			return 0.3;
	});
	link.style('stroke-width', function(l) {
		if (d.source  === l.source && d.target === l.target )
			return 4;
		else
			return 0.5;
	})
	.style('stroke-opacity', function(l) {
		if (d.source  === l.source && d.target === l.target )
			return 1;
		else
			return 0.2;
	});
	forcediv.transition()		
        .duration(200)
        .style("opacity", 0.8)
        .style('border-color','#999');
    forcediv.html('<strong>' + d.source.Subtopic + "</strong> and <strong>"
            + d.target.Subtopic+'</strong> have <strong>'+ d.weight 
            + "</strong> files in common")
        .style("left", (d3.select(this).attr("x")) + "px")			 
        .style("top", (d3.select(this).attr("y")) + "px")
        .style("visibility", "visible");
});

link.on('mouseout', function() {
	node.style('opacity',1);
	link.style('stroke-width', function(d) { return strokewidth(d.weight); })
		.style("stroke-opacity", function(d) { return strokeopacity(d.weight); });
	forcediv.transition()
	    .delay(200)	
        .duration(200)		
        .style("visibility", "hidden");
});

var legend = svg.selectAll(".legend")
	.data(color.domain())
	.enter().append("g")
	.attr("class", "legend")
	.attr("transform", function(d, i) { 
		yOff= height + (4-i)*25;
		xOff= width+30;
		return "translate("+xOff+"," + yOff + ")"; });

legend.append("rect")
	.attr("x", width - 18)
	.attr("width", 18)
	.attr("height", 18)
	.style("fill", color);

legend.append("text")
	.attr("x", width - 24)
	.attr("y", 9)
	.attr("dy", ".35em")
	.style("text-anchor", "end")
	.text(function(d) { return d; });

force.on("tick", function() {
	link.attr("x1", function(d) { return d.source.x; })
		.attr("y1", function(d) { return d.source.y; })
		.attr("x2", function(d) { return d.target.x; })
		.attr("y2", function(d) { return d.target.y; });

	node.attr("cx", function(d) { return d.x; })
		.attr("cy", function(d) { return d.y; });
});

});