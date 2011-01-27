package com.github.mymashup;

import java.util.HashMap;
import java.util.Map;

public abstract class AbstractCanonicalizer implements Canonicalizer
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
	
	private static final Map<String, String> stateOptions = new HashMap<String, String>();
	private static final Map<String, String> countryOptions = new HashMap<String, String>();
	private static final Map<String, String> unitOptions = new HashMap<String, String>();
	private static final Map<String, String> activeOptions = new HashMap<String, String>();
	static
	{
		stateOptions.put("UT", "UT");
		
		countryOptions.put("US", "US");
		
		unitOptions.put("PROVO WEST STAKE", "Provo West Stake");
		unitOptions.put("PROVO GRANDVIEW SOUTH STAKE", "Provo Grandview South Stake");
		unitOptions.put("PROVO PARKWAY STAKE", "Provo Parkway Stake");
		unitOptions.put("PROVO SOUTH STAKE", "Provo South Stake");
		unitOptions.put("PROVO SUNSET STAKE", "Provo Sunset Stake");
		unitOptions.put("GRANDVIEW STAKE", "Grandview Stake");
		unitOptions.put("GRANDVIEW EAST", "Grandview East");
		unitOptions.put("PROVO CENTRAL STK.", "Provo Central Stk.");
		unitOptions.put("FORT UTAH/ ARTURO", "Fort Utah/ Arturo");
		unitOptions.put("PROVO NORTH PARK", "Provo North Park");
		unitOptions.put("COMMUNITY UNITS", "Community Units");
		
		activeOptions.put("YES", "yes");
	}
	
	public boolean isAllNumbers(String data)
	{
		for(char ch : data.toCharArray())
		{
			if(!Character.isDigit(ch))
			{
				return false;
			}
		}
		
		return true;
	}

	public String getCanonicalState(String canonicalData)
	{
		return stateOptions.get(canonicalData);
	}
	
	
	public String getCanonicalCountry(String canonicalData)
	{
		return countryOptions.get(canonicalData);
	}

	
	public String getCanonicalUnit(String canonicalData)
	{
		return unitOptions.get(canonicalData);
	}

	
	public String getCanonicalActive(String canonicalData)
	{
		return activeOptions.get(canonicalData);
	}
	
	public String getCanonicalMBNumber(String mbName)
	{
		mbName = mbName.toLowerCase().replace(" ", "");
		return String.valueOf(MeritBadge.findByCanonicalName(mbName).getNumber());
	}
}


