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
	
	params.OrgKey = 0;
	params.DoWhat_mbAdmin = {};
	params.DoWhat_mbAdmin.value = "user";
	params.DoWhat_mbAdmin.checked = true;
	params.ActiveCounselorsOnly = false;
	
	// add a test counselor for testing and then use that index
	//params.CounselorKey = 7; // this index selects the counselor to edit
	params.CounselorKey = "115756";
	params.DoWhat_counselorAdmin = {};
	params.DoWhat_counselorAdmin.value = "edit";
	params.DoWhat_counselorAdmin.checked = true;
	
	params.LastName = "Jarvis";
	params.FirstName = "Norman";
	params.strAddress = "230 North 2300 West";
	params.strCity = "Provo";
	params.strState = "UT";
	params.dblZip = "84601";
	this.getFormInput(this.domWindow, 1, 'strWorkPhone').value = params.strWorkPhone; // (801) 377-1663
	this.getFormInput(this.domWindow, 1, 'strHomePhone').value = params.strHomePhone; // (801) 377-1663
	this.getFormInput(this.domWindow, 1, 'dtmTrained').value = params.dtmTrained; // what is the date format?
	this.getFormInput(this.domWindow, 1, 'strRegNumber').value = params.strRegNumber;
	this.getFormInput(this.domWindow, 1, 'dtmUpdated').value = params.dtmTrained; // what is the date format?
	this.getFormInput(this.domWindow, 1, 'dtmExpires').value = params.dtmTrained; // what is the date format?
	
	/* One of these is the strUnit
                <option  value="Community Units">Community Units</option>

				<option  value="Provo Central">Provo Central</option>

				<option  value="Provo Grandview">Provo Grandview</option>

				<option  value="Provo Grandview East">Provo Grandview East</option>

				<option  value="Provo Grandview South">Provo Grandview South</option>

				<option  value="Provo North Park">Provo North Park</option>

				<option  value="Provo Parkway">Provo Parkway</option>

				<option  value="Provo South">Provo South</option>

				<option  value="Provo Sunset">Provo Sunset</option>

				<option Selected  value="Provo West">Provo West</option>
	 */
	this.handleSelect(this.domWindow, 1, 'strUnit', params.strUnit);
	this.getFormInput(this.domWindow, 1, 'otherstrUnit').value = params.otherstrUnit;
	this.getFormInput(this.domWindow, 1, 'Email').value = params.Email;
	this.getFormInput(this.domWindow, 1, 'Email2').value = params.Email2;
	this.getFormInput(this.domWindow, 1, 'Note').value = params.Note;
	params.ActiveCode = true;
	params.ShowAddress = true;
	
	//return globalURLHandler.webScreens.gotoNextURL("https://utahscouts.doubleknot.com/rosters/logon.asp?orgkey=", "meritBadgeLogin", params, true);
	//return globalURLHandler.webScreens.gotoNextURL("https://utahscouts.doubleknot.com/rosters/MBdefault.asp", "mbAdmin", params, true);
	return globalURLHandler.webScreens.gotoNextURL("https://utahscouts.doubleknot.com/rosters/MBNameList.asp", "counselorAdmin", params, true);
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


WebScreens.prototype.meritBadgeLogin = function (screenURL, loadedURL, params)
{
	var mouseClick, creds;

	if (this.inputsExist(this.domWindow, 'LogonForm', ['UserName', 'Password', 'savePWD', 'Btn1']))
	{
		this.repl.print("__________Method 'meritBadgeLogin' invoked: '" + screenURL + "' :: '" + loadedURL + "'");
		
		creds = this.promptForUsernameAndPassword(this.domWindow, 'Please enter your Username and Password', this.getFormInput(this.domWindow, 'LogonForm', 'UserName').value);
		this.getFormInput(this.domWindow, 'LogonForm', 'UserName').value = creds[0];
		this.getFormInput(this.domWindow, 'LogonForm', 'Password').value = creds[1];
		this.getFormInput(this.domWindow, 'LogonForm', 'savePWD').checked = params.savePWD;

		// DONE: this is where the logic goes to setup the WebScreens object for the next URL
		// that will load as soon as the click event is dispatched below
		this.gotoNextURL("", "gotoMBAdmin", params, false);
		
		this.repl.print("meritBadgeLogin after gotoNextURL: gotoMBAdmin");
		this.dispatchClickEvent(this.domWindow, this.getFormInput(this.domWindow, 'LogonForm', 'Btn1'));
		this.repl.print("meritBadgeLogin after dispatchClickEvent: LogonForm.Btn1");
	}
	else
	{
		return this.handleError("meritBadgeLogin", params);
	}
};

 
// https://utahscouts.doubleknot.com/rosters/default.asp?UserName=NORMAN.JARVIS@GMAIL.COM
WebScreens.prototype.gotoMBAdmin = function (screenURL, loadedURL, params)
{
	this.repl.print("__________Method 'gotoMBAdmin' invoked: '" + screenURL + "' :: '" + loadedURL + "'");
	this.gotoNextURL("https://utahscouts.doubleknot.com/rosters/MBdefault.asp", "mbAdmin", params, true);
};


//https://utahscouts.doubleknot.com/rosters/MBdefault.asp
WebScreens.prototype.mbAdmin = function (screenURL, loadedURL, params)
{
	var mouseClick;
	
	if (this.inputsExist(this.domWindow, 1, ['OrgKey', 'DoWhat', 'ActiveCounselorsOnly', 'Btn']))
	{
		this.repl.print("__________Method 'mbAdmin' invoked: '" + screenURL + "' :: '" + loadedURL + "'");

		//this.repl.print("Got here 1");
		this.handleSelect(this.domWindow, 1, 'OrgKey', params.OrgKey);
		//this.repl.print("Got here 2");
		this.handleRadioButton(this.domWindow, 1, 'DoWhat', params.DoWhat_mbAdmin.value, params.DoWhat_mbAdmin.checked);
		//this.repl.print("Got here 3");
		this.getFormInput(this.domWindow, 1, 'ActiveCounselorsOnly').checked = params.ActiveCounselorsOnly;
		//this.repl.print("Got here 4");
		
		this.gotoNextURL("", "counselorAdmin", params, false);

		this.dispatchClickEvent(this.domWindow, this.getFormInput(this.domWindow, 1, 'Btn'));
	}
	else
	{
		return this.handleError("mbAdmin", params);
	}
};


WebScreens.prototype.counselorAdmin = function (screenURL, loadedURL, params)
{
	var mouseClick;
	
	if (this.inputsExist(this.domWindow, 1, ['CounselorKey', 'DoWhat', 'Btn']))
	{
		this.repl.print("__________Method 'counselorAdmin' invoked: '" + screenURL + "' :: '" + loadedURL + "'");

		//this.repl.print("Got here 1");
		this.handleSelect(this.domWindow, 1, 'CounselorKey', params.CounselorKey);
		//this.repl.print("Got here 2");
		this.handleRadioButton(this.domWindow, 1, 'DoWhat', params.DoWhat_counselorAdmin.value, params.DoWhat_counselorAdmin.checked);
		//this.repl.print("Got here 3");
		
		this.gotoNextURL("", "createAndEditCounselor", params, false);

		this.dispatchClickEvent(this.domWindow, this.getFormInput(this.domWindow, 1, 'Btn'));
	}
	else
	{
		return this.handleError("counselorAdmin", params);
	}
	
};



WebScreens.prototype.createAndEditCounselor = function (screenURL, loadedURL, params)
{
	var mouseClick;
	
	if (this.inputsExist(this.domWindow, 1, ['strLastName', 'strFirstName', 'ActiveCode', 'Submit']))
	{
		this.repl.print("__________Method 'createAndEditCounselor' invoked: '" + screenURL + "' :: '" + loadedURL + "'");

		this.getFormInput(this.domWindow, 1, 'strLastName').value = params.LastName;
		this.getFormInput(this.domWindow, 1, 'strFirstName').value = params.FirstName;
		this.getFormInput(this.domWindow, 1, 'strAddress').value = params.strAddress;
		this.getFormInput(this.domWindow, 1, 'strCity').value = params.strCity;
		this.handleSelect(this.domWindow, 1, 'strState', params.strState);
		this.getFormInput(this.domWindow, 1, 'dblZip').value = params.dblZip;
		this.getFormInput(this.domWindow, 1, 'strWorkPhone').value = params.strWorkPhone; // (801) 377-1663
		this.getFormInput(this.domWindow, 1, 'strHomePhone').value = params.strHomePhone; // (801) 377-1663
		this.getFormInput(this.domWindow, 1, 'dtmTrained').value = params.dtmTrained; // what is the date format?
		this.getFormInput(this.domWindow, 1, 'strRegNumber').value = params.strRegNumber;
		this.getFormInput(this.domWindow, 1, 'dtmUpdated').value = params.dtmTrained; // what is the date format?
		this.getFormInput(this.domWindow, 1, 'dtmExpires').value = params.dtmTrained; // what is the date format?
		
		/* One of these is the strUnit
                    <option  value="Community Units">Community Units</option>

					<option  value="Provo Central">Provo Central</option>

					<option  value="Provo Grandview">Provo Grandview</option>

					<option  value="Provo Grandview East">Provo Grandview East</option>

					<option  value="Provo Grandview South">Provo Grandview South</option>

					<option  value="Provo North Park">Provo North Park</option>

					<option  value="Provo Parkway">Provo Parkway</option>

					<option  value="Provo South">Provo South</option>

					<option  value="Provo Sunset">Provo Sunset</option>

					<option Selected  value="Provo West">Provo West</option>
		 */
		this.handleSelect(this.domWindow, 1, 'strUnit', params.strUnit);
		this.getFormInput(this.domWindow, 1, 'otherstrUnit').value = params.otherstrUnit;
		this.getFormInput(this.domWindow, 1, 'Email').value = params.Email;
		this.getFormInput(this.domWindow, 1, 'Email2').value = params.Email2;
		this.getFormInput(this.domWindow, 1, 'Note').value = params.Note;
		this.getFormInput(this.domWindow, 1, 'ActiveCode').checked = params.ActiveCode;
		this.getFormInput(this.domWindow, 1, 'ShowAddress').checked = params.ShowAddress;
		
		this.gotoNextURL("", "doneWithScreen", params, false);

		//this.dispatchClickEvent(this.domWindow, this.getFormInput(this.domWindow, 1, 'Submit'));
	}
	else
	{
		return this.handleError("createAndEditCounselor", params);
	}
	
};


