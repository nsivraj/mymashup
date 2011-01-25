package com.github.mymashup;

import java.io.BufferedReader;
import java.io.FileReader;
import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

public class CanonicalParser extends BaseMBParser implements CanonicalData
{
	protected List<MBCounselor> counselors;
	
	public CanonicalParser()
	{
		this.counselors = new ArrayList<MBCounselor>();
	}
	
	public void merge(CanonicalData canonicalData) throws IOException
	{
		//read in the canonical data from the file
		BufferedReader reader = new BufferedReader(new FileReader(toParse));
		String nextLine = null;
		boolean firstLine = true;
		
		while((nextLine = reader.readLine()) != null)
		{
			if(firstLine)
			{
				firstRow = nextLine.split("\t");
			}
			else
			{
				MBCounselor counselor = new MBCounselor(nextLine.split("\t"));
				counselors.add(counselor);
			}
			firstLine = false;
		}
	}

	// personId, lastName, firstName, address1, address2, phone1, phone2, fax, email, email2
	public MBCounselor findCounselor(String[] canonicalData)
	{
		// first attempt an exact match on Registration_Number
		// next attempt an exact match on Last_Name and one of (address1, address2, phone1, phone2, fax, email, email2)
		//    if First_Name does not match then error out and find out what needs to be done in that special case
		
		return null;
	}
	
	public void addCounselor(MBCounselor counselor)
	{
		counselors.add(counselor);
		
		// also need to update the different keyed lookup Maps or Sorted collections
	}
}

