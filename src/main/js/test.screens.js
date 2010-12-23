//<><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><>
// this section is for configuring jslint
//<><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><>
/*jslint nomen: false, debug: false,
    evil: false, onevar: true */
/*global globalURLHandler: false, WebScreens: false */


//<><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><>
// this section is for functions that test these WebScreens
//<><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><>
var loadedTestAt = new Date();

function reportTest()
{
    this.print('test.screens.js was loaded at ' + loadedTestAt);
}


//<><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><>
// this section is for the startup functions for these WebScreens
//<><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><>
this.print("****************************************************");
this.print("*");
this.print("* Start with repl.startTest();.");
this.print("*");
this.print("****************************************************");

function startTest()
{
	var params = {};
	params.invokedFromMethod = "startTest";
	params.username = "zoppie";
	params.password = "mymashup";
	params.PersistentCookie = false;
	
	return globalURLHandler.getURL("http://www.gmail.com/", "gmailLogin", params);
}


//<><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><>
// this section is for the actual WebScreens methods
//<><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><>
WebScreens.prototype.allowMethod = function (methodName, screenURL, loadedURL, params)
{
	return (methodName === "gmailLogin" && screenURL.indexOf("/www.gmail.com") !== -1 && loadedURL.indexOf("www.google.com/accounts/ServiceLogin") !== -1);
};


WebScreens.prototype.gmailLogin = function (screenURL, loadedURL, params)
{
	var screenResponse, mouseClick;
	
	if (this.domWindow.document.forms.namedItem('gaia_loginform').elements.namedItem('Email') && 
	   this.domWindow.document.forms.namedItem('gaia_loginform').elements.namedItem('Passwd') &&
	   this.domWindow.document.forms.namedItem('gaia_loginform').elements.namedItem('PersistentCookie') &&
	   this.domWindow.document.forms.namedItem('gaia_loginform').elements.namedItem('signIn'))
	{
		this.repl.print("__________Method 'gmailLogin' invoked: " + screenURL + " :: " + loadedURL);
		
		this.domWindow.document.forms.namedItem('gaia_loginform').elements.namedItem('Email').value = params.username;
		this.domWindow.document.forms.namedItem('gaia_loginform').elements.namedItem('Passwd').value = params.password;
	
		// make sure this checkbox is unchecked
		this.domWindow.document.forms.namedItem('gaia_loginform').elements.namedItem('PersistentCookie').checked = params.PersistentCookie;
		
		// DONE: construct a mouseClick for the signIn button
		mouseClick = this.domWindow.document.createEvent("MouseEvents");
		mouseClick.initMouseEvent('click', true, true, this.domWindow, 1, 0, 0, 0, 0, false, false, false, false, 0, null);
		this.domWindow.document.forms.namedItem('gaia_loginform').elements.namedItem('signIn').dispatchEvent(mouseClick);
		
		screenResponse = {};
		screenResponse.isDone = true;
		screenResponse.nextScreenMethod = "gmailEmailList";
	}
	
	return screenResponse;
};


