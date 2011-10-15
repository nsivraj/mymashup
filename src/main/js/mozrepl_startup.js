//<><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><>
// this section is for configuring jslint
//<><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><>
/*jslint nomen: false, debug: false,
    evil: false, onevar: true */
/*global Cc: false, Ci: false, repl: false */


//<><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><>
// load in the kernel.js and also the WebActor specified via the
// whichActor parameter
//<><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><>
this.print("****************************************************");
this.print("*");
this.print("* Start with repl.loadActor(<actor_set>); where <actor_set>");
this.print("* is \"bsa\" or \"test\" or \"mint\" or \"crumbs\". Exit with repl.quit();.");
this.print("*");
this.print("****************************************************");

function loadActor(whichActor)
{
	var mozreplInitUrl, endIndex;
	
	mozreplInitUrl = Cc['@mozilla.org/preferences-service;1']
	    .getService(Ci.nsIPrefBranch)
	    .getCharPref('extensions.mozrepl.initUrl');

	//this.print("mozreplInitUrl : " + mozreplInitUrl);
	endIndex = mozreplInitUrl.lastIndexOf('/');
	repl.mozreplInitDir = mozreplInitUrl.substring(0, endIndex);
	//this.print("repl.mozreplInitDir : " + repl.mozreplInitDir);

	repl.load(repl.mozreplInitDir + "/kernel.js", repl);
	if ("bsa" === whichActor)
	{
		repl.load(repl.mozreplInitDir + "/bsa.actor.js", repl);
	}
	else if ("test" === whichActor)
	{
		repl.load(repl.mozreplInitDir + "/test.actor.js", repl);
	}
	else if ("mint" === whichActor)
	{
		repl.load(repl.mozreplInitDir + "/mint.actor.js", repl);
	}
	else if ("crumbs" === whichActor)
	{
		repl.load(repl.mozreplInitDir + "/crumbs.js", repl);
	}
	else if ("mysearch" === whichActor)
	{
		repl.load(repl.mozreplInitDir + "/mysearch.js", repl);
		repl.catchEvents();
	}
}



//<><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><>
// this section is for short cut methods to by pass the reloading of the .js
//<><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><>
function reloadActor(whichActor)
{
	repl.loadInit();
	
	if ("test" === whichActor)
	{
		repl.loadActor("test");
	}
	else if ("bsa" === whichActor)
	{
		repl.loadActor("bsa");
	}
	else if ("mint" === whichActor)
	{
		repl.loadActor("mint");
	}
	else if ("crumbs" === whichActor)
	{
		repl.loadActor("crumbs");
	}
	else if ("mysearch" === whichActor)
	{
		repl.loadActor("mysearch");
	}
}

