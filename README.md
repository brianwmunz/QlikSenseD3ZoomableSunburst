This extension is built with D3, using Mike Bostock's Zoomable Sunburst chart found here:
[http://bl.ocks.org/mbostock/4348373](http://bl.ocks.org/mbostock/4348373)

The labels were added with the help of this tutorial by Martin Walter:
[http://blog.luzid.com/2013/extending-the-d3-zoomable-sunburst-with-labels/](http://blog.luzid.com/2013/extending-the-d3-zoomable-sunburst-with-labels/)

![alt tag](https://raw.githubusercontent.com/brianwmunz/QlikSenseD3ZoomableSunburst/master/screenshots/sunburstUpload.png)

Please view the QVF app for the best understanding of this extension.  There is a Story in the Storytelling section that goes through implementation.

This extension uses the pageData function from senseUtils which will make it support data sets larger than 10,000 cells.

*********************************
Installation & Use
*********************************
To install, just drag the "Sunburst" object from the object menu on the left in Edit mode.

Given the nature of the visualization, the data needs to be formatted in the proper way. In this case, it needs to be in a parent/child format.

It's fairly simple. With Tree data structures, the nodes should have a value associated with themselves as well as a parent in the tree.

If the data is structured properly, the visualization should come up right away.

![alt tag](https://raw.githubusercontent.com/brianwmunz/QlikSenseD3ZoomableSunburst/master/screenshots/sunburst.gif)


*********************************
Properties
*********************************
There are a couple of new properties in the latest version of the Sunburst.

The first change is that the chart can now handle multiple data types.  The sunburst still handles data that is in a nested parent-child hierarchy, however, now the extension can handle data that has all parents in one field and all children in the other (i.e. child fields are not in both child and parent).  To expand on this, for data that is in the hierarchical relationship Northeast-PA-Philadelphia, these three values would be in three distinct fields.

The second change has to do with coloring.  This extension now includes conditional coloring!  To implement this, expand your measure properties and click the dropdown "Color Format."  Select "By Expression (Hex Values)" then enter your expression below.  Expressions should use conditional statements that evaluate to Hex strings (e.g. '#393b79' including the single quotes).  Failing to include the single quotes or the hash symbol, will cause your expression to error.  Also of note, because your extension contains multiple dimensions, aggregation must be used to evaluate each field (i.e. sum, avg, min, only, etc.).