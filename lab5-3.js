function init(){
    var w = 600;
    var h = 250;

    var dataset = [14, 21, 15, 20, 23, 19, 16, 11, 8, 18,
                     5, 9, 17, 7, 24];

    // Ordinal Scaling
    var xScale = d3.scaleBand()
                    // calculate domain range
                    .domain(d3.range(dataset.length))
                    // specify output range relative to svg current size
                    .range([0,w])
                    // 5% of bandwidth as padding values
                    .paddingInner(0.05);

    var yScale = d3.scaleLinear()
                    // calculate domain range
                    .domain([0, d3.max(dataset)])
                    // specify range: from zero to h
                    .range([0,h]);

    var svg = d3.select('#bars')
                .append('svg')
                .attr('width', w)
                .attr('height', h)
                .attr('fill', 'rgb(0, 0, 102)');

    svg.selectAll("rect")
        .data(dataset)
        .enter()
        .append("rect")
        // set horizontol position for each bar
        .attr("x", function(d,i){
            return xScale(i);
        })
        // allow bar to grow from bottom
        .attr("y", function(d){
            return h - yScale(d);
        })
        //set width for each bar w/o manual bar padding
		.attr("width", xScale.bandwidth())
        //height of the bar
		.attr("height", function(d){
            return yScale(d);
        });

    svg.selectAll("text")
        .data(dataset)
        .enter()
        .append("text")
        // return exact value from dataset
        .text(function(d){
            return d;
        })
        // text color
        .attr("fill", "white")
        // center text
        .attr("text-anchor", "middle")
        // position text in the middle by adding half of the bar
        .attr("x", function(d,i){
            return xScale(i) + xScale.bandwidth() / 2;
        })
        // postion text vertical
        .attr("y", function(d){
            return h - yScale(d) + 14;
        });

        // On-Click
        d3.select('#add')
            .on('click', function(){
                // set a maxValue for random numbers
                var maxValue = 25;
                
                // generate a random value
                var newNumber = Math.floor(Math.random() * maxValue);
                dataset.push(newNumber); // add one new value to dataset when on-click

                // update xScale 
                xScale.domain(d3.range(dataset.length));
                
                // create a bar variable
                var bars = svg.selectAll('rect')
                            .data(dataset);

                // transition for a new bar to enter
                bars.enter()
                    .append('rect')
                    .merge(bars)
                    .transition()
                    .duration(500)
                    .attr('x', function(d, i){
                        return xScale(i);
                    })
                    .attr('y', function(d){
                        return h-yScale(d);
                    })
                    .attr('width', xScale.bandwidth())
                    .attr('height', function(d){
                        return yScale(d);
                    })
                    .attr('fill', 'rgb(0, 0, 102)');
                
                // update rects
                svg.selectAll('rect')
                    .data(dataset)
                    .attr('y', function(d){
                        return h - yScale(d);
                    })
                    .attr('height', function(d){
                        return yScale(d);
                    });
                   
                // update text
                svg.selectAll('text')
                    .data(dataset)
                    .attr('fill','white')
                    .attr('text-anchor','middle')
                    .attr('x', function(d,i){
                        return xScale(i) + xScale.bandwidth() / 2;
                    })
                    .attr('y', function(d){
                        return h - yScale(d) + 14;
                    });
            });

        d3.select('#remove')
            .on('click', function(){
                // Remove one value from dataset
                dataset.shift();
                    
                // update xScale
                xScale.domain(d3.range(dataset.length));
                
                // create a bar variable
                var bars = svg.selectAll('rect')
                            .data(dataset);

                // transition for bar to exit
                bars.exit()
                    .transition()
                    .duration(500)
                    .attr('x', w)
                    .remove()
                    .attr('y', function(d){
                        return h-yScale(d);
                    })
                    .attr('width', xScale.bandwidth())
                    .attr('height', function(d){
                        return yScale(d);
                    });

                svg.selectAll('text')
                    .data(dataset)
                    .exit()
                    .transition()
                    .duration(200)
                    .attr('x', w)
                    .remove()
                    .attr("x", function(d,i){
                        return xScale(i) + xScale.bandwidth() / 2;
                    })
                    .attr("y", function(d){
                        return h - yScale(d) + 14;
                    });

                    
            });
}

window.onload = init;
