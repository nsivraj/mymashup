package com.github.mymashup;

import java.io.BufferedReader;
import java.io.BufferedWriter;
import java.io.FileWriter;
import java.io.IOException;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

public class CanonicalParser extends BaseMBParser implements CanonicalData
{
	protected List<MBCounselor> counselors;
	protected Map<String, MBCounselor> regNumberMap = new HashMap<String, MBCounselor>();
	
	public CanonicalParser()
	{
		this.counselors = new ArrayList<MBCounselor>();
	}
	
	public String[] parseFirstRow(BufferedReader reader) throws IOException
	{
		String firstRowFromFile = reader.readLine();
		return parseNextLine(reader, firstRowFromFile);
	}
	
	public String[] parseNextLine(BufferedReader reader, String nextLine) throws IOException
	{
		if(nextLine == null) return null;
		return nextLine.split("\t");
	}

	
	public void persistData() throws IOException
	{
		BufferedWriter out = new BufferedWriter(new FileWriter(toParse));
		
		for(int i = 0; i < fields.length; ++i)
		{
			out.write(fields[i]);
			if(i < (fields.length + 1))
			{
				out.write("\t");
			}
		}
		out.write("\n");
		
		for(int i = 0; i < counselors.size(); ++i)
		{
			out.write(canonicalizer.getCanonicalString(counselors.get(i)));
			if(i < (counselors.size() + 1))
			{
				out.write("\n");
			}
		}
		
		out.flush();
		out.close();
	}
	

	// personId, lastName, firstName, address1, address2, phone1, phone2, fax, email, email2
	public MBCounselor findCounselor(String[] canonicalData, MBParser parser)
	{
		MBCounselor counselor = null;
		
		if(!(parser instanceof CanonicalParser))
		{
			// first attempt an exact match on Registration_Number
			counselor = regNumberMap.get(MBCounselor.getRegistrationNumber(canonicalData));
			
			// next attempt an exact match on Last_Name and one of (address1, address2, phone1, phone2, fax, email, email2)
			//    if First_Name does not match then error out and find out what needs to be done in that special case
			if(counselor == null)
			{
				// find based on the last name and some other piece of data
			}
		}

		return counselor;
	}
	
	public void addCounselor(MBCounselor counselor)
	{
		counselors.add(counselor);
		
		// also need to update the different keyed lookup Maps
		String regNumberKey = counselor.getRegistrationNumber();
		if(regNumberKey != null)
		{
			if(regNumberMap.get(regNumberKey) != null)
			{
				throw new RuntimeException("The registration number '" + regNumberKey + "' is already mapped to a counselor: " + counselor);
			}
			
			regNumberMap.put(regNumberKey, counselor);
		}
	}
}

