package com.github.mymashup;

public class SimpleCanonicalizer implements Canonicalizer
{

	public String[] getCanonicalData(String[] mbData, String[] mapping)
	{
		return mbData;
	}

	public String getCanonicalData(String data, ImportField field)
	{
		return data;
	}

}
