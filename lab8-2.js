function init() {

    // width and height
    var w = 500;
    var h = 300;

    var color = d3.scaleQuantize()
                  .range(['rgb(237, 248, 233)', 'rgb(186, 228, 179)', 
                    'rgb(116,196,118)', 'rgb(49,163,84)', 'rgb(0, 109, 44)']);

    // set Mercator map to projection
    var projection = d3.geoMercator()
                       .center([145, -36.5])
                       .translate([w / 2, h / 2])
                       .scale(3000);

    // define path generator, using projection
    var path = d3.geoPath()
                 .projection(projection);

    var svg = d3.select('#geo')
                .append('svg')
                .attr('width', w)
                .attr('height', h);

    d3.csv('VIC_LGA_unemployment.csv').then(function(data) {
        // Check the data format
        console.log('Data:', data);
    
        // Ensure data is an array
        if (Array.isArray(data)) {
            data.forEach(d => {
                if (d.unemployed) {
                    d.unemployed = +d.unemployed; // Convert 'unemployed' to number
                } else {
                    console.error("Missing 'unemployed' field in row:", d);
                }
            });
        } else {
            console.error("Data is not an array:", data);
        }

        var min = d3.min(data, function(d) { return d.unemployed; });
        var max = d3.max(data, function(d) { return d.unemployed; });

        // Define the color scale based on the actual data range
        var color = d3.scaleSequential(d3.interpolateBlues)
                    .domain([min, max]);
    });

    // Load GeoJSON data
    d3.json("LGA_VIC.json").then(function(json) {
        // Bind data and create one path per GeoJSON feature
        svg.selectAll("path")
            .data(json.features)
            .enter()
            .append("path")
            .attr("d", path)
            .attr("stroke", "#333") // Improved stroke for boundaries
            .attr("fill", function(d, i) {
                return color(i % 10); // Fill with color based on index or property
            });

    }).catch(function(error) {
        console.error("Error loading the GeoJSON data: ", error); // Error handling
    });


    // Load the city data and add circles for towns and cities
    d3.csv("VIC_city.csv").then(function(cityData) {
        // Add circles for each city/town
        svg.selectAll("circle")
            .data(cityData)
            .enter()
            .append("circle")
            .attr("cx", function(d) {
                return projection([+d.lon, +d.lat])[0]; // Map longitude to x using projection
            })
            .attr("cy", function(d) {
                return projection([+d.lon, +d.lat])[1]; // Map latitude to y using projection
            })
            .attr("r", 5) // Radius of the circle
            .attr("fill", "yellow") // Color of the circle
            .attr("stroke", "black") // Circle border color
            .attr("stroke-width", 1.5)
            .attr("opacity", 0.7) // Opacity for better visibility
            .on("mouseover", function(event, d) {
                d3.select(this)
                    .attr("r", 7) // Increase radius on hover
                    .attr("opacity", 1); // Fully opaque on hover
            })
            .on("mouseout", function(event, d) {
                d3.select(this)
                    .attr("r", 5) // Reset radius
                    .attr("opacity", 0.7); // Reset opacity
            })
            .append("title") // Tooltip for city names
            .text(function(d) {
                return d.place; // Display city/town name
            });
    }).catch(function(error) {
        console.error("Error loading the city data:", error);
    });
}                    

window.onload = init;
// function init() {

//     // width and height
//     var w = 500;
//     var h = 300;

//     var color = d3.scaleQuantize()
//                   .range(['rgb(237, 248, 233)', 'rgb(186, 228, 179)', 
//                     'rgb(116,196,118)', 'rgb(49,163,84)', 'rgb(0, 109, 44)']);

//     // set Mercator map to projection
//     var projection = d3.geoMercator()
//                        .center([145, -36.5])
//                        .translate([w / 2, h / 2])
//                        .scale(3000);

//     // define path generator, using projection
//     var path = d3.geoPath()
//                  .projection(projection);

//     var svg = d3.select('#geo')
//                 .append('svg')
//                 .attr('width', w)
//                 .attr('height', h);

//     d3.csv('VIC_LGA_unemployment.csv', function(data){

//         // convert data and trim LGA names
//         data.forEach(d =>{
//             d.LGA = d.LGA.trim(); // trim data
//             d.unemployed = +d.unemployed; // convert to numeric
            
//         });

//         color.domain([
//             d3.min(data, function(d){ return +d.unemployed;}),
//             d3.max(data, function(d){ return +d.unemployed;})
//         ]);

//         d3.json('LGA_VIC.json').then(function(json){

//             // merge the ag. data and GeoJSON
//             // loop through once for each ag. data value
//             for (var i = 0; i < data.length; i++) {
                
//                 // grab LGA name
//                 var dataLGA = data[i].LGA;

//                 // grab data value, and convert from string to float
//                 var dataValue = parseFloat(data[i].unemployed);
                
//                 // find the corresponding state inside the GeoJSON
//                 for (var j = 0; j < json.features.length; j++) {
//                     var jsonLGA = json.features[j].properties.LGA_name;

//                     // if exists
//                     if (dataLGA == jsonLGA) {

//                         // copy the data value into JSON
//                         json.features[j].properties.value = dataValue;
//                         break; // stop searching
//                     }
//                 }
//             }

//             // bind data and create one path per GeoJSON feature
//             svg.selectAll('path')
//                .data(json.features)
//                .enter()
//                .append('path')
//                .attr('d', path)
//                .style('fill', function(d) {
//                     // get data vakue
//                     var value = d.properties.value;
//                     if(value){
//                         // data exists
//                         return color(value);
//                     }else{
//                         // undefined
//                         return '#ccc';
//                     }
//                });

//             // load in cities data
//             d3.csv('VIC_city.csv').then(function(data){
//                 svg.selectAll('circle')
//                    .data(data)
//                    .enter()
//                    .append('circle')
//                    .attr('cx', function(d){
//                         return projection([d.lon, d.lat])[0];
//                    })
//                    .attr('cy', function(d){
//                         return projection([d.lon, d.lat])[1];
//                    })
//                    .attr('r', 5)
//                    .style('fill', 'yellow')
//                    .style('stroke', 'gray')
//                    .style('stroke-width', 0.25)
//                    .style('opacity', 0.75)
//                    .append('title')
//                    .text(function(d){
//                         return d.place;
//                 });
//             })
//         });
//     });
// }                    

// window.onload = init;


// function init() {

//     // width and height
//     var w = 500;
//     var h = 300;

//     // set Mercator map to projection
//     var projection = d3.geoMercator()
//                        .center([145, -36.5])
//                        .translate([w / 2, h / 2])
//                        .scale(3000);

//     // define path generator, using projection
//     var path = d3.geoPath()
//                  .projection(projection);

//     var svg = d3.select('#geo')
//                 .append('svg')
//                 .attr('width', w)
//                 .attr('height', h)
//                 .attr('fill', 'grey');
    

//     var color = d3.scaleQuantize()
//                 .range(["rgb(237,248,233)", "rgb(186,228,179)",
//                 "rgb(116,196,118)", "rgb(49,163,84)", "rgb(0,109,44)"]);


//     d3.csv('VIC_LGA_unemployment.csv').then(function(data) {
//         color.domain([
//             d3.min(data, function(d) { return d.unemployed;}),
//             d3.max(data, function(d) { return d.unemployed;})
//         ]);
//     });

//     d3.json('LGA_VIC.json', function(json) {

//             // merge the ag. data and GeoJSON
//             // loop through once for each ag. data value
//             for (var i = 0; i < data.length; i++) {

//                 // grab state name
//                 var dataLGA = data[i].LGA_name;

//                 // grab data value, and convert from string to float
//                 var dataValue = parseFloat(data[i].unemployed);

//                 // find the corresponding state inside the GeoJSON
//                 for (var j = 0; j < json.features.length; j++) {

//                     var jsonLGA = json.features[j].properties.LGA_name;

//                     // if exists
//                     if (dataLGA == jsonLGA) {
//                         //copy the data value into the JSON
//                         json.features[j].properties.value = dataValue;

//                         // stop looking through the JSON
//                         break;

//                     } // end if statement
//                 } // end for loop statement
//             } // end for loop statement
//     }); // end d3.json function

//     // bind data and create one path per GeoJSON feature
//     svg.selectAll('path')
//         .data(json.features)
//         .enter()
//         .append('path')
//         .attr('d', path)
//         .style('fill', function(d) {
//             // get data value
//             var value = d.properties.unemployed;
//             if (value) {
//                 // if value exists
//                 return color(value);
//             } else {
//                 // if value is undefined
//                 return 'rgb(0, 0, 102)'
//             }
//         });
//     // load in cities data
//     d3.csv('VIC_city.csv').then(function(data) {
//         svg.selectAll('circle')
//            .data(data)
//            .enter()
//            .append('circle')
//            .attr('cx', function(d) {
//                 return projection([d.lon, d.lat])[0];
//            })
//            .attr('cy', function(d) {
//                 return projection([d.lon, d.lat])[1];
//            })
//            .attr('r', 5)
//            .style('fill', 'yellow')
//            .style('stroke', 'gray')
//            .style('stroke-width', 0.25)
//            .style('opacity', 0.75);
//     });
            
// }

// window.onload = init; 
