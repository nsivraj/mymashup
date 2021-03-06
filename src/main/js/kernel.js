//<><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><>
// this section is for configuring jslint
//<><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><>
/*jslint nomen: false, debug: false,
    evil: false, onevar: true */
/*global Components: false, Ci: false */


//Components.utils.import("resource://gre/modules/DomUtils.jsm");
//var domUtil = Components.classes["@mozilla.org/inspector/dom-utils;1"].getService(Components.interfaces.inIDOMUtils);

//<><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><>
// this section is for functions that test the kernel
//<><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><>
var loadedWebActorAt = new Date();

function reportWebActor()
{
    this.print('kernel.js was loaded at ' + loadedWebActorAt);
}




//<><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><>
// This section is the declaration of the webActor
// and the onloadCallback method
//<><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><>
var webActor;
var onloadCallback = function (event)
{
    webActor.onloadHandler(event);
};
var domContentCallback = function (event)
{
    webActor.onloadHandler(event);
};



//<><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><>
// this section is the definition of the WebActor object
//<><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><>
function WebActor(repl)
{
    this.repl = repl;
    if (this.repl._workContext instanceof Ci.nsIDOMWindow)
    {
        this.origChromeWin = this.repl._workContext.window;
        this.origDomWindow = this.repl._workContext.content.window;
    }
    else
    {
        throw new Error('Not in a window.');
    }
    this.chromeWin = this.origChromeWin;
    this.domWindow = this.origDomWindow;
    this.params = {};
    this.currentScreenURL = "";
    this.currentScreenMethod = "";
    this.prompts = Components.classes["@mozilla.org/embedcomp/prompt-service;1"].getService(Components.interfaces.nsIPromptService);  
    

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
        
        // TODO: now you can finally invoke the processURL method
        // the processURL method is responsible for determining
        // what the next page is and returning that information here!!!!
        //this.repl.print("Here 1");
        screenResponse = this.processURL(event);
        //this.repl.print("Here 2");
        
        
        // TODO: figure out what the next URL is based on what the processURL method returned
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
        //this.repl.print("Trying to add DOMContentLoaded event listener...");
        
        theChromeWin.document.addEventListener('DOMContentLoaded', domContentCallback, true);
        //theChromeWin.document.addEventListener('load', onloadCallback, true);
    };
    
    this.removeEventListener = function (theChromeWin)
    {
        // TODO: loop over all of the windows that are open and add the onloadCallback as an event listener
        //this.repl.print("Trying to remove DOMContentLoaded event listener...");
        
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
        //    this.repl.print("event." + prop + ": " + event[prop]);
        //}

        this.repl.print("__________________________ END EVENT " + event.type + " _____________________________________");
    };
    

    
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Event handler methods are above and the WebActor processing is below
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


    
    this.gotoNextURL = function (screenURL, screenMethod, params)
    {
        this.params = params;
        this.currentScreenURL = screenURL;
        this.currentScreenMethod = screenMethod;
        
        //this.repl.print("Going to URL '" + screenURL + "' with method '" + screenMethod + "'.");
        this.addEventListener(this.chromeWin);
        
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
        params.event = event;
        
        
        // THIS NEXT if STATEMENT IS FOR DEBUG
//        if (event.target !== undefined && event.target.location !== undefined)
//        {
//            this.repl.print("Invoking processURL: " + screenURL + " :: " + methodName + " :: " + event.type + " :: " + event.target.location.href);
//        }
//        else
//        {
//            this.repl.print("Invoking processURL: " + screenURL + " :: " + methodName + " :: " + event.type + " :: " + undefined);
//        }
        
        // THIS NEXT for LOOP IS FOR DEBUG
        //for (var prop in params)
        //{
        //    this.repl.print("params." + prop + ": " + params[prop]);
        //}
        
        // DONE: use eval method to invoke the methodName
        //this.repl.print("The event.target URL is: " + event.target);
        //this.repl.print("The event.target.location URL is: " + event.target.location);
        //this.repl.print("The event.type is: " + event.type);
        //this.repl.print("The event.target.location.href URL is: " + event.target.location.href);

        // THIS STATEMENT IS FOR DEBUG
        //this.printEvent(event);
        if (event.target !== undefined && event.target.location !== undefined &&
            "DOMContentLoaded" === event.type)
        {
            //this.repl.print("about to call allowMethod...");
            isAllowed = this.allowMethod(methodName, screenURL, event.target.location.href, params);
            //this.repl.print("called allowMethod: "+isAllowed);
            if (isAllowed)
            {
                params.event = event;
                //this.repl.print("processURL --> params.event.target.location.href: " + params.event.target.location.href);
                //this.repl.print("processURL --> event.target.location.href: " + event.target.location.href);
                //this.repl.print("TRUE :: checking method '" + methodName + "' and screenURL '" + screenURL + "' and loadedURL '" + event.target.location.href + "'");
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
    
    
    this.dispatchClickEvent = function (eventWindow, toClick)
    {
        //need to figure out how to click on a XUL button in the chrome window
        
        /*
         
Oh, if you're writing a test, you should just use the methods in
nsIDOMWindowUtils. sendMouseEvent in your case should work fine, which
fires a mouse event as the platform-specific widget code would send it.
You'll need to fire both a 'mousedown' and a 'mouseup'.          



Hi,

I'm trying to simulate mouse click on some element through
sendMouseEvent() (I can't use element.dispatchEvent() for some
reasons).
I'm experiencing problems with passing correct parameters.
Say if I have a DOM element how can I find x,y for sendMouseEvent?

My current code is as follows:
function simulateClick(element) {
// get nsIDOMWindowUtils from content window
var win = element.ownerDocument.defaultView;
var req = win.QueryInterface(Ci.nsIInterfaceRequestor);
var utils = req.getInterface(Ci.nsIDOMWindowUtils);

var pos = findElementPosition(element);
var x = pos.x+win.scrollX, y = pos.y+win.scrollY;

utils.sendMouseEvent("mousedown", x, y, 0, 1, 0);
utils.sendMouseEvent("mouseup", x, y, 0, 1, 0);
}

function findElementPosition(element) {
var e = element;
var pos = {x: 0, y: 0};
while (e) {
var x = 0, y = 0, ee = e;
while (ee) {
x += ee.offsetLeft;
y += ee.offsetTop;
ee = ee.offsetParent;
}
pos.x += x;
pos.y += y;
e = e.ownerDocument.defaultView.frameElement;
}

pos.x += Math.round(element.offsetWidth/2);
pos.y += Math.round(element.offsetHeight/2);

return pos;
}


Thanks,
Denis 

         
         
         */
        
        
        // NOTE: do not use the this.currentScreenURL or the this.currentScreenMethod
        // or the this.params objects inside this method as those objects are
        // being set for the next page by he time this method is called
        
        // click, mousedown, mouseup, mouseover, mousemove, mouseout.
        
        //check to see if toClick is a toolbarbutton element and if it is then
        //try to use the .click method rather than trying the dispatchEvent method
        //or try to dispatch a mousedown and mouseup event
        
        
        //this.repl.print("Inside dispatchClickEvent 1 : " + eventWindow + " :: tagName " + toClick.tagName);
        if ("toolbarbutton" === toClick.tagName)
        {
            toClick.click();
        }
        else
        {
            var mouseClick = eventWindow.document.createEvent("MouseEvents");
            //this.repl.print("Inside dispatchClickEvent 2");
            mouseClick.initMouseEvent('click', true, true, eventWindow, 1, 0, 0, 0, 0, false, false, false, false, 0, null);
            //this.repl.print("Inside dispatchClickEvent 3");
            toClick.dispatchEvent(mouseClick);
            //this.debugEvent(mouseClick);
            //this.repl.print("Inside dispatchClickEvent 4");
        }
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


    this.debugObject = function (obj)
    {
        var attr;
        
        // This section is for debugging
        this.repl.print("===================================================================================================================================");
        this.repl.print("The object is: " + obj);
        
        for (attr in obj)
        {
            if (attr)
            {
                this.repl.print("The attributes of the object are: " + attr + " :: " + eval("obj." + attr));
                //this.repl.print("The attributes of the object are: " + attr + " :: " + eval("typeof obj." + attr));
            }
        }
        this.repl.print("===================================================================================================================================");
    };
    
    
    this.debugEvent = function (event)
    {
        var attr;
        
        // This section is for debugging
        this.repl.print("===================================================================================================================================");
        this.repl.print("The event.target is: " + event.target);
        
        for (attr in event)
        {
            if (attr)
            {
                this.repl.print("The attributes of the click event are: " + attr + " :: " + eval("event." + attr));
            }
        }
        
        
        /*this.repl.print("The event.target.tagName is: " + event.target.tagName);
        this.repl.print("The event.target.nodeName is: " + event.target.nodeName);
        this.repl.print("The event.type is: " + event.type);
        this.repl.print("The typeof event.type is: " + (typeof event.type));
        for (attr in event.type)
        {
            if (attr) { this.repl.print("The attributes of the event.type object are: " + attr); } // + " :: " + eval("event.type."+attr)); }
        }
        for (attr in event.target)
        {
            if (attr) { this.repl.print("The attributes of the event.target object are: " + attr + " :: " + eval("event.target."+attr)); }
        }
        for (attr in event.originalTarget)
        {
            if (attr) { this.repl.print("The attributes of the event.originalTarget object are: " + attr + " :: " + eval("event.originalTarget."+attr)); }
        }*/
        
        
        this.repl.print("===================================================================================================================================");
    };
    
    
    this.findDOMWindow = function (event)
    {
        var foundWindow = this.findEventWindow(event);
        
        if (foundWindow  instanceof Ci.nsIDOMWindow)
        {
            foundWindow = foundWindow.content.window;
        }
        //this.debugObject(foundWindow);
        //this.repl.print("This is the dom window: " + foundWindow);
        
        return foundWindow;
    };
    
    
    this.findEventWindow = function (event)
    {
        var foundWindow = this.origDomWindow;
        if (event)
        {
            // TODO: set foundWindow to the dom window where the event took place!!
            if (event.target && event.target.ownerDocument &&
               event.target.ownerDocument.defaultView &&
               event.target.ownerDocument.defaultView.window)
            {
                foundWindow = event.target.ownerDocument.defaultView.window;
                //this.repl.print("Found window using standard DOM JSObject " + event);
            }
            else if (event.target && event.target.wrappedJSObject &&
                    event.target.wrappedJSObject.defaultView &&
                    event.target.wrappedJSObject.defaultView.window)
            {
                foundWindow = event.target.wrappedJSObject.defaultView.window;
                this.repl.print("Found window using wrapped JSObject " + event);
            }
            else
            {
                this.repl.print("Could not find owner window for event " + event);
                if (event.target)
                {
                    this.repl.print("event.target: " + event.target);
                    if (event.target.ownerDocument)
                    {
                        this.repl.print("event.target.ownerDocument: " + event.target.ownerDocument);
                        if (event.target.ownerDocument.defaultView)
                        {
                            this.repl.print("event.target.ownerDocument.defaultView: " + event.target.ownerDocument.defaultView);
                            if (event.target.ownerDocument.defaultView.window)
                            {
                                this.repl.print("event.target.ownerDocument.defaultView.window: " + event.target.ownerDocument.defaultView.window);
                            }
                        }
                    }
                }
            }
        }
        
        //this.repl.print("Found window: " + foundWindow);
        
        return foundWindow;
    };
    

    this.trim = function (str)
    {
        str = str.replace(/^\s\s*/, '');
        var ws = /\s/, i = str.length;
        i -= 1;
        while (ws.test(str.charAt(i))) { i -= 1; }
        return str.slice(0, i + 1);
        //return str;
    };
    
    
    this.getHeaderText = function (domDocument)
    {
        // get head content first and parse that into key words that can be used to index the page
        //<head>
        //<meta http-equiv="Content-Type" content="text/html; charset=ISO-8859-1" />
        //<meta name="keywords" content=" Best DOM tree traverse, dhtml, javascript, css, dynamic html, xml, html, php, cgi" />
        //<meta name="description" content="[Archive]  Best DOM tree traverse JavaScript" />
        
        //<title> Best DOM tree traverse [Archive]  - Dynamic Drive Forums</title>
        //<link rel="stylesheet" type="text/css" href="http://www.dynamicdrive.com/forums/archive/archive.css" />
        //</head>

        //var headTags = domDocument.getElementsByTagName("head"), i, 
        var j, metaTags, titleTags, headerText = "";
        // get meta tag named keywords
        // get meta tag named description
        metaTags = domDocument.getElementsByTagName("meta");
        this.repl.print("metaTags.length: " + metaTags.length);
        for (j = 0; j < metaTags.length; j += 1)
        {
            //this.repl.print("metaTags[j]: " + metaTags[j]);
            //this.repl.print("metaTags[j].getAttribute(\"name\"): " + metaTags[j].getAttribute("name"));
            if (metaTags[j] && metaTags[j].getAttribute("name") &&
                metaTags[j].getAttribute("name") !== null &&
                (metaTags[j].getAttribute("name") === "keywords" ||
                 metaTags[j].getAttribute("name") === "description") &&
                metaTags[j].getAttribute("content"))
            {
                //this.repl.print("metaTags[j].getAttribute(\"content\"): " + metaTags[j].getAttribute("content"));
                headerText += " " + this.trim(metaTags[j].getAttribute("content")) + " ";
            }
        }

        // get title tag content
        titleTags = domDocument.getElementsByTagName("title");
        for (j = 0; j < titleTags.length; j += 1)
        {
            if (titleTags[j])
            {
                headerText += " " + this.trim(titleTags[j].textContent) + " ";
            }
        }
        
        return headerText;
    };
    
    
    
    /**
    * go through every child node of element and collect the text
    */
    this.getText = function (element, maxLen)
    {
        var c = element, n = null, textBuffer = "", tmp;

        do
        {
            n = c.firstChild;
            if (n === null)
            {
                // visit c
                if (c.nodeType === 3)
                {
                    textBuffer += " " + this.trim(c.nodeValue) + " "; //.replace(/\s/, "");
                    if (textBuffer.length > maxLen) { break; }
                    // done visit c
                }
            
                n = c.nextSibling;
            }
        
            if (n === null)
            {
                tmp = c;
                do
                {
                    n = tmp.parentNode;
                    if (n === element)
                    {
                        break;
                    }
                    
                    // visit n
                    if (n.nodeType === 3)
                    {
                        textBuffer += " " + this.trim(n.nodeValue) + " "; //.replace(/\s/, "");
                        if (textBuffer.length > maxLen) { break; }
                        // done visit n
                    }
                    
                    tmp = n;
                    n = n.nextSibling;
                }
                while (n === null);
            }
        
            c = n;
        }
        while (c !== element);
        
        return textBuffer;
    };
    
    
    
    /**
     * Gets an XPath for an element which describes its hierarchical location.
     */
    this.getElementXPath = function (element)
    {
        if (element && element.id)
        {
            //this.repl.print("getElementXPath 1");
            return '//*[@id="' + element.id + '"]';
        }
        else
        {
            //this.repl.print("getElementXPath 2");
            return this.getElementTreeXPath(element);
        }
    };

    
    this.getElementTreeXPath = function (element)
    {
        var paths = [], index, sibling, tagName, pathIndex;

        //this.repl.print("getElementTreeXPath 1");
        // Use nodeName (instead of localName) so namespace prefix is included (if any).
        for (; element && element.nodeType === 1; element = element.parentNode)
        {
            index = 0;
            //this.repl.print("getElementTreeXPath 2");
            for (sibling = element.previousSibling; sibling; sibling = sibling.previousSibling)
            {
                //this.repl.print("getElementTreeXPath 3 -- " + sibling);
                //this.repl.print("getElementTreeXPath 3 -- " + domWindow.Node.DOCUMENT_TYPE_NODE);
                //this.repl.print("getElementTreeXPath 3 -- " + sibling.nodeType);
                // Ignore document type declaration.
                if (sibling.nodeType === this.chromeWin.Node.DOCUMENT_TYPE_NODE)
                {
                    continue;
                }

                //this.repl.print("getElementTreeXPath 4");
                if (sibling.nodeName === element.nodeName)
                {
                    index += 1;
                }
            }

            //this.repl.print("getElementTreeXPath 5");
            tagName = element.nodeName.toLowerCase();
            //this.repl.print("getElementTreeXPath 6");
            pathIndex = (index ? "[" + (index + 1) + "]" : "");
            //this.repl.print("getElementTreeXPath 7");
            paths.splice(0, 0, tagName + pathIndex);
        }

        //this.repl.print("getElementTreeXPath 8");
        return paths.length ? "/" + paths.join("/") : null;
        
        
        /*
        var paths = [];

        // Use nodeName (instead of localName) so namespace prefix is included (if any).
        for (; element && element.nodeType == 1; element = element.parentNode)
        {
            var index = 0;
            for (var sibling = element.previousSibling; sibling; sibling = sibling.previousSibling)
            {
                // Ignore document type declaration.
                if (sibling.nodeType == this.chromeWin.Node.DOCUMENT_TYPE_NODE)
                    continue;

                if (sibling.nodeName == element.nodeName)
                    ++index;
            }

            var tagName = element.nodeName.toLowerCase();
            var pathIndex = (index ? "[" + (index+1) + "]" : "");
            paths.splice(0, 0, tagName + pathIndex);
        }

        return paths.length ? "/" + paths.join("/") : null;
        */
    };

    
    this.getElementsUsingXPath = function (domWindow, elementXPath)
    {
        var elements = [], result, item;

        try {
            result = domWindow.document.evaluate(elementXPath, domWindow.document, null, domWindow.XPathResult.ANY_TYPE, null);
            
            for (item = result.iterateNext(); item; item = result.iterateNext())
            {
                elements.push(item);
            }
        }
        catch (exc)
        {
            // Invalid xpath expressions make their way here sometimes.  If that happens,
            // we still want to return an empty set without an exception.
        }

        return elements;
    };
    
    
    this.getElementsUsingTagNameAndIdentifier = function (tagName, identifier)
    {
        // var elements = document.getElementsByTagName(tagName);
        // loop over elements
        // for each element in elements
        // if(element has identifier as an attribute or it equals the elements xpath) return element
        // done for loop
        // return undefined
    };
    
}


//<><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><>
// This section is the initialization of the webActor
//<><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><>
webActor = new WebActor(this);




