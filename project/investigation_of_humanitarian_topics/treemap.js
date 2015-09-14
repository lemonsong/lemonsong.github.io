var treemargin = {top: 10, right: 0, bottom: 10, left: 0},
    treewidth = 1200 - treemargin.left - treemargin.right,
    treeheight = 630 - treemargin.top - treemargin.bottom;

// var color = d3.scale.category20c();

var treecolor = d3.scale.ordinal()
            .domain(["hashtag",
            "location","funding","organization","politics","other",
            "life","humanity","social","peace","culture",
            "person","event","economics","media","thing"
            ])
            .range(["#fafafa",
            "#ef696a","#efee69","#69efee","#696aef","#efab69",
            "#adef69","#ab69ef","#69adef","#ef696a","#efee69",
            "#69efee","#696aef","#efab69","#adef69","#ab69ef",
            "#69adef","#ef696a","#efee69","#69efee","#696aef",
            "#efab69","#adef69","#ab69ef","#69adef","#ef696a",
            "#efee69","#69efee","#696aef","#efab69","#adef69",
            "#ab69ef","#69adef"]);


// Define the div for the tooltip
var treemapdiv = d3.select("#treemap").append("div")
                .style("opsition","relative")	
                .attr("class", "tooltip")
                .style("opacity", 0);

var treemap = d3.layout.treemap()
                .size([treewidth, treeheight])
                .sticky(true)
                .value(function(d) { return d.count; });


var div = d3.select("#treemap").append("div")
            .style("position", "relative")
            .style("width", (treewidth + treemargin.left + treemargin.right) + "px")
            .style("height", (treeheight + treemargin.top + treemargin.bottom) + "px")
            .style("left", treemargin.left + "px")
            .style("top", treemargin.top + "px");

d3.json("hashtagdata.json", function(error, root) {
    if (error) throw error;


    var Treenode = div.datum(root).selectAll(".node")
                    .data(treemap.nodes)
                    .enter().append("div")
                    .attr("class", "square")
                    .call(position)
                    .style("background", function(d) { return d.children ?  treecolor(d.name):null; })
                    .text(function(d) { return d.children ? null : d.name; })
                    .style("font-family", 'Yantramanav')
                    .style("text-shadow", "1px 0px 4px #fff")
                    .style("font-weight",'500');

    Treenode.on('mouseover',function(d) {
        treemapdiv.transition()		
                .duration("200")		
                .style("opacity", .9)
                .style('border-color',"#999");
        treemapdiv.html('<strong>#'+d.name+ '</strong> appears <strong>' + d.count + '</strong> times')
                .style("left", d3.select(this).style("left") )			 
                .style("top", d3.select(this).style("top") )
                .style("visibility", "visible");
    });

    Treenode.on('mouseout',function(d) {
        treemapdiv.style("visibility","hidden");
    });


});

function position() {
    this.style("left", function(d) { return d.x + "px"; })
        .style("top", function(d) { return d.y+ "px"; })
        .style("width", function(d) { return Math.max(0, d.dx+2 ) + "px"; })
        .style("height", function(d) { return Math.max(0, d.dy +2) + "px"; });
}