function init(){
    //reading data from pet_ownership CSV
    d3.csv('/COS30045 1.1 Resources/pet_ownership.csv').then(function(data, i){
        console.log(data);
        dataset = data;
        
        petChart2019(dataset);
        petChat2021(dataset);
    });

    function petChart2019(petdata){
        var w = 500;
        var h = 200;
        padding = 1.5;

        var svg = d3.select('#pet_chart2019')
                    .append('svg')
                    .attr('width', w)
                    .attr('height', h)
                    .attr('fill', 'rgb(0,0,102)');
        
        svg.selectAll('rect')
            .data(petdata)
            .enter()
            .append('rect')
            .attr('x', function(d, i){
                return i * (w/petdata.length);
            })
            .attr('y', function(d){
                return h - (d.pets2019 *4);
            })
            .attr('width', function(d){
                return w/petdata.length - padding;
            })
            .attr('height', function(d){
                return d.pets2019 * 4;
            });

        svg.selectAll('text')
            .data(petdata)
            .enter()
            .append('text')
            .text(function(d){
                return d.pets2019;
            })
            .attr('fill', 'white')
            .attr('x', function(d, i){
                return i * (w/petdata.length) + 25;
            })
            .attr('y', function(d){
                return h - (d.pets2019 * 4.2);
            });
    };
}

document.getElementById('pet_chart2021').onload = function(){petChart2021};

function petChart2021(petdata){
    var w = 500;
    var h = 200;
    padding = 1.5;

    var svg = d3.select('#pet_chart2021')
                .append('svg')
                .attr('width', w)
                .attr('height', h)
                .attr('fill', 'rgb(0,0,102)');
    
    svg.selectAll('rect')
        .data(petdata)
        .enter()
        .append('rect')
        .attr('x', function(d, i){
            return i * (w/petdata.length);
        })
        .attr('y', function(d){
            return h - (d.pets2021 *4);
        })
        .attr('width', function(d){
            return w/petdata.length - padding;
        })
        .attr('height', function(d){
            return d.pets2021 * 4;
        });

    svg.selectAll('text')
        .data(petdata)
        .enter()
        .append('text')
        .text(function(d){
            return d.pets2021;
        })
        .attr('fill', 'white')
        .attr('x', function(d, i){
            return i * (w/petdata.length) + 12;
        })
        .attr('y', function(d){
            return h - (d.pets2021 * 4);
        });
};

window.onload = init;


// document.addEventListener('DOMContentLoaded', function() {
//     // Your code here
//     petChart2019()
// });

// function show(){
//     document.getElementById('ChartImg').src=Image
//     document.getElementById('ChartImg').alt=ImgAlt
//     document.getElementById('ChartCap').innerHTML=ImgDesc
//     document.getElementById('ChartImg').style.display='block';
// }





/*
function barChart(dataset){

    svg.selectAll("text")
        .data(dataset)
        .enter()
        .append("text")
        .text(function(d){
            return d.wombats;
        })
        .attr("fill", "white")
        .attr("x", function(d, i){
            return i*(w/dataset.length) + 12;
        })
        .attr("y", function(d){
            return h - (d.wombats * 4.3);
        });
};*/