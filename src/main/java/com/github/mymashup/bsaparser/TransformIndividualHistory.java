package com.github.mymashup.bsaparser;

import java.io.BufferedReader;
import java.io.BufferedWriter;
import java.io.File;
import java.io.FileReader;
import java.io.FileWriter;
import java.io.IOException;
import java.io.PrintWriter;

public class TransformIndividualHistory
{
	public static final String endHeadPattern = "<td><font style=\"width:7.70in\"></font></td>";
	public static final String startFooterPattern = "</table>";
	public static final String footer = "</table>\r\n\r\n</BODY>\r\n\r\n</HTML>\r\n";
	public static final String namePattern = "\">Name:</font>";
	public static final String endIndividualSectionStartsWith = "<HR style=\"position:absolute;";
	public static final String endIndividualSectionEndsWith = "width=\"100%\">";
	public static final String beginTopPosPattern = "; top:";
	public static final String endTopPosPattern = "in;";
	// 0.13in -- top coordinate in first absolute position inline style
	public static final int topPosOffset = 13;
	
	private File inputFile;
	private String outputEnding;
	private String date;

	public TransformIndividualHistory(String[] args)
	{
		this.inputFile = new File(args[0]);
		this.date = this.inputFile.getName().substring(0,10);
		this.outputEnding = args[1];
	}

	private void processFile() throws IOException
	{
		// read the inputFile one line at a time and write it to outputFile
		System.out.println("input file: "+inputFile);
		System.out.println("date file: "+date);
		System.out.println("output file: "+outputEnding);
		
		BufferedReader in = new BufferedReader(new FileReader(inputFile));
		StringBuilder header = new StringBuilder();
		
		for(String line = in.readLine(); line != null; line = in.readLine())
		{
			header.append(line+"\r\n");
			if(endHeadPattern.equals(line))
			{
				header.append("\r\n");
				break;
			}
		}

		PrintWriter out = null;
		StringBuilder beforeName = new StringBuilder();
		IntWrapper topHeight = new IntWrapper();
		for(String line = in.readLine(); line != null; line = in.readLine())
		{
			line = fixPosition(line, topHeight);
			if(line.contains(namePattern))
			{
				beforeName.append(line+"\r\n");
				String extractedName = in.readLine();
				extractedName = fixPosition(extractedName, topHeight);
				beforeName.append(extractedName+"\r\n");
				// <font class=data style="position:absolute; top:0.69in; left:1.53in">Eric Chatwin</font>
				extractedName = extractedName.substring(extractedName.indexOf("\">")+2, extractedName.indexOf("</font>"));
				extractedName = extractedName.replace(' ', '.');
				out = new PrintWriter(new BufferedWriter(new FileWriter(new File(inputFile.getParentFile(), date+"_"+extractedName+outputEnding))));
				out.println(header);
				out.println(beforeName);
			}
			else if(out == null)
			{
				beforeName.append(line+"\r\n");
			}
			else if((line.startsWith(endIndividualSectionStartsWith) &&
					line.endsWith(endIndividualSectionEndsWith)) ||
					line.equals(startFooterPattern))
			{
				out.println(footer);
				out.flush();
				out.close();
				out = null;
				beforeName.setLength(0);
				topHeight.val = -1;
			}
			else
			{
				out.println(line);
			}
		}
		
		in.close();
	}
	
	public String fixPosition(String line, IntWrapper topHeight)
	{
		// <font class=label style="position:absolute; top:21.78in; left:0.25in">06/23/10</font>
		int topPosStartIndex = line.indexOf(beginTopPosPattern);
		
		if(topPosStartIndex != -1)
		{
			topPosStartIndex += beginTopPosPattern.length();
			int topPosEndIndex = line.indexOf(endTopPosPattern, topPosStartIndex);
			StringBuilder topPos = new StringBuilder(line.substring(topPosStartIndex, topPosEndIndex));
			String topPosReplace = topPos.toString();
			topPos.deleteCharAt(topPos.indexOf("."));
			int topPosNum = Integer.parseInt(topPos.toString());
			
			if(topHeight.val == -1)
			{
				topHeight.val = topPosNum - topPosOffset;
				topPosNum = topPosOffset;
			}
			else
			{
				topPosNum = topPosNum - topHeight.val;
			}
			topPos = new StringBuilder(String.valueOf(topPosNum));
			topPos.insert(topPos.length() - 2, '.');
			if(topPos.length() == 3)
			{
				topPos.insert(0, '0');
			}
			//StringBuilder l = new StringBuilder(line);
			line = line.replace(topPosReplace, topPos);
		}
		
		return line;
	}

	class IntWrapper
	{
		public int val = -1;
	}
	
	public static void main(String[] args) throws IOException
	{
		TransformIndividualHistory transform = new TransformIndividualHistory(args);
		transform.processFile();
	}
}
