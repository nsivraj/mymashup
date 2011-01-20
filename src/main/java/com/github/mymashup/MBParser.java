package com.github.mymashup;

import java.io.File;

interface MBParser {

	void init(File toParse, String[] fields, String[] mapping, String dataOrigin);

	void merge();

}
