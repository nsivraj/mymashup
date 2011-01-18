package com.github.mymashup;

import java.io.BufferedReader;
import java.io.File;
import java.io.FileNotFoundException;
import java.io.FileReader;
import java.io.IOException;
import java.util.HashMap;

public class ExtractMeritBadgeList
{
	private File doubleknotFile;
	
	public ExtractMeritBadgeList(String doubleknotFilename)
	{
		doubleknotFile = new File(doubleknotFilename);
	}

	private void extract() throws IOException
	{
		String nextLine = null;
		BufferedReader reader = new BufferedReader(new FileReader(doubleknotFile));
		
		//System.out.println("private static final String[][] MBs = \n{");
		System.out.println("private static final HashMap<String, String> MBs = new HashMap<String, String>();");
		System.out.println("static");
		System.out.println("{");
		while((nextLine = reader.readLine()) != null)
		{
			if(nextLine.startsWith("Badge")) continue;
			if(!nextLine.startsWith("\t"))
			{
				String mbName = "";
				String[] mbNameParts = nextLine.split("\t")[0].split(" ");
				//System.out.print("{");
				for(int i = 0; i < mbNameParts.length; ++i)
				{
					if(mbNameParts[i].equals("(ER)")) continue;
					mbName += mbNameParts[i].trim();
					//System.out.print("\""+mbNameParts[i].toLowerCase()+"\"");
					//if(i+1 < mbNameParts.length && !mbNameParts[i+1].equals("(ER)"))
					//{
						//System.out.print(",");
					//}
				}
				System.out.println("MBs.put(\""+mbName.toLowerCase()+"\", \""+mbName.toLowerCase()+"\");");
				//System.out.println("},");
			}
		}
		//System.out.println("};");
		System.out.println("}");
		
		reader.close();
	}

	public static final void main(String[] args) throws IOException
	{
		ExtractMeritBadgeList extract = new ExtractMeritBadgeList(args[0]);
		extract.extract();
	}

}

/*
private static final String[][] MBs = {
		{"american","business"},
		{""}
	};
*/

/*
 	private static final HashMap<String, String> MBs = new HashMap<String, String>();
	static
	{
		MBs.put("", "");
	}
 */