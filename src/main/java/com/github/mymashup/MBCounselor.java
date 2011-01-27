package com.github.mymashup;

public class MBCounselor 
{
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
		if(dataOrigin.equals(field.getOwner()))
		{
			values[field.getIndex()] = value;
		}
	}

	public void mergeData(String[] mbData, String dataOrigin)
	{
		// based on the dataOrigin, use the mbData to update this MBCounselor's values array
	}
}
