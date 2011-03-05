package com.github.mymashup;

import java.io.File;
import java.io.IOException;

public interface CanonicalData
{
	public MBCounselor findCounselor(String[] canonicalData, MBParser parser);

	public void addCounselor(MBCounselor counselor, MBParser parser);
	
	public void persistData() throws IOException;

	public void reorderLastNameMap(MBCounselor counselor, String[] oldValues, File oldToParse, int index, MBParser parser);

	public void reorderRegistrationNumberMap(MBCounselor counselor,	String[] oldValues, File oldToParse, int index);
}
