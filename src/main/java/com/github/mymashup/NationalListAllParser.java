package com.github.mymashup;

import java.io.BufferedReader;
import java.io.IOException;
import java.util.ArrayList;

public class NationalListAllParser extends BaseMBParser
{
	private static final ThreadLocal<String> mbName = new ThreadLocal<String>();
	//NL_09032010-ListAll.fields=Merit_Badge,Troop_Only,Name_Last_Part,Name_First_Part_And_Middle_Part,Address_Line_1,
	//                           Address_Line_2_Or_Empty,City_From_Address_Line_2_Or_Line_3,State_From_Address_Line_2_Or_Line_3,
	//                           Postal_Code_From_Address_Line_2_Or_Line_3,Phone_Line_1,Phone_Line_2
	
	public static final String MERIT_BADGE = "Merit_Badge";
	public static final String TROOP_ONLY = "Troop_Only";
	public static final String NAME_LAST_PART = "Name_Last_Part";
	public static final String NAME_FIRST_PART_AND_MIDDLE_PART = "Name_First_Part_And_Middle_Part";
	public static final String ADDRESS_LINE_1 = "Address_Line_1";
	public static final String ADDRESS_LINE_2_OR_EMPTY = "Address_Line_2_Or_Empty";
	public static final String CITY_FROM_ADDRESS_LINE_2_OR_LINE_3 = "City_From_Address_Line_2_Or_Line_3";
	public static final String STATE_FROM_ADDRESS_LINE_2_OR_LINE_3 = "State_From_Address_Line_2_Or_Line_3";
	public static final String POSTAL_CODE_FROM_ADDRESS_LINE_2_OR_LINE_3 = "Postal_Code_From_Address_Line_2_Or_Line_3";
	public static final String PHONE_LINE_1 = "Phone_Line_1";
	public static final String PHONE_LINE_2 = "Phone_Line_2";
	
	public boolean doNotMergeData(MBCounselor counselor, String[] mbData)
	{
		return counselor.getMostRecentDataFile().equals(toParse);
	}
	
	public String[] parseFirstRow(BufferedReader reader) throws IOException
	{
		String firstRowFromFile = reader.readLine();
		while(firstRowFromFile != null && !firstRowFromFile.trim().startsWith("Troop Only"))
		{
			firstRowFromFile = reader.readLine();
		}
		
		ArrayList<String> cols = new ArrayList<String>();
		for(String tmpStr = firstRowFromFile.trim();
		    tmpStr.length() > 0; tmpStr = tmpStr.trim())
		{
			int endIndex = tmpStr.indexOf("  ");
			endIndex = (endIndex == -1) ? tmpStr.length() : endIndex;
			cols.add(tmpStr.substring(0, endIndex));
			tmpStr = tmpStr.substring(endIndex);
		}
		
		return cols.toArray(new String[0]);
	}
	
	public String[] parseNextLine(BufferedReader reader, String nextLine) throws IOException
	{
		String[] mbData = null;
		
		if( ! (nextLine.trim().startsWith("Report #:") ||
		       nextLine.indexOf("docname=PAS Report!") != -1 ||
		       nextLine.trim().startsWith("Date    :") ||
			   nextLine.trim().startsWith("Time    :") ||
			   nextLine.trim().startsWith("---- Selected Options") ||
			   nextLine.trim().startsWith("BSA Structure:") ||
			   nextLine.trim().startsWith("Badges:") ||
			   nextLine.trim().startsWith("Include \"Troop Only\" Counselors:") ||
			   nextLine.trim().startsWith("Troop Only") ||
			   nextLine.trim().startsWith("------------------------------") ||
			   nextLine.trim().startsWith("--- End Of Report ---") ||
			   (nextLine.trim().contains("R!") && nextLine.trim().contains("N!"))))
		{
			int lineCount = 0;
			while(nextLine != null && nextLine.trim().length() > 0 && !(nextLine.trim().equals("\f")))
			{
				// nextLine could be a new merit badge name
				String meritBadge = getNextNationalMBBoundary(nextLine);
				if(meritBadge != null)
				{
					mbName.set(meritBadge);
					if(mbData != null) break;
				}
				else
				{
					if(mbData == null)
					{
						mbData = new String[fields.length];
					}
					
					// now parse nextLine data for this counselor
//		            N        David  V  Arnold                             1241 W 1150 S                            H (801) 764-0277^M
//                    Provo, UT  84601-5452                    W (801) 377-5755^M
//^M
					parseNational(nextLine, mbData, ++lineCount);

					// set the merit badge into the mbData array
					mbData[getIndex(MERIT_BADGE)] = mbName.get();
				}
				
				nextLine = reader.readLine();
			}
		}
		
		return mbData;
	}


	// Badges_Taught_Starts_Here,,Last_Name,First_Name,Address1,Address2,City,State,Postal_Code,Phone1,Phone2
	public int getIndex(String name)
	{
		Integer index = fieldName2Index.get(name);
		if(index != null)
		{
			return index;
		}
		
		throw new RuntimeException("Cannot find index for field with name: " + name);
	}

	public void parseNational(String line, String[] mbData, int lineCount)
	{
		//++lineCount;
		if(lineCount > 2)
		{
			System.out.println("found the culprit: " + line + " :: " + MBCounselor.toString(mbData, getToParse()));
		}
		
		// Badges_Taught_Starts_Here,,Last_Name,First_Name,Address1,Address2,City,State,Postal_Code,Phone1,Phone2
		int foundCharCount = 0;
		for(int i = 0; i < line.length(); ++i)
		{
			if(!Character.isWhitespace(line.charAt(i)))
			{
				if(line.contains("UT"))
				{
					// this is the last line of the counselor information
					// City, State Zip                Phone Number
					if(foundCharCount == 0) // City
					{
						foundCharCount++;
						int endIndex = line.indexOf(", ", i);
						//String[] parts = line.substring(i, endIndex).split(" ");
						if(i >= 0 && endIndex >= 0)  { mbData[getIndex(CITY_FROM_ADDRESS_LINE_2_OR_LINE_3)] = line.substring(i, endIndex); }
						i = endIndex;
						//this.state = parts[1];
						//this.postalCode = parts[2];
					}
					else if(foundCharCount == 1) // State
					{
						foundCharCount++;
						int endIndex = line.indexOf(" ", i);
						if(i >= 0 && endIndex >= 0)  { mbData[getIndex(STATE_FROM_ADDRESS_LINE_2_OR_LINE_3)] = line.substring(i, endIndex); }
						i = endIndex;
					}
					else if(foundCharCount == 2) // Zip
					{
						foundCharCount++;
						int endIndex = line.indexOf(" ", i);
						if(endIndex == -1) endIndex = line.length();
						mbData[getIndex(POSTAL_CODE_FROM_ADDRESS_LINE_2_OR_LINE_3)] = line.substring(i, endIndex);
						i = endIndex;
					}
					else if(foundCharCount == 3)
					{
						foundCharCount++;
						int endIndex = line.indexOf("   ", i);
						if(endIndex == -1) endIndex = line.length();
						String phoneNumber = canonicalizer.parseTelephone(line.substring(i+1, endIndex));
						if(line.charAt(i) == 'H') mbData[getIndex(PHONE_LINE_1)] = phoneNumber;
						else if(line.charAt(i) == 'W') mbData[getIndex(PHONE_LINE_2)] = phoneNumber;
						else if(line.charAt(i) == 'B') mbData[getIndex(PHONE_LINE_2)] = phoneNumber;
						i = endIndex;
					}
				}
				else if(lineCount == 1)
				{
					// this is always the first line of the counselor information
					// Troop Only       Name                                            Address                               Phone
					// parse the non-whitespace character by keeping track of how many times
					// a non-whitespace character has been encountered
					if(foundCharCount == 0)
					{
						// first char is Troop Only indicator
						foundCharCount++;
					}
					else if(foundCharCount == 1)
					{
						if(line.toLowerCase().indexOf("wagoner") != -1)
						{
							System.out.println("Processing Van Wagoner");
						}
						
						// second char is David  V  Arnold                             1241 W 1150 S                            H (801) 764-0277 Name - parse the whole name
						foundCharCount++;
						int endIndex = line.indexOf(' ', i);
						mbData[getIndex(NAME_FIRST_PART_AND_MIDDLE_PART)] = line.substring(i, endIndex);
						
						if("rovo,".equalsIgnoreCase(mbData[getIndex(NAME_FIRST_PART_AND_MIDDLE_PART)]))
						{
							System.out.println("found the culprit: " + line + " :: " + MBCounselor.toString(mbData, getToParse()));
						}
						
						i = endIndex;
						while(Character.isWhitespace(line.charAt(i))) ++i;
						if(Character.isWhitespace(line.charAt(i+1)))
						{
							mbData[getIndex(NAME_FIRST_PART_AND_MIDDLE_PART)] += " " + line.substring(i,++i);
							while(Character.isWhitespace(line.charAt(i))) ++i;
							endIndex = line.indexOf("  ", i);
							mbData[getIndex(NAME_LAST_PART)] = line.substring(i, endIndex);
							i = endIndex;
						}
						else
						{
							// either have a long middlename or no middlename
							endIndex = line.indexOf("   ", i);
							if(i >= 0 && endIndex >= 0)
							{
								String[] nameParts = line.substring(i, endIndex).split(" ");
								//mbData[getIndex(NAME_FIRST_PART_AND_MIDDLE_PART)] = "";
								for(int k = 0; k < nameParts.length; ++k)
								{
									// no middlename
									if(nameParts.length == 1 && k == 0) { mbData[getIndex(NAME_LAST_PART)] = nameParts[k]; }
									else
									{
										// long middlename
										mbData[getIndex(NAME_LAST_PART)] = nameParts[nameParts.length - 1];
										if(k < nameParts.length -1) { mbData[getIndex(NAME_FIRST_PART_AND_MIDDLE_PART)] += nameParts[k].trim()+" "; }
									}
								}
								mbData[getIndex(NAME_FIRST_PART_AND_MIDDLE_PART)] = mbData[getIndex(NAME_FIRST_PART_AND_MIDDLE_PART)].trim();
							}
							i = endIndex;
						}
					}
					else if(foundCharCount == 2)
					{
						// third char is address - parse the whole address
						// keep parsing until you encounter three spaces in a row
						foundCharCount++;
						int beginIndex = i;
						int endIndex = line.indexOf("   ", i);
						if(endIndex == -1) { endIndex = line.length(); }
						if(beginIndex >= 0 && endIndex >= 0) { mbData[getIndex(ADDRESS_LINE_1)] = line.substring(beginIndex, endIndex); }
						i = endIndex;
					}
					else if(foundCharCount == 3)
					{
						// parse the phone number - H is home, W is work and B is ????
						int endIndex = line.indexOf("   ", i);
						if(endIndex == -1) endIndex = line.length();
						String phoneNumber = canonicalizer.parseTelephone(line.substring(i+1, endIndex));
						if(line.charAt(i) == 'H') mbData[getIndex(PHONE_LINE_1)] = phoneNumber;
						else if(line.charAt(i) == 'W') mbData[getIndex(PHONE_LINE_2)] = phoneNumber;
						else if(line.charAt(i) == 'B') mbData[getIndex(PHONE_LINE_2)] = phoneNumber;
						i = endIndex;
					}
				}
				else
				{
					// this is where the odd case of a second address line is handled
					//				        221 S 2050 W                             W (801) 378-4031^M
					if(foundCharCount == 0)
					{
						// second line of the address
						foundCharCount++;
						int beginIndex = i;
						int endIndex = line.indexOf("   ", i);
						if(beginIndex >= 0 && endIndex >= 0) { mbData[getIndex(ADDRESS_LINE_2_OR_EMPTY)] = line.substring(beginIndex, endIndex); }
						i = endIndex;
					}
					else if(foundCharCount == 1)
					{
						// parse the phone number - H is home, W is work and B is ????
						int endIndex = line.indexOf("   ", i);
						if(endIndex == -1) endIndex = line.length();
						String phoneNumber = canonicalizer.parseTelephone(line.substring(i+1, endIndex));
						if(line.charAt(i) == 'H') mbData[getIndex(PHONE_LINE_1)] = phoneNumber;
						else if(line.charAt(i) == 'W') mbData[getIndex(PHONE_LINE_2)] = phoneNumber;
						else if(line.charAt(i) == 'B') mbData[getIndex(PHONE_LINE_2)] = phoneNumber;
						i = endIndex;
					}
				}
			}
		}
		
	}

	public String getNextNationalMBBoundary(String nextLine)
	{
		String[] parts = nextLine.trim().split(" ");
		return getMBBoundaryKey(nextLine, parts);
	}
	
	private String getMBBoundaryKey(String nextLine, String[] parts)
	{
		String mbKey = "";
		if(parts.length < 9)
		{
			for(int i = 0; i < parts.length; ++i)
			{
				if(parts[i].trim().length() == 0 || !Character.isLetter(parts[i].trim().charAt(0))) continue;
				mbKey += parts[i].trim().toLowerCase();
			}
		}
		
		
		if(MeritBadge.findByCanonicalName(mbKey) != null)
		{
			return mbKey;
		}
		else if("automotivemaintenance".equalsIgnoreCase(mbKey))
		{
			return "automechanics";
		}
		else if("modeldesignandbuilding".equalsIgnoreCase(mbKey))
		{
			return "modeldesign";
		}
		else if("watersports".equalsIgnoreCase(mbKey))
		{
			return "waterskiing";
		}
		else
		{
			return null;
		}
	}
}
