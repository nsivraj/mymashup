package com.github.mymashup;

import java.io.File;

public interface CanonicalData
{
	public MBCounselor findCounselor(String[] canonicalData, MBParser parser);

	public void addCounselor(MBCounselor counselor);
	
	public void persistData();
}
