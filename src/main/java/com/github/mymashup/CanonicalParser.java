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
	// TODO: need to rebuild the regNumberMap when or if the registration number changes
	protected Map<String, MBCounselor> regNumberMap = new HashMap<String, MBCounselor>();
	// TODO: need to rebuild the lastNameMap when or if the last name changes
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
//			just because the regNumberMap finds one of the counselors is not a reason to think
//			that the match is correct, still need to find a match on some other attribute
//			other than lastname or firstname (this is a problem because the firstname and lastname
//			data is messed up in the FortUtah-MCR-09032010-BSA.xlsx file, need to verify this
//			with Arturo)
			if(counselor != null && counselor.matchesOtherAttributes(canonicalData, parser.getDataOrigin(), false) == 0)
			{
				System.out.println("The counselor '" + counselor + "' matches on Registration Number '" + MBCounselor.getRegistrationNumber(canonicalData) + "' but not on other attributes '" + MBCounselor.toString(canonicalData) + "'");
				counselor = null;
			}
			
			
			// next attempt an exact match on Last_Name and one of (address1, address2, phone1, phone2, fax, email, email2)
			//    if First_Name does not match then error out and find out what needs to be done in that special case
			if(counselor == null)
			{
				// find based on the last name and some other piece of data
				String lastName = MBCounselor.getLastName(canonicalData);
				if(lastName != null)
				{
					lastName = lastName.toLowerCase();
					if("GREGORY".equalsIgnoreCase(lastName))
					{
						//System.out.println("Found GREGORY");
						//System.out.flush();
					}
					List<MBCounselor> sameLastName = lastNameMap.get(lastName);
					if(sameLastName != null)
					{
						int currentMatch = 0, nextMatch = -1;
						for(MBCounselor tmpCounselor : sameLastName)
						{
							nextMatch = tmpCounselor.matchesOtherAttributes(canonicalData, parser.getDataOrigin(), true);
							if(nextMatch > currentMatch && nextMatch > 1)
							{
								// the reg numbers do not match and so if we happen to find a match in this section
								// then it matches on last name and other attributes (nextMatch > 1) and 
								// if the address is the same then they are most likely a husband and wife or some
								// other family relationship and so we don't want to merge them
								if(!tmpCounselor.addressesMatch(canonicalData) || (tmpCounselor.addressesMatch(canonicalData) && tmpCounselor.firstnamesMatch(canonicalData)))
								{
									currentMatch = nextMatch;
									counselor = tmpCounselor;
								}
							}
						}
					}
				}
				
				if(counselor == null)
				{
					// NOTE: this whole section of logic assumes that the starting point of the
					// data load into the canonical data store does not suffer from the problem
					// of having the first name and last name swapped, it only will fix subsequent
					// data that may have this problem; the first time that a counselor with a given
					// first name and last name is parsed into the canonical data store will dictate
					// what the resultant first name and last name will ultimately be
					String firstName = MBCounselor.getFirstName(canonicalData);
					if(firstName != null)
					{
						firstName = firstName.toLowerCase();
						List<MBCounselor> sameFirstName = lastNameMap.get(firstName);
						if(sameFirstName != null)
						{
							//List<MBCounselor> counselorsToSwap = new ArrayList<MBCounselor>();
							int currentMatch = 0, nextMatch = -1;
							for(MBCounselor tmpCounselor : sameFirstName)
							{
								nextMatch = tmpCounselor.matchesOtherAttributes(canonicalData, parser.getDataOrigin(), false);
								if(nextMatch > currentMatch && nextMatch > 1)
								{
									
									currentMatch = nextMatch;
									counselor = tmpCounselor;
									
									// DONE: fix the lastNameMap based on the swapping that just occurred
									// this may not really need to be done
									//if(changed)
									//{
									//	counselorsToSwap.add(counselor);
									//}
								}
							}
							if(counselor != null)
							{
								System.out.println("Found some import data whose last name '" + lastName + "' is really the first name and whose first name '" + firstName + "' is really the last name.");
								boolean changed = MBCounselor.swapFirstNameAndLastName(canonicalData);
							}
							
							// DONE: remove the counselors from the sameFirstName list and put them
							// into their correct sameLastName list
							//this may not really need to be done here
						}
					}
				}
			}
			
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
				//System.out.println("Found GRIFFIN");
			}
			if("GREGORY".equalsIgnoreCase(lastName))
			{
				//System.out.println("Found GREGORY");
				//System.out.flush();
			}
			List<MBCounselor> sameLastName = lastNameMap.get(lastName);
			if(sameLastName == null)
			{
				sameLastName = new ArrayList<MBCounselor>();
				lastNameMap.put(lastName, sameLastName);
			}
			
			MBCounselor sameLastNameCounselor = null;
			int currentMatch = 0, nextMatch = -1;
			for(MBCounselor tmpCounselor : sameLastName)
			{
				nextMatch = tmpCounselor.matchesOtherAttributes(counselor.getValues(), myDataOrigin, true);
				if(nextMatch > currentMatch && nextMatch > 1)
				{
					currentMatch = nextMatch;
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

	public void reorderLastNameMap(MBCounselor counselor, String[] oldValues, int lastNameIndex)
	{
		System.out.println("Reordering the lastNameMap from '" + MBCounselor.toString(oldValues) + "' to '" + counselor.toString() + "'");
		
		// find the counselor using the old last name and remove it
		List<MBCounselor> sameLastName = lastNameMap.get(oldValues[lastNameIndex].toLowerCase());
		int counselorIndex = -1;
		int currentMatch = 0, nextMatch = -1;
		for(int i = 0; i < sameLastName.size(); ++i)
		{
			MBCounselor oldCounselor = sameLastName.get(i);
			nextMatch = oldCounselor.matchesOtherAttributes(oldValues, null, true);
			if(nextMatch > currentMatch)
			{
				//oldCounselor is the one to remove
				counselorIndex = i;
			}
		}
		
		if(counselorIndex > 0)
		{
			sameLastName.remove(counselorIndex);
			sameLastName = lastNameMap.get(counselor.getValue(lastNameIndex).toLowerCase());
			if(sameLastName == null)
			{
				sameLastName = new ArrayList<MBCounselor>();
				lastNameMap.put(counselor.getValue(lastNameIndex).toLowerCase(), sameLastName);
			}
			sameLastName.add(counselor);
		}
		else
		{
			throw new RuntimeException("FAILED: While attempting to reorder lastNameMap from '" + MBCounselor.toString(oldValues) + "' to '" + counselor.toString() + "'");
		}
	}

	public void reorderRegistrationNumberMap(MBCounselor counselor,	String[] oldValues, int regNumberIndex)
	{
		System.out.println("Reordering the regNumberMap from '" + MBCounselor.toString(oldValues) + "' to '" + counselor.toString() + "'");

		// find the old counselor using the old registration number
		MBCounselor oldCounselor = regNumberMap.get(oldValues[regNumberIndex]);
		if(oldCounselor == null)
		{
			throw new RuntimeException("FAILED: While attempting to reorder regNumberMap from '" + MBCounselor.toString(oldValues) + "' to '" + counselor.toString() + "'");
		}
		else
		{
			// re-register the counselor using the new registration number
			if(oldCounselor.matchesOtherAttributes(oldValues, null, true) != 0)
			{
				//oldCounselor is the one to remove
				regNumberMap.remove(oldValues[regNumberIndex]);
				regNumberMap.put(counselor.getValue(regNumberIndex), counselor);
			}
			else
			{
				throw new RuntimeException("FAILED: While attempting to reorder regNumberMap from '" + MBCounselor.toString(oldValues) + "' to '" + counselor.toString() + "'");				
			}
		}
	}
}

