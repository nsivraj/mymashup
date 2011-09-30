package com.github.mymashup.bsaparser;

import java.io.BufferedReader;
import java.io.IOException;

public class NationalParser extends BaseMBParser
{
	public boolean doNotMergeData(MBCounselor counselor, String[] mbData)
	{
		//return counselor.getMostRecentDataFile().equals(toParse);
		return false;
	}
	
	public boolean importData(MBCounselor counselor, String[] mbData)
	{
		boolean importData = counselor != null;
		
		//if(!importData)
		//{
			//System.out.println("Not importing data: "+mbData);
		//}
		return importData;
	}

	public String[] parseFirstRow(BufferedReader reader) throws IOException
	{
		String firstRowFromFile = reader.readLine();
		return parseNextLine(reader, firstRowFromFile);
	}
	
	public String[] parseNextLine(BufferedReader reader, String nextLine) throws IOException
	{
		String[] values = nextLine.replace("\"", "").split("\t");
		for(int i = 0; i < values.length; ++i)
		{
			if(this.getMapping()[i].equals("Badges_Taught_Starts_Here"))
			{
				/*if(values[i] != null && values[i].trim().length() > 0)
				{
					String canonicalMBName = values[i].trim().replace(" ", "").toLowerCase();
					if("automotivemaintenance".equalsIgnoreCase(canonicalMBName))
					{
						canonicalMBName = "automechanics";
					}
					else if("modeldesignandbuilding".equalsIgnoreCase(canonicalMBName))
					{
						canonicalMBName = "modeldesign";
					}
					else if("watersports".equalsIgnoreCase(canonicalMBName))
					{
						canonicalMBName = "waterskiing";
					}
					
					if(canonicalMBName.endsWith("(er)"))
					{
						canonicalMBName = canonicalMBName.substring(0, canonicalMBName.length() - 4);
					}
					
					if(MeritBadge.findByCanonicalName(canonicalMBName) == null && !"badge".equalsIgnoreCase(canonicalMBName) && !"mbcnslname".equalsIgnoreCase(canonicalMBName))
					{
						throw new RuntimeException("Cannot find merit badge with name '"+canonicalMBName+"'.");
					}
					else if(!"mbcnslname".equalsIgnoreCase(canonicalMBName))
					{
						//mbName.set(canonicalMBName);
						values[i] = canonicalMBName;
					}
				}*/
				
				//values[i] = mbName.get();
			}
			
			values[i] = values[i].trim();
		}
		
		return values;
	}
}
