package com.github.mymashup;

import java.io.File;
import java.util.Properties;

public class MergeMBCounselors
{
	public static final String MAPPING_PROPS_NAME = "data.field.mapping.properties";
	public static final Properties mappingProps;
	static
	{
		mappingProps = Utils.loadProps(MAPPING_PROPS_NAME);
	}
	
	public void merge(String mappingKey) throws InstantiationException, IllegalAccessException, ClassNotFoundException
	{
		// find the mappingKey.fullFilePath property
		File toParse = new File(mappingProps.getProperty(mappingKey + ".fullFilePath"));
		String[] fields = mappingProps.getProperty(mappingKey + ".fields").split(",");
		String[] mapping = mappingProps.getProperty(mappingKey + ".mapping").split(",");
		String dataOrigin = mappingProps.getProperty(mappingKey + ".dataOrigin");
		MBParser parser = (MBParser)Class.forName(mappingProps.getProperty(mappingKey + ".parser")).newInstance();
		parser.init(toParse, fields, mapping, dataOrigin);
		parser.merge();
	}
	
	public static final void main(String[] args) throws InstantiationException, IllegalAccessException, ClassNotFoundException
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