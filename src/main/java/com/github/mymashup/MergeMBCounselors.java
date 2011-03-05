package com.github.mymashup;

import java.io.File;
import java.io.IOException;
import java.util.Properties;

public class MergeMBCounselors
{
	public static final String MAPPING_PROPS_NAME = "data.field.mapping.properties";
	private static final Properties mappingProps;
	static
	{
		mappingProps = Utils.loadProps(MAPPING_PROPS_NAME);
		MBCounselor.reportValuesChanged = Boolean.valueOf(mappingProps.getProperty("reportValuesChanged"));
		MBCounselor.reportNotMergingBecauseOfOwnership = Boolean.valueOf(mappingProps.getProperty("reportNotMergingBecauseOfOwnership"));
		MBCounselor.verbose = Boolean.valueOf(mappingProps.getProperty("verbose"));
		//canonicalData = new CanonicalParser();

		//try
		//{
			//File toParse = new File(mappingProps.getProperty("canonical.fullFilePath"));
			//String[] fields = mappingProps.getProperty("canonical.fields").split(",");
			//String dataOrigin = mappingProps.getProperty("canonical.dataOrigin");
			//boolean hasFirstRow = Boolean.valueOf(mappingProps.getProperty("canonical.hasFirstRow"));
			//((CanonicalParser)canonicalData).init(toParse, fields, null, dataOrigin, null);
			//((CanonicalParser)canonicalData).merge(canonicalData, hasFirstRow);
		//}
		//catch(Throwable th)
		//{
		//	th.printStackTrace();
		//}
	}
	
	private CanonicalData canonicalData;
	
	public MergeMBCounselors() throws InstantiationException, IllegalAccessException, ClassNotFoundException, IOException
	{
		this.canonicalData = null;
		System.out.println("--------------------------------------------------------BEGIN: canonical------------------------------------------------------------------------------");
		this.merge("canonical");
		System.out.println("--------------------------------------------------------END: canonical-------------------------------------------------------------------------------");
	}

	public void merge(String mappingKey) throws InstantiationException, IllegalAccessException, ClassNotFoundException, IOException
	{
		// find the mappingKey.fullFilePath property
		File toParse = new File(mappingProps.getProperty(mappingKey + ".fullFilePath"));
		String[] fields = mappingProps.getProperty(mappingKey + ".fields").split(",");
		
		String mappingStr = mappingProps.getProperty(mappingKey + ".mapping");
		String[] mapping;
		if(mappingStr == null) mapping = fields;
		else mapping = mappingStr.split(",");
		
		String dataOrigin = mappingProps.getProperty(mappingKey + ".dataOrigin");
		boolean hasFirstRow = Boolean.valueOf(mappingProps.getProperty(mappingKey + ".hasFirstRow"));
		Canonicalizer canonicalizer = (Canonicalizer)Class.forName(mappingProps.getProperty(mappingKey + ".canonicalizer")).newInstance();
		MBParser parser = (MBParser)Class.forName(mappingProps.getProperty(mappingKey + ".parser")).newInstance();
		if(canonicalData == null)
		{
			canonicalData = (CanonicalData)parser;
		}
		parser.init(toParse, fields, mapping, dataOrigin, canonicalizer);
		parser.merge(canonicalData, hasFirstRow);
	}
	
	public void processData(String mappingKey) throws InstantiationException, IllegalAccessException, ClassNotFoundException, IOException
	{
		if("all".equalsIgnoreCase(mappingKey))
		{
			// loop over all of the configured data field mappings
			String[] mappings = mappingProps.getProperty("mappings").split(",");
			for(String mapping : mappings)
			{
				System.out.println("--------------------------------------------------------BEGIN: " + mapping + "------------------------------------------------------------------------------");
				this.merge(mapping);
				System.out.println("--------------------------------------------------------END: " + mapping + "-------------------------------------------------------------------------------");
			}
		}
		else
		{
			this.merge(mappingKey);
		}
		
		// now write out the canonicalData to permanent storage
		canonicalData.persistData();
	}
	
	public static final void main(String[] args) throws InstantiationException, IllegalAccessException, ClassNotFoundException, IOException
	{
		MergeMBCounselors merge = new MergeMBCounselors();
		if(args.length > 0) merge.processData(args[0]);
		else merge.processData("all");
	}
}