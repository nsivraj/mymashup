package com.github.mymashup.bsaparser;

import java.util.HashMap;
import java.util.Properties;

public class ImportField
{
	public static final String FIELD_PROPS_NAME = "double.knot.canonnical.import.fields.properties";
	private static final HashMap<String, ImportField> name2Field = new HashMap<String, ImportField>();
	private static final HashMap<Integer, ImportField> int2Field = new HashMap<Integer, ImportField>();
	static
	{
		Properties fieldProps = Utils.loadProps(FIELD_PROPS_NAME);
		
		// now initialize the canonicalName2MB and int2MB HashMaps
		int maxRefNum = Integer.parseInt(fieldProps.getProperty("importFields.maxRefNum"));
		String name, displayName, owner, type, defaultValue;
		int index;
		
		for(int i = 1; i <= maxRefNum; ++i)
		{
			name = fieldProps.getProperty(i + ".name");
			displayName = fieldProps.getProperty(i + ".displayName");
			owner = fieldProps.getProperty(i + ".owner");
			type = fieldProps.getProperty(i + ".type");
			defaultValue = fieldProps.getProperty(i + ".defaultValue");
			index = Integer.parseInt(fieldProps.getProperty(i + ".index")) - 1;
			if(name != null && owner != null && type != null)
			{
				ImportField field = new ImportField(name, displayName, owner, type, defaultValue, index);
				name2Field.put(field.getName(), field);
				int2Field.put(field.getIndex(), field);
			}
			else
			{
				continue;
			}
		}
	}
	
	protected String name;
	protected String displayName;
	protected String owner;
	protected String type;
	protected String defaultValue;
	protected int index;
	
	protected ImportField(String name, String displayName, String owner, String type, String defaultValue, int index)
	{
		this.name = name;
		if(displayName == null || displayName.trim().length() <= 0) this.displayName = name;
		else this.displayName = displayName;
		this.owner = owner;
		this.type = type;
		this.defaultValue = defaultValue;
		this.index = index;
	}

	public String getName() {
		return name;
	}
	
	public String getDisplayName() {
		return displayName;
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
	
	public int getIndex()
	{
		return index;
	}
	
	public String toString()
	{
		return name + " :: " + owner + " :: " + type + " :: " + defaultValue + " :: " + index;
	}
	
	public static final void main(String[] args)
	{
		ImportField mb = findByName(args[0]);
		System.out.println(mb);
	}

	public static ImportField findByName(String name) {
		return name2Field.get(name);
	}
	
	public static int getFieldCount() {
		return name2Field.size();
	}

	public static ImportField findByIndex(int index)
	{
		return int2Field.get(index);
	}

}
