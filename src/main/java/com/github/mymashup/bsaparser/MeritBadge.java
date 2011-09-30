package com.github.mymashup.bsaparser;


import java.util.HashMap;
import java.util.Properties;

public class MeritBadge
{
	public static boolean prepareForImport = false;
	public static boolean showMBNames = false;
	public static final String MB_PROPS_NAME = "merit.badges.properties";
	public static final HashMap<String, MeritBadge> canonicalName2MB = new HashMap<String, MeritBadge>();
	public static final HashMap<Integer, MeritBadge> int2MB = new HashMap<Integer, MeritBadge>();
	static
	{
		Properties mbProps = Utils.loadProps(MB_PROPS_NAME);
		
		// now initialize the canonicalName2MB and int2MB HashMaps
		int maxRefNum = Integer.parseInt(mbProps.getProperty("meritBadges.maxRefNum"));
		String canonicalName, displayName, number;
		
		for(int i = 1; i <= maxRefNum; ++i)
		{
			canonicalName = mbProps.getProperty(i + ".canonicalName");
			displayName = mbProps.getProperty(i + ".displayName");
			number = mbProps.getProperty(i + ".number");
			if(canonicalName != null && displayName != null && number != null)
			{
				MeritBadge mb = new MeritBadge(canonicalName, displayName, Integer.parseInt(number));
				canonicalName2MB.put(mb.getCanonicalName(), mb);
				int2MB.put(mb.getNumber(), mb);
			}
			else
			{
				continue;
			}
		}
	}
	
	
	private String canonicalName;
	private String displayName;
	private int number;
	
	protected MeritBadge(String canonicalName, String displayName, int number)
	{
		this.canonicalName = canonicalName;
		this.displayName = displayName;
		this.number = number;
	}
	
	public String getCanonicalName()
	{
		return canonicalName;
	}
	
	public String getDisplayName()
	{
		return this.displayName;
	}
	
	public int getNumber()
	{
		return this.number;
	}
	
	public String toString()
	{
		return canonicalName + " :: " + displayName + " :: " + number;
	}
	
	public static final MeritBadge findByCanonicalName(String canonicalName)
	{
		return canonicalName2MB.get(canonicalName);
	}
	
	public static final MeritBadge findByNumber(int number)
	{
		return int2MB.get(number);
	}
	
	public static final void main(String[] args)
	{
		MeritBadge mb = findByNumber(Integer.parseInt(args[0]));
		System.out.println(mb);
	}
}

/*
Properties props = new Properties();
        URL url = ClassLoader.getSystemResource(propsName);
        props.load(url.openStream());
        return props;





java.util.Properties props = new java.util.Properties();
String path = getClass().getProtectionDomain().getCodeSource().
   getLocation().toString().substring(6);
java.io.FileInputStream fis = new java.io.FileInputStream
   (new java.io.File( path + "/myprops.props"));
props.load(fis);
fis.close();
System.out.println(props);



 */
