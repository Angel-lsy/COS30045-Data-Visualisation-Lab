function init() {

    // width and height
    var w = 500;
    var h = 300;

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
                .attr('height', h)
                .attr('fill', 'grey');

    // load in GeoJSON data 
    d3.json('LGA_VIC.json').then(function(json) {

        // bind data and create one path per GeoJSON feature
        svg.selectAll('path')
           .data(json.features)
           .enter()
           .append('path')
           .attr('d', path)
           .attr('fill', 'rgb(0, 0, 102)');
    });
}

window.onload = init;