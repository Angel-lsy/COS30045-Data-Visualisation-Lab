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
        //set width w/o manual bar padding
		.attr("width", xScale.bandwidth())
        //height of the bar
		.attr("height", function(d){
            return yScale(d);
        })
        // when mouseover, trigger function below
        .on('mouseover', function(event, d){
            // Get this bar's x/y values, then augment for tooltip
            var xPosition = parseFloat(d3.select(this).attr('x') + xScale.bandwidth()/2);
            var yPosition = parseFloat(d3.select(this).attr('y') + 14);
            
            //Create the tooltip label
            svg.append("text")
                .attr("id", "tooltip")
                .attr("x", xPosition)
                .attr("y", yPosition)
                .attr("text-anchor", "middle")
                .attr("font-family", "sans-serif")
                .attr("font-size", "12px")
                .attr("fill", "white")
                .text(d);

            // bar turns orange when mouseover 
            d3.select(this)
                .transition()
                .duration(100)
                .attr('fill', 'orange');
        })
        .on('mouseout', function(d){
            // Remove tooltip
            d3.select('#tooltip').remove();
            
            // bar back to original color when mouseout 
            d3.select(this)
                .transition()
                .duration(250)
                .attr('fill', 'rgb(0, 0, 102)')
        });

    svg.selectAll("text")
        .data(dataset)
        .enter()
        .append("text")
        .text(function(d){
            return d;
        })
        .attr("fill", "white")
        .attr("text-anchor", "middle")
        .attr("x", function(d,i){
            return xScale(i) + xScale.bandwidth() / 2;
        })
        .attr("y", function(d){
            return h - yScale(d) + 14;
        });

    // On-Click
    d3.select('#add')
        .on('click', function(){
            // set maxValue for random number
            var maxValue = 25;

            // generate random number
            var newNumber = Math.floor(Math.random() * maxValue);
            dataset.push(newNumber); // add one new value to dataset

            // update xScale
            xScale.domain(d3.range(dataset.length));
            
            // Create bars variable
            var bars = svg.selectAll('rect')
                        .data(dataset);

            // transition for new bar
            bars.enter()
                .append('rect')
                .merge(bars)
                .transition() // ms
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
                })
                .on('mouseover', function(event, d){
                    // Get this bar's x/y values, then augment for tooltip
                    var xPosition = parseFloat(d3.select(this).attr('x') + xScale.bandwidth()/2);
                    var yPosition = parseFloat(d3.select(this).attr('y') + 14);
                    
                    //Create the tooltip label
                    svg.append("text")
                        .attr("id", "tooltip")
                        .attr("x", xPosition)
                        .attr("y", yPosition)
                        .attr("text-anchor", "middle")
                        .attr("font-family", "sans-serif")
                        .attr("font-size", "12px")
                        .attr("fill", "white")
                        .text(d);
        
                    // bar color change to orange when mouseover
                    d3.select(this)
                        .transition()
                        .duration(100)
                        .attr('fill', 'orange');
                })
                .on('mouseout', function(d){
                    // Remove tooltip
                    d3.select('#tooltip').remove();
                    
                    // color return to original
                    d3.select(this)
                        .transition()
                        .duration(250)
                        .attr('fill', 'rgb(0, 0, 102)')
                });
                
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
            
            // create bars variable
            var bars = svg.selectAll('rect')
                        .data(dataset);

            // set bar transition for remove
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
    
    var sortOrder = false;

    d3.select('#sort')
        .on('click', function(){
            sortBars();
           })

        // Define sort function       
        var sortBars = function () {
            // Flip value of sortOrder
            sortOrder = !sortOrder

            // sort bar with transition
            svg.selectAll('rect')
                .sort(function(a, b){
                    if (sortOrder) {
                        // ascending order
                        return d3.ascending(a,b);
                    } else {
                        //descending order
                        return d3.descending(a,b);
                    }   
                })
                .transition()
                .duration(1000) // ms
                .attr('x', function(d,i){
                    return xScale(i);
                });

            
            // sort text with transition
            svg.selectAll('text')
                .data(dataset)
                .sort(function(a, b){
                    if (sortOrder) {
                        // ascending order
                        return d3.ascending(a,b);
                    } else {
                        //descending order
                        return d3.descending(a,b);
                    }   
                })
                .transition()
                .duration(1000) // ms
                .attr('fill','white')
                .attr('text-anchor','middle')
                .attr('x', function(d,i){
                    return xScale(i) + xScale.bandwidth() / 2;
                })
                .attr('y', function(d){
                    return h - yScale(d) + 14;
                });
        };
}

window.onload = init;

