function init() {
    var w = 450;
    var h = 400;
    padding = 25;

    // dataset from murray
    var dataset = [
        { apples: 5, oranges: 10, grapes: 22 },
        { apples: 4, oranges: 12, grapes: 28 },
        { apples: 2, oranges: 19, grapes: 32 },
        { apples: 7, oranges: 23, grapes: 35 },
        { apples: 23, oranges: 17, grapes: 43 }
    ];

    

    var xScale = d3.scaleBand()
                    // calculate domain range
                    .domain(d3.range(dataset.length))
                    // specify output range relative to svg current size
                    .range([0,w])
                    .padding(0.05);
    
    var yScale = d3.scaleLinear()
                    // calculate domain range
                    .domain([0, d3.max(dataset, function(d) {
                        return d.apples + d.oranges + d.grapes;
                        })
                    ])
                    .range([h, 0]);

    var color = d3.scaleOrdinal(d3.schemeCategory10);

    // set up stack method
    var stack = d3.stack()
                  .keys(['apples', 'oranges', 'grapes'])
                  .order(d3.stackOrderDescending);

    // Data, stacked
    var series = stack(dataset);

    // create svg
    var svg = d3.select('#chart')
                .append('svg')
                .attr('width', w)
                .attr('height', h);

    // add group for each row of data
    var groups = svg.selectAll('g')
                    .data(series)
                    .enter()
                    .append('g')
                    .style('fill', function(d, i){
                        return color(i);
                    });
    
    // add a rect for each data value
    var rects = groups.selectAll('rect')
                    .data(function(d){ return d; })
                    .enter()
                    .append('rect')
                    .attr('x', function(d, i){
                        return xScale(i);
                    })
                    .attr('y', function(d){
                        return yScale(d[1]);
                    })
                    .attr('height', function(d){
                        return yScale(d[0]) - yScale(d[1]);
                    })
                    .attr('width', xScale.bandwidth())
                    .data(function(d){ return d ; });

    // add legend for fruit types
    var legend = svg.selectAll('.legend')
                    .data(['apples', 'oranges', 'grapes'])
                    .enter()
                    .append('g')
                    .attr('class', 'legend')
                    .attr('transform', function(d, i){
                        return 'translate(-350, ' + i * 20 + ')';
                    });

    // Adding colored rectangles
    legend.append('rect')
          .attr('x', w - 18)
          .attr('y', 18)
          .attr('width', 18)
          .attr('height', 18)
          .style('fill', function(d,i){
                return color(i);
          });

    // add labels 
    legend.append('text')
          .attr('x', w - 25)
          .attr('y', 18)
          .attr('dy', '.35cm')
          .attr('fill', 'white')
          .style('text-anchor', 'end')
          .text(function(d){ 
                return d;
            })
}

window.onload = init;