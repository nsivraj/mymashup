package com.github.mymashup;

import java.io.File;

public abstract class BaseMBParser implements MBParser
{
	protected File toParse;
	protected String[] fields;
	protected String[] mapping;
	protected String dataOrigin;
	
	public void init(File toParse, String[] fields, String[] mapping, String dataOrigin)
	{
		this.toParse = toParse;
		this.fields = fields;
		this.mapping = mapping;
		this.dataOrigin = dataOrigin;
	}

}
