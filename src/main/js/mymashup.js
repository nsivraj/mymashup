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

function mashup()
{
	var window = this._workContext._content;
	var document = window.document;
	var tagName = "mashlet";
	this.print("document.title: "+document.title);
	
	var toDelete = [];
	var mashupTags = document.getElementsByTagName(tagName);
	this.print(tagName+": "+mashupTags);
	this.print("mashupTags.length: "+mashupTags.length);
	
	for(var i=0; i < mashupTags.length; ++i)
	{
		this.print("mashupTags["+i+"]: "+mashupTags[i]);
		var mashupContent = this.getMashupContent(window, document, mashupTags[i], i+"_"+tagName);
		mashupTags[i].parentNode.insertBefore(mashupContent, mashupTags[i]);
		toDelete.push(mashupTags[i].parentNode);
		toDelete.push(mashupTags[i]);
	}
	
	for(var i=0; i < toDelete.length; i+=2)
	{
		toDelete[i].removeChild(toDelete[i+1]);
	}
}

function getMashupContent(window, document, mashlet, mIndex)
{
	var xpath = mashlet.getAttribute("xpath");
	if(!xpath)
	{
		xpath = mashlet.textContent;
	}
	var uri = mashlet.getAttribute("uri");
	var htmlTag = mashlet.getAttribute("htmlTag");
	if(!htmlTag)
	{
		htmlTag = "span";
	}
	var tagId = mashlet.getAttribute("id");
	if(!tagId)
	{
		tagId = "htmlTag"+mIndex;
	}
	
	var mashedElement = document.createElement(htmlTag);
	mashedElement.setAttribute("id", tagId);
	mashedElement.innerHTML = uri + " :: " + xpath;
	return mashedElement;
}

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
