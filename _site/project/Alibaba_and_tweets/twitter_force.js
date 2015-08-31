var width = 1260,
    height = 650;
    
var color = d3.scale.linear()
.domain([-0.6,0,0.9])
.range(['#B22B4A','#FFFFFF','#35B249'])

var stroke = d3.scale.ordinal()
    .domain(d3.range(["technology","business","news","internet","opinion","Other"]))
    .range(["#1b9e77","#d95f02","#7570b3","#e7298a","#66a61e","#e6ab02"]);

var size = d3.scale.linear()
.domain([1,141])
.range([25,60])

var force = d3.layout.force()
    .charge(-120)
    .linkDistance(30)
    .size([width, height]);

var svg = d3.select("body").append("svg")
    .attr("width", width)
    .attr("height", height);

//Set up tooltip
var tip = d3.tip()
    .attr('class', 'd3-tip')
    .offset([-10, 0])
    .html(function (d) {
    return  "<span style='color:#B3E855'>"+d.name+"</span> posted <span style='color:#B3E855'>"+d.Numer_of_tweets+"</span> tweets. Average polarity was </span><span style='color:#B3E855'>"+d.Polarity+"</span>";})

svg.call(tip);
//tip end

d3.json("data/twitters.json", function(error, graph) {

    force
      .nodes(graph.nodes)
      .links(graph.links)
      .start();

    var link = svg.selectAll(".link")
      .data(graph.links)
    .enter().append("line")
      .attr("class", "link")
      .style("stroke-width", function(d) { return Math.sqrt(d.value); });

    var gnodes = svg.selectAll('.node')
         .data(graph.nodes)
         .enter()
         .append('g')
         .classed('gnode', true);

    var node = gnodes.append("circle")
      .attr("class", "node")
          .attr("r", function(d,i) { return size(d.Numer_of_tweets); })
          .attr("stroke", function(d,i) { return stroke(d.Type); })
          .style("fill", function(d,i) { return color(d.Polarity); })
          .style("text", function(d,i) { return color(d.Polarity); })

          .call(force.drag)
          .on('mouseover', tip.show) //Added
          .on('mouseout', tip.hide); //Added 

    var labels = gnodes.append("text")
      .text(function(d,i) { return d.name.substring(0, size(d.Numer_of_tweets)/5); })
      .attr("dy", ".3em")
      .style("text-anchor", "middle")
            .attr("fill",function(d,i) { return stroke(d.Type);});

    console.log(labels);
//
//var node = svg.selectAll(".node")
  //    .data(graph.nodes)
   // .enter().append("circle")
     // .attr("class", "node")
//      .attr("r", function(d,i) { return size(d.Numer_of_tweets); })
  //    .attr("stroke", function(d,i) { return stroke(d.Type); })
    //  .style("fill", function(d,i) { return color(d.Polarity); })
      //.call(force.drag)
      //.on('mouseover', tip.show) //Added
      //.on('mouseout', tip.hide); //Added 



      force.on("tick", function() {
        link.attr("x1", function(d) { return d.source.x; })
            .attr("y1", function(d) { return d.source.y; })
            .attr("x2", function(d) { return d.target.x; })
            .attr("y2", function(d) { return d.target.y; });

      gnodes.attr("transform", function(d) { 
          return 'translate(' + [d.x, d.y] + ')';   });
       node.each(collide(3)); //Added 
       // node.attr("cx", function(d) { return d.x; })
         //   .attr("cy", function(d) { return d.y; });
      });
    //---Insert------
    // Resolves collisions between d and all other circles.
    var padding = 4, // separation between circles
        radius=10;

    function collide(alpha) {
      var quadtree = d3.geom.quadtree(graph.nodes);
      return function(d) {
        var rb = 2*radius + padding,
            nx1 = d.x - rb,
            nx2 = d.x + rb,
            ny1 = d.y - rb,
            ny2 = d.y + rb;
    
        quadtree.visit(function(quad, x1, y1, x2, y2) {
          if (quad.point && (quad.point !== d)) {
            var x = d.x - quad.point.x,
                y = d.y - quad.point.y,
                l = Math.sqrt(x * x + y * y);
              if (l < rb) {
              l = (l - rb) / l * alpha;
              d.x -= x *= l;
              d.y -= y *= l;
              quad.point.x += x;
              quad.point.y += y;
            }
          }
          return x1 > nx2 || x2 < nx1 || y1 > ny2 || y2 < ny1;
        });
      };
    }
    //---End Insert---
});