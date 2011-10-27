//<><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><>
// this section is for configuring jslint
//<><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><>
/*jslint nomen: false, debug: false,
    evil: false, onevar: true */
/*global webActor: false, WebActor: false, Ci: false, Components: false, FileUtils: false, Services: false */


Components.utils.import("resource://gre/modules/Services.jsm");  
Components.utils.import("resource://gre/modules/FileUtils.jsm");

var shouldBeVisible = false,
    searchTerm = "",
    maxLinksToShow = 50,
    maxSelectSize = 5;

var sqlLiteFile = FileUtils.getFile("ProfD", ["mySearchWords.sqlite"]);  
var wordDBConn = Services.storage.openDatabase(sqlLiteFile); // Will also create the file if it does not exist

//       the table structure is words[word_id, key_word, search_count]
//       urls[url_id, url, last_load_date, load_count, as_link_count] word2url[word_id, url_id, isTag]
//       dates are ISO8601 strings ("YYYY-MM-DD HH:MM:SS.SSS")

// check to see if the tables exist and if they do not then create them
try
{
    wordDBConn.executeSimpleSQL("SELECT count(word_id) FROM words");
}
catch (ex)
{
    //print("Exception is: " + ex);
    // normalize to lowercase
    wordDBConn.executeSimpleSQL("create table words (word_id integer, word varchar(120) unique, count integer, primary key(word_id desc))");
    wordDBConn.executeSimpleSQL("create table urls (url_id integer, url varchar(2000) unique, last_load_date varchar(25), load_count integer, as_link_count integer, primary key(url_id desc))");
    wordDBConn.executeSimpleSQL("create table word2url (word_id integer, url_id integer, isTag boolean, inHeader boolean, word_count integer, foreign key(word_id) references words(word_id), foreign key(url_id) references urls(url_id), primary key(word_id, url_id desc))");
}


//var statement = wordDBConn.createStatement("SELECT count(word_id) FROM words");
//statement.executeAsync({
//    handleResult: function (aResultSet)
//    {
//        var row, value;
//        for (row = aResultSet.getNextRow();  
//            row;  
//            row = aResultSet.getNextRow())
//        {  
//            value = row.getResultByName("key_word");  
//        }  
//    },  
//    
//    handleError: function (aError)
//    {  
//        print("Error: " + aError.message);  
//    },  
//    
//    handleCompletion: function (aReason)
//    {  
//        if (aReason !== Components.interfaces.mozIStorageStatementCallback.REASON_FINISHED)
//        {
//            print("Query canceled or aborted! - " + aReason);
//        }
//    }
//});


// resetting a statement
//var statement = dbConn.createStatement("SELECT * FROM table_name");  
//try {  
//  while (statement.step()) {  
//    // Use the results...  
//  }  
//}  
//finally {  
//  statement.reset();  
//}  


/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//mysearch tool URL data capture methods
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
WebActor.prototype.allowMethod = function (methodName, screenURL, loadedURL, params)
{
    //this.repl.print("inside allowMethod...");
    
    return (
        this.checkMethodRequest(
            methodName, ["indexURL"],
            screenURL, "",
            loadedURL, ""
        ) || this.checkMethodRequest(
                methodName, [""],
                screenURL, "",
                loadedURL, ""
        )
    );
};



WebActor.prototype.indexURL = function (screenURL, loadedURL, params)
{
    // TODO: the loadedURL is the URL currently in the browser window, add
    //       logic to parse the content in the browser and map reduce the
    //       content to key words that can be searched on and store those
    //       key words in an index so that when the key word is found then
    //       there are a set of numbers associated with the key word and these
    //       numbers are primary keys to URLs that have been map reduced,
    //       the table structure is given above
    
    // using jQuery: $(body).text()
    
    // document.body.innerText;
    // document.body.textContent
    
    var localDomWindow = webActor.findDOMWindow(params.event), docText, currentLoc = params.event.target.location, headerText;
    if (loadedURL !== params.event.target.location.href)
    {
        throw "The parameter 'loadedURL' " + loadedURL + " does not match the 'currentLoc.href' " + currentLoc.href;
    }
    
    // Tags, Titles, Keywords, Image Alt=text, and KW density just doesn't seem to be adequate enough anymore
    
    webActor.repl.print("*******************************************************************************************************************");
    
    // take the URL loadedURL and parse for keywords to store with the URL
    webActor.repl.print("currentLoc.href: " + currentLoc.href);
    // 1) get the host from loadedURL and use the hostname as a keyword - strip off the "www." from the hostname
    // maybe the hostname should be the only part of the url that is used as a word to index the page
    webActor.repl.print("currentLoc.hostname: " + currentLoc.hostname);
    
    // 2) get the URI from loadedURL - parse it for keywords
    webActor.repl.print("currentLoc.pathname: " + currentLoc.pathname);
    // 3) get the queryString from loadedURL - parse it for keywords
    webActor.repl.print("currentLoc.queryString: " + currentLoc.search);
    
    headerText = webActor.getHeaderText(localDomWindow.document);
    webActor.repl.print("indexURL headerText: " + headerText);
    
    webActor.repl.print("localDomWindow.document.referrer: " + localDomWindow.document.referrer);
    
    Need to figure out how to handle the exact same content being indexed on a child URL that loads inside a parent or first URL!!!
    The parent or first URL loads which then causes the child URL to load but the content in the window remains the same
    
    //webActor.repl.print("indexURL localDomWindow: " + localDomWindow.body.innerText);
    //webActor.repl.print("indexURL localDomWindow.body: " + localDomWindow.body);
    //webActor.repl.print("indexURL localDomWindow.body.innerText: " + localDomWindow.body.innerText);
    //webActor.repl.print("indexURL localDomWindow: " + localDomWindow);
    //webActor.repl.print("indexURL localDomWindow.document.body: " + localDomWindow.document.body);
    //webActor.repl.print("indexURL localDomWindow.document.body.textContent: " + localDomWindow.document.body.textContent);
    docText = webActor.getText(localDomWindow.document.documentElement);
    //webActor.repl.print("indexURL localDomWindow.document.documentElement: " + docText);
    //webActor.repl.print("indexURL localDomWindow.document.body.innerText: " + localDomWindow.document.body.innerText);
    webActor.repl.print("*******************************************************************************************************************");
    webActor.repl.print("*******************************************************************************************************************");
    
    webActor.repl.print("Indexing URL with screenURL as -- " + screenURL + " -- and loadedURL as -- " + loadedURL);
    webActor.repl.print("---------------------------------------------------------------------------------------------------------------");
    
    webActor.renderMySearchTool(params.event);
    
    //webActor.gotoNextURL("", "indexURL", params);
};



WebActor.prototype.mySearchToolIsVisible = function (document)
{
    var tooldiv = document.getElementById("mysearchToolId");
    if (tooldiv && tooldiv.style.display.toLowerCase() !== 'none')
    {
        return true;
    }
    
    return false;
};



WebActor.prototype.addMySearchTool = function (document)
{
    //<div id="mysearchToolId" style="width: 135px; position:fixed; top: 5px; right: 20px;">
    //This content stays perfectly static on the screen, but only in Firefox.
    //As of IE6, IE doesn't support it.
    //</div>
    
    //bodyTags = document.getElementsByTagName("body");
    var searchLinks, textbox, tooldiv = document.getElementById("mysearchToolId");
    
    if (/*bodyTags.length > 0 && */document.documentElement && !tooldiv)
    {
        webActor.repl.print("Could not find mysearchTool... so creating...");
        
        tooldiv = document.createElement("div");
        tooldiv.setAttribute("id", "mysearchToolId");
        tooldiv.setAttribute("style", "z-index: 10000000; width: 235px; position:fixed; top: 5px; right: 20px; display: inline;");
        
        //Create an input type dynamically.
        textbox = document.createElement("input");
     
        //Assign different attributes to the element.
        textbox.setAttribute("type", "text");
        textbox.setAttribute("value", "");
        textbox.setAttribute("name", "mysearchTextBox");
        textbox.setAttribute("id", "mysearchTextBoxId");
        textbox.setAttribute("style", "z-index: 10000000; width: 235px;");
        //textbox.setAttribute("onKeyUp", "handleKeyUp(15);");
        tooldiv.appendChild(textbox);
        
        //var textnode = document.createTextNode("Some text, maybe a link...");
        //tooldiv.appendChild(textnode);
        
        //<select onClick="handleSelectClick();" name="functionselect" size="20" style="font-size:10pt;width:34ex;">
        //</select>
        searchLinks = document.createElement("select");
        //selectNode.setAttribute("onClick", "handleSelectClick();");
        searchLinks.setAttribute("name", "mysearchLinks");
        searchLinks.setAttribute("id", "mysearchLinksId");
        searchLinks.setAttribute("size", "0");
        searchLinks.setAttribute("style", "z-index: 10000000; width: 245px; display: none;");
        tooldiv.appendChild(searchLinks);
        
        //Append the element in page
        document.documentElement.appendChild(tooldiv);
        //bodyTags = document.getElementsByTagName("body");
        //bodyTags.item(0).insertBefore(tooldiv, bodyTags.item(0).firstChild);
    }
};


WebActor.prototype.showMySearchTool = function (document)
{
    var tooldiv = document.getElementById("mysearchToolId");
    if (tooldiv)
    {
        tooldiv.style.display = "inline";
        document.theLastFocusedElement = document.activeElement;
        document.getElementById("mysearchTextBoxId").focus();
           
        webActor.repl.print("showing mysearch tool");
        webActor.repl.print("---------------------------------------------------------------------------------------------------------------");
    }
};



WebActor.prototype.hideMySearchTool = function (document)
{
    var tooldiv = document.getElementById("mysearchToolId");
    if (tooldiv)
    {
        tooldiv.style.display = "none";
        document.theLastFocusedElement.focus();
        
        webActor.repl.print("hiding mysearch tool");
        webActor.repl.print("---------------------------------------------------------------------------------------------------------------");
    }
};



WebActor.prototype.appendNewLink = function (document, searchLinks, text, value)
{
    var newLink = document.createElement('option');
    newLink.text = text;
    newLink.value = value;
    
    try
    {
        searchLinks.add(newLink, null);
    }
    catch (ex)
    {
        searchLinks.add(newLink);
    }
};


WebActor.prototype.insertNewLink  = function (document, searchLinks, text, value)
{
    if (searchLinks.selectedIndex >= 0)
    {
        var oldLink, newLink = document.createElement('option');
        newLink.text = text;
        newLink.value = value;
        oldLink = searchLinks.options[searchLinks.selectedIndex];  
        try
        {
            searchLinks.add(newLink, oldLink);
        }
        catch (ex)
        {
            searchLinks.add(newLink, searchLinks.selectedIndex);
        }
    }
};    


WebActor.prototype.populateSearchLinks = function (document, searchLinks, termToFind)
{
    // find all the links in the database for the "termToFind"
    // need to figure out how to set the "termResults" Array to the list of URLs that match
    // The text needs to be the description or title of the URL and the values needs to be the actual URL
    // termResults[i] is the text (description or title of the URL)
    // termResults[i+1] is the value or the actual URL
    var i, termResults = [termToFind + "1.text", termToFind + "1.value", termToFind + "2.text", termToFind + "2.value", termToFind + "3.text", termToFind + "3.value", termToFind + "4.text", termToFind + "4.value", termToFind + "5.text", termToFind + "5.value", termToFind + "6.text", termToFind + "6.value"];
    
    // add the links that were found to the combo box
    searchLinks.length = 0;
    searchLinks.size = ((termResults.length / 2) > maxSelectSize) ? maxSelectSize : (termResults.length / 2);
    
    for (i = 0; (i < termResults.length && i < (maxLinksToShow * 2)); i += 2)
    {
        webActor.appendNewLink(document, searchLinks, termResults[i], termResults[i + 1]);
    }
    
};


WebActor.prototype.renderSearchLinks = function (document)
{
    var searchLinks  = document.getElementById("mysearchLinksId");
    //populate values into the select box (combo box from here)
    if (searchTerm.length >= 2)
    {
        webActor.repl.print("Showing the searchLinks: " + searchTerm);
        searchLinks.style.display = "inline";
        webActor.populateSearchLinks(document, searchLinks, searchTerm);
    }
    else if (searchTerm.length < 2)
    {
        webActor.repl.print("Hiding the searchLinks: " + searchTerm);
        searchLinks.style.display = "none";
    }
};


WebActor.prototype.setTextBoxValue = function (document)
{
    var textbox, tooldiv = document.getElementById("mysearchToolId");
    if (tooldiv && tooldiv.style.display.toLowerCase() !== 'none')
    {
        textbox = document.getElementById("mysearchTextBoxId");
        if (textbox.value !== searchTerm)
        {
            webActor.repl.print("Setting the value of mysearchTextBox to: " + searchTerm);
            textbox.value = searchTerm;
            
            webActor.renderSearchLinks(document);
        }
    }
};


WebActor.prototype.renderMySearchTool = function (event)
{
    var localDomWindow = webActor.findDOMWindow(event);
    if (shouldBeVisible && localDomWindow.document && !webActor.mySearchToolIsVisible(localDomWindow.document))
    {
        webActor.addMySearchTool(localDomWindow.document);
        webActor.showMySearchTool(localDomWindow.document);
    }
    else if (!shouldBeVisible && localDomWindow.document && webActor.mySearchToolIsVisible(localDomWindow.document))
    {
        webActor.hideMySearchTool(localDomWindow.document);
    }
    
    if (localDomWindow.document && webActor.mySearchToolIsVisible(localDomWindow.document))
    {
        webActor.setTextBoxValue(localDomWindow.document);
    }
};









/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// mysearch tool events and UI methods
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
function catchEvents()
{
    var domWindow = webActor.origDomWindow,
    chromeWin = webActor.origChromeWin,
    //prevTitle, prevEl, prevOutline,
    result = {},
    params = {};
    
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
        //renderMySearchTool(event);
        //var localEventWindow;

        webActor.repl.print("keypress Key has been pressed: " + event);
        webActor.repl.print("keypress event.target.name: " + event.target.name);
        webActor.repl.print("keypress event.target.type: " + event.target.type);
        webActor.repl.print("keypress event.target.tagName: " + event.target.tagName);
        webActor.repl.print("keypress event.target.id: " + event.target.id);
        webActor.repl.print("keypress event.target.value: " + event.target.value);
        webActor.repl.print("keypress event.altKey: " + event.altKey);
        webActor.repl.print("keypress event.shiftKey: " + event.shiftKey);
        webActor.repl.print("keypress event.ctrlKey: " + event.ctrlKey);
        webActor.repl.print("keypress event.keyCode: " + event.keyCode);
        webActor.repl.print("keypress event.charCode: " + event.charCode);
        webActor.repl.print("---------------------------------------------------------------------------------------------------------------");
        
        //debugEvent(event);
        var localDomWindow = webActor.findDOMWindow(event);
        
        if ((event.charCode === 102 || event.charCode === 70) && event.ctrlKey && event.shiftKey)
        {
            shouldBeVisible = !shouldBeVisible;
        }
        
        if (((event.charCode === 102 || event.charCode === 70) && event.ctrlKey && event.shiftKey &&
           !webActor.mySearchToolIsVisible(localDomWindow.document)) || ((event.charCode === 102 || event.charCode === 70) &&
                   event.ctrlKey && event.shiftKey && webActor.mySearchToolIsVisible(localDomWindow.document)))
        {
            // force the mysearch tool to always float to the top right of the browser content area
            //addMySearchTool(localDomWindow.document);
            //showMySearchTool(localDomWindow.document);
            webActor.renderMySearchTool(event);
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

        //if (event.target && event.target.id === "mysearchTextBoxId" && !event.ctrlKey && !event.altKey)
        //{
            //searchTerm = event.target.value;
        //    searchTerm += String.fromCharCode(event.charCode);
        //    webActor.repl.print("keypress: Setting global searchTerm to: " + searchTerm);
        //    webActor.repl.print("keypress: The value of event.target is: " + event.target.value);
        //}
    }
    
    
    function onKeyup(event)
    {
        var localDomWindow;
        
        webActor.repl.print("keyup Key has been pressed: " + event);
        webActor.repl.print("keyup event.target.name: " + event.target.name);
        webActor.repl.print("keyup event.target.type: " + event.target.type);
        webActor.repl.print("keyup event.target.tagName: " + event.target.tagName);
        webActor.repl.print("keyup event.target.id: " + event.target.id);
        webActor.repl.print("keyup event.target.value: " + event.target.value);
        webActor.repl.print("keyup event.altKey: " + event.altKey);
        webActor.repl.print("keyup event.shiftKey: " + event.shiftKey);
        webActor.repl.print("keyup event.ctrlKey: " + event.ctrlKey);
        webActor.repl.print("keyup event.keyCode: " + event.keyCode);
        webActor.repl.print("keyup event.charCode: " + event.charCode);
        webActor.repl.print("---------------------------------------------------------------------------------------------------------------");

        if (event.target && event.target.id === "mysearchTextBoxId" && !event.ctrlKey && !event.altKey)
        {
            //searchTerm = event.target.value;
            //searchTerm += String.fromCharCode(event.charCode);
            searchTerm = event.target.value;
            localDomWindow = webActor.findDOMWindow(event);
            webActor.renderSearchLinks(localDomWindow.document);
            webActor.repl.print("keyup: Setting global searchTerm to: " + searchTerm);
            webActor.repl.print("keyup: The value of event.target is: " + event.target.value);
        }
    }

    
    function onClick(event)
    {
        webActor.renderMySearchTool(event);
        //var attr, localEventWindow, localDomWindow;
        
        //debugEvent(event);
        
        webActor.repl.print("the mouse has been clicked: " + event);
        webActor.repl.print("mouseclick event.target.name: " + event.target.name);
        webActor.repl.print("mouseclick event.target.type: " + event.target.type);
        webActor.repl.print("mouseclick event.target.tagName: " + event.target.tagName);
        webActor.repl.print("mouseclick event.target.id: " + event.target.id);
        webActor.repl.print("mouseclick event.target.value: " + event.target.value);
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
        webActor.renderMySearchTool(event);
    }
    
    
    function done(event)
    {
        webActor.repl.print("Done clicking on objects, so removing listeners!!");
        chromeWin.document.removeEventListener('click', onClick, true);
        //chromeWin.document.removeEventListener('mouseover', onOver, true);
        chromeWin.document.removeEventListener('keypress', onKeypress, true);
        chromeWin.document.removeEventListener('keyup', onKeyup, true);
        chromeWin.document.removeEventListener('mousemove', onMousemove, true);
    }
    

    chromeWin.document.addEventListener('click', onClick, true);
    //chromeWin.document.addEventListener('mouseover', onOver, true);
    chromeWin.document.addEventListener('keypress', onKeypress, true);
    chromeWin.document.addEventListener('keyup', onKeyup, true);
    chromeWin.document.addEventListener('mousemove', onMousemove, true);
    params.invokedFromMethod = "catchEvents";
    webActor.gotoNextURL("", "indexURL", params);
    
    return result;
}
