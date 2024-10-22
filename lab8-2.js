function init() { 
    // width and height
    var w = 500;
    var h = 300;

    // Color scale
    var color = d3.scaleSequential(d3.interpolateBlues); // We'll set the domain later

    // Set Mercator map projection
    var projection = d3.geoMercator()
        .center([145, -36.5])
        .translate([w / 2, h / 2])
        .scale(3000);

    // Define path generator, using projection
    var path = d3.geoPath()
        .projection(projection);

    var svg = d3.select('#geo')
        .append('svg')
        .attr('width', w)
        .attr('height', h);

    // Load unemployment data first
    d3.csv('https://raw.githubusercontent.com/Angel-lsy/COS30045-Data-Visualisation-Lab/refs/heads/main/VIC_LGA_unemployment.csv').then(function(unemploymentData) {
        // Parse unemployment data and find min/max values
        unemploymentData.forEach(d => {
            d.unemployed = +d.unemployed; // Ensure 'unemployed' is numeric
        });

        var min = d3.min(unemploymentData, d => d.unemployed);
        var max = d3.max(unemploymentData, d => d.unemployed);

        // Update color scale domain based on min and max unemployment values
        color.domain([min, max]);

        // After loading unemployment data, load GeoJSON data
        d3.json('https://raw.githubusercontent.com/Angel-lsy/COS30045-Data-Visualisation-Lab/refs/heads/main/LGA_VIC.json').then(function(json) {
            // Merge unemployment data with GeoJSON
            json.features.forEach(function(feature) {
                var LGA_name = feature.properties.LGA_name;
                var match = unemploymentData.find(d => d.LGA === LGA_name);

                if (match) {
                    feature.properties.unemployed = match.unemployed;
                } else {
                    feature.properties.unemployed = null; // Default for missing data
                }
            });

            // Bind data and create one path per GeoJSON feature
            svg.selectAll("path")
                .data(json.features)
                .enter()
                .append("path")
                .attr("d", path)
                .attr('stroke', '#333')
                .attr('fill', function(d) {
                    // Get unemployment value
                    var value = d.properties.unemployed;
                    return value ? color(value) : '#ccc'; // If no data, fill grey
                })
                .attr('opacity', 1);

            // Load the city data and add circles for towns and cities (moved here)
            d3.csv("https://raw.githubusercontent.com/Angel-lsy/COS30045-Data-Visualisation-Lab/refs/heads/main/VIC_city.csv").then(function(cityData) {
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

        }).catch(function(error) {
            console.error("Error loading the GeoJSON data: ", error); // Error handling
        });

    }).catch(function(error) {
        console.error("Error loading the unemployment data: ", error);
    });
}

window.onload = init;
