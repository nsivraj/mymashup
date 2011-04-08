//<><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><>
// this section is for configuring jslint
//<><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><>
/*jslint nomen: false, debug: false,
    evil: false, onevar: true */
/*global webActor: false, WebActor: false */


//<><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><>
// this section is for functions that test these WebActor
//<><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><>
var loadedMintAt = new Date();

function reportTest()
{
    this.print('mint.screens.js was loaded at ' + loadedMintAt);
}


//<><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><>
//this section is for the startup functions for these WebActor
//<><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><>
this.print("****************************************************");
this.print("*");
this.print("* Start with repl.mint();.");
this.print("*");
this.print("****************************************************");

function mint()
{
	var params = {}, retVal;
	params.invokedFromMethod = "mint";

	//return webActor.gotoNextURL("https://wwws.mint.com/overview.event", "chooseMintPage", params);
	retVal = webActor.gotoNextURL("", "chooseMintPage", params);
	webActor.chooseMintPage("", "", params);
	
	return retVal;
}

//<><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><>
//this section is for the actual WebActor methods
//<><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><><>
WebActor.prototype.allowMethod = function (methodName, screenURL, loadedURL, params)
{
	return (
	    this.checkMethodRequest(
          methodName, ["mintAnalysis"],
          screenURL, "",
          loadedURL, ""
	    ) || this.checkMethodRequest(
          methodName, ["mbAdmin"],
          screenURL, "/utahscouts.doubleknot.com/rosters/MBdefault.asp",
          loadedURL, "/utahscouts.doubleknot.com/rosters/MBdefault.asp"
		) || this.checkMethodRequest(
          methodName, ["counselorAdmin"],
          screenURL, "",
          loadedURL, "/utahscouts.doubleknot.com/rosters/MBNameList.asp"
		) || this.checkMethodRequest(
          methodName, ["createAndEditCounselor"],
          screenURL, "",
          loadedURL, "/utahscouts.doubleknot.com/rosters/EditCouncilor.asp"
		)
	);
};


WebActor.prototype.chooseMintPage = function (screenURL, loadedURL, params)
{
	var mintPage, startDate, sDate, defaultStartDate = "", endDate, todaysDate, defaultEndDate = "";
	
	// prompt for the page to go to
	// https://wwws.mint.com/transaction.event?startDate=03/01/2011&endDate=03/31/2011 
	mintPage = this.promptForInput(this.domWindow, 'Please choose one of these: transaction, budget, ????', "transaction");
	
	if (mintPage === "transaction")
	{
		// Done: set the default endDate to today's date
		todaysDate = new Date();
		defaultEndDate = (todaysDate.getMonth() < 9) ? "0" + (todaysDate.getMonth() + 1) : todaysDate.getMonth() + 1;
		defaultEndDate += "/" + ((todaysDate.getDate() < 10) ? ("0" + todaysDate.getDate()) : todaysDate.getDate());
		defaultEndDate += "/" + todaysDate.getFullYear();
		
		// Done: have the default startDate be 14 days ago
		sDate = new Date(todaysDate.getTime() - (14 * 24 * 60 * 60 * 1000));
		defaultStartDate = (sDate.getMonth() < 9) ? "0" + (sDate.getMonth() + 1) : sDate.getMonth() + 1;
		defaultStartDate += "/" + ((sDate.getDate() < 10) ? "0" + sDate.getDate() : sDate.getDate());
		defaultStartDate += "/" + sDate.getFullYear();
		
		// prompt for the startDate and the endDate for which to get the transactions
		startDate = this.promptForInput(this.domWindow, 'Please enter the start date: 03/26/2011', defaultStartDate);
		endDate = this.promptForInput(this.domWindow, 'Please enter the end date: 03/31/2011', defaultEndDate);
		
		this.repl.print("https://wwws.mint.com/transaction.event?startDate=" + startDate + "&endDate=" + endDate);
		this.gotoNextURL("https://wwws.mint.com/transaction.event?startDate=" + startDate + "&endDate=" + endDate, "mintTransactionPage", params);
	}
};


WebActor.prototype.mintTransactionPage = function (screenURL, loadedURL, params)
{
	// sum up all of the debits and sum up all of the credits and show the sums in the page
	
};


