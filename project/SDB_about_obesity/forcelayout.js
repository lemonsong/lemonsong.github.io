var margin = {top: 0, right: 0, bottom: 10, left: 0},
    width = 800- margin.left - margin.right,
	height = 700- margin.top - margin.bottom;

var nodessize =  d3.scale.quantile()
	.domain([0,1,18])
	.range([0,2,6]),
	nodesstroke =  d3.scale.quantile()
	.domain([0,1,54])
	.range([0,1,9]),
	nodesopacity =  d3.scale.linear()
	.domain([1,65])
	.range([0.56,1]);

var strokeopacity =  d3.scale.quantile()
	.domain([1,32])
	.range([0.2,0.8]),
	strokewidth =  d3.scale.linear()
	.domain([1,32])
	.range([0.3,1.8]);

var distance = d3.scale.linear()
	.domain([1,32])
	.range([30,20]),
	graphcharge = d3.scale.linear()
	.domain([1,32])
	.range([-2,2]);

var force = d3.layout.force()
	.linkStrength(0.1)
	.friction(0.9)
	.linkStrength(0.3)
	.theta(0.8)
	.size([width, height*0.9]);


    
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
	.theta(0.1)
	//.friction(0)
	.start();

// Legend.
var legend = svg.selectAll(".legend")
    .data(['Number of papers published as first author',
    		'Number of paper published not as first author',
    		'Co-work in a same paper',
    		'Publish more than 9 papers as first author',
    		'Publish more than 23 papers',
    		'Co-work with more than 120 people'])
    .enter().append("g")
    .attr("class", "legend")
    .attr("transform", function(d, i) { return "translate(20," + (i * 15+20 ) + ")"; });

legend.append("text")
    .attr("x", 12)
    .attr("dy", ".31em")
    .text(function(d) { return d;})
    .attr("font-size", "12px")
    //.style("font-weight",300)
    .attr("fill",function (d){ 
        if (d === 'Number of papers published as first author')
        	return "#efee69";
        else if (d=== 'Number of paper published not as first author')
            return "#69adef";
        else if (d=== 'Co-work in a same paper')
            return "#999";
        else if (d === 'Publish more than 9 papers as first author')
            return "#efab69";
        else if (d=== 'Publish more than 23 papers')
            return "#ef696a";
        else
        	return "#ab69ef";})
    .style("text-shadow","1px 0px 4px #999");   
            
var link = svg.selectAll(".link")
	.data(graph.links)
	.enter().append("line")
	.attr("class", "link")
	.style("stroke-opacity", function(d) { return strokeopacity(d.weight); })
	.style("stroke-width", function(d) { return strokewidth(d.weight); });

var node = svg.selectAll(".node")
	.data(graph.nodes)
	.enter().append("g")
	.attr("class", "node")
	.call(force.drag);
	
	node.append("circle")
		.attr("r", function(d) { return nodessize(d.Countfirst); })
		.style("stroke-width",function(d) { return nodesstroke(d.Countother)+'px'; })
		//.style("stroke",'#f7fbfe')
		//.style("fill", '#69adef')
		.style("stroke",'#69adef')
		.style("fill", '#efee69')
		.style("opacity",function(d) { return nodesopacity(d.Count); });
	
	node.append("text")
		.text(function(d) {
		if (d.Countfirst>=9)//first author
		return d.name; })
		.attr("font-size", "12px")
		.attr("fill","#efab69");
	node.append("text")
		.text(function(d) {
		if (d.Count>=23)// total
		return d.name; })
		.attr("font-size", "12px")
		.attr("fill","#ef696a");
	node.append("text")
		.text(function(d) {
		if (d.Connections>=120)
		return d.name; })
		.attr("font-size", "12px")
		.attr("fill","#ab69ef");

force.on("tick", function() {
	link.attr("x1", function(d) { return d.source.x; })
		.attr("y1", function(d) { return d.source.y; })
		.attr("x2", function(d) { return d.target.x; })
		.attr("y2", function(d) { return d.target.y; });

	node.attr("transform", function(d) { return "translate(" + d.x + "," + d.y + ")"; });
});

});