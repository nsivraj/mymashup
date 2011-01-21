package com.github.mymashup;

import java.io.BufferedReader;
import java.io.FileReader;
import java.io.IOException;

public class NationalParser extends BaseMBParser
{
	public void merge(CanonicalData canonicalData) throws IOException
	{
		BufferedReader reader = new BufferedReader(new FileReader(toParse));
		String nextLine = null;
		boolean firstLine = true;
		
		while((nextLine = reader.readLine()) != null)
		{
			if(firstLine)
			{
				firstRow = nextLine.replace("\"", "").split("\t");
			}
			else
			{
				String[] mbData = nextLine.replace("\"", "").split("\t");
				mbData = canonicalizer.getCanonicalData(mbData, mapping);
				MBCounselor counselor = canonicalData.findCounselor(mbData, mapping);
				if(counselor == null)
				{
					counselor = new MBCounselor(mbData);
					canonicalData.addCounselor(counselor);
				}
			}
			firstLine = false;
		}
	}
	
}
