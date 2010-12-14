/*jslint nomen: false, debug: false,
    evil: false, onevar: true */

var startedAt = new Date();

function report()
{
    this.print('I was started at ' + startedAt);
}


// 1) create the mymashup xml file format and create the mymashup processor that creates the html page from the mymashup xml file
//    a) Enter the url to the mymashup xml file in the web browsers URL text field
//    b) Detect in this javascript code that the file is a mymashup xml file
//    c) Invoke the mymashup xml file processor to generate the html output for the mashup




// 2) create the authoring tool that allows you to author a mymashup xml file by just browsing to the web pages
//    within the web browser and it captures and records the URLs and xpaths from mouse clicks while holding down the Ctrl+Alt key

// here is the use case I would like to follow:
// a) repl.mashup("http://host:port/path/to/somemashup.html");
// b) it would be nice to be able to use jQuery or something like that to select the remote html/xml nodes
// c) it would be nice to be able to use XMLHttpRequest to do asynchronous requests for html/xml snippets
//    but will use tabs if needed

var loadedMashlets = 0;

function trim(str)
{
	return str.replace(/^\s\s*/, '').replace(/\s\s*$/, '');
}


function setMashedAttributes(mashedElement, tagId, useStyle, mashlet)
{
	mashedElement.setAttribute("id", tagId);
	if(useStyle)
	{
		//this.print("setAttribute style to: "+useStyle);
		mashedElement.setAttribute("style", useStyle);
	}
	
	// for all the attributes on mashlet; except xpath, uri, htmltag, id, style and usestyle;
	// add those attributes to mashedElement
	var attrs = mashlet.attributes;
	for(var i=0; i < attrs.length; ++i)
	{
		//this.print("checking attribute attrs["+i+"].name: "+attrs[i].name);
		//this.print("checking attribute attrs["+i+"].value: "+attrs[i].value);
		
		if(attrs[i].name != "xpath" && attrs[i].name != "uri" &&
		   attrs[i].name != "htmltag" && attrs[i].name != "id" &&
		   attrs[i].name != "style" && attrs[i].name != "usestyle" &&
		   attrs[i].name != "httpmethod")
		{
			mashedElement.setAttribute(attrs[i].name, attrs[i].value);
			//this.print("setAttribute attrs["+i+"].name: "+attrs[i].name);
			//this.print("setAttribute attrs["+i+"].value: "+attrs[i].value);
		}
	}
}



function parseFormData(mashlet, urlEncoded)
{
	// var data = "file=" + url + "&content=" + content;
	var formTag = mashlet.getElementsByTagName("m-form");
	if(formTag.length > 0)
	{
		var formData = "";
		this.print("formTag: "+formTag);
		this.print("formTag[0]: "+formTag[0]);
		var formParams = formTag[0].getElementsByTagName("m-param");
		this.print("formParams.length is: "+formParams.length);
		this.print("formParams is: "+formParams);
		for(var i = 0; i < formParams.length; ++i)
		{
			this.print("formParams[i]: "+formParams[i]);
			this.print("formParams[i].getElementsByTagName(\"m-name\") is: "+formParams[i].getElementsByTagName("m-name"));
			this.print("formParams[i].getElementsByTagName(\"m-name\").length is: "+formParams[i].getElementsByTagName("m-name").length);
			this.print("formParams[i].getElementsByTagName(\"m-value\").length is: "+formParams[i].getElementsByTagName("m-value").length);
			if(urlEncoded)
			{
				formData += formParams[i].getElementsByTagName("m-name")[0].textContent + "=" + formParams[i].getElementsByTagName("m-value")[0].textContent;
				if(i < formParams.length - 1)
				{
					formData += "&";
				}
			}
			else
			{
				formData += "<input type=\"hidden\" name=\""+formParams[i].getElementsByTagName("m-name")[0].textContent+"\" value=\""+formParams[i].getElementsByTagName("m-value")[0].textContent+"\">\n";
			}
		}

		return formData;
	}
	
	return "";
}



function getMashupContent(window, document, tabWindow, tabDocument, mashlet, mIndex, httpCallback)
{
	var xpath = mashlet.getAttribute("xpath");
	if(!xpath)
	{
		xpath = mashlet.getElementsByTagName("xpath");
		if(xpath.length > 0)
		{
			xpath = this.trim(xpath[0].textContent);
		}
		else
		{
			xpath = undefined;
		}
	}
	var uri = mashlet.getAttribute("uri");
	var htmlTag = mashlet.getAttribute("htmltag");
	var tagId = mashlet.getAttribute("id");
	if(!tagId)
	{
		tagId = (htmlTag ? htmlTag + "_" : "") + mIndex;
	}
	var useStyle = mashlet.getAttribute("usestyle");
	
	var mashedElement;
	if(htmlTag)
	{
		mashedElement = document.createElement(htmlTag);
		this.setMashedAttributes(mashedElement, tagId, useStyle, mashlet);
		//mashedElement.innerHTML = uri + " :: " + xpath;
	}
	var httpMethod = mashlet.getAttribute("httpmethod");
	if(!httpMethod)
	{
		httpMethod = "GET";
	}
	httpMethod = httpMethod.toUpperCase();
	
	//var formData = this.parseFormData(mashlet, true);
	//if(httpMethod == "GET" && formData)
	//{
	//	// DONE: add on the '?' and the formData params to the uri
	//	uri += "?" + formData;
	//	formData = null;
	//}

	//this.print("The httpmethod is '"+httpMethod+"' and the uri is '"+uri+"' and the formData is '"+formData+"'!!");

	// TODO: Get the content from uri using xpath and set it on the mashedElement
	// a) get a DOM from XMLHttpRequest using the uri
	/*var xhr = new window.XMLHttpRequest();
	xhr.repl = this;
	xhr.openedURI = uri;
	xhr.open(httpMethod, uri, true);
	if(formData && "POST" == httpMethod)
	{
		xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
	}
	xhr.onreadystatechange = function (aEvt)
	{
		httpCallback(xhr, aEvt, mashlet, mashedElement, htmlTag, document, tagId, useStyle, uri, xpath);
	};
	
	xhr.send(formData);*/
	
	// TODO: write the form submit content (an actual html form) into a hidden div in the current window and
	// then using javascript submit the form using a CTRL-click event and then use the content that was loaded
	// into the new tab -- something like this
	// 1) get the document node
	// 2) append child elements for the form
	var formDiv = tabDocument.getElementById("__mashletFormDiv__");
	if(!formDiv)
	{
		formDiv = tabDocument.createElement("div");
		formDiv.setAttribute("id", "__mashletFormDiv__")
		tabDocument.body.appendChild(formDiv);
	}

	//var formDiv = document.getElementById("__mashletFormDiv__");
	//this.print("formDiv is: "+formDiv);
	
	formDiv.innerHTML = this.createHTMLForm(tagId, uri, httpMethod, mashlet);
	//this.print("formDiv.innerHTML: "+formDiv.innerHTML);
	
	//now click on the submit button with a CTRL-click event
	var submitButton = tabDocument.getElementById("submitNextMashlet"+tagId);
	
	var ctrlClickEvt = tabDocument.createEvent("MouseEvents");
	ctrlClickEvt.initMouseEvent("click", true, true, tabWindow, 0, 0, 0, 0, 0, true, false, false, false, 0, null);
	var cancelled = submitButton.dispatchEvent(ctrlClickEvt);
	if(cancelled)
	{
		this.print("The submit for 'submitNextMashlet"+tagId+"' was CANCELLED.");
	}
	else
	{
		this.print("The submit for 'submitNextMashlet"+tagId+"' was SUCCESSFUL.");
	}
}

function createHTMLForm(tagId, uri, httpMethod, mashlet)
{
	var formData = "<form id=\"nextMashletForm"+tagId+"\" action=\""+uri+"\" method=\""+httpMethod+"\">\n" +
                   this.parseFormData(mashlet, false) +
                   "<input id=\"submitNextMashlet"+tagId+"\" name=\"submitNextMashlet"+tagId+"\" type=\"submit\"></form>\n";
	
	this.print("The httpmethod is '"+httpMethod+"' and the uri is '"+uri+"' and the formData is '"+formData+"'!!");

	return formData;
}

function mashletCallback(xhr, evt, mashlet, mashedElement, htmlTag, document, tagId, useStyle, uri, xpath)
{
	if (xhr.readyState == 4)
	{
		if(xhr.status == 200)
		{
			xhr.repl.print("Successful loading page '"+xhr.openedURI+"': "+xhr.status);
			//xhr.repl.print("xhr.responseText: "+xhr.responseText);
			//dump(xhr.responseText);
			//var xmlDoc = xhr.responseXML;
			var xmlDoc = htmlParser(document, xhr.responseText);
			//alert(xmlDoc.getElementsByTagName('p').length);
			xhr.repl.print("xmlDoc: "+xmlDoc);
			//var nsResolver = xmlDoc.createNSResolver( xmlDoc.ownerDocument == null ? xmlDoc.documentElement : xmlDoc.ownerDocument.documentElement);
			//var xpathNodes = xmlDoc.evaluate(xpath, xmlDoc, nsResolver, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null );
			var xpathNodes = xmlDoc.evaluate(xpath, xmlDoc, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null );
			xhr.repl.print("xpathNodes: "+xpathNodes);
			for(var i=0; i < xpathNodes.snapshotLength; ++i)
			{
				xhr.repl.print("An xpath node is: "+xpathNodes.snapshotItem(i));
			}
			
			if(!mashedElement)
			{
				xhr.repl.print("Passed in mashedElement is not defined!!!");
				if(!htmlTag)
				{
					htmlTag = "span";
				}
				mashedElement = document.createElement(htmlTag);
				xhr.repl.setMashedAttributes(mashedElement, tagId, useStyle, mashlet);
				mashedElement.innerHTML = uri + " :: " + xpath;
			}
			
			xhr.repl.print("The htmlTag is: "+htmlTag);
			xhr.repl.print("the document is: "+document);
			xhr.repl.print("the mashlet is: "+mashlet);
			xhr.repl.print("the mashlet.parentNode is: "+mashlet.parentNode);
			xhr.repl.print("the mashedElement is: "+mashedElement);

			mashlet.parentNode.insertBefore(mashedElement, mashlet);
		}
		else
		{
			xhr.repl.print("Error loading page '"+xhr.openedURI+"': "+xhr.status);
			//dump("Error loading page\n");
			
			// TODO: need to put an error message into the page for the mashlet that could not be loaded
		}
		
		loadedMashlets += 2;
	}
}

function htmlParser(document, aHTMLString)
{
	var html = document.implementation.createDocument("http://www.w3.org/1999/xhtml", "html", null);
	var body = document.createElementNS("http://www.w3.org/1999/xhtml", "body");
	html.documentElement.appendChild(body);

	body.appendChild(Components.classes["@mozilla.org/feed-unescapehtml;1"]
	    .getService(Components.interfaces.nsIScriptableUnescapeHTML)
	    .parseFragment(aHTMLString, false, null, body));

	return body;
}

	
function deleteMashlets(toDelete, window, tabWindow, repl)
{
	repl.print("Checking if I can delete the mashlet tags: " + loadedMashlets + " ::: " + toDelete.length);
	if(loadedMashlets >= toDelete.length)
	{
		repl.print("Deleting the mashlet tags: " + toDelete.length);
		for(var i=0; i < toDelete.length; i+=2)
		{
			toDelete[i].removeChild(toDelete[i+1]);
			loadedMashlets -= 2;
		}
		var formDiv = window.document.getElementById("__mashletFormDiv__");
		window.document.removeChild(formDiv);
		repl.print("Done deleting the mashlet tags: " + loadedMashlets + " ::: " + toDelete.length);
		tabWindow.close();
	}
	else
	{
		window.setTimeout(function(toDelete, window, tabWindow, repl) { repl.deleteMashlets(toDelete, window, tabWindow, repl); }, 1000, toDelete, window, tabWindow, repl);
	}
}




function mashup()
{
	var chromeWin = this._workContext;
	var window = this._workContext._content;
	var document = window.document;
	var tagName = "mashlet";
	//this.print("document.title: "+document.title);
	
	var toDelete = [];
	var mashupTags = document.getElementsByTagName(tagName);
	//this.print(tagName+": "+mashupTags);
	//this.print("mashupTags.length: "+mashupTags.length);
	
	var newTab = chromeWin.openNewTabWith("http://www.google.com", document, null, null, null, null);
	
    // Source:
    // http://mxr.mozilla.org/mozilla-central/source/browser/base/content/browser.js#4448
	var tabWindow = chromeWin.gBrowser
		      .getBrowserForTab(newTab)
		      .docShell
		      .QueryInterface(Ci.nsIInterfaceRequestor)
		      .getInterface(Ci.nsIDOMWindow);
	this.print("The tabWindow is: "+tabWindow);
	var tabDocument = tabWindow.document;
	this.print("The tabDocument is: "+tabDocument);
	
	for(var i = 0; i < mashupTags.length; ++i)
	{
		//this.print("mashupTags["+i+"]: "+mashupTags[i]);
		the getMashupContent method needs to be invoked as part of a call back after the tabWindow loads
		the content from the mashlet, then it needs to load the content of the next mashlet, etc.
		this.getMashupContent(window, document, tabWindow, tabDocument, mashupTags[i], tagName + i + "_", this.mashletCallback);
		//mashupTags[i].parentNode.insertBefore(mashupContent, mashupTags[i]);
		toDelete.push(mashupTags[i].parentNode);
		toDelete.push(mashupTags[i]);
		this.print("Added mashlet to be deleted: "+mashupTags[i]);
	}

	window.setTimeout(function(toDelete, window, tabWindow, repl) { repl.deleteMashlets(toDelete, window, tabWindow, repl); }, 1000, toDelete, window, tabWindow, this);
}

//function getDoc(url, doFunc, id)
//xmlhttp=new XMLHttpRequest();
//xmlhttp.onreadystatechange= function() { 
//    if (xmlhttp.readyState==4)
//        if (xmlhttp.status==200)
//            doFunc(xmlhttp, id);
//}
//
//xmlhttp.open("GET",url,true);
//xmlhttp.send(null);
//}
//
//function writeHTML(req, id) {
//document.getElementById(id).innerHTML = req.responseText;
//}
//
//getDoc('blah', writeHTML, 'myId');


function loadMashup(uri)
{
	var window = this._workContext._content;
	var document = window.document;
	
	// register an onload event listener that will invoke the this.mashup method after the uri loads
	
	window.content.location.href = uri;
}









//function mashup()
//{
//	var toDelete = [];
//	var headNode = document.getElementsByTagName("head");
//	this.print("headNode.length: "+headNode.length);
//
//	for(var i=0; i < headNode.length; ++i)
//	{
//		var mashlet = headNode[i].getElementsByTagName("mashlet");
//		for(var j=0; j < mashlet.length; ++j)
//		{
//			this.print("mashlet["+j+"]: "+mashlet[j]);
//			// get html element from the mashlet
//			var mashletContent = this.getMashletContent(window, document, mashlet[j], i+"_head_"+j);
//			mashlet[j].parentNode.insertBefore(mashletContent, mashlet[j]);
//			toDelete.push(mashlet[j].parentNode);
//			toDelete.push(mashlet[j]);
//		}
//	}
//	
//	for(var i=0; i < toDelete.length; i+=2)
//	{
//		toDelete[i].removeChild(toDelete[i+1]);
//	}

	//var embeddedXMLs = document.getElementsByTagName("xml");
	//good line -- mashletXML(window, document, "xml");
//}

//function mashletXML(window, document, tagName)
//{
//	var toDelete = [];
//	var embeddedTags = document.getElementsByTagName(tagName);
//	this.print(tagName+": "+embeddedTags);
//	this.print("embeddedTags.length: "+embeddedTags.length);
//	
//	for(var i=0; i < embeddedTags.length; ++i)
//	{
//		this.print("embeddedTags["+i+"]: "+embeddedTags[i]);
//		var mashlet = embeddedTags[i].getElementsByTagName("mashlet");
//		for(var j=0; j < mashlet.length; ++j)
//		{
//			this.print("mashlet["+j+"]: "+mashlet[j]);
//			// get html element from the mashlet
//			var mashletContent = this.getMashletContent(window, document, mashlet[j], i+"_"+tagName+"_"+j);
//			if(tagName == "xml")
//			{
//              embeddedTags[i].parentNode.insertBefore(mashletContent, embeddedTags[i]);
//				toDelete.push(embeddedTags[i].parentNode);
//				toDelete.push(embeddedTags[i]);
//			}
//			else if(tagName == "head" || tagName == "mashlet")
//			{
//              mashlet[j].parentNode.insertBefore(mashletContent, mashlet[j]);
//				toDelete.push(mashlet[j].parentNode);
//				toDelete.push(mashlet[j]);
//			}
//		}
//	}
//	
//	for(var i=0; i < toDelete.length; i+=2)
//	{
//		toDelete[i].removeChild(toDelete[i+1]);
//	}
//}
