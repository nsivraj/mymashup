package com.github.mymashup;

import java.io.File;
import java.io.FileWriter;
import java.io.IOException;
import java.io.PrintWriter;
import java.io.RandomAccessFile;
import java.util.HashMap;
import java.util.Map;

public class MergeMBCounselors
{
	private File nationalFile;
	private File doubleknotFile;
	private static final HashMap<String, String> MBs = new HashMap<String, String>();
	static
	{
		MBs.put("americanbusiness", "americanbusiness");
		MBs.put("americancultures", "americancultures");
		MBs.put("americanheritage", "americanheritage");
		MBs.put("americanlabor", "americanlabor");
		MBs.put("animalscience", "animalscience");
		MBs.put("archaeology", "archaeology");
		MBs.put("archery", "archery");
		MBs.put("architecture", "architecture");
		MBs.put("art", "art");
		MBs.put("astronomy", "astronomy");
		MBs.put("athletics", "athletics");
		MBs.put("automotivemaintenance", "automotivemaintenance");
		MBs.put("aviation", "aviation");
		MBs.put("backpacking", "backpacking");
		MBs.put("basketry", "basketry");
		MBs.put("birdstudy", "birdstudy");
		MBs.put("bugling", "bugling");
		MBs.put("camping", "camping");
		MBs.put("canoeing", "canoeing");
		MBs.put("chemistry", "chemistry");
		MBs.put("cinematography", "cinematography");
		MBs.put("citizenshipinthecommunity", "citizenshipinthecommunity");
		MBs.put("citizenshipinthenation", "citizenshipinthenation");
		MBs.put("citizenshipintheworld", "citizenshipintheworld");
		MBs.put("climbing", "climbing");
		MBs.put("coincollecting", "coincollecting");
		MBs.put("collections", "collections");
		MBs.put("communications", "communications");
		MBs.put("compositematerials", "compositematerials");
		MBs.put("computers", "computers");
		MBs.put("cooking", "cooking");
		MBs.put("crimeprevention", "crimeprevention");
		MBs.put("cycling", "cycling");
		MBs.put("dentistry", "dentistry");
		MBs.put("disabilitiesawareness", "disabilitiesawareness");
		MBs.put("dogcare", "dogcare");
		MBs.put("drafting", "drafting");
		MBs.put("electricity", "electricity");
		MBs.put("electronics", "electronics");
		MBs.put("emergencypreparedness", "emergencypreparedness");
		MBs.put("energy", "energy");
		MBs.put("engineering", "engineering");
		MBs.put("entrepreneurship", "entrepreneurship");
		MBs.put("environmentalscience", "environmentalscience");
		MBs.put("familylife", "familylife");
		MBs.put("farmmechanics", "farmmechanics");
		MBs.put("fingerprinting", "fingerprinting");
		MBs.put("firesafety", "firesafety");
		MBs.put("firstaid", "firstaid");
		MBs.put("fishandwildlifemanagement", "fishandwildlifemanagement");
		MBs.put("fishing", "fishing");
		MBs.put("flyfishing", "flyfishing");
		MBs.put("forestry", "forestry");
		MBs.put("gardening", "gardening");
		MBs.put("genealogy", "genealogy");
		MBs.put("geology", "geology");
		MBs.put("golf", "golf");
		MBs.put("graphicarts", "graphicarts");
		MBs.put("hiking", "hiking");
		MBs.put("homerepairs", "homerepairs");
		MBs.put("horsemanship", "horsemanship");
		MBs.put("indianlore", "indianlore");
		MBs.put("insectstudy", "insectstudy");
		MBs.put("journalism", "journalism");
		MBs.put("landscapearchitecture", "landscapearchitecture");
		MBs.put("law", "law");
		MBs.put("leatherwork", "leatherwork");
		MBs.put("lifesaving", "lifesaving");
		MBs.put("mammalstudy", "mammalstudy");
		MBs.put("medicine", "medicine");
		MBs.put("metalwork", "metalwork");
		MBs.put("modeldesignandbuilding", "modeldesignandbuilding");
		MBs.put("motorboating", "motorboating");
		MBs.put("motorboating", "motorboating");
		MBs.put("music", "music");
		MBs.put("nature", "nature");
		MBs.put("nuclearscience", "nuclearscience");
		MBs.put("oceanography", "oceanography");
		MBs.put("orienteering", "orienteering");
		MBs.put("painting", "painting");
		MBs.put("personalfitness", "personalfitness");
		MBs.put("personalmanagement", "personalmanagement");
		MBs.put("pets", "pets");
		MBs.put("photography", "photography");
		MBs.put("pioneering", "pioneering");
		MBs.put("plantscience", "plantscience");
		MBs.put("plumbing", "plumbing");
		MBs.put("pottery", "pottery");
		MBs.put("publichealth", "publichealth");
		MBs.put("publicspeaking", "publicspeaking");
		MBs.put("pulpandpaper", "pulpandpaper");
		MBs.put("radio", "radio");
		MBs.put("railroading", "railroading");
		MBs.put("reading", "reading");
		MBs.put("reptileandamphibianstudy", "reptileandamphibianstudy");
		MBs.put("rifleshooting", "rifleshooting");
		MBs.put("rowing", "rowing");
		MBs.put("safety", "safety");
		MBs.put("salesmanship", "salesmanship");
		MBs.put("scholarship", "scholarship");
		MBs.put("sculpture", "sculpture");
		MBs.put("shotgunshooting", "shotgunshooting");
		MBs.put("skating", "skating");
		MBs.put("smallboatsailing", "smallboatsailing");
		MBs.put("snowsports", "snowsports");
		MBs.put("soilandwaterconservation", "soilandwaterconservation");
		MBs.put("spaceexploration", "spaceexploration");
		MBs.put("sports", "sports");
		MBs.put("stampcollecting", "stampcollecting");
		MBs.put("surveying", "surveying");
		MBs.put("swimming", "swimming");
		MBs.put("textile", "textile");
		MBs.put("theater", "theater");
		MBs.put("trafficsafety", "trafficsafety");
		MBs.put("trucktransportation", "trucktransportation");
		MBs.put("veterinarymedicine", "veterinarymedicine");
		MBs.put("watersports", "watersports");
		MBs.put("weather", "weather");
		MBs.put("whitewater", "whitewater");
		MBs.put("wildernesssurvival", "wildernesssurvival");
		MBs.put("woodcarving", "woodcarving");
		MBs.put("woodwork", "woodwork");
	}
	
	/**
	 * 
	 * @param nationalFilename Fully qualified pathname to national merit badge counselor file
	 * @param doubleknotFilename Fully qualified pathname to doubleknot merit badge counselor file
	 */
	public MergeMBCounselors(String nationalFilename, String doubleknotFilename)
	{
		nationalFile = new File(nationalFilename);
		doubleknotFile = new File(doubleknotFilename);
		if(!nationalFile.exists() || !doubleknotFile.exists())
		{
			throw new RuntimeException("One of '"+nationalFilename+"' or '"+doubleknotFilename+"' does not exist!!!");
		}
	}
	
	public void merge() throws IOException
	{
		RandomAccessFile nFile = new RandomAccessFile(nationalFile, "r");
		RandomAccessFile dFile = new RandomAccessFile(doubleknotFile, "r");

		PrintWriter spreadsheet = new PrintWriter(new FileWriter(new File(doubleknotFile.getParentFile(), "merged_merit_badge_counselors.xls")));
		printHeadersToSpreadsheet(spreadsheet);
		
		// DONE: need to handle the case of a middle name being more than one character and being more than one name like "Ann J"
		// this is what happens with Judith Kelsch
		// Also there seems to be an issue with Lynn and Thomas
		// there are some rows with a firstname of rovo, need to fix that
		// sometimes the address is gettting messed up
		
		for(int i = 0; i < MBs.size(); ++i)
		{
			MeritBadge dMB = readNextMeritBadge(dFile, true);
			MeritBadge nMB = readNextMeritBadge(nFile, false);
			
			// merge dMB and nMB together
			if(dMB.getName().equals(nMB.getName()))
			{
				System.out.println("Merging merit badge --> "+dMB.getName());
				
				// the names match, now merge the counselors together
				// need to figure out how to do this merge
				// first have the Counselors class implement Comparable
				dMB.merge(nMB);
				
				// print out dMB into a spreadsheet friendly format
				dMB.printToSpreadsheet(spreadsheet);
				spreadsheet.flush();
				//break;
			}
			else
			{
				throw new RuntimeException("The two merit badge names do not match: "+dMB.getName()+" :: "+nMB.getName());
			}
		}
		
		nFile.close();
		dFile.close();
		spreadsheet.close();
	}
	
	protected MeritBadge readNextMeritBadge(RandomAccessFile file, boolean doubleknot) throws IOException
	{
		MeritBadge mb = new MeritBadge(doubleknot);
		String nextLine = null;
		long previousPos = file.getFilePointer();
		while((nextLine = file.readLine()) != null)
		{
			// check to see if this line specifies a merit badge
			boolean nextBoundary = (Boolean) (doubleknot ? mb.isNextDoubleKnotMBBoundary(nextLine) : mb.isNextNationalMBBoundary(nextLine));

			//if("Athletics".equalsIgnoreCase(mb.getName()))
			//if(nextLine.trim().toLowerCase().startsWith("athletics"))
			//{
			//	//System.out.println("Found the specfic merit badge: "+mb.getName());
			//	System.out.println("Found the boundary: "+nextLine);
			//}
			
			if(nextBoundary && mb.hasName() && !mb.isSameName(nextLine))
			{
				file.seek(previousPos);
				break;
			}
			else
			{
				if(doubleknot) mb.parseDoubleKnotLine(nextLine, nextBoundary);
				else mb.parseNationalLine(nextLine, nextBoundary);
			}
			
			previousPos = file.getFilePointer();
		}
		return mb;
	}

	public static void printHeadersToSpreadsheet(PrintWriter spreadsheet)
	{
		spreadsheet.print("Name"); spreadsheet.print("\t");
		spreadsheet.print("Source of data"); spreadsheet.print("\t");
		spreadsheet.print("In Both"); spreadsheet.print("\t");
		spreadsheet.print("Doubleknot Duplicates"); spreadsheet.print("\t");
		spreadsheet.print("National Duplicates"); spreadsheet.print("\t");
		spreadsheet.print("First Name"); spreadsheet.print("\t");
		spreadsheet.print("Middle Name"); spreadsheet.print("\t");
		spreadsheet.print("Last Name"); spreadsheet.print("\t");
		spreadsheet.print("Work Phone"); spreadsheet.print("\t");
		spreadsheet.print("Home Phone"); spreadsheet.print("\t");
		spreadsheet.print("Business Phone"); spreadsheet.print("\t");
		spreadsheet.print("Email 1"); spreadsheet.print("\t");
		spreadsheet.print("Email 2"); spreadsheet.print("\t");
		spreadsheet.print("Address"); spreadsheet.print("\t");
		spreadsheet.print("City"); spreadsheet.print("\t");
		spreadsheet.print("State"); spreadsheet.print("\t");
		spreadsheet.print("Postal Code"); spreadsheet.print("\t");
		spreadsheet.print("LDS Stake"); spreadsheet.print("\r\n");
	}
	
	class MeritBadge
	{
		private String name;
		private Map<String, Counselor> counselors;
		private String parsingCounselor;
		private boolean doubleknot;
		
		MeritBadge(boolean doubleknot)
		{
			this.counselors = new HashMap<String, Counselor>();
			this.parsingCounselor = null;
			this.doubleknot = doubleknot;
		}
		
		public void printToSpreadsheet(PrintWriter spreadsheet)
		{
			// print out the name of the MeritBadge and then the list of counselors
			for(Counselor printCounselor : counselors.values())
			{
				spreadsheet.print(name);
				spreadsheet.print("\t");
				printCounselor.printToSpreadsheet(spreadsheet);
			}
		}

		// if firstname and lastname match and one of the mixed matching of phone numbers
		// is a match then merge the records together
		// if mixed matching of firstname and lastname matches then also consider
		// one other piece of data and if one matches then merge the records
		public void merge(MeritBadge mb)
		{
			System.out.println("Before merge: this.counselors.size(): "+this.counselors.size());
			System.out.println("Before merge: mb.counselors.size(): "+mb.counselors.size());
			
			// merge this MeritBadge with the mb parameter
			if(name.equals(mb.name))
			{
				HashMap<String, Counselor> counselorsToRemove = new HashMap<String, Counselor>();
				for(Counselor myCounselor : counselors.values())
				{
					for(String mbKey : mb.counselors.keySet())
					{
						Counselor mbCounselor = mb.counselors.get(mbKey);
						if(((myCounselor.compareStrings(myCounselor.lastname, mbCounselor.lastname) &&
						     myCounselor.compareFirstname(myCounselor.firstname, mbCounselor.firstname, myCounselor.lastname)) ||
						    (myCounselor.compareStrings(myCounselor.firstname, mbCounselor.lastname) &&
						     myCounselor.compareFirstname(myCounselor.lastname, mbCounselor.firstname, myCounselor.firstname))) &&
						   myCounselor.compareOneOtherPieceOfInfo(mbCounselor))
						{
							// merge the mbCounselor into the myCounselor
							myCounselor.merge(mbCounselor);
							counselorsToRemove.put(mbKey, mbCounselor);
						}
					}
				}
				
				//put the left over counselors into the counselors HashMap here
				for(String mbKey : counselorsToRemove.keySet())
				{
					mb.counselors.remove(mbKey);
				}
				for(Counselor mbCounselor : mb.counselors.values())
				{
					counselors.put(mbCounselor.getKey(), mbCounselor);
				}
				
				// empty out the counselors HashMap and restore it back into another HashMap
				HashMap<String, Counselor> newCounselors = new HashMap<String, Counselor>();
				for(Counselor myCounselor : counselors.values())
				{
					String mbKey = myCounselor.getKey();
					if(newCounselors.containsKey(mbKey))
					{
						Counselor updateCounselor = newCounselors.get(mbKey);
						updateCounselor.setDoubleknotDuplicates(updateCounselor.getDoubleknotDuplicates()+1);
					}
					else
					{
						newCounselors.put(mbKey, myCounselor);
					}
				}
				counselors = newCounselors;
				
				System.out.println("After merge: this.counselors.size(): "+this.counselors.size());
				System.out.println("After merge: mb.counselors.size(): "+mb.counselors.size());
			}
			else
			{
				throw new RuntimeException("Cannot merge two merit badges that have different names: "+name+" :: "+mb.name);
			}
		}

		public boolean isDoubleknot()
		{
			return doubleknot;
		}
		
		
		public String getName()
		{
			return name;
		}

		public boolean isSameName(String line)
		{
			if(doubleknot)
			{
				String[] parts = line.split("\t");
				if(parts[0].length() > 0)
				{
					return this.name.equals(this.getName(parts[0].trim().split(" ")));
				}
			}
			else
			{
				return this.name.equals(this.getName(line.trim().split(" ")));
			}
			
			return false;
		}

		public boolean isNextNationalMBBoundary(String nextLine)
		{
			String[] parts = nextLine.trim().split(" ");
			return isMBBoundaryKey(nextLine, parts);
		}

		public boolean isNextDoubleKnotMBBoundary(String nextLine)
		{
			String[] parts = nextLine.split("\t")[0].split(" ");
			return isMBBoundaryKey(nextLine, parts);
			
		}

		private boolean isMBBoundaryKey(String nextLine, String[] parts)
		{
			String mbKey = "";
			if(parts.length < 9)
			{
				for(int i = 0; i < parts.length; ++i)
				{
					if(parts[i].trim().length() == 0 || !Character.isLetter(parts[i].trim().charAt(0))) continue;
					mbKey += parts[i].trim().toLowerCase();
				}
			}
			
			if(MBs.containsKey(mbKey))
			{
				return true;
			}
			else
			{
				return false;
			}
		}

		public String getMBKeyFromName()
		{
			return name.trim().toLowerCase().replace(" ", "");
		}
		
		public boolean hasName()
		{
			return name != null;
		}

		void parseDoubleKnotLine(String line, boolean nextBoundary)
		{
			// need to see if this line represents a new counselor for this MB
			// or maybe the line represents the declaration of the MB name
			if(line.startsWith("Badge	Last Name	First Name	Unit"))
			{
				return;
			}
			else
			{
					String[] parts = line.split("\t");
					if(parts[0].length() > 0)
					{
						this.parseName(parts[0].trim().split(" "));
					}
					
					Counselor counselor = new Counselor(doubleknot);
					counselor.parseDoubleKnot(parts);
					counselors.put(counselor.getKey(), counselor);
			}
		}
		
		void parseNationalLine(String line, boolean nextBoundary)
		{
			if(line.trim().length() == 0 ||
			   line.trim().startsWith("Report #:") ||
			   line.indexOf("docname=PAS Report!") != -1 ||
			   line.trim().startsWith("Date    :") ||
			   line.trim().startsWith("Time    :") ||
			   line.trim().startsWith("---- Selected Options") ||
			   line.trim().startsWith("BSA Structure:") ||
			   line.trim().startsWith("Badges:") ||
			   line.trim().startsWith("Include \"Troop Only\" Counselors:") ||
			   line.trim().startsWith("Troop Only") ||
			   line.trim().startsWith("------------------------------") ||
			   line.trim().equals("\f"))
			{
				parsingCounselor = null;
				return;
			}
			
			if(nextBoundary && !hasName())
			{
				// parse name
				this.parseName(line.trim().split(" "));
				parsingCounselor = null;
			}
			else if(hasName() && !nextBoundary)
			{
				Counselor counselor = null;
				//String[] parts = line.trim().split(" ");
				if(parsingCounselor == null)
				{
					counselor = new Counselor(doubleknot);
					counselor.parseNational(line.trim(), false);
					parsingCounselor = counselor.getKey();
					counselors.put(parsingCounselor, counselor);
				}
				else
				{
					counselor = counselors.get(parsingCounselor);
					if(counselor == null)
					{
						System.out.println("found another culprit");
					}
					counselor.parseNational(line.trim(), true);
					counselors.remove(parsingCounselor);
					counselors.put(counselor.getKey(), counselor);
					parsingCounselor = counselor.getKey();
				}
			}
		}
		
		private void parseName(String[] nameParts)
		{
			this.name = getName(nameParts);
		}
		
		public String getName(String[] nameParts)
		{
			String aName = "";
			for(int i = 0; i < nameParts.length; ++i)
			{
				if(!Character.isLetter(nameParts[i].trim().charAt(0))) continue;
				
				String tmpName = nameParts[i].trim().toLowerCase();
				aName += Character.toUpperCase(tmpName.charAt(0)) + tmpName.substring(1);
				if(i < (nameParts.length - 1))
				{
					aName += " ";
				}
			}

			return aName.trim();
		}
	}
	
	class Counselor
	{
		private String firstname;
		private String middlename;
		private String lastname;
		private String workPhone;
		private String homePhone;
		private String businessPhone;
		private String email1;
		private String email2;
		private String address;
		private String city;
		private String state;
		private String postalCode;
		private String ldsStake;

		private boolean doubleknot;
		private boolean inBoth;
		private int doubleknotDuplicates;
		private int nationalDuplicates;
		private int nationalLineCount;
		
		Counselor(boolean doubleknot)
		{
			this.setDoubleknotDuplicates(0);
			this.setNationalDuplicates(0);
			this.inBoth = false;
			this.doubleknot = doubleknot;
			this.nationalLineCount = 0;
		}

		public boolean compareFirstname(String myFirstname, String otherFirstname, String lastname)
		{
			boolean equals = compareStrings(myFirstname, otherFirstname);
			if(!equals && myFirstname != null && otherFirstname != null)
			{
				// compare first three chars
				if(myFirstname.length() >= 3 && otherFirstname.length() >= 3)
				{
					equals = true;
					for(int i = 0; i < 3; ++i)
					{
						if(myFirstname.charAt(i) != otherFirstname.charAt(i))
						{
							equals = false;
						}
					}
					
					if(equals)
					{
						System.out.println("Comparing two firstnames on three chars returned true: "+myFirstname+" ::: "+otherFirstname+" ::: "+lastname);
					}
				}
			}
			
			return equals;
		}

		public void printToSpreadsheet(PrintWriter spreadsheet)
		{
			spreadsheet.print((inBoth || !doubleknot) ? "National" : "Doubleknot"); spreadsheet.print("\t");
			spreadsheet.print(inBoth ? "Yes" : "No"); spreadsheet.print("\t");
			spreadsheet.print(doubleknotDuplicates); spreadsheet.print("\t");
			spreadsheet.print(nationalDuplicates); spreadsheet.print("\t");
			spreadsheet.print(firstname); spreadsheet.print("\t");
			spreadsheet.print(middlename); spreadsheet.print("\t");
			spreadsheet.print(lastname); spreadsheet.print("\t");
			spreadsheet.print(workPhone); spreadsheet.print("\t");
			spreadsheet.print(homePhone); spreadsheet.print("\t");
			spreadsheet.print(businessPhone); spreadsheet.print("\t");
			spreadsheet.print(email1); spreadsheet.print("\t");
			spreadsheet.print(email2); spreadsheet.print("\t");
			spreadsheet.print(address); spreadsheet.print("\t");
			spreadsheet.print(city); spreadsheet.print("\t");
			spreadsheet.print(state); spreadsheet.print("\t");
			spreadsheet.print(postalCode); spreadsheet.print("\t");
			spreadsheet.print(ldsStake); spreadsheet.print("\r\n");
		}

		public boolean isDoubleknot()
		{
			return doubleknot;
		}

		public void setInBoth(boolean inBoth) {
			this.inBoth = inBoth;
		}

		public boolean isInBoth() {
			return inBoth;
		}

		public void setDoubleknotDuplicates(int doubleknotDuplicates) {
			this.doubleknotDuplicates = doubleknotDuplicates;
		}

		public int getDoubleknotDuplicates() {
			return doubleknotDuplicates;
		}

		public void setNationalDuplicates(int nationalDuplicates) {
			this.nationalDuplicates = nationalDuplicates;
		}

		public int getNationalDuplicates() {
			return nationalDuplicates;
		}

		public String getKey()
		{
			return firstname+"::"+lastname+"::"+workPhone+"::"+homePhone+"::"+address+"::"+city+"::"+state+"::"+postalCode;
		}

		public void parseDoubleKnot(String[] parts)
		{
			this.firstname = parts.length > 2 ? parts[2] : "";
			this.lastname = parts.length > 1 ? parts[1] : "";
			if(this.lastname != null && this.lastname.indexOf(' ') != -1)
			{
				String[] nameParts = this.lastname.split(" ");
				this.lastname = nameParts[nameParts.length - 1];
				//this.firstname = nameParts[0];
				this.middlename = "";
				for(int k = 0; k < nameParts.length - 1; ++k)
				{
					this.middlename += nameParts[k]+" ";
				}
				this.middlename = this.middlename.trim();
			}
			this.ldsStake = parts.length > 2 ? parts[3] : "";
			this.workPhone = parts.length > 4 ? this.parseTelephone(parts[4]) : "";
			this.homePhone = parts.length > 5 ? this.parseTelephone(parts[5]) : "";
			this.address = parts.length > 6 ? parts[6] : "";
			this.city = parts.length > 7 ? parts[7] : "";
			this.state = parts.length > 8 ? parts[8] : "";
			this.postalCode = parts.length > 9 ? parts[9] : "";
			this.email1 = parts.length > 10 ? parts[10] : "";
			this.email2 = parts.length > 11 ? parts[11] : "";
		}

// DONE: Three lines for one counselor in National
//        N        Solitu  T  Purcell                           PO Box 7442                              H (801) 373-1568^M
//        221 S 2050 W                             W (801) 378-4031^M
//        Provo, UT  84601-3776^M
		
		public void parseNational(String line, boolean secondLine)
		{
			++this.nationalLineCount;
			if(this.nationalLineCount > 2)
			{
				System.out.println("found the culprit");
			}
			
			int foundCharCount = 0;
			for(int i = 0; i < line.length(); ++i)
			{
				if(!Character.isWhitespace(line.charAt(i)))
				{
					if(line.contains("UT"))
					{
						// this is the last line of the counselor information
						// City, State Zip                Phone Number
						if(foundCharCount == 0) // City
						{
							foundCharCount++;
							int endIndex = line.indexOf(", ", i);
							//String[] parts = line.substring(i, endIndex).split(" ");
							if(i >= 0 && endIndex >= 0)  { this.city = line.substring(i, endIndex); }
							i = endIndex;
							//this.state = parts[1];
							//this.postalCode = parts[2];
						}
						else if(foundCharCount == 1) // State
						{
							foundCharCount++;
							int endIndex = line.indexOf(" ", i);
							if(i >= 0 && endIndex >= 0)  { this.state = line.substring(i, endIndex); }
							i = endIndex;
						}
						else if(foundCharCount == 2) // Zip
						{
							foundCharCount++;
							int endIndex = line.indexOf(" ", i);
							if(endIndex == -1) endIndex = line.length();
							this.postalCode = line.substring(i, endIndex);
							i = endIndex;
						}
						else if(foundCharCount == 3)
						{
							foundCharCount++;
							int endIndex = line.indexOf("   ", i);
							if(endIndex == -1) endIndex = line.length();
							String phoneNumber = parseTelephone(line.substring(i+1, endIndex));
							if(line.charAt(i) == 'H') this.homePhone = phoneNumber;
							else if(line.charAt(i) == 'W') this.workPhone = phoneNumber;
							else if(line.charAt(i) == 'B') this.businessPhone = phoneNumber;
							i = endIndex;
						}
					}
					else if(this.nationalLineCount == 1)
					{
						// this is always the first line of the counselor information
						// Troop Only       Name                                            Address                               Phone
						// parse the non-whitespace character by keeping track of how many times
						// a non-whitespace character has been encountered
						if(foundCharCount == 0)
						{
							// first char is Troop Only indicator
							foundCharCount++;
						}
						else if(foundCharCount == 1)
						{
							// second char isN        David  V  Arnold                             1241 W 1150 S                            H (801) 764-0277 Name - parse the whole name
							foundCharCount++;
							int endIndex = line.indexOf(' ', i);
							this.firstname = line.substring(i, endIndex);
							
							if("rovo,".equalsIgnoreCase(this.firstname))
							{
								System.out.println("found the culprit: "+line);
							}
							
							i = endIndex;
							while(Character.isWhitespace(line.charAt(i))) ++i;
							if(Character.isWhitespace(line.charAt(i+1)))
							{
								this.middlename = line.substring(i,++i);
								while(Character.isWhitespace(line.charAt(i))) ++i;
								endIndex = line.indexOf(' ', i);
								this.lastname = line.substring(i, endIndex);
								i = endIndex;
							}
							else
							{
								// either have a long middlename or no middlename
								endIndex = line.indexOf("   ", i);
								if(i >= 0 && endIndex >= 0)
								{
									String[] nameParts = line.substring(i, endIndex).split(" ");
									this.middlename = "";
									for(int k = 0; k < nameParts.length; ++k)
									{
										// no middlename
										if(nameParts.length == 1 && k == 0) { this.lastname = nameParts[k]; }
										else
										{
											// long middlename
											this.lastname = nameParts[nameParts.length - 1];
											if(k < nameParts.length -1) { this.middlename += nameParts[k].trim()+" "; }
										}
									}
									this.middlename = this.middlename.trim();
								}
								i = endIndex;
							}
						}
						else if(foundCharCount == 2)
						{
							// third char is address - parse the whole address
							// keep parsing until you encounter three spaces in a row
							foundCharCount++;
							int beginIndex = i;
							int endIndex = line.indexOf("   ", i);
							if(beginIndex >= 0 && endIndex >= 0) { this.address = line.substring(beginIndex, endIndex); }
							i = endIndex;
						}
						else if(foundCharCount == 3)
						{
							// parse the phone number - H is home, W is work and B is ????
							int endIndex = line.indexOf("   ", i);
							if(endIndex == -1) endIndex = line.length();
							String phoneNumber = parseTelephone(line.substring(i+1, endIndex));
							if(line.charAt(i) == 'H') this.homePhone = phoneNumber;
							else if(line.charAt(i) == 'W') this.workPhone = phoneNumber;
							else if(line.charAt(i) == 'B') this.businessPhone = phoneNumber;
							i = endIndex;
						}
					}
					else
					{
						// this is where the odd case of a second address line is handled
						//				        221 S 2050 W                             W (801) 378-4031^M
						if(foundCharCount == 0)
						{
							// second line of the address
							foundCharCount++;
							int beginIndex = i;
							int endIndex = line.indexOf("   ", i);
							if(beginIndex >= 0 && endIndex >= 0) { this.address += ", "+line.substring(beginIndex, endIndex); }
							i = endIndex;
						}
						else if(foundCharCount == 1)
						{
							// parse the phone number - H is home, W is work and B is ????
							int endIndex = line.indexOf("   ", i);
							if(endIndex == -1) endIndex = line.length();
							String phoneNumber = parseTelephone(line.substring(i+1, endIndex));
							if(line.charAt(i) == 'H') this.homePhone = phoneNumber;
							else if(line.charAt(i) == 'W') this.workPhone = phoneNumber;
							else if(line.charAt(i) == 'B') this.businessPhone = phoneNumber;
							i = endIndex;
						}
					}
				}
			}
			
		}

		public String parseTelephone(String phone)
		{
			String retVal = "";

			for(int i = 0; i < phone.length(); ++i)
			{
				if(Character.isDigit(phone.charAt(i)))
				{
					retVal += phone.charAt(i);
				}
			}
			
			return retVal;
		}
		
		public void merge(Counselor toMerge)
		{
			this.inBoth = true;
			if(this.doubleknot && toMerge.doubleknot)
			{
				++this.doubleknotDuplicates;
			}
			else if(!this.doubleknot && !toMerge.doubleknot)
			{
				++this.nationalDuplicates;
			}
			//this.doubleknot = toMerge.doubleknot;

			
			if(toMerge.firstname != null)
			{
				this.firstname = toMerge.firstname;
			}
			if(toMerge.middlename != null)
			{
				this.middlename = toMerge.middlename;
			}
			if(toMerge.lastname != null)
			{
				this.lastname = toMerge.lastname;
			}
			if(toMerge.workPhone != null)
			{
				this.workPhone = toMerge.workPhone;
			}
			if(toMerge.homePhone != null)
			{
				this.homePhone = toMerge.homePhone;
			}
			if(toMerge.businessPhone != null)
			{
				this.businessPhone = toMerge.businessPhone;
			}
			if(toMerge.email1 != null)
			{
				this.email1 = toMerge.email1;
			}
			if(toMerge.email2 != null)
			{
				this.email2 = toMerge.email2;
			}
			if(toMerge.address != null)
			{
				this.address = toMerge.address;
			}
			if(toMerge.city != null)
			{
				this.city = toMerge.city;
			}
			if(toMerge.state != null)
			{
				this.state = toMerge.state;
			}
			if(toMerge.postalCode != null)
			{
				this.postalCode = toMerge.postalCode;
			}
			if(toMerge.ldsStake != null)
			{
				this.ldsStake = toMerge.ldsStake;
			}
		}

		public boolean compareOneOtherPieceOfInfo(Counselor compare)
		{
			//private String workPhone;
			//private String homePhone;
			//private String businessPhone;
			//private String email1;
			//private String email2;
			//private String address;
			
			boolean foundOne = comparePhoneNumbers(workPhone, compare);
			if(!foundOne)
			{
				foundOne = comparePhoneNumbers(homePhone, compare);
				if(!foundOne)
				{
					foundOne = comparePhoneNumbers(businessPhone, compare);
					if(!foundOne)
					{
						foundOne = compareStrings(email1, compare.email1);
						if(!foundOne)
						{
							foundOne = compareStrings(email2, compare.email2);
							if(!foundOne)
							{
								foundOne = compareAddress(compare);
							}
						}
					}
				}
			}
			
			return foundOne;
		}
		
		private boolean comparePhoneNumbers(String myPhone, Counselor compare)
		{
			return compareStrings(myPhone, compare.homePhone) || compareStrings(myPhone, compare.workPhone) || compareStrings(myPhone, compare.businessPhone);
		}

		private boolean compareAddress(Counselor compare)
		{
			return compareStrings(address, compare.address, true) &&
				   compareStrings(city, compare.city);// &&
				   //compareStrings(state, compare.state);
				   //compare.postalCode !-
		}

		//public boolean compareFirstname(Counselor compare)
		//{
		//	return compareStrings(firstname, compare.firstname);
		//}

		public boolean compareLastname(Counselor compare)
		{
			return compareStrings(lastname, compare.lastname);
		}
		
		private boolean compareStrings(String str1, String str2)
		{
			return compareStrings(str1, str2, false);
		}

		private boolean compareStrings(String str1, String str2, boolean replaceSpace)
		{
			if(replaceSpace)
			{
				return str2 != null && str1 != null && str2.replace(" ", "").toLowerCase().trim().equals(str1.replace(" ", "").toLowerCase().trim());
			}
			else
			{
				return str2 != null && str1 != null && str2.toLowerCase().trim().equals(str1.toLowerCase().trim());
			}
		}
		
		@Override
		public int hashCode()
		{
			return super.hashCode();
			
		}
		
		@Override
		public boolean equals(Object obj)
		{
			return super.equals(obj);
			
		}
		
		public String toString()
		{
			return getKey();
		}
	}
	
	/**
	 * args[0] is the nationalFilename and args[1] is the doubleknotFilename
	 * @param args
	 * @throws IOException
	 */
	public static final void main(String[] args) throws IOException
	{
		MergeMBCounselors merge = new MergeMBCounselors(args[0], args[1]);
		merge.merge();
	}
}
