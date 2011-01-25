package com.github.mymashup;

public class NationalCanonicalizer extends AbstractCanonicalizer
{
	public String[] getCanonicalData(String[] mbData, String[] mapping)
	{
		String[] canonicalData = new String[ImportField.getFieldCount()];
		
		for(int i = 0; i < mbData.length; ++i)
		{
			ImportField field = ImportField.findByName(mapping[i]);
			if(field != null)
			{
				canonicalData[field.getIndex()] = getCanonicalData(mbData[i], field);
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
	
	public String getCanonicalData(String data, ImportField field)
	{
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
				canonicalData = canonicalData.replace("(", "").replace(")", "").replace(" ", "").replace("-", "");
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
	
				if(canonicalData == null || canonicalData.length() <= 0)
				{
					throw new RuntimeException("The field '" + field.getName() + " :: " + field.getType() + "' does not have a UNIT_OPTION mapping: " + data);
				}
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
				if(canonicalData == null || canonicalData.length() <= 0)
				{
					throw new RuntimeException("The field '" + field.getName() + " :: " + field.getType() + "' does not have a Merit Badge mapping: " + data);
				}
			}
				
			if(canonicalData == null/* || canonicalData.length() <= 0*/)
			{
				throw new RuntimeException("The field '" + field.getName() + " :: " + field.getType() + "' is null or empty: " + canonicalData + " :: " + data);
			}
		}
		
		return canonicalData;
	}

}
