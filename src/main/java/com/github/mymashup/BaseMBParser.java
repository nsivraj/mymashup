package com.github.mymashup;

import java.io.BufferedReader;
import java.io.File;
import java.io.FileReader;
import java.io.IOException;

public abstract class BaseMBParser implements MBParser
{
	protected File toParse;
	protected String[] fields;
	protected String[] mapping;
	protected String dataOrigin;
	protected Canonicalizer canonicalizer;
	protected String[] firstRow;
	
	public void init(File toParse, String[] fields, String[] mapping, String dataOrigin, Canonicalizer canonicalizer)
	{
		this.toParse = toParse;
		this.fields = fields;
		this.mapping = mapping;
		this.dataOrigin = dataOrigin;
		this.canonicalizer = canonicalizer;
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
		BufferedReader reader = new BufferedReader(new FileReader(toParse));
		
		if(hasFirstRow)
		{
			firstRow = parseFirstRow(reader.readLine());
		}

		String nextLine = null;
		while((nextLine = reader.readLine()) != null)
		{
			String[] mbData = parseNextLine(nextLine);
			mbData = canonicalizer.getCanonicalData(mbData, mapping);
			MBCounselor counselor = canonicalData.findCounselor(mbData, this);
			if(counselor == null)
			{
				counselor = new MBCounselor(mbData);
				canonicalData.addCounselor(counselor);
			}
			else
			{
				counselor.mergeData(mbData, getDataOrigin());
			}
		}
		
		reader.close();
	}

}
