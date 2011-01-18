//<><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><>
// this section is for configuring jslint
//<><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><>
/*jslint nomen: false, debug: false,
    evil: false, onevar: true */
/*global Components: false */


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
	this.prompts = Components.classes["@mozilla.org/embedcomp/prompt-service;1"].getService(Components.interfaces.nsIPromptService);  

	this.gotoNextURL = function (screenURL, screenMethod, params)
	{
		this.params = params;
		this.currentScreenURL = screenURL;
		this.currentScreenMethod = screenMethod;
		
		this.repl.print("Going to URL '" + screenURL + "' with method '" + screenMethod + "'.");
		this.handler.addEventListener(this.chromeWin);
		
		// this method basically does an HTTP GET of the screenURL
		// in order to start the sequence of screens, it causes
		// the onloadHandler below to get invoked after the
		// screenURL loads
		//this.repl.print("Setting this.domWindow.location.href to: " + screenURL);
		//this.repl.print("this.domWindow is: " + this.domWindow);
		if (screenURL.length > 0)
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
		
		
		var isAllowed, screenResponse, screenURL = this.currentScreenURL,
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
			isAllowed = this.allowMethod(methodName, screenURL, event.target.location.href, params);
			if (isAllowed)
			{
				this.repl.print("TRUE :: checking method '" + methodName + "' and screenURL '" + screenURL + "' and loadedURL '" + event.target.location.href + "'");
				// TODO: before doing the eval make sure that the this.chromeWin and the this.domWindow are set correctly
				screenResponse = eval("this." + methodName + "(screenURL, \"" + event.target.location.href + "\", params);");
			}
		}

		return screenResponse;
	};

	
	this.checkMethodRequest = function (reqMethodName, methodNames, reqScreenURL, screenURLSnippet, reqLoadedURL, loadedURLSnippet)
	{
		//this.repl.print("inside checkMethodRequest: " + reqMethodName + " :: " + methodNames[0] + " :: " + reqScreenURL + " :: " + reqLoadedURL);
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
	
	
	this.promptForInput = function (theDOMWindow, promptText, defaultValue)
	{
		if (!defaultValue)
		{
			defaultValue = '';
		}
		
		var check, input, result;
		
		check = {value: false};                  // default the checkbox to false  
		input = {value: defaultValue};                  // default the edit field to Bob  
		result = this.prompts.prompt(theDOMWindow, "Data Input", promptText, input, null, check);
		
		// result is true if OK is pressed, false if Cancel.
		// input.value holds the value of the edit field if "OK" was pressed. 
		
		return (result ? input.value : defaultValue);
	};
	
	
	this.promptForPassword = function (theDOMWindow, promptText, defaultValue)
	{
		if (!defaultValue)
		{
			defaultValue = '';
		}
		
		var password, check, result;
		
		password = {value: defaultValue};              // default the password to pass  
		check = {value: false};                   // default the checkbox to false
		result = this.prompts.promptPassword(theDOMWindow, "Password", promptText, password, null, check);  

		// result is true if OK was pressed, false if cancel was pressed.
		// password.value is set if OK was pressed. The checkbox is not displayed. 
		
		return (result ? password.value : defaultValue);
	};
	
	
	this.promptForUsernameAndPassword = function (theDOMWindow, promptText, defaultUser, defaultPass)
	{
		if (!defaultUser)
		{
			defaultUser = '';
		}
		
		if (!defaultPass)
		{
			defaultPass = '';
		}

		var username, password, check, result;

		username = {value: defaultUser};              // default the username to user  
		password = {value: defaultPass};              // default the password to pass  
		check = {value: false};                   // default the checkbox to false  
		result = this.prompts.promptUsernameAndPassword(theDOMWindow, "Username and Password", promptText,  
		                                                username, password, "Save", check);
		
		// result is true if OK was pressed, false if cancel was pressed.
		// username.value, password.value, and check.value are set if OK was pressed.
		
		return (result ? [username.value, password.value] : [defaultUser, defaultPass]);
	};
	
	
	this.selectInput = function (theDOMWindow, promptText, items, defaultValue)
	{
		if (!defaultValue)
		{
			defaultValue = '';
		}
		
		var selected = {}, result;
		
		//var items = ["Hello", "Welcome", "Howdy", "Hi", ":)"]; // list items  
		result = this.prompts.select(theDOMWindow, "Select Input", promptText, items.length,  
				                     items, selected);  
		
		// result is true if OK was pressed, false if cancel.
		// selected is the index of the item array  
		// that was selected. Get the item using items[selected.value].
		
		return (result ? items[selected.value] : defaultValue);
	};
	
	
	this.dispatchClickEvent = function (theDOMWindow, toClick)
	{
		// NOTE: do not use the this.currentScreenURL or the this.currentScreenMethod
		// or the this.params objects inside this method as those objects are
		// being set for the next page by he time this method is called
		
		//this.repl.print("Inside dispatchClickEvent 1");
		var mouseClick = theDOMWindow.document.createEvent("MouseEvents");
		//this.repl.print("Inside dispatchClickEvent 2");
		mouseClick.initMouseEvent('click', true, true, theDOMWindow, 1, 0, 0, 0, 0, false, false, false, false, 0, null);
		//this.repl.print("Inside dispatchClickEvent 3");
		toClick.dispatchEvent(mouseClick);
		//this.repl.print("Inside dispatchClickEvent 4");
	};
	
	
	this.handleSelect = function (theDOMWindow, formName, inputName, selIndex)
	{
		var selIndexIsInt = (typeof selIndex === 'number'),
		    selectElem, optionIndex;

		//this.repl.print("Inside handleSelect 1: " + selIndex);
		selectElem = this.getFormInput(theDOMWindow, formName, inputName);
		//this.repl.print("Inside handleSelect 2: " + selectElem);
		if (selIndexIsInt)
		{
			selectElem.selectedIndex = selIndex;
		}
		else
		{
			//this.repl.print("Inside handleSelect 2.5.1: " + selectElem.options);
			//this.repl.print("Inside handleSelect 2.5.2: " + selectElem.options.namedItem(selIndex));
			if (selectElem.options.namedItem(selIndex))
			{
				// now find the selIndex in the array of options
				selectElem.selectedIndex = selectElem.options.namedItem(selIndex).index;
			}
			else
			{
				// loop through the options list and find the index of
				// the one with the value equal to selIndex
				//this.repl.print("Inside handleSelect 2.5.3: " + selectElem.options);
				for (optionIndex = 0; optionIndex < selectElem.length; optionIndex += 1)
				{
					//this.repl.print("Inside handleSelect 2.5.4: " + optionIndex);
					if (selectElem.options[optionIndex].value === selIndex)
					{
						//this.repl.print("Inside handleSelect 2.5.5: " + optionIndex);
						selectElem.selectedIndex = optionIndex;
						break;
					}
				}
			}
		}
		//this.repl.print("Inside handleSelect 3.");
		this.dispatchClickEvent(theDOMWindow, selectElem);
		//this.repl.print("Inside handleSelect 4.");
	};
	
		
	this.handleRadioButton = function (theDOMWindow, formName, groupName, radioValue, isChecked)
	{
		var radioElem,
		    radioButtons = this.getFormGroup(theDOMWindow, formName, groupName);
		
		for (radioElem in radioButtons)
		{
			if (radioElem.value === radioValue)
			{
				radioElem.checked = isChecked;
				this.dispatchClickEvent(theDOMWindow, radioElem);
				break;
			}
		}
	};
	
	
	this.getFormGroup = function (theDOMWindow, formName, groupName)
	{
		var formNameIsInt = (typeof formName === 'number'),
	        formGroup;
		
		if (formNameIsInt)
		{
			formGroup = theDOMWindow.document.forms.item(formName)[groupName];
		}
		else
		{
			formGroup = theDOMWindow.document.forms.namedItem(formName)[groupName];
		}
		
		return formGroup;
	};
	
	
	this.getFormInput = function (theDOMWindow, formName, inputName)
	{
		var formNameIsInt = (typeof formName === 'number'),
		    inputNameIsInt = (typeof inputName === 'number'),
		    formInputElement;
		
		//this.repl.print("formNameIsInt: " + formNameIsInt + " :: inputNameIsInt: " + inputNameIsInt);
		if (!formNameIsInt && !inputNameIsInt)
		{
			//this.repl.print("inside getFormInput theDOMWindow.document.forms.namedItem(" + formName + "): " + theDOMWindow.document.forms.namedItem(formName));
			formInputElement = theDOMWindow.document.forms.namedItem(formName).elements.namedItem(inputName);
		}
		else if (formNameIsInt && !inputNameIsInt)
		{
			//this.repl.print("inside getFormInput theDOMWindow.document.forms.item(" + formName + "): " + theDOMWindow.document.forms.item(formName));
			//this.repl.print("inside getFormInput theDOMWindow.document.forms.item(" + formName + ").elements: " + theDOMWindow.document.forms.item(formName).elements);
			//this.repl.print("inside getFormInput theDOMWindow.document.forms.item(" + formName + ").elements.namedItem(" + inputName+ "): " + theDOMWindow.document.forms.item(formName).elements.namedItem(inputName));
			//this.repl.print("inside getFormInput theDOMWindow.document.forms.item(" + formName + ").elements[" + inputName+ "]: " + theDOMWindow.document.forms.item(formName).elements[inputName]);

			formInputElement = theDOMWindow.document.forms.item(formName).elements.namedItem(inputName);
		}
		else if (!formNameIsInt && inputNameIsInt)
		{
			//this.repl.print("inside getFormInput theDOMWindow.document.forms.namedItem(" + formName + "): " + theDOMWindow.document.forms.namedItem(formName));
			formInputElement = theDOMWindow.document.forms.namedItem(formName).elements.item(inputName);
		}
		else if (formNameIsInt && inputNameIsInt)
		{
			//this.repl.print("inside getFormInput theDOMWindow.document.forms.item(" + formName + "): " + theDOMWindow.document.forms.item(formName));
			formInputElement = theDOMWindow.document.forms.item(formName).elements.item(inputName);
		}
		
		//this.repl.print("inside getFormInput: " + formName + "." + inputName + " :: " + formInputElement);
		return formInputElement;
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
	
	this.handleError = function (methodName, params)
	{
		this.repl.print(methodName + ": some of the inputs do not exist!!");
		this.gotoNextURL("", "errorInScreen", params);
		
		var screenResponse = {};
		screenResponse.isDone = true;
		screenResponse.chromeWin = this.chromeWin;
		
		return screenResponse;
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
		//this.repl.print("processURL returned screenResponse as: " + screenResponse);
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




