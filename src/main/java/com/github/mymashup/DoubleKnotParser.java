package com.github.mymashup;

public class DoubleKnotParser extends BaseMBParser
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
