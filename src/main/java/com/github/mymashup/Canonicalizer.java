package com.github.mymashup;

public interface Canonicalizer
{
	public String[] getCanonicalData(String[] mbData, String[] mapping);
	public String getCanonicalData(String mapping, String data);
}
