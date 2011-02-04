package com.github.mymashup;

import java.io.IOException;

public interface CanonicalData
{
	public MBCounselor findCounselor(String[] canonicalData, MBParser parser);

	public void addCounselor(MBCounselor counselor, MBParser parser);
	
	public void persistData() throws IOException;
}
