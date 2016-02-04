var margin = {top: 40, right: 40, bottom: 90, left: 280},
width = 600 - margin.left - margin.right,
height = 3960 - margin.top - margin.bottom;

var xscale=d3.scale.linear()
    .domain([-0.321438795,1.254075157])
    .range([30,width]);
    
//var yscale = d3.scale.linear()
//.domain([0,283221,5172931,21098099,1377064907])
//.range([height, height*3/4, height/2, height/4,0]);

var yscale = d3.scale.ordinal()
        .domain(["Afghanistan","Albania","Algeria","American Samoa","Andorra","Angola","Anguilla","Antigua and Barbuda","Argentina",
        "Armenia","Aruba","Australia","Austria","Azerbaijan","Bahamas","Bahrain","Bangladesh","Barbados","Belarus","Belgium","Belize","Benin",
        "Bermuda","Bhutan","Bolivia","Bosnia and Herzegovina","Botswana","Brazil","British Virgin Islands","Brunei Darussalam","Bulgaria","Burkina Faso",
        "Burundi","Cambodia","Cameroon","Canada","Cape Verde","Cayman Islands","Central African Republic","Chad","Channel Islands","Chile",
        "China","China, Hong Kong Special Administrative Region","China, Macao Special Administrative Region","Colombia","Comoros","Congo",
        "Cook Islands","Costa Rica","Cote d'Ivoire","Croatia","Cuba","Cyprus","Czech Republic","Czechoslovakia [former]","Democratic Republic of the Congo","Denmark",
        "Djibouti","Dominica","Dominican Republic","Ecuador","Egypt","El Salvador","Equatorial Guinea","Eritrea","Estonia","Ethiopia",
        "European Union (EU)","Faeroe Islands","Falkland Islands (Malvinas)","Fiji","Finland","France","French Guiana","French Polynesia","Gabon",
        "Gambia","Georgia","Germany","Ghana","Gibraltar","Greece","Greenland","Grenada","Guadeloupe","Guam","Guatemala","Guinea","Guinea-Bissau",
        "Guyana","Haiti","Honduras","Hungary","Iceland","India","Indonesia","Iran (Islamic Republic of)","Iraq","Ireland","Israel","Italy",
        "Jamaica","Japan","Jordan","Kazakhstan","Kenya","Kiribati","Korea, Democratic People's Republic of","Korea, Republic of","Kuwait","Kyrgyzstan",
        "Lao People's Democratic Republic","Latvia","Lebanon","Lesotho","Liberia","Libyan Arab Jamahiriya","Liechtenstein","Lithuania","Luxembourg",
        "Madagascar","Malawi","Malaysia","Maldives","Mali","Malta","Marshall Islands","Martinique","Mauritania","Mauritius","Mayotte","Mexico",
        "Micronesia, Federated States of","Monaco","Mongolia","Montenegro","Montserrat","Morocco","Mozambique","Myanmar","Namibia","Nauru",
        "Nepal","Netherlands","Netherlands Antilles","New Caledonia","New Zealand","Nicaragua","Niger","Nigeria","Niue","Northern Mariana Islands","Norway",
        "Oman","Pakistan","Palau","Panama","Papua New Guinea","Paraguay","Peru","Philippines","Poland","Portugal","Puerto Rico","Qatar","Republic of Moldova",
        "Reunion","Romania","Russian Federation","Rwanda","Saint Helena","Saint Kitts and Nevis","Saint Lucia","Saint Pierre and Miquelon","Saint Vincent and the Grenadines",
        "Samoa","San Marino","Sao Tome and Principe","Saudi Arabia","Senegal","Serbia","Serbia and Montenegro","Seychelles","Sierra Leone","Singapore",
        "Slovakia","Slovenia","Solomon Islands","Somalia","South Africa","South Sudan","Spain","Sri Lanka","State of Palestine","Sudan","Sudan (former)",
        "Suriname","Swaziland","Sweden","Switzerland","Syrian Arab Republic","Tajikistan","Thailand","The former Yugoslav Republic of Macedonia","Timor-Leste",
        "Togo","Tokelau","Tonga","Trinidad and Tobago","Tunisia","Turkey","Turkmenistan","Turks and Caicos Islands","Tuvalu","Uganda","Ukraine",
        "Union of Soviet Socialist Republics [former]","United Arab Emirates","United Kingdom","United Republic of Tanzania","United States","United States Virgin Islands",
        "Uruguay","Uzbekistan","Vanuatu","Venezuela","Viet Nam","Wallis and Futuna Islands","Western Sahara","Yemen","Yugoslavia [former Socialist Federal Republic]","Zambia","Zimbabwe"])
        .rangePoints([0,height]);

var r=height/190;
var prin1scale=d3.scale.linear()
    .domain([-2.86497,8.32178])
    .range([r/4,r]);
var prin2scale=d3.scale.linear()
    .domain([-1.24657,24.15191])
    .range([r/4,r]);
var prin3scale=d3.scale.linear()
    .domain([-6.32967,15.75851])
    .range([r/4,r]);
var prin4scale=d3.scale.linear()
    .domain([-3.20290,5.86939])
    .range([r/4,r]);

// Define the div for the tooltip
var stardiv = d3.select("#stargraph").append("div")	
    .attr("class", "tooltip")
    .style("opacity", 0);
    
    
    
d3.csv("pcadata.csv", function(d) {
    return {
    Country:d.Country,
    IsLDC2014:+d.IsLDC2014,
    Prin1:+d.Prin1,
    Prin2:+d.Prin2,
    Prin3:+d.Prin3,
    Prin4:+d.Prin4,
    Population:+d.Population2012,
    predLDC:d.predLDC
    };
},
function(error, data) {

    
var svg = d3.select("#stargraph").append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")")
        .attr("fill","#0c3d6d");

// Legend.
var legend = svg.selectAll(".legend")
    .data(['Country is not LDC','Country is LDC'])
    .enter().append("text")
    .text(function(d) { return d;})
    .attr("transform", function(d, i) { return "translate(" +(i*180+25) + ", -15 )"; })
    .style("fill","#b5d6f7")
    .style("font-weight",700);
// Legend.
var starlegend = svg.selectAll("g.legend")
    .data(['Real LDC Classification','Prediction of LDC'])
    .enter().append("svg:g")
    .attr("class", "legend")
    .attr("transform", function(d, i) { return "translate(-250," + (i * 20-10 ) + ")"; });

starlegend.append("polygon")
    .attr("points","0,-8 -3,-3 -8,0 -3,3 0,8 3,3 8,0 3,-3")
    .style("fill",function (d){ 
        if (d === 'Real LDC Classification')
            return "#f9f9cc";
        else
            return "#ecec59";});

starlegend.append("svg:text")
    .attr("x", 12)
    .attr("dy", ".31em")
    .text(function(d) { return d;})
    .style("font-weight",300)
    .style("fill",function (d){ 
        if (d === 'Real LDC Classification')
            return "#f9f9cc";
        else
            return "#ecec59";});

var connect = svg.selectAll(".star")
        .data(data)
        .enter().append("polygon")
        .attr("id", "connect")
        .style("fill", "#ecec59") 
        .style("opacity",0.15)    // remove any fill colour
        .attr("points", function(d){
        return (xscale(d.IsLDC2014)-prin2scale(d.Prin2)/3)+','+(yscale(d.Country)-prin1scale(d.Prin1)/3)+' '+
                (xscale(d.IsLDC2014)-prin2scale(d.Prin2)/3)+','+(yscale(d.Country)+prin3scale(d.Prin3)/3)+' '+
                (xscale(d.IsLDC2014)-prin2scale(d.Prin2)/3)+','+(yscale(d.Country)-prin1scale(d.Prin1)/3)+' '+
                (xscale(d.IsLDC2014)-prin2scale(d.Prin2)/3)+','+(yscale(d.Country)+prin3scale(d.Prin3)/3);})
        .transition()
        .delay("100")
        .duration("1200")
        .attr("points", function(d){
        return (xscale(d.IsLDC2014)-prin2scale(d.Prin2)/3)+','+(yscale(d.Country)-prin1scale(d.Prin1)/3)+' '+
                (xscale(d.IsLDC2014)-prin2scale(d.Prin2)/3)+','+(yscale(d.Country)+prin3scale(d.Prin3)/3)+' '+
                xscale(d.predLDC)+','+(yscale(d.Country)+prin3scale(d.Prin3))+' '+
                xscale(d.predLDC)+','+(yscale(d.Country)-prin1scale(d.Prin1));});

var realldc = svg.selectAll(".star")
        .data(data)
        .enter().append("polygon")
        .attr("id", "realldc")
        .style("fill", "#f9f9cc")     // remove any fill colour
        .attr("points", function(d){
        return xscale(d.IsLDC2014)+','+(yscale(d.Country)-prin1scale(d.Prin1))+' '+
                (xscale(d.IsLDC2014)-prin2scale(d.Prin2)/3)+','+(yscale(d.Country)-prin1scale(d.Prin1)/3)+' '+
                (xscale(d.IsLDC2014)-prin2scale(d.Prin2))+','+yscale(d.Country)+' '+
                (xscale(d.IsLDC2014)-prin2scale(d.Prin2)/3)+','+(yscale(d.Country)+prin3scale(d.Prin3)/3)+' '+
                xscale(d.IsLDC2014)+','+(yscale(d.Country)+prin3scale(d.Prin3))+' '+
                (xscale(d.IsLDC2014)+prin4scale(d.Prin4)/3)+','+(yscale(d.Country)+prin3scale(d.Prin3)/3)+' '+
                (xscale(d.IsLDC2014)+prin4scale(d.Prin4))+','+yscale(d.Country)+' '+
                (xscale(d.IsLDC2014)+prin4scale(d.Prin4)/3)+','+(yscale(d.Country)-prin1scale(d.Prin1)/3);});
                
                
var predldc = svg.selectAll(".star")
        .data(data)
        .enter().append("polygon")
        .attr("id", "predldc")
        .style("fill", "#e0df19")     // remove any fill colour
        .attr("points", function(d){
        return xscale(d.IsLDC2014)+','+(yscale(d.Country)-prin1scale(d.Prin1))+' '+
                (xscale(d.IsLDC2014)-prin2scale(d.Prin2)/3)+','+(yscale(d.Country)-prin1scale(d.Prin1)/3)+' '+
                (xscale(d.IsLDC2014)-prin2scale(d.Prin2))+','+yscale(d.Country)+' '+
                (xscale(d.IsLDC2014)-prin2scale(d.Prin2)/3)+','+(yscale(d.Country)+prin3scale(d.Prin3)/3)+' '+
                xscale(d.IsLDC2014)+','+(yscale(d.Country)+prin3scale(d.Prin3))+' '+
                (xscale(d.IsLDC2014)+prin4scale(d.Prin4)/3)+','+(yscale(d.Country)+prin3scale(d.Prin3)/3)+' '+
                (xscale(d.IsLDC2014)+prin4scale(d.Prin4))+','+yscale(d.Country)+' '+
                (xscale(d.IsLDC2014)+prin4scale(d.Prin4)/3)+','+(yscale(d.Country)-prin1scale(d.Prin1)/3);})
        .transition()
        .delay("100")
        .duration("1200")
        .style("fill", "#ecec59")     // remove any fill colour
        .attr("points", function(d){
        return xscale(d.predLDC)+','+(yscale(d.Country)-prin1scale(d.Prin1))+' '+
                (xscale(d.predLDC)-prin2scale(d.Prin2)/3)+','+(yscale(d.Country)-prin1scale(d.Prin1)/3)+' '+
                (xscale(d.predLDC)-prin2scale(d.Prin2))+','+yscale(d.Country)+' '+
                (xscale(d.predLDC)-prin2scale(d.Prin2)/3)+','+(yscale(d.Country)+prin3scale(d.Prin3)/3)+' '+
                xscale(d.predLDC)+','+(yscale(d.Country)+prin3scale(d.Prin3))+' '+
                (xscale(d.predLDC)+prin4scale(d.Prin4)/3)+','+(yscale(d.Country)+prin3scale(d.Prin3)/3)+' '+
                (xscale(d.predLDC)+prin4scale(d.Prin4))+','+yscale(d.Country)+' '+
                (xscale(d.predLDC)+prin4scale(d.Prin4)/3)+','+(yscale(d.Country)-prin1scale(d.Prin1)/3);});

                
var countrylabel = svg.selectAll(".countrylabel")
        .data(data)
        .enter().append("text")
        .text(function(d) { return d.Country; })
        .attr("x", 15)
        .attr("y",function(d) { return  yscale(d.Country); })
        .attr("dy", ".50em")   
        .style("text-anchor", "end")
        .style("fill","#b5d6f7")
        .style("font-weight",300);

countrylabel.on('mouseover',function(d) {
    d3.select(this).style("fill","#e0df19");
    stardiv.transition()		
        .duration("200")		
        .style("opacity", .9)
        .style('border-color',d3.select(this).style("fill"));
    stardiv.html('<strong>'+ d.Country +'</strong>' + '<br>Prin1 '+ d.Prin1  + '<br>Prin2 '+ d.Prin2 + '<br>Prin3 '+ d.Prin3 + '<br>Prin4 '+ d.Prin4)
        .style("right","330px")			 
        .style("top", d3.select(this).attr("y")+"px")
        //.attr("transform", "translate(" + p.x + "," + p.y + ")")
        .style("visibility", "visible");
});

countrylabel.on('mouseout',function(d) {
    d3.select(this).style("fill","#b5d6f7");
    stardiv.style("visibility","hidden");
});



realldc.append("title").text(function(d) { return d.Country; });




});