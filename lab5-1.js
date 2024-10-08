function init(){
    var w = 600;
    var h = 250;

    var dataset = [14, 21, 15, 26, 23, 19, 16, 11, 8, 18,
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
        .attr("y", function(d){
            // allow bar to grow from bottom
            return h - yScale(d);
        })
        // set width for each bar w/o manual bar padding
		.attr("width", xScale.bandwidth())
        // height of the bar
		.attr("height", function(d){
            return yScale(d);
        });

    svg.selectAll("text")
        .data(dataset)
        .enter()
        .append("text")
        // return the exact value from dataset
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
        // position text vertical 
        .attr("y", function(d){
            return h - yScale(d) + 14;
        });

        // On-Click
        d3.select('button')
            .on('click', function(){
                // new dataset values
                //set size
                var numValues = dataset.length;
                // limit the range of random number
                var maxValue = 25;
                // new dataset
                dataset = [];

                // generate newNumber and store into the dataset
                for (var i = 0; i < numValues; i++) {
                    var newNumber = Math.floor(Math.random() * maxValue);
                    dataset[i] = newNumber;
                }
                
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
}

window.onload = init;

