This extension is built with D3, using Mike Bostock's Zoomable Sunburst chart found here:
[http://bl.ocks.org/mbostock/4348373](http://bl.ocks.org/mbostock/4348373)

The labels were added with the help of this tutorial by Martin Walter:
[http://blog.luzid.com/2013/extending-the-d3-zoomable-sunburst-with-labels/](http://blog.luzid.com/2013/extending-the-d3-zoomable-sunburst-with-labels/)

![alt tag](https://raw.githubusercontent.com/brianwmunz/QlikSenseD3ZoomableSunburst/master/screenshots/sunburstUpload.png)

Please view the QVF app for the best understanding of this extension.  There is a Story in the Storytelling section that goes through implementation.

*********************************
Installation & Use
*********************************
To install, just drag the "Sunburst" object from the object menu on the left in Edit mode.

Given the nature of the visualization, the data needs to be formatted in the proper way. In this case, it needs to be in a parent/child format.

It's fairly simple. With Tree data structures, the nodes should have a value associated with themselves as well as a parent in the tree.

If the data is structured properly, the visualization should come up right away.

![alt tag](https://raw.githubusercontent.com/brianwmunz/QlikSenseD3ZoomableSunburst/master/screenshots/sunburst.gif)