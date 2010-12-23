//<><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><>
// this section is for configuring jslint
//<><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><>
/*jslint nomen: false, debug: false,
    evil: false, onevar: true */
/*global Cc: false, Ci: false, repl: false */


//<><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><>
// load in the kernel.js and also the WebScreens specified via the
// whichScreens parameter
//<><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><>
this.print("****************************************************");
this.print("*");
this.print("* Start with repl.loadScreens(<screen_set>); where <screen_set>");
this.print("* is \"bsa\" or \"test\". Exit with repl.quit();.");
this.print("*");
this.print("****************************************************");

function loadScreens(whichScreens)
{
	var mozreplInitUrl, mozreplInitDir, endIndex;
	
	mozreplInitUrl = Cc['@mozilla.org/preferences-service;1']
	    .getService(Ci.nsIPrefBranch)
	    .getCharPref('extensions.mozrepl.initUrl');

	//this.print("mozreplInitUrl : " + mozreplInitUrl);
	endIndex = mozreplInitUrl.lastIndexOf('/');
	mozreplInitDir = mozreplInitUrl.substring(0, endIndex);
	//this.print("mozreplInitDir : " + mozreplInitDir);

	repl.load(mozreplInitDir + "/kernel.js", repl);
	if ("bsa" === whichScreens)
	{
		repl.load(mozreplInitDir + "/bsa.screens.js", repl);
	}
	else if ("test" === whichScreens)
	{
		repl.load(mozreplInitDir + "/test.screens.js", repl);
	}
}



//<><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><>
// this section is for short cut methods to by pass the reloading of the .js
//<><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><>
function reloadScript()
{
	repl.loadInit();
	repl.loadScreens("test");
	repl.startTest();
	//repl.loadScreens("bsa");
	//repl.loadMBCounselors();
}
