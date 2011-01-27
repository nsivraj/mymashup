package com.github.mymashup;

public class NationalParser extends BaseMBParser
{
	public String[] parseFirstRow(String firstRow)
	{
		return parseNextLine(firstRow);
	}
	
	public String[] parseNextLine(String nextLine)
	{
		return nextLine.replace("\"", "").split("\t");
	}
}
