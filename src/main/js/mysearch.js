var shouldBeVisible = false;
var searchTerm = "";

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// mysearch methods
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
function catchEvents()
{
    var domWindow = webActor.origDomWindow,
    chromeWin = webActor.origChromeWin,
    //prevTitle, prevEl, prevOutline,
    result = {};
    //params = {};
    
    //prevTitle = domWindow.top.title;
    //prevTitle = domWindow.document.title;
    
    
    function addMySearchTool(document)
    {
    	//<div id="mysearchToolId" style="width: 135px; position:fixed; top: 5px; right: 20px;">
    	//This content stays perfectly static on the screen, but only in Firefox.
    	//As of IE6, IE doesn't support it.
    	//</div>
    	
    	var tooldiv = document.getElementById("mysearchToolId");
    	if(!tooldiv)
    	{
    		webActor.repl.print("Could not find mysearchTool... so creating...");
    		
    		tooldiv = document.createElement("div");
	    	tooldiv.setAttribute("id", "mysearchToolId");
	    	tooldiv.setAttribute("style", "width: 235px; position:fixed; top: 5px; right: 20px; display: inline;");
	    	
	        //Create an input type dynamically.
	        var textbox = document.createElement("input");
	     
	        //Assign different attributes to the element.
	        textbox.setAttribute("type", "text");
	        textbox.setAttribute("value", "");
	        textbox.setAttribute("name", "mysearchTextBox");
	        textbox.setAttribute("id", "mysearchTextBoxId");
	        textbox.setAttribute("style", "width: 235px;");
	        //textbox.setAttribute("onKeyUp", "handleKeyUp(15);");
	        tooldiv.appendChild(textbox);
	        
	        //var textnode = document.createTextNode("Some text, maybe a link...");
	        //tooldiv.appendChild(textnode);
	        
	        //<select onClick="handleSelectClick();" name="functionselect" size="20" style="font-size:10pt;width:34ex;">
	        //</select>
	        var selectNode = document.createElement("select");
	        //selectNode.setAttribute("onClick", "handleSelectClick();");
	        selectNode.setAttribute("name", "mysearchLink");
	        selectNode.setAttribute("size", "1");
	        selectNode.setAttribute("style", "width: 245px; display: none;");
	        tooldiv.appendChild(selectNode);
	        
	        //Append the element in page
	        document.documentElement.appendChild(tooldiv);
    	}
    }

    
    function showMySearchTool(document)
    {
    	var tooldiv = document.getElementById("mysearchToolId");
    	if(tooldiv)
    	{
    		tooldiv.style.display = "inline";
    		document.theLastFocusedElement = document.activeElement;
    		document.getElementById("mysearchTextBoxId").focus();
    	}
    }
    
    function hideMySearchTool(document)
    {
    	var tooldiv = document.getElementById("mysearchToolId");
    	if(tooldiv)
    	{
    		tooldiv.style.display = "none";
    		document.theLastFocusedElement.focus();
    	}
    }
    
    
    function mySearchToolIsVisible(document)
    {
    	var tooldiv = document.getElementById("mysearchToolId");
        if(tooldiv && tooldiv.style.display.toLowerCase() != 'none')
        {
            return true;
        }
        
        return false;
    }

    
    function setTextBoxValue(document)
    {
    	var tooldiv = document.getElementById("mysearchToolId");
        if(tooldiv && tooldiv.style.display.toLowerCase() != 'none')
        {
        	var textbox = document.getElementById("mysearchTextBoxId");
        	if(textbox.value !== searchTerm)
        	{
        		textbox.value = searchTerm;
        	}
        }
    }
    
    

    
    
    


    
    function renderMySearchTool(event)
    {
    	var localDomWindow = webActor.findDOMWindow(event);
    	if(shouldBeVisible && localDomWindow.document && !mySearchToolIsVisible(localDomWindow.document))
    	{
       		addMySearchTool(localDomWindow.document);
       		showMySearchTool(localDomWindow.document);
    	}
    	
    	if(localDomWindow.document && mySearchToolIsVisible(localDomWindow.document))
    	{
    		setTextBoxValue(localDomWindow.document);
    	}
    }

    //function reset(event)
    //{
    //    prevEl.style.outline = prevOutline;
        //webActor.findEventWindow(event).top.title = prevTitle;
        //webActor.findEventWindow(event).document.title = prevTitle;
    //}


    function done(event)
    {
        webActor.repl.print("Done clicking on objects, so removing listeners!!");
        chromeWin.document.removeEventListener('click', onClick, true);
        //chromeWin.document.removeEventListener('mouseover', onOver, true);
        chromeWin.document.removeEventListener('keypress', onKeypress, true);
        //reset(event);
        
        // TODO: now write out to a file which elements have been clicked on to play it back later
        
    }
    

    //function onOver(event)
    //{
    //    var curEl = event.target;

        //webActor.findEventWindow(event).document.title =
        //    '<' + curEl + '> in ' + curEl.ownerDocument.location.href;

    //    if (prevEl)
    //    {
    //        prevEl.style.outline = prevOutline;
    //    }

    //    prevEl = curEl;
    //    prevOutline = curEl.style.outline;

    //    curEl.style.outline = '4px dashed #FF0000';
    //}


    function onKeypress(event)
    {
    	renderMySearchTool(event);
    	//var localEventWindow;

        webActor.repl.print("Key has been pressed: "+event);
        webActor.repl.print("keypress event.target.name: "+event.target.name);
        webActor.repl.print("keypress event.target.type: "+event.target.type);
        webActor.repl.print("keypress event.target.tagName: "+event.target.tagName);
        webActor.repl.print("keypress event.target.id: "+event.target.id);
        webActor.repl.print("keypress event.target.value: "+event.target.value);
        webActor.repl.print("keypress event.altKey: "+event.altKey);
        webActor.repl.print("keypress event.shiftKey: "+event.shiftKey);
        webActor.repl.print("keypress event.ctrlKey: "+event.ctrlKey);
        webActor.repl.print("keypress event.keyCode: "+event.keyCode);
        webActor.repl.print("keypress event.charCode: "+event.charCode);
        webActor.repl.print("---------------------------------------------------------------------------------------------------------------");
        
        //debugEvent(event);
    	var localDomWindow = webActor.findDOMWindow(event);
        
        if((event.charCode == 102 || event.charCode == 70) && event.ctrlKey && event.shiftKey &&
           !mySearchToolIsVisible(localDomWindow.document))
        {
            // force the mysearch tool to always float to the top right of the browser content area
       		addMySearchTool(localDomWindow.document);
       		showMySearchTool(localDomWindow.document);
       		
            webActor.repl.print("showing mysearch tool");
            webActor.repl.print("---------------------------------------------------------------------------------------------------------------");
        }
        else if((event.charCode == 102 || event.charCode == 70) && event.ctrlKey && event.shiftKey &&
                mySearchToolIsVisible(localDomWindow.document))
        {
        	hideMySearchTool(localDomWindow.document);
        	
            webActor.repl.print("hiding mysearch tool");
            webActor.repl.print("---------------------------------------------------------------------------------------------------------------");
        }
        
        if((event.charCode == 102 || event.charCode == 70) && event.ctrlKey && event.shiftKey)
        {
        	shouldBeVisible = !shouldBeVisible;
        }
        
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
        //.push(webActor.findEventWindow(event).document.location.href + "__||__keypress__||__" + event.target);
        //localEventWindow = webActor.findEventWindow(event);
        //.push( (localEventWindow.document.location.href, event));

        if(event.target && event.target.id === "mysearchTextBoxId")
        {
        	searchTerm = event.target.value;
        	webActor.repl.print("Setting global searchTerm to: "+searchTerm);
        }
    }
    
    
    function onClick(event)
    {
    	renderMySearchTool(event);
    	//var attr, localEventWindow, localDomWindow;
        
        // TODO: is event.target an action to cause a change in the page (i.e.
        //       <a href="..."...> or <input type="image"...> or <img ...> or
        //       <input type="button"...> or <input type="submit"...>) OR is
        //       event.target a form element 
        
        //debugEvent(event);
        
        webActor.repl.print("the mouse has been clicked: "+event);
        webActor.repl.print("mouseclick event.target.name: "+event.target.name);
        webActor.repl.print("mouseclick event.target.type: "+event.target.type);
        webActor.repl.print("mouseclick event.target.tagName: "+event.target.tagName);
        webActor.repl.print("mouseclick event.target.id: "+event.target.id);
        webActor.repl.print("mouseclick event.target.value: "+event.target.value);
        webActor.repl.print("---------------------------------------------------------------------------------------------------------------");
        
        //reset(event);
        //webActor.repl.print("onClick: 2");
        //webActor.repl.print("Checking event.target.tagName to see if ready to quit ... " + event.target.tagName);
        
        
        // THIS if IS FOR TEMPORARY DEBUGGING PURPOSES SO THAT I DO NOT HAVE TO KEEP RESTARTING THE BROWSER
        if ((event.target.tagName === "toolbarbutton" && event.target.id === "") ||
        	(event.target.tagName === "scrollbox" && event.target.id === "PlacesToolbarItems"))
        {
            webActor.repl.print("Invoking the done(event) method because event.target.tagName === " + event.target.tagName + " and event.target.id === " + event.target.id);
            //localDomWindow = webActor.findDOMWindow(event);
            //webActor.repl.print("Ending URL in the web browser is: " + localDomWindow.document.location.href);
            done(event);
            //webActor.repl.print("onClick: 3");
        }
        else
        {
            // TODO: change 'event.target' below to the xpath of 'event.target'
            //.push(webActor.findEventWindow(event).document.location.href + "__||__click__||__" + event.target);
            //localEventWindow = webActor.findEventWindow(event);
            //.push( (localEventWindow.document.location.href, event));
        }
        
        //webActor.repl.print("onClick: 4");
    }

    
    function onMousemove(event)
    {
    	renderMySearchTool(event);
    }
    
    
    chromeWin.document.addEventListener('click', onClick, true);
    //chromeWin.document.addEventListener('mouseover', onOver, true);
    chromeWin.document.addEventListener('keypress', onKeypress, true);
    chromeWin.document.addEventListener('mousemove', onMousemove, true);
    //params.invokedFromMethod = "record";
    //webActor.gotoNextURL("", "recordReload", params);
    
    return result;
}
