package com.github.mymashup;

public interface Canonicalizer
{
	public String[] getCanonicalData(String dataOrigin, String[] mbData, String[] mapping);
	public String getCanonicalData(String currentCanonicalData, String data, ImportField field);
	public String getCanonicalString(MBCounselor counselor);
	public String getCanonicalDisplayString(String value, ImportField field);
	public String parseTelephone(String phone);
}
