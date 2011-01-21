package com.github.mymashup;

import java.io.File;
import java.io.IOException;
import java.util.Properties;

public class MergeMBCounselors
{
	public static final String MAPPING_PROPS_NAME = "data.field.mapping.properties";
	private static final Properties mappingProps;
	private static final CanonicalData canonicalData;
	static
	{
		mappingProps = Utils.loadProps(MAPPING_PROPS_NAME);
		canonicalData = new CanonicalParser();

		try
		{
			File toParse = new File(mappingProps.getProperty("canonical.fullFilePath"));
			String[] fields = mappingProps.getProperty("canonical.fields").split(",");
			String dataOrigin = mappingProps.getProperty("canonical.dataOrigin");
			((CanonicalParser)canonicalData).init(toParse, fields, null, dataOrigin, null);
			((CanonicalParser)canonicalData).merge(canonicalData);
		}
		catch(Throwable th)
		{
			th.printStackTrace();
		}
	}
	
	public void merge(String mappingKey) throws InstantiationException, IllegalAccessException, ClassNotFoundException, IOException
	{
		// find the mappingKey.fullFilePath property
		File toParse = new File(mappingProps.getProperty(mappingKey + ".fullFilePath"));
		String[] fields = mappingProps.getProperty(mappingKey + ".fields").split(",");
		String[] mapping = mappingProps.getProperty(mappingKey + ".mapping").split(",");
		String dataOrigin = mappingProps.getProperty(mappingKey + ".dataOrigin");
		Canonicalizer canonicalizer = (Canonicalizer)Class.forName(mappingProps.getProperty(mappingKey + ".canonicalizer")).newInstance();
		MBParser parser = (MBParser)Class.forName(mappingProps.getProperty(mappingKey + ".parser")).newInstance();
		parser.init(toParse, fields, mapping, dataOrigin, canonicalizer);
		parser.merge(canonicalData);
	}
	
	public static final void main(String[] args) throws InstantiationException, IllegalAccessException, ClassNotFoundException, IOException
	{
		MergeMBCounselors merge = new MergeMBCounselors();

		if("all".equalsIgnoreCase(args[0]))
		{
			// loop over all of the configured data field mappings
			String[] mappings = mappingProps.getProperty("mappings").split(",");
			for(String mapping : mappings)
			{
				merge.merge(mapping);
			}
		}
		else
		{
			merge.merge(args[0]);
		}
	}
}