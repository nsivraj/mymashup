package com.github.mymashup.bsaparser;

import java.io.BufferedReader;
import java.io.File;
import java.io.IOException;
import java.text.ParseException;

interface MBParser
{
	void init(File toParse, String[] fields, String[] mapping, String dataOrigin, Canonicalizer canonicalizer);
	void merge(CanonicalData canonicalData, boolean hasFirstRow) throws IOException, ParseException;
	String getDataOrigin();
	String[] parseFirstRow(BufferedReader reader) throws IOException;
	String[] parseNextLine(BufferedReader reader, String nextLine) throws IOException;
	File getToParse();
	boolean doNotMergeData(MBCounselor counselor, String[] mbData);
	boolean importData(MBCounselor counselor, String[] mbData);
}
