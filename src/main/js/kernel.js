//<><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><>
// this section is for configuring jslint
//<><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><>
/*jslint nomen: false, debug: false,
    evil: false, onevar: true */


//<><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><>
// this section is for functions that test the kernel
//<><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><>
var loadedKernelAt = new Date();

function reportKernel()
{
    this.print('kernel.js was loaded at ' + loadedKernelAt);
}


//<><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><>
// this section defines the WebScreens javascript object whose
// methods get added in the different .js files loaded with
// the kernel.js in the mymashup.js file
//<><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><>
function WebScreens(handler)
{
	this.handler = handler;
	this.repl = handler.repl;
	this.chromeWin = handler.origChromeWin;
	this.domWindow = handler.origDomWindow;
}


//<><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><>
// This section is the initialization of the globalURLHandler
// and the onloadCallback method
//<><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><>
var globalURLHandler = {};
var onloadCallback = function (event)
{
	globalURLHandler.onloadHandler(event);
};


//<><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><>
// this section is the definition of the LoadURL object
//<><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><>
function UrlHandler(repl)
{
	this.repl = repl;
	this.origChromeWin = repl._workContext.window;
	this.origDomWindow = repl._workContext.content.window;
	this.params = {};
	this.currentScreenURL = "";
	this.currentScreenMethod = "";
	this.webScreens = new WebScreens(this);
	
	this.getURL = function (screenURL, screenMethod, params)
	{
		this.params = params;
		this.currentScreenURL = screenURL;
		this.currentScreenMethod = screenMethod;
		
		this.addEventListener();
		
		// this method basically does an HTTP GET of the screenURL
		// in order to start the sequence of screens, it causes
		// the onloadHandler below to get invoked after the
		// screenURL loads
		//this.repl.print("Setting this.origDomWindow.location.href to: " + screenURL);
		//this.repl.print("this.origDomWindow is: " + this.origDomWindow);
		this.origDomWindow.location.href = screenURL;
		
		// this method needs to return a specific kind of object
		return {};
	};

	
	this.onloadHandler = function (event)
	{
		var screenResponse;
		
		// this method is invoked on a callback after each web page is
		// completely loaded into the browser, the code that registers
		// this method as the callback handler for those events is in
		// the kernel.js code; this method kicks off the invoking
		// of the screenMethod method using the eval key word
		//this.repl.print("onloadHandler with event " + event.type + " and currentScreenURL as: " + this.currentScreenURL + " :: currentScreenMethod as: " + this.currentScreenMethod);
		
		// loop over the properties of the event object to see what it's properties are
		
		this.addEventListener();
		
		// TODO: now you can finally invoke the screenMethod method
		// of the this.webScreens object
		// the this.webScreens object is responsible for determining
		// what the next page is and returning that information here!!!!
		screenResponse = this.webScreens.processURL(this.currentScreenURL, this.currentScreenMethod, this.params, event);
		
		
		// TODO: figure out what the next URL is based on what the webScreens.processURL method returned
		// the screenResponse returned from processURL controls whether
		// a URL from the queue is used or if a button was clicked on
		// or if no other URL should be loaded
		if(screenResponse != undefined)
		{
			this.repl.print("processURL returned screenResponse as: " + screenResponse);
			//this.currentScreenURL = screenResponse.nextScreenURL;
			//this.currentScreenMethod = screenResponse.nextScreenMethod;
			//this.screenQueue.addAll(screenResponse.queue);
		}
		
	};
	
	
	this.addEventListener = function ()
	{
		// TODO: loop over all of the windows that are open and add the onloadCallback as an event listener
		
		this.origChromeWin.document.addEventListener('load', onloadCallback, true);
		
	};
	
}


//<><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><>
// This section is the initialization of the globalURLHandler
//<><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><>
globalURLHandler = new UrlHandler(this);




