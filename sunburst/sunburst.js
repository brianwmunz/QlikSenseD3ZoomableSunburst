/*globals define*/
define(["jquery", "text!./style.css", "./d3.v3.min", "./senseD3utils"], function($, cssContent) {

    $("<style>").html(cssContent).appendTo("head");
    return {
        initialProperties: {
            version: 1.0,
            qHyperCubeDef: {
                qDimensions: [],
                qMeasures: [],
                qInitialDataFetch: [{
                    qWidth: 10,
                    qHeight: 50
                }]
            }
        },
        definition: {
            type: "items",
            component: "accordion",
            items: {
                dimensions: {
                    uses: "dimensions",
                    min: 2,
                    max: 2
                },
                measures: {
                    uses: "measures",
                    min: 1,
                    max: 2
                },
                sorting: {
                    uses: "sorting"
                },
                settings: {
                    uses: "settings"
                }
            }
        },
        snapshot: {
            canTakeSnapshot: true
        },
        paint: function($element, layout) {
          	//create JSON container object
          	var myJSON = {"name":layout.title,"children":[]};
            var qData = layout.qHyperCube.qDataPages[0];
         	//create matrix variable
            var qMatrix = qData.qMatrix;
          	//use senseD3.createFamily to create JSON object
            myJSON.children = senseD3.createFamily(qMatrix);
          	//create unique id
            var id = "sb_" + layout.qInfo.qId;
			//if extension has already been loaded, empty it, if not attach unique id
            if (document.getElementById(id)) {
                $("#" + id).empty();
            } else {
                $element.append($('<div />').attr("id", id));
            }
			$("#" + id).width($element.width()).height($element.height());

            var width = $("#" + id).width()-5,
                height = $("#" + id).height()-5,
                radius = (Math.min(width, height) / 2.2);
            var x = d3.scale.linear()
                .range([0, 2 * Math.PI]);

            var y = d3.scale.linear()
                .range([0, radius]);

            var color = d3.scale.category20c();

            var svg = d3.select("#" + id).append("svg")
                .attr("width", width)
                .attr("height", height)
                .append("g")
                .attr("transform", "translate(" + width / 2 + "," + (height / 2 + 10) + ")");

            var partition = d3.layout.partition()
                .value(function(d) {
                    return d.size;
                });

            var arc = d3.svg.arc()
                .startAngle(function(d) {
                    return Math.max(0, Math.min(2 * Math.PI, x(d.x)));
                })
                .endAngle(function(d) {
                    return Math.max(0, Math.min(2 * Math.PI, x(d.x + d.dx)));
                })
                .innerRadius(function(d) {
                    return Math.max(0, y(d.y));
                })
                .outerRadius(function(d) {
                    return Math.max(0, y(d.y + d.dy));
                });


            var g = svg.selectAll("g")
                .data(partition.nodes(myJSON))
                .enter().append("g");

            var path = g.append("path")
                .attr("d", arc)
                .style("fill", function(d) {
                  if(d.depth === 0){
                    var theColor = "white";
                  }else{
                  	var theColor = color((d.children ? d : d.parent).name);
                  }
                    return theColor;
                })
                .on("click", click);

            var text = g.append("text")
                .attr("transform", function(d) {
                    return "rotate(" + senseD3.computeTextRotation(d, x) + ")";
                })
                .attr("x", function(d) {
                    return y(d.y);
                })
                .attr("dx", "6") // margin
                .attr("dy", ".35em") // vertical-align
                .text(function(d) {
                    return d.name;
                });

            function click(d) {
                // fade out all text elements
                text.transition().attr("opacity", 0);
                path.transition()
                    .duration(750)
                    .attrTween("d", senseD3.arcTween(d, x, y, radius, arc))
                    .each("end", function(e, i) {
                        // check if the animated element's data e lies within the visible angle span given in d
                        if (e.x >= d.x && e.x < (d.x + d.dx)) {
                            // get a selection of the associated text element
                            var arcText = d3.select(this.parentNode).select("text");
                            // fade in the text element and recalculate positions
                            arcText.transition().duration(750)
                                .attr("opacity", 1)
                                .attr("transform", function() {
                                    return "rotate(" + senseD3.computeTextRotation(e, x) + ")"
                                })
                                .attr("x", function(d) {
                                    return y(d.y);
                                });
                        }
                    });
            }


            d3.select(self.frameElement).style("height", height + "px");




        },
      resize:function($el,layout){
      		this.paint($el,layout);
        }
    };
});