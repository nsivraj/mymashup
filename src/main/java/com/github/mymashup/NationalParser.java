package com.github.mymashup;

import java.io.BufferedReader;
import java.io.IOException;

public class NationalParser extends BaseMBParser
{
	public String[] parseFirstRow(BufferedReader reader) throws IOException
	{
		String firstRowFromFile = reader.readLine();
		return parseNextLine(reader, firstRowFromFile);
	}
	
	public String[] parseNextLine(BufferedReader reader, String nextLine) throws IOException
	{
		return nextLine.replace("\"", "").split("\t");
	}
}
