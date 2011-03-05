package com.github.mymashup;

import java.io.BufferedReader;
import java.io.IOException;

public class DoubleKnotParser extends BaseMBParser
{
	private static final ThreadLocal<String> mbName = new ThreadLocal<String>();
	
	public boolean doNotMergeData(MBCounselor counselor, String[] mbData)
	{
		boolean doNotMerge = (counselor.getMostRecentDataFile().equals(toParse) && !counselor.firstnamesMatch(mbData));
		if(doNotMerge)
		{
			System.out.println("Found a matching counselor '"+counselor+"' but not merging in data '"+MBCounselor.toString(mbData, toParse)+"'");
		}
		else
		{
			System.out.println("Merging counselor '"+counselor+"' to include data '"+MBCounselor.toString(mbData, toParse)+"'");
		}
		
		return doNotMerge;
	}
	
	public String[] parseFirstRow(BufferedReader reader) throws IOException
	{
		String firstRow = reader.readLine();
		return parseNextLine(reader, firstRow);
	}
	
	public String[] parseNextLine(BufferedReader reader, String nextLine) throws IOException
	{
		String[] values = nextLine.replace("\"", "").split("\t");
		for(int i = 0; i < values.length; ++i)
		{
			if(this.getMapping()[i].equals("Badges_Taught_Starts_Here"))
			{
				if(values[i] != null && values[i].trim().length() > 0)
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
					
					if(MeritBadge.findByCanonicalName(canonicalMBName) == null && !"badge".equalsIgnoreCase(canonicalMBName))
					{
						throw new RuntimeException("Cannot find merit badge with name '"+canonicalMBName+"'.");
					}
					else
					{
						mbName.set(canonicalMBName);
					}
				}
				
				values[i] = mbName.get();
			}
		}

		return values;
	}
}
