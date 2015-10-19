// Create the dc.js chart objects & link to div
var topicChart = dc.rowChart("#dc-topic");
var authorChart = dc.rowChart("#dc-author");
var magazineChart = dc.rowChart("#dc-magazine");
var orgChart = dc.rowChart("#dc-org");
var locationChart = dc.rowChart("#dc-location");

var yearChart = dc.barChart("#dc-number");
var dataTable = dc.dataTable("#dc-table-graph");

// load data from a csv file
d3.csv("obesity.csv", function (data) {
	var yearformat = d3.format(".0f");

	data.forEach(function(d) { 
		d.Id   = +d.Id;
		d.Title  = d.Title;
		d.Year   = yearformat(d.Year);
		d.Magazine = d.Magazine;
		d.Author = d.Author;
		d.Topic = +d.Topic;
	});

	// Run the data through crossfilter and load our 'facts'
	var facts = crossfilter(data);
	var all = facts.groupAll();
	// count all the facts
	dc.dataCount(".dc-data-count")
		.dimension(facts)
		.group(all);

	//topic
	var topicDimension = facts.dimension(function (d) {
		var tpc = d.Topic;
		switch (tpc) {
			case 0:
			return "0.gh;imt;craniofacial;osa;osahs;dimensions;pws;cephalometric;soft;maxillomandible";
			case 1:
			return "1.osa;cardiovascular;disease;apnea;osas;syndrome;obstructive;hypertension;treatment;airway";
			case 2:
			return "2.osas;cpap;+/-;p;osa;0;patients;treatment;airway;pulmonary";
			case 3:
			return "3.osa;cardiovascular;osas;hypertension;inflammation;patients;bradyarrhythmia;disease;+/-;0";
			case 4:
			return "4.pickwick;stroke;syndrome;aspects;disorders;imbalance;advancements;modifiable;snoring;pathogenesis";
			case 5:
			return "5.apap;erectile;vfa;siblings;prader;willi;workers;pws;wl;hypothalamic";
		}
	});

	var topicGroup = topicDimension.group().reduceCount(function(d) { return d.Topic; });

	topicChart.width(300)
		.height(220)
		.margins({top: 5, left: 10, right: 10, bottom: 20})
		.dimension(topicDimension)
		.group(topicGroup)
		//.colors(d3.scale.category10())
		.ordinalColors(["#efee69","#efab69","#ef696a","#ab69ef","#696aef","#69adef","#69efee","#adef69"])
		.label(function (d){
			return d.key.split(".")[0];
		})
		.title(function(d){return d.value;})
		.elasticX(true)
		.xAxis().ticks(4);

	//Author
	var authorDimension = facts.dimension(function (d) { return d.Author;});

	var authorGroup = authorDimension.group().reduceCount(function(d) { return d.Author; });

	authorChart.width(300)
		.height(80000)
		.margins({top: 5, left: 10, right: 10, bottom: 20})
		.dimension(authorDimension)
		.group(authorGroup)
		.ordinalColors(["#efee69","#efab69","#ef696a","#ab69ef","#696aef","#69adef","#69efee","#adef69"])
		.label(function (d){
			return d.key;
		})
		.title(function(d){return d.value;})
		.elasticX(true)
		.xAxis().ticks(4);
	authorChart.ordering(function(d){ return -d.value });

	//Magazine
	var magazineDimension = facts.dimension(function (d) { return d.Magazine;});

	var magazineGroup = magazineDimension.group().reduceCount(function(d) { return d.Magazine; });

	magazineChart.width(300)
		.height(30000)
		.margins({top: 5, left: 10, right: 10, bottom: 20})
		.dimension(magazineDimension)
		.group(magazineGroup)
		.ordinalColors(["#efee69","#efab69","#ef696a","#ab69ef","#696aef","#69adef","#69efee","#adef69"])
		.label(function (d){
			return d.key;
		})
		.title(function(d){return d.value;})
		.elasticX(true)
		.xAxis().ticks(4);
	magazineChart.ordering(function(d){ return -d.value });
	
	//Organization
	var orgDimension = facts.dimension(function (d) {return d.Organization;});

	var orgGroup = orgDimension.group().reduceCount(function(d) { return d.Organization; });

	orgChart.width(300)
		.height(30000)
		.margins({top: 5, left: 10, right: 10, bottom: 20})
		.dimension(orgDimension)
		.group(orgGroup)
		.ordinalColors(["#efee69","#efab69","#ef696a","#ab69ef","#696aef","#69adef","#69efee","#adef69"])
		.label(function (d){
			return d.key;
		})
		.title(function(d){return d.value;})
		.elasticX(true)
		.xAxis().ticks(4);
	orgChart.ordering(function(d){ return -d.value });
	
	//Location
	var locationDimension = facts.dimension(function (d) {return d.Location;});

	var locationGroup = locationDimension.group().reduceCount(function(d) { return d.Location; });

	locationChart.width(300)
		.height(30000)
		.margins({top: 5, left: 10, right: 10, bottom: 20})
		.dimension(locationDimension)
		.group(locationGroup)
		.ordinalColors(["#efee69","#efab69","#ef696a","#ab69ef","#696aef","#69adef","#69efee","#adef69"])
		.label(function (d){
			return d.key;
		})
		.title(function(d){return d.value;})
		.elasticX(true)
		.xAxis().ticks(4);
	locationChart.ordering(function(d){ return -d.value });

	//Number of Articles by Year
	var yearDimension = facts.dimension(function(d) {
		return d.Year;
	});
	var yearGroup = yearDimension.group().reduceCount(function(d) { return d.Year; });

	yearChart.width(960)
		.height(180)
		.margins({top: 10, right: 20, bottom: 20, left: 40})
		.dimension(yearDimension)
		.group(yearGroup)
		.transitionDuration(500)
		.elasticY(true)
		.x(d3.scale.linear().domain(d3.extent(data, function(d) { return d.Year; })))
		.xAxis();
	yearChart.colors("#69adef");


	// Create dataTable dimension
	var titleDimension = facts.dimension(function (d) {
		return d.Title;
	});

	// Table of article data
	dataTable.width(960).height(800)
		.dimension(titleDimension)
		.group(function(d) { return d.Year
		})
		.size(200)//Maximun number of lines
		.columns([
			function(d) { return d.Id; },
			function(d) { return d.Title; },
			function(d) { return d.Year; },
			function(d) { return d.Magazine; },
			function(d) { return d.Author; },
			function(d) { return d.Topic; },
			function(d) { 
				return '<a href="http://www.ncbi.nlm.nih.gov/pubmed/' + 
				d.Id+'">Abstract</a>';}
		])
		.sortBy(function(d){ return d.Year; })
		.order(d3.descending);


	// Render the Charts
	dc.renderAll();

});