package com.github.mymashup;

import java.util.HashMap;
import java.util.Properties;

public class ImportField
{
	public static final String FIELD_PROPS_NAME = "double.knot.canonnical.import.fields.properties";
	public static final HashMap<String, ImportField> name2Field = new HashMap<String, ImportField>();
	static
	{
		Properties fieldProps = Utils.loadProps(FIELD_PROPS_NAME);
		
		// now initialize the canonicalName2MB and int2MB HashMaps
		int maxRefNum = Integer.parseInt(fieldProps.getProperty("importFields.maxRefNum"));
		String name, owner, type, defaultValue;
		
		for(int i = 0; i < maxRefNum; ++i)
		{
			name = fieldProps.getProperty(i + ".name");
			owner = fieldProps.getProperty(i + ".owner");
			type = fieldProps.getProperty(i + ".type");
			defaultValue = fieldProps.getProperty(i + ".defaultValue");
			if(name != null && owner != null && type != null)
			{
				ImportField field = new ImportField(name, owner, type, defaultValue);
				name2Field.put(field.getName(), field);
			}
			else
			{
				continue;
			}
		}
	}
	
	protected String name;
	protected String owner;
	protected String type;
	protected String defaultValue;
	
	protected ImportField(String name, String owner, String type, String defaultValue)
	{
		this.name = name;
		this.owner = owner;
		this.type = type;
		this.defaultValue = defaultValue;
	}

	public String getName() {
		return name;
	}

	public String getOwner() {
		return owner;
	}

	public String getType() {
		return type;
	}

	public String getDefaultValue() {
		return defaultValue;
	}
	
	public String toString()
	{
		return name + " :: " + owner + " :: " + type + " :: " + defaultValue;
	}
	
	public static final void main(String[] args)
	{
		ImportField mb = findByName(args[0]);
		System.out.println(mb);
	}

	private static ImportField findByName(String name) {
		return name2Field.get(name);
	}
	
}
