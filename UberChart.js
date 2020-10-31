/// <reference path="Scripts/jspack-vsdoc.js" />

var Diagram = MindFusion.Diagramming.Diagram;
var CompositeNode = MindFusion.Diagramming.CompositeNode;
var Behavior = MindFusion.Diagramming.Behavior;
var Events = MindFusion.Diagramming.Events;
var Theme = MindFusion.Diagramming.Theme;
var Style = MindFusion.Diagramming.Style;

var Alignment = MindFusion.Drawing.Alignment;
var Rect = MindFusion.Drawing.Rect;
var Point = MindFusion.Drawing.Point;

var TreeLayout = MindFusion.Graphs.TreeLayout;

var diagram = null;
var names;
var coloredNode;

//The DeanNode is a class that inherits from CompositeNode and 
//uses the available layout panels (grid, stack, simple etc.) and components (text, image, table etc.) 
//to construct the desired node type
var DeanNode = CompositeNode.classFromTemplate("DeanNode",
{
	component: "SimplePanel",
	name: "root",
	children:
	[
        {
            component: "Rect",
			name: "Background",
			brush: "white",
			pen: "#cecece",
		},
		{
			component: "GridPanel",
			rowDefinitions: ["*", "2"],
			columnDefinitions: ["*"],
			children:
			[	
				{		
					component: "StackPanel",
					orientation: "Vertical",
					margin: "1",
					verticalAlignment: "Near",
					gridRow: 0,
					children:
						[
							{
								component: "Text",
								name: "Faculty",
								autoProperty: true,
								text: "title",
								font: "serif bold"
								},
								{
								component: "Text",
								name: "Dean",
								autoProperty: true,
								text: "Name of dean",
								pen: "#808080",
								padding: "1,0,1,0"
								},
								{
								component: "Text",
								name: "Details",
								autoProperty: true,
								text: "details",
								font: "serif 3.5 italic"
								}		
						
						]
				},
				
				{
					component: "Rect",
					name: "Underline",
					pen: "red",
					brush: "red",
					gridRow: 1,
					autoProperty: true					
				}
			]
		}			
	]
});



document.addEventListener("DOMContentLoaded", function ()
{
	//some random names for the people
	names = ["Nicole Montgomery", "Loren Alvarado", "Vicki Fisher", "Edith Fernandez", "Lynette Sullivan", "Amy Rhodes", "Teresa Marsh", "Ginger Larson", "Bob Lawrence", "Arthur Ball", "Ramiro Mitchell", "Mitchell Barker", "Jane Silva", "Diana Curry", "Jay Smith", "Caroline Garcia", "Paulette Wells", "Alexander Chapman", "Emanuel Glover", "Shannon Daniel", "Jesus Townsend", "Lowell Gibbs", "Ruben Figueroa", "Estelle Henderson", "Sonja French", "Ken Underwood", "Joe Hines", "Eric Rogers", "Lindsay Manning", "Jorge Shelton", "Bobby Sanders", "Mamie Pratt", "Rudolph Armstrong", "Wayne Mcguire", "Jessica Peters", "Clinton Maxwell", "Lillian Carroll", "Felipe Craig", "Marion Holt", "Willard Reynolds", "Anita Adkins", "Ramona Hanson", "Zachary Rodriguez", "Boyd Todd", "Michelle Ford", "Orlando Jenkins", "Nelson Benson", "Shirley Farmer", "Eddie Curtis", "Phil Taylor", "Yolanda Strickland", "Simon Abbott", "Jesus Neal", "Roman Owens", "Heather Hogan", "Andrew Jennings", "Lucille Kelly", "Glenda Lee", "Kathryn Boone", "Craig Summers", "Michele Fernandez", "Tonya Parsons", "Bennie Freeman", "Stewart Austin", "Johanna Barber", "Julia Dean", "Jeanette Hernandez", "Nicholas Hawkins", "Miriam Lindsey", "Chester Waters", "Marta Jackson", "Jake Brown", "Rufus Turner", "Melvin Nunez", "Luther Collier", "Geraldine Barton", "Wesley Lamb", "Wilbur Frazier", "Wendell Saunders", "Brittany Corte"];
	tags1= ['VP', 'Head', 'CTO', 'CPO'];
	names1 = ['Zhenya Lindgardt', 'Raquel Urtasun', 'Thuan Pham', 'Dara Khosrowshahi'];
	tags2 = ['Head', 'Head', 'GM', 'CEO', 'Head', 'Head', 'Head', 'Head', 'Head', 'Head', 'Head', 'VP', 'CIO', 'Sr Director', 'Sr Director', 'Sr Director', 'Sr Director', 'Head', 'VP of Technology', 'Sr Director', 'Director', 'VP', 'Head', 'VP of Technology'];
	names2 = ['Karishma Shah', 'Jon Venuto', 'David Reich', 'Andrey Liscovich', 'Austin Geidt', 'Eric Hanson', 'Raquel Urtasun', 'Nat Beuse', 'Sameer Kshirsagar', 'Stephen Lesh', 'Adrian Thompson', 'Jon Thomason', 'Shobhana Ahluwalla', 'Sophia Vicent', 'Haider Sabri', 'Sumanth Sukumar', 'Jennifer Anderson', 'Gaurav Garg', 'Peeyush Nahar', 'Eckart Walther', 'Megha Yethadka', 'Michael Gough', 'Peter Hazlehurst', 'Sundeep Jain'];
	
	// create a Diagram component that wraps the "diagram" canvas
	diagram = Diagram.create(document.getElementById("diagramCanvas"));
	
	// enable drawing of custom nodes interactively
	diagram.setCustomNodeType(DeanNode);
	diagram.setBehavior(Behavior.Custom);
	
	var theme = new Theme();
	var linkStyle = new Style();
	linkStyle.setStroke("#CECECE");
	theme.styles["std:DiagramLink"] = linkStyle;
	diagram.setTheme(theme);	
	diagram.setShadowsStyle(MindFusion.Diagramming.ShadowsStyle.None);
	
	createNodes();
	
	var links = diagram.getLinks();
	
	//set all links to light gray and with pointers at the bottom

	//rather than the head in order to appear inverted
	for(var i = 0; i < links.length; i++)
	{
		var link = links[i];
		
	link.setBaseShape("Triangle");
	link.setHeadShape(null);
	link.setBaseShapeSize(3.0);
	link.setBaseBrush({ type: 'SolidBrush', color: "#CECECE" });
	link.setZIndex(0);
	}
	
	//create an instance of the Tree Layout and apply it
	var layout = new TreeLayout();
	layout.direction = MindFusion.Graphs.LayoutDirection.TopToBottom;
	layout.linkType = MindFusion.Graphs.TreeLayoutLinkType.Cascading;
	//enabling assistants tells the layout to order the nodes with Assistant traits in a special way
	layout.enableAssistants = true;
    diagram.arrange(layout);
	
	diagram.resizeToFitItems(5);
	
	// create an ZoomControl component that wraps the "zoomer" canvas
	var zoomer = MindFusion.Controls.ZoomControl.create(document.getElementById("zoomer"));
	zoomer.setTarget(diagram);
	zoomer.setZoomFactor(55);	
	
});



//create all nodes
function createNodes()
{
	var departName = ["Product", "Technology", "Uber ATG", "Platform Growth & Customer Engagement"];
	var product = ["Product & Data Science", "Payment (Uber Money)", "Product Design", "Global Scaled Solutions", "Business and Developer Products"];
	var technology = ["Product Engineering", "Mobility & Marketplace", "Product Platform (business infrastructure)", "Infrastructure", "Eats Engineering", "Technical Program Management & Learning", "Information Technology"];
	var uberATG = ["Software Engineering", "Systems Engineering & Testing", "Hardware & Vehicle", "Supply Chain", "Safety", "Research & Development", "Product & Design", "Strategy"];
	var customerEngagement = [ "Uber Works", "Uber Transit", "Customer Engagement", "Incubator"];
	var departments = [product, technology, uberATG, customerEngagement];
	
	var deans = [];
	for(var i = 0; i < departName.length; i++)
		deans.push(createDepartmentNodes(departName[i], departments[i]));
	

	//the president and the board
	var vpNodeSocial = new DeanNode(diagram);
	vpNodeSocial.setBounds(new Rect(80, 225, 60, 25));
	vpNodeSocial.setFaculty("Uber");
	vpNodeSocial.setDean("Dara Khosrowshahi");
	vpNodeSocial.setDetails("CEO");
	vpNodeSocial.getComponent("Underline").brush = "#76A68F";
	vpNodeSocial.getComponent("Underline").pen = "#76A68F";
	diagram.addItem(vpNodeSocial);
	
	diagram.getFactory().createDiagramLink(vpNodeSocial, getDean(deans, "Product"));
	diagram.getFactory().createDiagramLink(vpNodeSocial, getDean(deans, "Technology"));
	diagram.getFactory().createDiagramLink(vpNodeSocial, getDean(deans, "Uber ATG"));
	diagram.getFactory().createDiagramLink(vpNodeSocial, getDean(deans, "Platform Growth & Customer Engagement"));
		
}


//create the nodes for the given department
function createDepartmentNodes (department, specialities)
{
	var nodes = [];
	
	//create nodes for all specialities in it
	for(var i = 0; i < specialities.length; i++)
	{
		var node = new DeanNode(diagram);
		node.setBounds(new Rect(100, 195, 60, 25));
		node.setFaculty(specialities[i]);
		node.setDean(names2.pop());
		node.setDetails(tags2.pop());
			
	    if(node.getDetails().length > 70)
			node.setDetails(
		    getTitle() + " " + specialities[i]);
		node.getComponent("Underline").brush = "#F2C3A7";
		node.getComponent("Underline").pen = "#F2C3A7";
		node.layoutTraits = { treeLayoutAssistant: MindFusion.Graphs.AssistantType.Left };
		node.setId(specialities[i]);
		diagram.addItem(node);	
		nodes.push(node);
	}
	
	
	var deanNode = new DeanNode(diagram);
	deanNode.setBounds(new Rect(100, 195, 60, 25));
	deanNode.setFaculty(department);
	deanNode.setDean(names1.pop());
	deanNode.setDetails(tags1.pop());
	if(deanNode.getDetails().length > 60)
		deanNode.setDetails(
		"Dean of the Faculty of " + department);
		
	deanNode.getComponent("Underline").brush = "#F27649";
	deanNode.getComponent("Underline").pen = "#F27649";
	deanNode.setId(department);
	
	diagram.addItem(deanNode);	
	
	//connect the departments with the dean node
	for(var i = 0; i < nodes.length; i++)
	{
		diagram.getFactory().createDiagramLink(deanNode, nodes[i]);
	}
	
	return deanNode;		
}


//search for the dean of the provided departent
function getDean(deanNodes, department)
{
	
	for(var i = 0; i < deanNodes.length; i++)
		if(deanNodes[i].getId() == department)
			return deanNodes[i];
		
		return null;
}


//handles the mouse move event
diagramCanvas.addEventListener('mousemove', function (e) {
	
	//get the position of the mouse
	var cursor = MindFusion.Diagramming.Utils.getCursorPos(e, document.getElementById("diagramCanvas"));
	//convert the mouse position to diagram units
	var point = diagram.clientToDoc(cursor);

	//see if there is a diagram node at this location
    var deanNode = diagram.getNodeAt(point);
    if (deanNode) {	
	
	//if there is a node but also another node is colored, we must reset ALL nodes
	 if(coloredNode)
		  resetAllItems();
	  
	 coloredNode = deanNode;	
	  
	  //set the background of the node to the color of its bottom line
      var brush = deanNode.getComponent("Underline").brush;	
	  deanNode.getComponent("Background").brush = brush;	
	
	//set all incoming and outgoing links to be red
	  var links = deanNode.getOutgoingLinks();	  
	  for(var i =0; i < links.length; i++)
	  {
		  var link = links[i];
		  link.setStroke("red");	
		  link.setZIndex(1);
	  }
	  
	  links = deanNode.getIncomingLinks();	  
	  for(var i =0; i < links.length; i++)
	  {
		  var link = links[i];
		  link.setStroke("red");	
		  link.setZIndex(1);		  
	  }  
	  
	  //invalidate the node to repaint it
	  deanNode.invalidate();
	 }else if (coloredNode)
	 {
		 //if we have a colored node and the mouse is not under another node
		 //we ust reset the colors of the colored node and its links
		 coloredNode.getComponent("Background").brush = "white";	
		 
		var links = coloredNode.getOutgoingLinks();	  
		 
	  for(var i =0; i < links.length; i++)
	  {
		  var link = links[i];
		  link.setStroke("#CECECE");
		  link.setZIndex(0);
		  
	  }
	  
	  links = coloredNode.getIncomingLinks();
	  
	  for(var i =0; i < links.length; i++)
	  {
		  var link = links[i];
		  link.setStroke("#CECECE");
		  link.setZIndex(0);
	  }	  
	  
		 coloredNode.invalidate();
		 coloredNode = null;
	 }
}); 


/* sets the background of all nodes to white,
the links to gray and the zIndex of all elements to 0 */
function resetAllItems()
{
	 var nodes = diagram.getNodes();
		  
		  for(var i = 0; i < nodes.length; i++)
			  nodes[i].getComponent("Background").brush = "white";
		  
		  var links = diagram.getLinks();
		  
		   for(var i = 0; i < links.length; i++)
		   {
			  links[i].setStroke("#CECECE");
			  links[i].setZIndex(0);
		   }
}

