package com.github.mymashup;

public interface CanonicalData
{
	public MBCounselor findCounselor(String[] mbData, String[] mapping);

	public void addCounselor(MBCounselor counselor);
	
}
