var data = "";
var data2 = "";
    d3.json("/data/neighborhoods.json").then((jsonData) => {
            data = jsonData
            for (var i = 0; i < data.features.length; i++) {
                var obj = data.features[i];
                obj.population = Math.floor(Math.random() * (750000 - 500)) + 500
                obj.listings = Math.floor(Math.random() * (200 - 50)) + 50
                obj.costPerNight = Math.floor(Math.random() * (140 - 30)) + 30
                data.features[i] = obj;
            }
            console.log(data)
        })
        .then(function() {


        var width = 960;
        var height = 580;
        d3.csv('/data/population.csv').then((data) => {
            console.log(data)
        })
        let tooltip = d3.select("body")
        .append("div")
        .attr("class", "tooltip")
        .style("opacity", 0);
        
        var svg = d3.select( "body" )
        .append( "svg" )
        .attr( "width", width )
        .attr( "height", height );

        var g = svg.append( "g" );

        var albersProjection = d3.geoAlbers()
            .scale( 190000 ) //19000
            .rotate( [122.3321,0] ) //replace longitude
            .center( [0, 47.608013] ) //and lat with seattle
            .translate( [width/2,height/2] );

        var geoPath = d3.geoPath()
            .projection( albersProjection );

        g.selectAll( "path" )
        //save this array first to access
            .data( data.features )
            .enter()
            .append( "path" )
            .attr( "fill", "#ccc" )
            .attr( "stroke", "#ffff")
            .attr( "d", geoPath )
            .on('mouseover', function(d) {
                console.log(d)
                tooltip.transition()        
                .duration(200)      
                .style("opacity", .9); 
                tooltip.html(
                        "Neighborhood: " + d['properties']['nhood'] 
                        + "<br/>" + "population: " + d['population']
                    + "<br/>" + "Cost per night: $" + d['costPerNight']
                    + "<br/>" + "Number of listings: " + d['listings']
                )
                .style("left", (d3.event.pageX) + "px")
                .style("top", (d3.event.pageY - 28) + "px")
            })
            .on("mouseout", function(d) {       
                tooltip.transition()        
                .duration(500)      
                .style("opacity", 0);   
            });

        //where is this loading?
        var listings = svg.append( "g" );
            
            d3.json("/data/neighborhood_data.json").then((jsonNData) => {
                console.log(jsonNData)
                data2 = jsonNData
            })
            .then(function(){
            listings.selectAll( "path" )
                .data( data2.features )
                .enter()
                .append( "path" )
                .attr( "fill", "#900" )
                .attr( "stroke", "#999" )
                .attr( "d", geoPath );
                console.log(listings)
            })  
    }

            
);
