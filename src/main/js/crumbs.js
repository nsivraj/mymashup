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
    
    this.toString = function ()
    {
        return this.type;
    };
}


function Crumb(crumbURL, event, elementXPath)
{
    this.crumbURL = crumbURL;
    this.elementXPath = elementXPath;
    // TODO: the event object being passed in could be of type CrumbEvent and if it is then
    // just use the event being passed in
    this.crumbEvent = new CrumbEvent(event);

    webActor.repl.print("Adding event for: " + this.crumbEvent + " and element " + this.elementXPath + " and URL " + this.crumbURL);
    
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
    result = {};
    
    // record what the location of the current page is
    crumbs.startingURL = domWindow.document.location.href;
    webActor.repl.print("Starting at page: " + crumbs.startingURL);
    
    //prevTitle = domWindow.top.title;
    //prevTitle = domWindow.document.title;
    
    
    
    
    function onOver(event)
    {
        var curEl = event.target;

        //webActor.findDOMWindow(event).document.title =
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
        var localDomWindow;

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
        //crumbs.push(webActor.findDOMWindow(event).document.location.href + "__||__keypress__||__" + event.target);
        localDomWindow = webActor.findDOMWindow(event);
        crumbs.push(new Crumb(localDomWindow.document.location.href, event, webActor.getElementXPath(event.target)));
    }
    
    
    function reset(event)
    {
        prevEl.style.outline = prevOutline;
        //webActor.findDOMWindow(event).top.title = prevTitle;
        //webActor.findDOMWindow(event).document.title = prevTitle;
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
    

    function onClick(event)
    {
        var attr, localDomWindow;
        
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
            done(event);
            //webActor.repl.print("onClick: 3");
        }
        else
        {
            // TODO: change 'event.target' below to the xpath of 'event.target'
            //crumbs.push(webActor.findDOMWindow(event).document.location.href + "__||__click__||__" + event.target);
            localDomWindow = webActor.findDOMWindow(event);
            crumbs.push(new Crumb(localDomWindow.document.location.href, event, webActor.getElementXPath(event.target)));
        }
        
        //webActor.repl.print("onClick: 4");
    }

    chromeWin.document.addEventListener('click', onClick, true);
    chromeWin.document.addEventListener('mouseover', onOver, true);
    chromeWin.document.addEventListener('keypress', onKeypress, true);
    
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
            webActor.crumbProcessor(crumbs.startingURL, crumbs.startingURL, params);
        }
    }
    
    return result;
    
}


WebActor.prototype.allowMethod = function (methodName, screenURL, loadedURL, params)
{
    //webActor.repl.print("inside allowMethod...");
    
    return (
        this.checkMethodRequest(
            methodName, ["crumbProcessor"],
            screenURL, "",
            loadedURL, ""
        )
    );
};


WebActor.prototype.crumbProcessor = function (screenURL, loadedURL, params)
{
    //webActor.repl.print("Inside crumbProcessor!!!");
    var crumb, crumbElements, i = params.crumbsIndex;
    
    // TODO: Now loop over each of the elements that was clicked on and click on them in turn
    for (; i < crumbs.length; i += 1)
    {
        params.crumbsIndex = i + 1;
        crumb = crumbs[i];
        // load in the saved elements and playback the events
        webActor.repl.print("Playing back user event: " + crumb);
        
        if (crumb.crumbEvent.type === "click")
        {
            // find the dom element and click on it
            crumbElements = webActor.getElementsUsingXPath(this.domWindow, crumb.elementXPath);
            webActor.repl.print("The crumb element is: " + crumbElements + " :: " + crumbElements.length + " :: " + crumbElements[0]);
            
        }
        else if (crumb.crumbEvent.type === "keypress")
        {
            // find the dom element and send it the key event
            crumbElements = webActor.getElementsUsingXPath(this.domWindow, crumb.elementXPath);
            webActor.repl.print("The crumb element is: " + crumbElements + " :: " + crumbElements.length + " :: " + crumbElements[0]);
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



