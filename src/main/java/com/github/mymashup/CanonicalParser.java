package com.github.mymashup;

import java.util.ArrayList;
import java.util.List;

public class CanonicalParser extends BaseMBParser implements CanonicalData
{
	protected List<MBCounselor> counselors;
	
	public CanonicalParser()
	{
		this.counselors = new ArrayList<MBCounselor>();
	}
	
	public void merge(CanonicalData canonicalData)
	{
		//read in the canonical data from the file
	}
}
