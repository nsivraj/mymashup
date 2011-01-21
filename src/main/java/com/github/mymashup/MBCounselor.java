package com.github.mymashup;

import java.util.Collection;

public class MBCounselor 
{
	protected String[] values;
	
	public MBCounselor(String[] values, boolean canonicalized)
	{
		if(canonicalized)
		{
			this.values = values;
		}
		else
		{
			// canonicalize the values and then assign them to the values array
			this.values = values;
		}
	}
	
	public String[] getValues()
	{
		return values;
	}
	
	public String getValue(String name)
	{
		ImportField field = ImportField.findByName(name);
		return values[field.getIndex()];
	}
	
	public void setValue(String dataOrigin, String name, String value)
	{
		ImportField field = ImportField.findByName(name);
		if(dataOrigin.equals(field.getOwner()))
		{
			values[field.getIndex()] = value;
		}
	}
}
