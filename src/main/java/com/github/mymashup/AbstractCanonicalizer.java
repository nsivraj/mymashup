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
		MeritBadge mb = MeritBadge.findByCanonicalName(mbName.toLowerCase().replace(" ", ""));
		//an error is occuring on the next line when mbName is empty
		return mb == null ? null : String.valueOf(mb.getNumber());
	}

	public String[] getCanonicalData(String dataOrigin, String[] mbData, String[] mapping)
	{
		String[] canonicalData = new String[ImportField.getFieldCount()];
		
		for(int i = 0; i < mbData.length; ++i)
		{
			ImportField field = ImportField.findByName(mapping[i]);
			if(field != null && (dataOrigin.equals(field.getOwner()) || "canonical".equalsIgnoreCase(dataOrigin)))
			{
				canonicalData[field.getIndex()] = getCanonicalData(canonicalData[field.getIndex()], mbData[i], field);
			}
		}

		for(int i = 0; i < canonicalData.length; ++i)
		{
			if(canonicalData[i] == null)
			{
				canonicalData[i] = ImportField.findByIndex(i).getDefaultValue();
			}
		}
		
		return canonicalData;
	}
	
	public String getCanonicalData(String currentCanonicalData, String data, ImportField field)
	{
		if(data == null) return data;
		
		String canonicalData = data.trim();
		
		if(field != null)
		{
			if(ALL_NUMBERS.equals(field.getType()))
			{
				if(!isAllNumbers(canonicalData))
				{
					throw new RuntimeException("The field '" + field.getName() + " :: " + field.getType() + "' is not all numbers: " + canonicalData);
				}
			}
			else if(STRING.equals(field.getType()) || NAME.equals(field.getType()) || EMAIL.equals(field.getType()))
			{
				canonicalData = canonicalData.toUpperCase();
			}
			else if(STATE_OPTION.equals(field.getType()))
			{
				canonicalData = getCanonicalState(canonicalData.toUpperCase());
				if(canonicalData == null || canonicalData.length() <= 0)
				{
					canonicalData = field.getDefaultValue();
				}
				
				if(canonicalData == null)
				{
					throw new RuntimeException("The field '" + field.getName() + " :: " + field.getType() + "' does not have a STATE_OPTION mapping: " + data);
				}
			}
			else if(US_POSTAL_CODE.equals(field.getType()))
			{
				canonicalData = canonicalData.replace("-", "");
				if(!isAllNumbers(canonicalData))
				{
					throw new RuntimeException("The field '" + field.getName() + " :: " + field.getType() + "' is not all numbers: " + canonicalData);
				}
			}
			else if(COUNTRY_OPTION.equals(field.getType()))
			{
				canonicalData = getCanonicalCountry(canonicalData.toUpperCase());
				if(canonicalData == null)
				{
					canonicalData = field.getDefaultValue();
				}
	
				if(canonicalData == null || canonicalData.length() <= 0)
				{
					throw new RuntimeException("The field '" + field.getName() + " :: " + field.getType() + "' does not have a COUNTRY_OPTION mapping: " + data);
				}
			}
			else if(PHONE.equals(field.getType()))
			{
				canonicalData = parseTelephone(canonicalData); //canonicalData.replace("(", "").replace(")", "").replace(" ", "").replace("-", "");
				if(!isAllNumbers(canonicalData))
				{
					throw new RuntimeException("The field '" + field.getName() + " :: " + field.getType() + "' is not all numbers: " + canonicalData + " :: " + data);
				}
			}
			else if(UNIT_OPTION.equals(field.getType()))
			{
				canonicalData = getCanonicalUnit(canonicalData.toUpperCase());
				if(canonicalData == null)
				{
					canonicalData = field.getDefaultValue();
				}
	
				//if(canonicalData == null || canonicalData.length() <= 0)
				//{
				//	throw new RuntimeException("The field '" + field.getName() + " :: " + field.getType() + "' does not have a UNIT_OPTION mapping: " + data);
				//}
			}
			else if(DATE.equals(field.getType()))
			{
				canonicalData = canonicalData.replace("/", "");
				if(!isAllNumbers(canonicalData))
				{
					throw new RuntimeException("The field '" + field.getName() + " :: " + field.getType() + "' is not all numbers: " + canonicalData + " :: " + data);
				}
			}
			else if(ACTIVE_OPTION.equals(field.getType()))
			{
				canonicalData = getCanonicalActive(canonicalData.toUpperCase());
				if(canonicalData == null)
				{
					canonicalData = field.getDefaultValue();
				}
	
				if(canonicalData == null || canonicalData.length() <= 0)
				{
					throw new RuntimeException("The field '" + field.getName() + " :: " + field.getType() + "' does not have a ACTIVE_OPTION mapping: " + data);
				}
			}
			else if(MB_LIST.equals(field.getType()))
			{
				canonicalData = getCanonicalMBNumber(canonicalData);
				if((canonicalData == null || canonicalData.length() <= 0) && currentCanonicalData == null)
				{
					throw new RuntimeException("The field '" + field.getName() + " :: " + field.getType() + "' does not have a Merit Badge mapping: " + data);
				}
				else
				{
					if(currentCanonicalData != null && currentCanonicalData.length() > 0)
					{
						canonicalData = currentCanonicalData + "," + canonicalData;
					}
				}
			}
				
			//if(canonicalData == null/* || canonicalData.length() <= 0*/)
			//{
			//	throw new RuntimeException("The field '" + field.getName() + " :: " + field.getType() + "' is null or empty: " + canonicalData + " :: " + data);
			//}
		}
		
		return canonicalData;
	}
	

	public String getCanonicalDisplayString(String value, ImportField field)
	{
		String displayVal = value;
		
		if(EMAIL.equals(field.getType()))
		{
			displayVal = value.toLowerCase();
		}
		else if(NAME.equals(field.getType()))
		{
			String[] parts = value.split(" ");
			displayVal = "";
			for(int i = 0; i < parts.length; ++i)
			{
				if(parts[i].trim().length() > 0)
				{
					displayVal += Character.toUpperCase(parts[i].charAt(0)) + parts[i].substring(1).toLowerCase();
					displayVal += " ";
				}
			}
		}
		else if(US_POSTAL_CODE.equals(field.getType()))
		{
			if(value.length() > 5)
			{
				displayVal = value.substring(0,5) + "-" + value.substring(5);
			}
		}
		else if(PHONE.equals(field.getType()))
		{
			if(value.length() == 10)
			{
				displayVal = "(" + value.substring(0,3) + ")" + value.substring(3,6) + "-" + value.substring(6);
			}
			else if(value.length() == 7)
			{
				displayVal = value.substring(0,3) + "-" + value.substring(3);
			}
		}
		
		return displayVal.trim();
	}
	
	
	public String getCanonicalString(MBCounselor counselor)
	{
		String[] values = counselor.getValues();
		StringBuilder buf = new StringBuilder();
		
		for(int i = 0; i < values.length; ++i)
		{
			// instead of just appending values[i], rather make sure values[i] is displayed properly!!
			ImportField field = ImportField.findByIndex(i);
			buf.append(values[i] == null ? "" : getCanonicalDisplayString(values[i], field));
			
			if(i < (values.length + 1))
			{
				buf.append("\t");
			}
		}
		
		return buf.toString();
	}
	
	public String parseTelephone(String phone)
	{
		String retVal = "";

		for(int i = 0; i < phone.length(); ++i)
		{
			if(Character.isDigit(phone.charAt(i)))
			{
				retVal += phone.charAt(i);
			}
		}
		
		return retVal;
	}	
}


