package com.github.mymashup;

import java.io.File;
import java.text.ParseException;
import java.util.HashMap;
import java.util.Map;

public interface Canonicalizer
{
	public static final String ALL_NUMBERS = "AllNumbers";
	public static final String STRING = "String";
	public static final String NAME = "Name";
	public static final String EMAIL = "Email";
	public static final String STATE_OPTION = "StateOption";
	public static final String US_POSTAL_CODE = "USPostalCode";
	public static final String COUNTRY_OPTION = "CountryOption";
	public static final String PHONE = "Phone";
	public static final String UNIT_OPTION = "UnitOption";
	public static final String DATE = "Date";
	public static final String ACTIVE_OPTION = "ActiveOption";
	public static final String MB_LIST = "MBList";
	
	public String[] getCanonicalData(File mostRecentDataFile, String dataOrigin, String[] mbData, String[] mapping) throws ParseException;
	public String getCanonicalData(String currentCanonicalData, String data, ImportField field) throws ParseException;
	public String getCanonicalString(MBCounselor counselor);
	public String getCanonicalDisplayString(String value, ImportField field);
	public String parseTelephone(String phone);
}
