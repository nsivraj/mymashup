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
	params.PersistentCookie = false;
	
	return globalURLHandler.webScreens.gotoNextURL("http://www.gmail.com/", "gmailLogin", params);
}


//<><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><>
// this section is for the actual WebScreens methods
//<><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><>
WebScreens.prototype.allowMethod = function (methodName, screenURL, loadedURL, params)
{
	//return (methodName === "gmailLogin" && screenURL.indexOf("/www.gmail.com") !== -1 && loadedURL.indexOf("www.google.com/accounts/ServiceLogin") !== -1);
	return (
        this.checkMethodRequest(
            methodName, ["gmailLogin"],
            screenURL, "/www.gmail.com",
            loadedURL, "www.google.com/accounts/ServiceLogin"
		)
    );
};


WebScreens.prototype.gmailLogin = function (screenURL, loadedURL, params)
{
	var screenResponse, mouseClick, creds;
	
	if (this.inputsExist(this.domWindow, 'gaia_loginform', ['Email', 'Passwd', 'PersistentCookie', 'signIn']))
	{
		this.repl.print("__________Method 'gmailLogin' invoked: " + screenURL + " :: " + loadedURL);
		
		creds = this.promptForUsernameAndPassword(this.domWindow, 'Please enter your Username and Password', this.getFormInput(this.domWindow, 'gaia_loginform', 'Email').value);
		this.getFormInput(this.domWindow, 'gaia_loginform', 'Email').value = creds[0]; //this.promptForInput(this.domWindow, 'Email', this.getFormInput(this.domWindow, 'gaia_loginform', 'Email').value);
		this.getFormInput(this.domWindow, 'gaia_loginform', 'Passwd').value = creds[1]; //this.promptForInput(this.domWindow, 'Passwd');
		this.getFormInput(this.domWindow, 'gaia_loginform', 'PersistentCookie').checked = params.PersistentCookie;

		// TODO: this is where the logic goes to setup the WebScreens object for the next URL
		// that will load as soon as the click event is dispatched below
		
		this.dispatchClickEvent(this.domWindow, this.getFormInput(this.domWindow, 'gaia_loginform', 'signIn'));
	}
	else
	{
		return this.handleError("gmailLogin", params);
	}
};


