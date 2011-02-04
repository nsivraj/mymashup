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
	protected Map<String, List<MBCounselor>> lastNameMap = new HashMap<String, List<MBCounselor>>();
	
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
				String lastName = MBCounselor.getLastName(canonicalData);
				if(lastName != null)
				{
					lastName = lastName.toLowerCase();
					if("GRIFFIN".equalsIgnoreCase(lastName))
					{
						System.out.println("Found GRIFFIN");
					}
					List<MBCounselor> sameLastName = lastNameMap.get(lastName);
					if(sameLastName != null)
					{
						for(MBCounselor tmpCounselor : sameLastName)
						{
							if(tmpCounselor.matchesOtherAttributes(canonicalData, parser.getDataOrigin()))
							{
								counselor = tmpCounselor;
							}
						}
					}
				}
				
				if(counselor == null)
				{
					String firstName = MBCounselor.getFirstName(canonicalData);
					if(firstName != null)
					{
						firstName = firstName.toLowerCase();
						List<MBCounselor> sameFirstName = lastNameMap.get(firstName);
						if(sameFirstName != null)
						{
							for(MBCounselor tmpCounselor : sameFirstName)
							{
								if(tmpCounselor.matchesOtherAttributes(canonicalData, parser.getDataOrigin()))
								{
									counselor = tmpCounselor;
									System.out.println("Found some import data whose last name '" + lastName + "' is really the first name and whose first name '" + firstName + "' is really the last name.");
									MBCounselor.swapFirstNameAndLastName(canonicalData);
								}
							}
						}
					}
				}
			}
			
			// is there another comparison that should be done???, probably not
			
		}

		return counselor;
	}

	
	public void addCounselor(MBCounselor counselor, MBParser parser)
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
		
		// need to do checks on both because sometimes the first and last names are getting swapped, maybe NOT ???
		addLastNameIndex(counselor.getLastName(), parser.getDataOrigin(), counselor);
		//addLastNameIndex(counselor.getFirstName(), counselor);
	}

	public void addLastNameIndex(String lastName, String myDataOrigin, MBCounselor counselor)
	{
		if(lastName != null)
		{
			lastName = lastName.toLowerCase();
			if("GRIFFIN".equalsIgnoreCase(lastName))
			{
				System.out.println("Found GRIFFIN");
			}
			List<MBCounselor> sameLastName = lastNameMap.get(lastName);
			if(sameLastName == null)
			{
				sameLastName = new ArrayList<MBCounselor>();
				lastNameMap.put(lastName, sameLastName);
			}
			
			MBCounselor sameLastNameCounselor = null;
			for(MBCounselor tmpCounselor : sameLastName)
			{
				if(tmpCounselor.matchesOtherAttributes(counselor.getValues(), myDataOrigin))
				{
					sameLastNameCounselor = tmpCounselor;
				}
			}
			
			// this should never happen, if it does then it means that the findCounselor method above failed, in most cases
			if(sameLastNameCounselor != null)
			{
				throw new RuntimeException("The counselor with last name '" + lastName + "' is already contained in the last name mapping: " + counselor + " :: " + sameLastNameCounselor);
			}
			
			sameLastName.add(counselor);
		}
	}
}

