package com.github.mymashup;

import java.io.File;
import java.io.IOException;

interface MBParser
{
	void init(File toParse, String[] fields, String[] mapping, String dataOrigin, Canonicalizer canonicalizer);
	void merge(CanonicalData canonicalData) throws IOException;
}
