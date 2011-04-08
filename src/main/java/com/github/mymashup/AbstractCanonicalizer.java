package com.github.mymashup;

import java.io.File;
import java.util.HashMap;
import java.util.Map;

public abstract class AbstractCanonicalizer implements Canonicalizer
{
	private static final Map<String, String> stateOptions = new HashMap<String, String>();
	private static final Map<String, String> countryOptions = new HashMap<String, String>();
	private static final Map<String, String> unitOptions = new HashMap<String, String>();
	private static final Map<String, String> activeOptions = new HashMap<String, String>();
	static
	{
		stateOptions.put("UT", "UT");
		//there is a person with State set to PA in the DoubleknotExport.20101103.xls file, his name is Stinger
		stateOptions.put("PA", "PA");
		
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
		
		// the length and order of mbData is different than the length and order or canonicalData
		for(int i = 0; i < mbData.length; ++i)
		{
			ImportField field = ImportField.findByName(mapping[i]);
			if(field != null/* && (dataOrigin.equals(field.getOwner()) || "canonical".equalsIgnoreCase(dataOrigin))*/)
			{
				canonicalData[field.getIndex()] = getCanonicalData(canonicalData[field.getIndex()], mbData[i], field);
			}
		}

		// the length and order of mbData is different than the length and order or canonicalData
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
				if("Last_Name".equals(field.getName()) && (canonicalData.endsWith(" JR") || canonicalData.endsWith(" DR") || canonicalData.endsWith(" IV")))
				{
					// DONE: check for IV and figure out a way to keep the lastname suffix
					String origCanonicalData = canonicalData;
					canonicalData = origCanonicalData.substring(0, origCanonicalData.length() - 3);
					canonicalData += MBCounselor.LASTNAME_SUFFIX_INDICATOR+origCanonicalData.substring(origCanonicalData.length() - 3).trim();
				}
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
					//throw new RuntimeException("The field '" + field.getName() + " :: " + field.getType() + "' does not have a STATE_OPTION mapping: " + data);
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
			else if("Note".equals(field.getName()))
			{
				if((canonicalData == null || canonicalData.length() <= 0) && currentCanonicalData == null)
				{
					//throw new RuntimeException("The field '" + field.getName() + " :: " + field.getType() + "' does not have a Merit Badge mapping: " + data + " :: " + canonicalData);
				}
				else
				{
					if(currentCanonicalData != null && currentCanonicalData.length() > 0 && canonicalData != null && currentCanonicalData.indexOf(canonicalData) == -1)
					{
						canonicalData = currentCanonicalData + " -- " + canonicalData;
					}
				}
			}
			else if(MB_LIST.equals(field.getType()))
			{
				canonicalData = getCanonicalMBNumber(canonicalData);
				if((canonicalData == null || canonicalData.length() <= 0) && currentCanonicalData == null)
				{
					//throw new RuntimeException("The field '" + field.getName() + " :: " + field.getType() + "' does not have a Merit Badge mapping: " + data + " :: " + canonicalData);
				}
				else
				{
					if(currentCanonicalData != null && currentCanonicalData.length() > 0 && canonicalData != null)
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
			if(value.length() == 7)
			{
				displayVal = value.substring(0,3) + "-" + value.substring(3);
			}
			else if(value.length() == 10)
			{
				displayVal = "(" + value.substring(0,3) + ")" + value.substring(3,6) + "-" + value.substring(6);
			}
			else if(value.length() > 10)
			{
				displayVal = "(" + value.substring(0,3) + ")" + value.substring(3,6) + "-" + value.substring(6,10) + " x" + value.substring(10);
			}
			else if(value.length() > 0)
			{
				throw new RuntimeException("The phone number '"+value+"' is longer than zero but not long enough");
			}
		}
		else if(MB_LIST.equals(field.getType()))
		{
			// TODO: add code here to remove duplicates
			String[] mbVals = displayVal.split(",");
			displayVal = "";
			for(int i = 0; i < mbVals.length; ++i)
			{
				for(int j = i+1; j < mbVals.length; ++j)
				{
					if(mbVals[i].equalsIgnoreCase(mbVals[j]))
					{
						mbVals[i] = "";
					}
				}
				
				if(mbVals[i].length() > 0)
				{
					if(MeritBadge.prepareForImport)
					{
						displayVal += mbVals[i] + "\t";
					}
					else if(MeritBadge.showMBNames)
					{
						displayVal += MeritBadge.findByNumber(Integer.parseInt(mbVals[i])).getDisplayName() + ",";
					}
					else
					{
						displayVal += mbVals[i] + ",";
					}
				}
			}
			
			if(displayVal.endsWith(",") || displayVal.endsWith("\t"))
			{
				displayVal = displayVal.substring(0, displayVal.length() - 1);
			}
			
			if(!MeritBadge.prepareForImport) { displayVal = "\"" + displayVal + "\""; }
		}
		
		return displayVal.trim();
	}
	
	
	public void swapFirstnameAndLastnameIfNeeded(MBCounselor counselor)
	{
		// need to handle the last 130 counselors and the lastname first / firstname last problem
		String swapKey = counselor.getLastName().toLowerCase()+"_"+counselor.getFirstName().toLowerCase();
		if(MergeMBCounselors.swapNameProps.get(swapKey) != null)
		{
			MBCounselor.swapFirstNameAndLastName(counselor.values, new File("canonical"));
		}
	}
	
	public String getCanonicalString(MBCounselor counselor)
	{
		swapFirstnameAndLastnameIfNeeded(counselor);
		String[] values = counselor.getValues();
		StringBuilder buf = new StringBuilder();
		
		for(int i = 0; i < values.length; ++i)
		{
			// instead of just appending values[i], rather make sure values[i] is displayed properly!!
			ImportField field = ImportField.findByIndex(i);
			buf.append(values[i] == null ? "" : getCanonicalDisplayString(values[i], field));
			if(values[i] != null && "Last_Name".equals(field.getName()) && counselor.getLastNameSuffix() != null)
			{
				buf.append(" "+getCanonicalDisplayString(counselor.getLastNameSuffix(), field));
			}
			
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


