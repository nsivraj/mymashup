package com.github.mymashup;

import java.io.BufferedReader;
import java.io.File;
import java.io.FileReader;
import java.io.IOException;

public class ExtractMeritBadgeList
{
	private File inputFile;
	
	public ExtractMeritBadgeList(String inputFilename)
	{
		inputFile = new File(inputFilename);
	}

	private void extractFromDoubleKnot() throws IOException
	{
		String nextLine = null;
		BufferedReader reader = new BufferedReader(new FileReader(inputFile));
		
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

	private void extractFromMBRefList() throws IOException
	{
		String nextLine = null;
		BufferedReader reader = new BufferedReader(new FileReader(inputFile));
		int counter = 0;
		
		while((nextLine = reader.readLine()) != null)
		{
			nextLine = nextLine.trim();
			if(nextLine.startsWith("Badge")) continue;
			String[] parts = nextLine.split("\t");
			counter++;
			System.out.println(counter+".canonicalName="+parts[0].toLowerCase().replace(" ", ""));
			System.out.println(counter+".displayName="+parts[0]);
			System.out.println(counter+".number="+parts[1]);
		}
		
		reader.close();
	}

	public static final void main(String[] args) throws IOException
	{
		ExtractMeritBadgeList extract = new ExtractMeritBadgeList(args[0]);
		if(args[0].toLowerCase().indexOf("double") != -1 && args[0].toLowerCase().indexOf("knot") != -1) { extract.extractFromDoubleKnot(); }
		else if(args[0].toLowerCase().indexOf("reflist") != -1) { extract.extractFromMBRefList(); }
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