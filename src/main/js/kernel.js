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
	this.origChromeWin = this.repl._workContext.window;
	this.origDomWindow = this.repl._workContext.content.window;
	this.chromeWin = this.origChromeWin;
	this.domWindow = this.origDomWindow;
	this.params = {};
	this.currentScreenURL = "";
	this.currentScreenMethod = "";

	this.gotoNextURL = function (screenURL, screenMethod, params, useScreenURL)
	{
		this.params = params;
		this.currentScreenURL = screenURL;
		this.currentScreenMethod = screenMethod;
		
		this.handler.addEventListener(this.chromeWin);
		
		// this method basically does an HTTP GET of the screenURL
		// in order to start the sequence of screens, it causes
		// the onloadHandler below to get invoked after the
		// screenURL loads
		//this.repl.print("Setting this.domWindow.location.href to: " + screenURL);
		//this.repl.print("this.domWindow is: " + this.domWindow);
		if (useScreenURL)
		{
			this.domWindow.location.href = screenURL;
		}
		
		// this method needs to return a specific kind of object
		return {};
	};

	this.processURL = function (event)
	{
		// TODO: for any given "event" parameter, we need to make sure
		// that this processURL method is only invoked once or the side
		// effects could be undesireable!!!!!
		
		
		var screenResponse, screenURL = this.currentScreenURL,
		    methodName = this.currentScreenMethod, params = this.params;
		
		
		// THIS NEXT if STATEMENT IS FOR DEBUG
//		if (event.target !== undefined && event.target.location !== undefined)
//		{
//			this.repl.print("Invoking processURL: " + screenURL + " :: " + methodName + " :: " + event.type + " :: " + event.target.location.href);
//		}
//		else
//		{
//			this.repl.print("Invoking processURL: " + screenURL + " :: " + methodName + " :: " + event.type + " :: " + undefined);
//		}
		
		// THIS NEXT for LOOP IS FOR DEBUG
		//for (var prop in params)
		//{
		//	this.repl.print("params." + prop + ": " + params[prop]);
		//}
		
		// DONE: use eval method to invoke the methodName
		//this.repl.print("The event.target URL is: " + event.target);
		//this.repl.print("The event.target.location URL is: " + event.target.location);
		//this.repl.print("The event.type is: " + event.type);
		//this.repl.print("The event.target.location.href URL is: " + event.target.location.href);

		// THIS STATEMENT IS FOR DEBUG
		//this.handler.printEvent(event);
		if (event.target !== undefined && event.target.location !== undefined &&
		    "DOMContentLoaded" === event.type)
		{
			if (this.allowMethod(methodName, screenURL, event.target.location.href, params))
			{
				// TODO: before doing the eval make sure that the this.chromeWin and the this.domWindow are set correctly
				screenResponse = eval("this." + methodName + "(screenURL, \"" + event.target.location.href + "\", params);");
			}
		}

		return screenResponse;
	};

	this.checkMethodRequest = function (reqMethodName, methodNames, reqScreenURL, screenURLSnippet, reqLoadedURL, loadedURLSnippet)
	{
		//this.repl.print("inside checkMethodRequest: " + reqMethodName + " :: " + methodName[0]);
		var nameIndex;
		for (nameIndex in methodNames)
		{
			if (reqMethodName === methodNames[nameIndex])
			{
				return reqScreenURL.indexOf(screenURLSnippet) !== -1 && reqLoadedURL.indexOf(loadedURLSnippet) !== -1;
			}
		}
		
		return false;
	};
	
	this.dispatchClickEvent = function (theDOMWindow, toClick)
	{
		// NOTE: do not use the this.currentScreenURL or the this.currentScreenMethod
		// or the this.params objects inside this method as those objects are
		// being set for the next page by he time this method is called
		
		var mouseClick = theDOMWindow.document.createEvent("MouseEvents");
		mouseClick.initMouseEvent('click', true, true, theDOMWindow, 1, 0, 0, 0, 0, false, false, false, false, 0, null);
		toClick.dispatchEvent(mouseClick);
	};
	
	this.getFormInput = function (theDOMWindow, formName, inputName)
	{
		//this.repl.print("inside getFormInput: " + formName + "." + inputName);
		return theDOMWindow.document.forms.namedItem(formName).elements.namedItem(inputName);
	};
	
	this.inputsExist = function (theDOMWindow, formName, inputNames)
	{
		//this.repl.print("inside inputsExist: " + inputNames.length);
		var inputIndex;
		for (inputIndex in inputNames)
		{
			if (!(this.getFormInput(theDOMWindow, formName, inputNames[inputIndex])))
			{
				return false;
			}
		}
		
		return true;
	};
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
var domContentCallback = function (event)
{
	globalURLHandler.onloadHandler(event);
};

//<><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><>
// this section is the definition of the UrlHandler object
//<><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><>
function UrlHandler(repl)
{
	this.repl = repl;
	this.webScreens = new WebScreens(this);
	
	this.onloadHandler = function (event)
	{
		// TODO: for any given "event" parameter, we need to make sure
		// that the below processURL method is only invoked once or the side
		// effects could be undesireable!!!!!

		var screenResponse;
		
		// this method is invoked on a callback after each web page is
		// completely loaded into the browser, the code that registers
		// this method as the callback handler for those events is in
		// the kernel.js code; this method kicks off the invoking
		// of the screenMethod method using the eval key word
		//this.repl.print("onloadHandler with event " + event.type + " and currentScreenURL as: " + this.currentScreenURL + " :: currentScreenMethod as: " + this.currentScreenMethod);
		
		// loop over the properties of the event object to see what it's properties are
		
		//this.addEventListener();
		
		// TODO: now you can finally invoke the screenMethod method
		// of the this.webScreens object
		// the this.webScreens object is responsible for determining
		// what the next page is and returning that information here!!!!
		//this.repl.print("Here 1");
		screenResponse = this.webScreens.processURL(event);
		//this.repl.print("Here 2");
		
		
		// TODO: figure out what the next URL is based on what the webScreens.processURL method returned
		// the screenResponse returned from processURL controls whether
		// a URL from the queue is used or if a button was clicked on
		// or if no other URL should be loaded
		if (screenResponse !== undefined)
		{
			this.repl.print("processURL returned screenResponse as: (isDone," + screenResponse.isDone + ") :: (chromeWin," + screenResponse.chromeWin + ")");

			if (screenResponse.isDone)
			{
				this.removeEventListener(screenResponse.chromeWin);
			}
		}
		
	};
	
	
	this.addEventListener = function (theChromeWin)
	{
		// TODO: loop over all of the windows that are open and add the onloadCallback as an event listener
		
		theChromeWin.document.addEventListener('DOMContentLoaded', domContentCallback, true);
		//theChromeWin.document.addEventListener('load', onloadCallback, true);
	};
	
	this.removeEventListener = function (theChromeWin)
	{
		// TODO: loop over all of the windows that are open and add the onloadCallback as an event listener
		
		theChromeWin.document.removeEventListener('DOMContentLoaded', domContentCallback, true);
		//theChromeWin.document.removeEventListener('load', onloadCallback, true);
	};
	
	this.printEvent  = function (event)
	{
		this.repl.print("*************** @@@@@@@@@ BEGIN EVENT " + event.type + " @@@@@@@@@@@@@ ********************");
		//event.type: load
		//event.target: [object XULElement]
		this.repl.print("The event.target.location.href URL is: " + event.target.location.href);
		//event.originalTarget: [object XULElement]
		this.repl.print("The event.originalTarget.location.href URL is: " + event.originalTarget.location.href);
		//event.currentTarget: [object XULDocument]
		this.repl.print("The event.currentTarget.location.href URL is: " + event.currentTarget.location.href);
		//event.explicitOriginalTarget: [object XULElement]
		this.repl.print("The event.explicitOriginalTarget.location.href URL is: " + event.explicitOriginalTarget.location.href);

		//for (prop in event)
		//{
		//	this.repl.print("event." + prop + ": " + event[prop]);
		//}

		this.repl.print("__________________________ END EVENT " + event.type + " _____________________________________");
	};
}


//<><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><>
// This section is the initialization of the globalURLHandler
//<><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><>
globalURLHandler = new UrlHandler(this);




