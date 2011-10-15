//<><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><>
// this section is for configuring jslint
//<><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><>
/*jslint nomen: false, debug: false,
    evil: false, onevar: true */
/*global webActor: false, WebActor: false, Ci: false, Components: false */




////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Global variables used in the Crumbs methods
////////////////////////////////////////////////////////////////////////////////////////////////////////////
var crumbs = [];
////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////

function CrumbEvent(event)
{
    // TODO: make the attributes of this class the same as those of the event object being passed in
    
    // TODO: the event object being passed in could be of type CrumbEvent
    
    this.type = event.type;
    this.waitForReload = false;
    
    this.toString = function ()
    {
        return this.type + " :: " + this.waitForReload;
    };
}


function Crumb(crumbURL, event)
{
    this.crumbURL = crumbURL;
    this.elementXPath = webActor.getElementXPath(event.target);
    // TODO: the event object being passed in could be of type CrumbEvent and if it is then
    // just use the event being passed in
    this.crumbEvent = new CrumbEvent(event);

    var localDomWindow = webActor.findDOMWindow(event);
    webActor.repl.print("Current web browser URL: " + localDomWindow.document.location.href);
    webActor.repl.print("Adding event for [" + crumbs.length + "]: " + this.crumbEvent + " and element " + event.target + " and elementXPath " + this.elementXPath + " and URL " + this.crumbURL);
    
    this.toString = function ()
    {
        return this.crumbURL + " :: " + this.crumbEvent + " :: " + this.elementXPath;
    };
    
}






/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// This starts the implementation section of the Crumbs features
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
function record()
{
    var domWindow = webActor.origDomWindow,
    chromeWin = webActor.origChromeWin,
    prevTitle, prevEl, prevOutline,
    result = {}, params = {};
    
    // record what the location of the current page is
    crumbs.startingURL = domWindow.document.location.href;
    webActor.repl.print("Starting at page: " + crumbs.startingURL);
    
    //prevTitle = domWindow.top.title;
    //prevTitle = domWindow.document.title;
    
    
    
    
    function onOver(event)
    {
        var curEl = event.target;

        //webActor.findEventWindow(event).document.title =
        //    '<' + curEl + '> in ' + curEl.ownerDocument.location.href;

        if (prevEl)
        {
            prevEl.style.outline = prevOutline;
        }

        prevEl = curEl;
        prevOutline = curEl.style.outline;

        curEl.style.outline = '4px dashed #FF0000';
    }

    
    function onKeypress(event)
    {
        var localEventWindow;

        webActor.repl.print("Key has been pressed");
        
        //debugEvent(event);
        
        // TODO: need to do something similar to the onClick method
        // where the target of the event get's highlighted in the
        // browser and then in addition we record the key strokes or take the value
        // of the target each time this method is called;
        
        // TODO: need to handle
        // the 'tab' character in a special way because it should cause
        // a new element in the page to be highlighted...;
        
        // TODO: need to catch any keystroke that may cause the
        // actual page to submit/reload and then make sure that the
        // keypress event is triggered on that target during playback
        // so that we can get to the next page
        
        // TODO: change 'event.target' below to the xpath of 'event.target'
        //crumbs.push(webActor.findEventWindow(event).document.location.href + "__||__keypress__||__" + event.target);
        localEventWindow = webActor.findEventWindow(event);
        crumbs.push(new Crumb(localEventWindow.document.location.href, event));
    }
    
    
    function reset(event)
    {
        prevEl.style.outline = prevOutline;
        //webActor.findEventWindow(event).top.title = prevTitle;
        //webActor.findEventWindow(event).document.title = prevTitle;
    }


    function onClick(event)
    {
        var attr, localEventWindow, localDomWindow;
        
        // TODO: is event.target an action to cause a change in the page (i.e.
        //       <a href="..."...> or <input type="image"...> or <img ...> or
        //       <input type="button"...> or <input type="submit"...>) OR is
        //       event.target a form element 
        
        //debugEvent(event);
        
        //webActor.repl.print("onClick: 1");
        
        reset(event);
        //webActor.repl.print("onClick: 2");
        //webActor.repl.print("Checking event.target.tagName to see if ready to quit ... " + event.target.tagName);
        if (event.target.tagName === "toolbarbutton" && event.target.id === "stop-button")
        {
            webActor.repl.print("Invoking the done(event) method because event.target.tagName === " + event.target.tagName + " and event.target.id === " + event.target.id);
            localDomWindow = webActor.findDOMWindow(event);
            webActor.repl.print("Ending URL in the web browser is: " + localDomWindow.document.location.href);
            done(event);
            //webActor.repl.print("onClick: 3");
        }
        else
        {
            // TODO: change 'event.target' below to the xpath of 'event.target'
            //crumbs.push(webActor.findEventWindow(event).document.location.href + "__||__click__||__" + event.target);
            localEventWindow = webActor.findEventWindow(event);
            crumbs.push(new Crumb(localEventWindow.document.location.href, event));
        }
        
        //webActor.repl.print("onClick: 4");
    }


    function done(event)
    {
        webActor.repl.print("Done clicking on objects, so removing listeners!!");
        chromeWin.document.removeEventListener('click', onClick, true);
        chromeWin.document.removeEventListener('mouseover', onOver, true);
        chromeWin.document.removeEventListener('keypress', onKeypress, true);
        reset(event);
        
        // TODO: now write out to a file which elements have been clicked on to play it back later
        
    }
    

    chromeWin.document.addEventListener('click', onClick, true);
    chromeWin.document.addEventListener('mouseover', onOver, true);
    chromeWin.document.addEventListener('keypress', onKeypress, true);
    params.invokedFromMethod = "record";
    webActor.gotoNextURL("", "recordReload", params);
    
    return result;
}


function stopRecording()
{

}


function clear()
{
    crumbs.length = 0;
}


function playback()
{
    var domWindow = webActor.origDomWindow,
        result = {}, params = {};
    
    // TODO: check to make sure that recording is stopped and if it is
    // not yet stopped then send a click event to the XUL windows
    // stop button
    
    
    if (crumbs && crumbs.length > 0 && crumbs.startingURL)
    {
        params.invokedFromMethod = "playback";
        params.crumbsIndex = 0;
        
        if (domWindow.document.location.href !== crumbs.startingURL)
        {
            domWindow.alert("Going to the starting page: " + crumbs.startingURL);
            //domWindow.document.location.href = crumbs.startingURL;
            webActor.gotoNextURL(crumbs.startingURL, "crumbProcessor", params);
        }
        else
        {
            webActor.gotoNextURL("", "crumbProcessor", params);
            webActor.crumbProcessor(crumbs.startingURL, crumbs.startingURL, params);
        }
    }
    
    return result;
    
}









WebActor.prototype.allowMethod = function (methodName, screenURL, loadedURL, params)
{
    //this.repl.print("inside allowMethod...");
    
    return (
        this.checkMethodRequest(
            methodName, ["crumbProcessor"],
            screenURL, "",
            loadedURL, ""
        ) || this.checkMethodRequest(
                methodName, ["recordReload"],
                screenURL, "",
                loadedURL, ""
        )
    );
};



WebActor.prototype.recordReload = function (screenURL, loadedURL, params)
{
    crumbs[crumbs.length - 1].crumbEvent.waitForReload = true;
    this.repl.print("Recording the reload event for screenURL: " + screenURL + " and loadedURL " + loadedURL + " and crumb " + crumbs[crumbs.length - 1]);
};



WebActor.prototype.crumbProcessor = function (screenURL, loadedURL, params)
{
    //this.repl.print("Inside crumbProcessor!!!");
    var crumb, crumbElements, i = params.crumbsIndex, eventWindow = this.domWindow, localDomWindow;
    
    // TODO: Now loop over each of the elements that was clicked on and click on them in turn
    for (; i < crumbs.length; i += 1)
    {
        params.crumbsIndex = i + 1;
        crumb = crumbs[i];
        
        //this.debugEvent(params.event);
        localDomWindow = webActor.findDOMWindow(params.event);
        webActor.repl.print("Current web browser URL: " + localDomWindow.document.location.href);

        // load in the saved elements and playback the events
        this.repl.print("Playing back user event: " + crumb + " at index " + i);
        
        if (crumb.crumbEvent.type === "click")
        {
            // find the dom element and click on it
            crumbElements = this.getElementsUsingXPath(eventWindow, crumb.elementXPath);
            if (crumbElements.length <= 0)
            {
                eventWindow = this.chromeWin;
                crumbElements = this.getElementsUsingXPath(eventWindow, crumb.elementXPath);
            }
            this.repl.print("The crumb element is: " + crumbElements + " :: " + crumbElements.length + " :: " + crumbElements[0]);

            if (crumbElements.length > 0)
            {
                if (crumb.crumbEvent.waitForReload)
                {
                    webActor.gotoNextURL("", "crumbProcessor", params);
                    this.dispatchClickEvent(eventWindow, crumbElements[0]);
                    this.repl.print("Waiting for the page to reload [" + i + "]... :: screenURL: " + screenURL + " :: loadedURL: " + loadedURL);
                    break;
                }
                else
                {
                    //for some reason these two lines do not cause the URL in the browser to change, not
                    //sure why as it should, this is the case there the element that was
                    //clicked on originally is an anchor rather than an href...
                    
                    //actually, these two lines do cause the browser to change but the propagation of the
                    //event through the dom takes longer than the for loop that we are in and 
                    //so another onclick callback method needs to be provided so that it can
                    //launch back into this method to finish the for loop because an onload
                    //event does not get triggered by the this.dispatchClickEvent method call
                    //for an anchor; basically, this method needs to be reinvoked for every
                    //event that ocurrs as the event propagates through the DOM, so that one
                    //invocation only goes through the for loop once, in fact, the for loop
                    //should really be changed to a simple if statement and the params.crumbsIndex
                    //gets incremented by one.
                    
                    webActor.gotoNextURL("", "crumbProcessor", params);
                    this.dispatchClickEvent(eventWindow, crumbElements[0]);
                }
            }
        }
        else if (crumb.crumbEvent.type === "keypress")
        {
            // find the dom element and send it the key event
            crumbElements = this.getElementsUsingXPath(eventWindow, crumb.elementXPath);
            if (crumbElements.length <= 0)
            {
                eventWindow = this.chromeWin;
                crumbElements = this.getElementsUsingXPath(eventWindow, crumb.elementXPath);
            }
            this.repl.print("The crumb element is: " + crumbElements + " :: " + crumbElements.length + " :: " + crumbElements[0]);
        }
        
        // TODO: a couple of ways to find the dom element that crumbs[i] is referring to
        // 1) use document.evaluate along with the xpath that is part of the crumbs[i]
        // 2) loop through the elements of the particular tagName using
        //    document.getElementsByTagName(tagName) checking to see if one of the
        //    elements matches the one that was previously used in the crumbs[i],
        //    this means that tagName must be provided along with some identifying
        //    token of the element used to build crumbs[i]
        // 3) Is there another way to do this?????
        
    }
};



//record - done
//stopRecording - need to figure out how to implement this
//clear - done
//playback - in progress
//edit
//save
//load
// TODO: transfer  notes from when I was at the VP training into this file...
//automation/instrumentation
//mashup - 
// just an idea - remember that you can execute a .bat file from within the mozrepl framework
//                this could be useful in implementing some part of the BrowserBot



