//<><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><>
// this section is for configuring jslint
//<><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><>
/*jslint nomen: false, debug: false,
    evil: false, onevar: true */
/*global globalURLHandler: false, WebScreens: false */


//<><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><>
// this section is for functions that test these WebScreens
//<><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><>
var loadedBSAAt = new Date();

function reportTest()
{
    this.print('bsa.screens.js was loaded at ' + loadedBSAAt);
}


//<><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><>
//this section is for the startup functions for these WebScreens
//<><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><>
this.print("****************************************************");
this.print("*");
this.print("* Start with repl.loadMBCounselors();.");
this.print("*");
this.print("****************************************************");

function loadMBCounselors()
{
	var params = {};
	params.invokedFromMethod = "loadMBCounselors";
	params.savePWD = false;
	
	return globalURLHandler.webScreens.gotoNextURL("https://utahscouts.doubleknot.com/rosters/logon.asp?orgkey=", "meritBadgeLogin", params, true);
}

//<><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><>
//this section is for the actual WebScreens methods
//<><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><>
WebScreens.prototype.allowMethod = function (methodName, screenURL, loadedURL, params)
{
	return (
	    this.checkMethodRequest(
	        methodName, ["meritBadgeLogin"],
	    	screenURL, "/utahscouts.doubleknot.com/rosters/logon.asp",
	    	loadedURL, "/utahscouts.doubleknot.com/rosters/logon.asp"
	    ) || this.checkMethodRequest(
		        methodName, ["gotoMBAdmin"],
		    	screenURL, "",
		    	loadedURL, "/utahscouts.doubleknot.com/rosters/default.asp"
	    ) || this.checkMethodRequest(
		        methodName, ["mbAdmin"],
		    	screenURL, "/utahscouts.doubleknot.com/rosters/MBdefault.asp",
		    	loadedURL, "/utahscouts.doubleknot.com/rosters/MBdefault.asp"
		)
	);
};


WebScreens.prototype.meritBadgeLogin = function (screenURL, loadedURL, params)
{
	var mouseClick;
	
	if (this.inputsExist(this.domWindow, 'LogonForm', ['UserName', 'Password', 'savePWD', 'Btn1']))
	{
		this.repl.print("__________Method 'meritBadgeLogin' invoked: " + screenURL + " :: " + loadedURL);
		
		this.getFormInput(this.domWindow, 'LogonForm', 'UserName').value = this.promptForInput(this.domWindow, 'UserName');
		this.getFormInput(this.domWindow, 'LogonForm', 'Password').value = this.promptForInput(this.domWindow, 'Password');
		this.getFormInput(this.domWindow, 'LogonForm', 'savePWD').checked = params.savePWD;

		// TODO: this is where the logic goes to setup the WebScreens object for the next URL
		// that will load as soon as the click event is dispatched below
		this.gotoNextURL("", "gotoMBAdmin", params, false);
		
		this.dispatchClickEvent(this.domWindow, this.getFormInput(this.domWindow, 'LogonForm', 'Btn1'));
	}
	else
	{
		this.repl.print("meritBadgeLogin: some of the inputs do not exist!!");
	}
};

 
// https://utahscouts.doubleknot.com/rosters/default.asp?UserName=NORMAN.JARVIS@GMAIL.COM
WebScreens.prototype.gotoMBAdmin = function (screenURL, loadedURL, params)
{
	this.repl.print("__________Method 'gotoMBAdmin' invoked: " + screenURL + " :: " + loadedURL);
	
	this.gotoNextURL("https://utahscouts.doubleknot.com/rosters/MBdefault.asp", "mbAdmin", params, true);
};


//https://utahscouts.doubleknot.com/rosters/MBdefault.asp
WebScreens.prototype.mbAdmin = function (screenURL, loadedURL, params)
{
	this.repl.print("__________Method 'mbAdmin' invoked: " + screenURL + " :: " + loadedURL);
};

