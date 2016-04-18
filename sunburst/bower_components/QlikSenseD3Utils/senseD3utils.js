var senseD3 = {
    arcTween: function(d, x, y, radius, arc) {
        var xd = d3.interpolate(x.domain(), [d.x, d.x + d.dx]),
            yd = d3.interpolate(y.domain(), [d.y, 1]),
            yr = d3.interpolate(y.range(), [d.y ? 20 : 0, radius]);
        return function(d, i) {
            return i ? function(t) {
                return arc(d);
            } : function(t) {
                x.domain(xd(t));
                y.domain(yd(t)).range(yr(t));
                return arc(d);
            };
        };

    },
    computeTextRotation: function(d, x) {
        return (x(d.x + d.dx / 2) - Math.PI / 2) / Math.PI * 180;
    },
  //create family is to be used for creating a tree type data structure which can be used in most D3 tree vizualizations.  
  //See more info about the tree layout here:  https://github.com/mbostock/d3/wiki/Tree-Layout
  // takes parameters for:
    // dataset :    qMatrix -   actual data values 
    // familytype : string -    nested () or over multiple dimensions (),
    // numDims :    int -       number of dimensions used to create the chart
    // colorFlag :  boolean -   is there a color dimension included in the dataset
    createFamily: function(dataSet,familytype,numDims,colorFlag) {
        var numDims;
        if(arguments.length==2) {
            numDims = 2,
            colorFlag = false;
        } else if (arguments.length==3) {
            colorFlag = false;
        }
        
        //create arrays of parents and children.  this is so we can determine if there's any nodes without parents.  these would be the top parents 
        var parentsA = [];
        var kidsA = [];
// var parentColor = [];
        //format Sense data into a more easily consumable format and build the parent/child arrays

        var happyData = [];

        //loop through each array in the dataset
        for(s=0; s<dataSet.length; s++){
            var d = dataSet[s];
            //for each dim check if the record is a child or a parent and add to corresponding array
            for(i=0; i<numDims-1; i++){
// console.log(parentsA.map(function (e) {return e.name}));

                if (parentsA.map(function (e) {return e.name}).indexOf(d[i].qText) === -1) {
// console.log('countcalled');
                    var parentIter = {
                        name: d[i].qText,
                        color: d[numDims].qState="O" ? d[numDims].qNum : 1
                    };
                    parentsA.push(parentIter);
// parentColor.push(d[numDims].qState="O" ? d[numDims].qNum : 1);
                }
                var parentVal = "";
                if ((!(d[i].qText)) || (d[i].qText == "-") || (d[i].qText == "") || (d[i].qText) == " ") {
                    parentVal = "[root]";
                } else {
                    parentVal = d[i].qText;
                }
                if (kidsA.indexOf(d[i+1].qText) === -1) {
                    kidsA.push(d[i+1].qText);
                }
                // var exists = false;
                // $.each(happyData, function(){
                //     if((this.parent == parentVal) && (this.name == d[i+1].qText)){
                //         exists = true;
                //     }
                // });
                //get attributes associated to each leaf of tree - add a color attribute if a dim exists that was not included in numDims
                // if(!exists){
                var newDataSet = {
                    name: d[i+1].qText,
                    parent: parentVal,
                    size: (d[numDims+1] || d[numDims]).qNum,
                    color: d[numDims].qState="O" ? d[numDims].qNum : 1,
                    level: i,
                    leaf: (i+1) === (numDims-1) ? true : false
                };
                happyData.push(newDataSet);
                // }
            }
        }
console.log('happyData',happyData);
console.log('parentsA',parentsA);
// console.log('parentColor',parentColor);
// console.log('kidsA',kidsA);
        //loop through the parent and child arrays and find the parents which aren't children.  set those to have a parent of "-", indicating that they're the top parent
        
        $.each(parentsA, function( index ) {
            // if (kidsA.indexOf(this.toString()) === -1) {
// console.log('ineach',this,'data', index);
                var noParent = {
                    "name": this.name,
                    "color": this.color,
                    "parent": "[root]"
                }
                happyData.push(noParent);
            // }
        });
// console.log('happyData',happyData);

// console.log(happyData);
        //crawl through the data to create the family tree in JSON
        function getChildren(name, familytype) {
            if (familytype=="multiDim") {
                var returnChildren = happyData.filter(function(d) {
                    return d.parent === name;
                })
                .map(function(d) {
                    var mapping;
                    if(d.leaf) {
                        mapping = {
                            name: d.name,
                            size: d.size,
                            color: d.color
                        };
                    }
                    else {
                        mapping = {
                            name: d.name,
                            size: d.size,
                            color: d.color,
                            children: getChildren(d.name, familytype)
                        };
                    }
                    
                    return mapping;
                });
            } else{
                var returnChildren = happyData.filter(function(d) {
                    return d.parent === name;
                })
                .map(function(d) {
                    return {
                        name: d.name,
                        size: d.size,
                        color: d.color,
                        children: getChildren(d.name, familytype)
                    };
                });
            };

            return returnChildren;
        }

        var JSONtree = getChildren('[root]', familytype);
        return JSONtree;

    },
    createJSONObj: function (layout, numOfDims) {

        //store raw dimensions and create variable for final labels
        var rawDimLabels = layout.qHyperCube.qDimensionInfo,
            rawMeasLabels = layout.qHyperCube.qMeasureInfo,
            datapts     = layout.qHyperCube.qDataPages[0].qMatrix
            labels = [];

        //loop through dimension and measure labels and add to array
        for (var i = 0; i <= rawDimLabels.length - 1; i++) {
                labels.push(rawDimLabels[i].qFallbackTitle);
        };
        for (var i = 0; i <= rawMeasLabels.length - 1; i++) {
                labels.push(rawMeasLabels[i].qFallbackTitle);
        };
        var data = [];
        //labels ["Date", "Cloud Cover", "Temperature Classification", "Turnstile Entries", "Taxi Passengers"]

        for (var index = datapts.length - 1; index >= 0; index--) {
            var tempData ={};
            for (var j = labels.length - 1; j >= 0; j--) {
                //hard coded limit to check if text or number
    //*************************Remove magic number
                if (j<=numOfDims) {
                    tempData[labels[j]] = datapts[index][j].qText;
                } else{
                    tempData[labels[j]] = datapts[index][j].qNum;
                };
            };
            data.push(tempData);
        };

        return data;
    },

    // Traverse the dataset to find the maximum value of a 
    // specified attribute from all of the nodes in the passed dataset
    findMaxValue: function(attr, dataSet) {
        var maxValue = 0;
        dataSet.forEach(function(d) {
            maxValue = (d[attr] > maxValue ? d[attr] : maxValue);
        });
        return maxValue;
    },
    findNumOfDims: function (layout, colorDimExist) {
        return layout.qHyperCube.qDimensionInfo.length - (colorDimExist ? 1 : 0);
    }
};
