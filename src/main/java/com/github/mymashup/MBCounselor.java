package com.github.mymashup;

public class MBCounselor 
{
	public static boolean reportValuesChanged = false;
	public static boolean reportNotMergingBecauseOfOwnership = false;
	
	protected String[] values;
	
	public MBCounselor(String[] values)
	{
		this.values = values;
	}
	
	public String[] getValues()
	{
		return values;
	}
	
	public String getValue(String name)
	{
		return getValue(name, values);
	}
	
	public String getValue(int index)
	{
		return values[index];
	}
	
	public String getRegistrationNumber()
	{
		return getRegistrationNumber(values);
	}

	public static String getValue(String name, String[] mbData)
	{
		ImportField field = ImportField.findByName(name);
		return mbData[field.getIndex()];
	}
	
	public static String getRegistrationNumber(String[] mbData)
	{
		return getValue("Registration_Number", mbData);
	}
	
	public void setValue(String dataOrigin, String name, String value)
	{
		ImportField field = ImportField.findByName(name);
		setValue(dataOrigin, field, value);
	}

	public void setValue(String dataOrigin, int index, String value)
	{
		ImportField field = ImportField.findByIndex(index);
		setValue(dataOrigin, field, value);
	}

	public void setValue(String dataOrigin, ImportField field, String value)
	{
		if(dataOrigin.equals(field.getOwner()) || "canonical".equalsIgnoreCase(dataOrigin))
		{
			// need logic here to determine if values[index] is empty or null or whether it
			// should be overwritten then allow it to be overwritten by value
			if(value != null && value.length() > 0/* && (values[field.getIndex()] == null || values[field.getIndex()].length() <= 0)*/)
			{
				if(!value.equals(values[field.getIndex()]) && reportValuesChanged)
				{
					System.out.println("Changing value of field '" + field.getName() + "' from '" + values[field.getIndex()] + "' to '" + value + "' -- " + getRegistrationNumber());
				}
				
				values[field.getIndex()] = value;
			}
		}
		else if(reportNotMergingBecauseOfOwnership)
		{
			System.out.println("Not merging data '" + value + "' into field '" + field.getName() + "' becuase the data origin '" + dataOrigin + "' does not own it: " + field.getOwner());
		}
	}
	
	public void mergeData(String[] mbData, String dataOrigin)
	{
		// based on the dataOrigin, use the mbData to update this MBCounselor's values array
		for(int i = 0; i < values.length; ++i)
		{
			setValue(dataOrigin, i, mbData[i]);			
		}
	}

}
