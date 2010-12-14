//<><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><>
// this section is for configuring jslint
//<><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><>
/*jslint nomen: false, debug: false,
    evil: false, onevar: true */
/*global globalURLHandler: false, WebScreens: false */


//<><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><>
// this section is for functions that test these WebScreens
//<><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><>
var loadedTestAt = new Date();

function reportTest()
{
    this.print('test.screens.js was loaded at ' + loadedTestAt);
}


//<><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><>
// this section is for the startup functions for these WebScreens
//<><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><>
this.print("****************************************************");
this.print("*");
this.print("* Start with repl.startTest();.");
this.print("*");
this.print("****************************************************");

function startTest()
{
	var params = {};
	params.invokedFromMethod = "startTest";
	
	return globalURLHandler.getURL("http://www.gmail.com/", "gmail", params);
}


//<><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><>
// this section is for the actual WebScreens methods
//<><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><>
WebScreens.prototype.processURL = function (screenURL, methodName, params, event)
{
	//var prop;
	
	//this.repl.print("Invoking the processURL method of WebScreens.");
	
	//for (prop in params)
	//{
	//	this.repl.print("params." + prop + ": " + params[prop]);
	//}
	
	// TODO: somehow use the properties of the event object to determine if the methodName should
	//       be invoked or not because there are a lot of 'onload' events that get into this
	//       method but are not the events for which the html is loaded, the other load
	//       events are for .css, .js, images (.gif, .jpg, etc.) or other related files, the
	//       methodName should only be invoked for the onload event of the html content
	//       another URL that sometimes gets loaded is 'about:blank'
	//for (prop in event)
	//{
	//	this.repl.print("event." + prop + ": " + event[prop]);
	//}

	//event.type: load
	//event.target: [object XULElement]
	//this.repl.print("The event.target.location.href URL is: " + event.target.location.href);
	//event.originalTarget: [object XULElement]
	//this.repl.print("The event.originalTarget.location.href URL is: " + event.originalTarget.location.href);
	//event.currentTarget: [object XULDocument]
	//this.repl.print("The event.currentTarget.location.href URL is: " + event.currentTarget.location.href);
	//event.explicitOriginalTarget: [object XULElement]
	//this.repl.print("The event.explicitOriginalTarget.location.href URL is: " + event.explicitOriginalTarget.location.href);
	
	// DONE: use eval method to invoke the methodName
	//this.repl.print("The event.target URL is: " + event.target);
	//this.repl.print("The event.target.location URL is: " + event.target.location);
	//this.repl.print("The event.target.location.href URL is: " + event.target.location.href);
	if (event.target != undefined && event.target.location != undefined)
	{
		// TODO: before doing the eval make sure that the this.chromeWin and the this.domWindow are set correctly
		
		return eval("this." + methodName + "(screenURL, \"" + event.target.location.href + "\", params);");
	}
	else
	{
		return undefined;
	}
};


WebScreens.prototype.gmail = function (screenURL, loadedURL, params)
{
	this.repl.print("From inside the gmail method screenURL: " + screenURL);
	this.repl.print("From inside the gmail method loadedURL: " + loadedURL);
	this.repl.print("From inside the gmail method params: " + params);
	
	var screenResponse = {};
	screenResponse.isDone = true;
	
	return screenResponse;
};


