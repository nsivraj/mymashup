package com.github.mymashup;

import java.io.File;

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

}
