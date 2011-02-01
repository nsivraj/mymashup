package com.github.mymashup;

import java.io.BufferedReader;
import java.io.IOException;

public class DoubleKnotParser extends BaseMBParser
{
	public String[] parseFirstRow(BufferedReader reader) throws IOException
	{
		String firstRow = reader.readLine();
		return parseNextLine(reader, firstRow);
	}
	
	public String[] parseNextLine(BufferedReader reader, String nextLine) throws IOException
	{
		return nextLine.replace("\"", "").split("\t");
	}
}
