package com.github.mymashup;

import java.io.BufferedReader;
import java.io.File;
import java.io.FileReader;
import java.io.IOException;
import java.util.HashMap;
import java.util.Map;

public abstract class BaseMBParser implements MBParser
{
	protected File toParse;
	protected String[] fields;
	protected String[] mapping;
	protected String dataOrigin;
	protected Canonicalizer canonicalizer;
	protected String[] firstRow;
	protected Map<String, Integer> fieldName2Index;
	
	public void init(File toParse, String[] fields, String[] mapping, String dataOrigin, Canonicalizer canonicalizer)
	{
		this.toParse = toParse;
		this.fields = fields;
		this.mapping = mapping;
		this.dataOrigin = dataOrigin;
		this.canonicalizer = canonicalizer;
		this.fieldName2Index = new HashMap<String, Integer>();
		
		for(int i = 0; i < fields.length; ++i)
		{
			this.fieldName2Index.put(fields[i], i);
		}
		
	}

	public String getDataOrigin()
	{
		return dataOrigin;
	}

	public File getToParse()
	{
		return toParse;
	}

	public String[] getFields()
	{
		return fields;
	}

	public String[] getMapping()
	{
		return mapping;
	}

	public Canonicalizer getCanonicalizer()
	{
		return canonicalizer;
	}

	public String[] getFirstRow()
	{
		return firstRow;
	}

	
	/*public void merge(CanonicalData canonicalData) throws IOException
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
				addCounselor(counselor);
			}
			firstLine = false;
		}
	}*/
	
	public void merge(CanonicalData canonicalData, boolean hasFirstRow) throws IOException
	{
		if(toParse.exists())
		{
			BufferedReader reader = new BufferedReader(new FileReader(toParse));
			
			if(hasFirstRow)
			{
				firstRow = parseFirstRow(reader);
			}
	
			String nextLine = null;
			while((nextLine = reader.readLine()) != null)
			{
				String[] mbData = parseNextLine(reader, nextLine);
				if(mbData != null)
				{
					mbData = canonicalizer.getCanonicalData(dataOrigin, mbData, mapping);
					if("GRIFFIN".equalsIgnoreCase(mbData[0]))
					{
						System.out.println("Found GRIFFIN");
					}
					
					MBCounselor counselor = canonicalData.findCounselor(mbData, this);
					if(counselor == null)
					{
						counselor = new MBCounselor(mbData);
						canonicalData.addCounselor(counselor, this);
					}
					else
					{
						counselor.mergeData(mbData, getDataOrigin());
					}
				}
			}
			
			reader.close();
		}
	}

	
	
}
