package com.github.mymashup;

import java.net.URL;
import java.util.Properties;

public class Utils
{
	public static final Properties loadProps(String name)
	{
		Properties mbProps = new Properties();

		try
		{
			// load properties file
			URL url = ClassLoader.getSystemResource(name);
			if(url == null)
			{
				url = MeritBadge.class.getProtectionDomain().getCodeSource().getLocation();
				String path = url.toString().substring(5);
				java.io.FileInputStream fis = new java.io.FileInputStream
				   (new java.io.File( path + "/" + name));
				mbProps.load(fis);
				fis.close();
			}
			else
			{
				mbProps.load(url.openStream());
			}
		}
		catch(Throwable th)
		{
			th.printStackTrace();
		}
		
		return mbProps;
	}
}
