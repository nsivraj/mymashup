package com.github.mymashup.bsaparser;

import java.io.File;

public class MBCounselor 
{
	public static final String LASTNAME_SUFFIX_INDICATOR = "||||";
	public static boolean reportValuesChanged = false;
	public static boolean reportNotMergingBecauseOfOwnership = false;
	public static boolean verbose = false;
	
	public static String getValue(String name, String[] mbData)
	{
		ImportField field = ImportField.findByName(name);
		if(field == null) return null;
		else return mbData[field.getIndex()];
	}
	
	public static String getLastName(String[] mbData)
	{
		return getValue("Last_Name", mbData);
	}
	
	public static String getRegistrationNumber(String[] mbData)
	{
		return getValue("Registration_Number", mbData);
	}
	
	
	public static boolean swapFirstNameAndLastName(String[] canonicalData, File dataFile)
	{
		System.out.println("Swapping first and last name for '" + MBCounselor.toString(canonicalData, dataFile) + "'.");
		String firstName = getFirstName(canonicalData);
		String lastName = getLastName(canonicalData);
		
		String[] newValue = new String[canonicalData.length];
		System.arraycopy(canonicalData, 0, newValue, 0, canonicalData.length);

		ImportField field = ImportField.findByName("First_Name");
		newValue[field.getIndex()] = lastName;
		field = ImportField.findByName("Last_Name");
		newValue[field.getIndex()] = firstName;
		
		boolean changed1 = setValue("canonical", "First_Name", newValue, dataFile, canonicalData, dataFile);
		boolean changed2 = setValue("canonical", "Last_Name", newValue, dataFile, canonicalData, dataFile);

		return changed1 || changed2;
	}
	
	public static boolean swapPhone1AndPhone2(String[] canonicalData, File dataFile)
	{
		//System.out.println("Swapping phone1 and phone2 for '" + MBCounselor.toString(canonicalData) + "'.");
		String phone1 = getPhone1(canonicalData);
		String phone2 = getPhone2(canonicalData);
		
		String[] newValue = new String[canonicalData.length];
		System.arraycopy(canonicalData, 0, newValue, 0, canonicalData.length);

		ImportField field = ImportField.findByName("Phone1");
		newValue[field.getIndex()] = phone2;
		field = ImportField.findByName("Phone2");
		newValue[field.getIndex()] = phone1;
		
		boolean changed1 = setValue("canonical", "Phone1", newValue, dataFile, canonicalData, dataFile);
		boolean changed2 = setValue("canonical", "Phone2", newValue, dataFile, canonicalData, dataFile);

		return changed1 || changed2;
	}
	
	public static boolean swapEmailAndEmail2(String[] canonicalData, File dataFile)
	{
		//System.out.println("Swapping email and email2 for '" + MBCounselor.toString(canonicalData) + "'.");
		String email = getEmail(canonicalData);
		String email2 = getEmail2(canonicalData);
		
		String[] newValue = new String[canonicalData.length];
		System.arraycopy(canonicalData, 0, newValue, 0, canonicalData.length);

		ImportField field = ImportField.findByName("Email");
		newValue[field.getIndex()] = email2;
		field = ImportField.findByName("Email2");
		newValue[field.getIndex()] = email;
		
		boolean changed1 = setValue("canonical", "Email", newValue, dataFile, canonicalData, dataFile);
		boolean changed2 = setValue("canonical", "Email2", newValue, dataFile, canonicalData, dataFile);
		
		return changed1 || changed2;
	}
	
	public static boolean isLastName(int index)
	{
		ImportField field = ImportField.findByName("Last_Name");
		if(field == null) return false;
		else return index == field.getIndex();
	}
	
	public static boolean isRegistrationNumber(int index)
	{
		ImportField field = ImportField.findByName("Registration_Number");
		if(field == null) return false;
		else return index == field.getIndex();
	}
	
	public static void setLastName(String dataOrigin, String lastName, File newDataFile, String[] mbData, File mbDataFile)
	{
		String[] newValues = new String[mbData.length];
		System.arraycopy(mbData, 0, newValues, 0, mbData.length);
		ImportField field = ImportField.findByName("Last_Name");
		newValues[field.getIndex()] = lastName;
		setValue(dataOrigin, "Last_Name", newValues, newDataFile, mbData, mbDataFile);
	}
	
	public static String getFirstName(String[] mbData)
	{
		return getValue("First_Name", mbData);
	}

	public static String getPhone1(String[] mbData)
	{
		return getValue("Phone1", mbData);
	}

	public static String getPhone2(String[] mbData)
	{
		return getValue("Phone2", mbData);
	}

	public static String getFax(String[] mbData)
	{
		return getValue("Fax", mbData);
	}

	public static String getEmail(String[] mbData)
	{
		return getValue("Email", mbData);
	}

	public static String getEmail2(String[] mbData)
	{
		return getValue("Email1", mbData);
	}

	public static String getAddress1(String[] mbData)
	{
		return getValue("Address1", mbData);
	}

	public static String getAddress2(String[] mbData)
	{
		return getValue("Address2", mbData);
	}

	public static boolean setValue(String dataOrigin, String name, String[] newValue, File newDataFile, String[] mbData, File oldDataFile)
	{
		ImportField field = ImportField.findByName(name);
		return setValue(dataOrigin, field, newValue, newDataFile, mbData, oldDataFile);
	}

	public static boolean setValue(String dataOrigin, int index, String[] newValue, File newDataFile, String[] mbData, File oldDataFile)
	{
		ImportField field = ImportField.findByIndex(index);
		return setValue(dataOrigin, field, newValue, newDataFile, mbData, oldDataFile);
	}

	public static boolean setValue(String dataOrigin, ImportField field, String[] newValue, File newDataFile, String[] mbData, File oldDataFile)
	{
		boolean valueChanged = false;
		
		//if(isField(field, "Badges_Taught_Starts_Here"))
		//{
		//	System.out.println("Setting Badges_Taught_Starts_Here");
		//}
		
		if(dataOrigin.equals(field.getOwner()) || "canonical".equalsIgnoreCase(dataOrigin))
		{
			// need logic here to determine if mbData[index] is empty or null or whether it
			// should be overwritten then allow it to be overwritten by value
			if(newValue != null && newValue[field.getIndex()] != null &&
			   newValue[field.getIndex()].length() > 0/* && (mbData[field.getIndex()] == null || mbData[field.getIndex()].length() <= 0)*/)
			{
				if((mbData[field.getIndex()] != null && mbData[field.getIndex()].length() > 0 && !newValue[field.getIndex()].equals(mbData[field.getIndex()])))
				{
					if(verbose || reportValuesChanged)
					{
						//if(verbose || (/*!newValue[field.getIndex()].startsWith(mbData[field.getIndex()]) &&*/
						//   !alreadyContainsPhone(mbData, field, newValue) &&
						//   !isPhone(field)))
						//{
							System.out.println(">> Changing value of field '" + field.getName() + "' from '" + mbData[field.getIndex()] + "' to '" + newValue[field.getIndex()] + "' --: " + toString(mbData, oldDataFile) + " <--> " + toString(newValue, newDataFile));
						//}
					}
					
					valueChanged = true;
				}
				
//				if(MBCounselor.getFirstName(mbData).equalsIgnoreCase("ACKERMAN"))
//				{
//					System.out.println("Found the culprit: "+MBCounselor.getFirstName(mbData));
//				}

				//if the fields type is MBList then we need to concatenate the values rather than replace the values
				if(("Badges_Taught_Starts_Here".equals(field.getName()) || "Note".equals(field.getName())) &&
				   mbData[field.getIndex()] != null && mbData[field.getIndex()].trim().length() > 0)
				{
					if("Note".equals(field.getName()))
					{
						if(mbData[field.getIndex()].indexOf(newValue[field.getIndex()]) == -1)
						{
							mbData[field.getIndex()] += " -- "+newValue[field.getIndex()];
						}
					}
					else
					{
						mbData[field.getIndex()] += ","+newValue[field.getIndex()];
					}
				}
				else
				{
					mbData[field.getIndex()] = newValue[field.getIndex()];
				}
			}
		}
		else if(reportNotMergingBecauseOfOwnership)
		{
			System.out.println(">> Not merging data '" + newValue[field.getIndex()] + "' into field '" + field.getName() + "' becuase the data origin '" + dataOrigin + "' does not own it: " + field.getOwner());
		}
		
		return valueChanged;
	}
	
	private static boolean isField(ImportField field, String fieldName)
	{
		boolean retVal = false;
		
		if(fieldName.equals(field.getName()))
		{
			retVal = true;
		}
		
		return retVal;
	}
	
	
	private static boolean isPhone(ImportField field)
	{
		boolean retVal = false;
		
		if("Phone1".equals(field.getName()) || "Phone2".equals(field.getName()))
		{
			retVal = true;
		}
		
		return retVal;
	}
	
	private static boolean alreadyContainsPhone(String[] oldValue, ImportField field, String[] newValue)
	{
		boolean retVal = false;
		
		if("Phone1".equals(field.getName()) || "Phone2".equals(field.getName()))
		{
			String phone1 = getPhone1(oldValue);
			if(phone1 != null && phone1.equals(newValue[field.getIndex()]))
			{
				retVal = true;
			}
			
			String phone2 = getPhone2(oldValue);
			if(phone2 != null && phone2.equals(newValue[field.getIndex()]))
			{
				retVal = true;
			}
		}
		
		return retVal;
	}
	
	
	public static String toString(String[] values, File mostRecentDataFile)
	{
		if(mostRecentDataFile == null)
		{
			throw new NullPointerException("The parameter '"+mostRecentDataFile+"' is null, this is not allowed!!");
		}
		String retVal = "";
		for(String val : values)
		{
			retVal += val + " :: ";
		}
		retVal += mostRecentDataFile;
		
		return retVal;
	}
	
	public static String toString(MBCounselor counselor)
	{
		return toString(counselor.getValues(), counselor.getMostRecentDataFile());
	}

	public static boolean firstnamesMatch(String thisFirstName, String otherFirstName)
	{
		if(thisFirstName != null)
		{
			thisFirstName = thisFirstName.replace(" ", "");
		}
		if(otherFirstName != null)
		{
			otherFirstName = otherFirstName.replace(" ", "");
		}

		return (thisFirstName != null && otherFirstName != null && (thisFirstName.indexOf(otherFirstName) != -1 || otherFirstName.indexOf(thisFirstName) != -1));
	}

	
	
	
	

	
	protected String[] values;
	protected int lastNameMapIndex;
	protected File mostRecentDataFile;
	protected String lastNameSuffix;
	
	public MBCounselor(String[] values)
	{
		this.values = values;
		this.lastNameMapIndex = -1;
	}
	
	public File getMostRecentDataFile()
	{
		return mostRecentDataFile;
	}
	
	public void setMostRecentDataFile(File mostRecentDataFile)
	{
		this.mostRecentDataFile = mostRecentDataFile;
	}
	
	public int getLastNameMapIndex()
	{
		return lastNameMapIndex;
	}
	
	public void setLastNameMapIndex(int lastNameMapIndex)
	{
		this.lastNameMapIndex = lastNameMapIndex;
	}

	public String toString()
	{
		return toString(this);
	}
	
	public String[] getValues()
	{
		return values;
	}
	
	public String getValue(String name)
	{
		return getValue(name, values);
	}
	
	public String getValue(int index)
	{
		return values[index];
	}
	
	public String getLastName()
	{
		return getLastName(values);
	}

	public String getFirstName()
	{
		return getFirstName(values);
	}

	public String getPhone1()
	{
		return getPhone1(values);
	}

	public String getPhone2()
	{
		return getPhone2(values);
	}

	public String getFax()
	{
		return getFax(values);
	}

	public String getEmail()
	{
		return getEmail(values);
	}

	public String getEmail2()
	{
		return getEmail2(values);
	}

	public String getAddress1()
	{
		return getAddress1(values);
	}

	public String getAddress2()
	{
		return getAddress2(values);
	}

	public String getRegistrationNumber()
	{
		return getRegistrationNumber(values);
	}

	public boolean addressesMatch(String[] canonicalData)
	{
		if(this.getAddress1() == null) return false;
		
		return this.getAddress1().equalsIgnoreCase(getAddress1(canonicalData));
	}

	public boolean firstnamesMatch(String[] canonicalData)
	{
		String thisFirstName = this.getFirstName();
		String otherFirstName = getFirstName(canonicalData);

		return firstnamesMatch(thisFirstName, otherFirstName);
	}

	public boolean[] mergeData(String[] mbData, File newDataFile, String dataOrigin)
	{
		boolean[] hasChanged = new boolean[values.length];
		// based on the dataOrigin, use the mbData to update this MBCounselor's values array
		for(int i = 0; i < values.length; ++i)
		{
			hasChanged[i] = setValue(dataOrigin, i, mbData, newDataFile, values, mostRecentDataFile);
		}
		
		return hasChanged;
	}

	// personId, lastName, firstName, address1, address2, phone1, phone2, fax, email, email2
	public int matchesOtherAttributes(String[] canonicalData, File dataFile, String dataOrigin, boolean checkStandardComparisons)
	{
		int matchCount = 0;
		
		if(checkStandardComparisons)
		{
			String myRegNumber = this.getRegistrationNumber();
			String paramRegNumber = MBCounselor.getRegistrationNumber(canonicalData);
			if(myRegNumber != null && paramRegNumber != null && myRegNumber.length() > 0 && paramRegNumber.length() > 0)
			{
				if(myRegNumber.equals(paramRegNumber))
				{
					++matchCount;
				}
				//return myRegNumber.equals(paramRegNumber);
			}
			
			// make sure that the last names match
			String myLastName = this.getLastName();
			String paramLastName = MBCounselor.getLastName(canonicalData);
			if(myLastName == null || myLastName.length() <= 0 ||
			   paramLastName == null || paramLastName.length() <= 0 ||
			   !myLastName.replace(" ", "").equalsIgnoreCase(paramLastName.replace(" ", ""))) // I added the .replace(" ","") in order to get the Dirk Vanwagoner record merged correctly
			{
				//MAY need to add code to see if the first name and last name got swapped in the data
				//if the dataOrigin of the canonicalData parameter is DoubleKnot then we need to
				//do the first name check but if the dataOrigin in National then we can assume
				//that the canonicalData parameter's lastName will truly be the lastname
				
				// this should almost never happen, so I am logging it
				System.out.println("The last names do not match inside matchesOtherAttributes " + myLastName + " :: " + paramLastName);
				System.out.println("Here are the two counselors " + this + " <> " + MBCounselor.toString(canonicalData, dataFile));
				//return false;
				return 0;
			}
			
		}
		
		// last names match by now, let's see if we match on one other piece of data
		// phone1, phone2, fax, email, email2, address1, address2
		String myField = this.getPhone1();
		String paramField = MBCounselor.getPhone1(canonicalData);
		if(myField != null && paramField != null && myField.length() > 0 && paramField.length() > 0)
		{
			if(myField.equals(paramField))
			{
				++matchCount;
			}
			//return true;
		}
		myField = this.getPhone2();
		paramField = MBCounselor.getPhone2(canonicalData);
		if(myField != null && paramField != null && myField.length() > 0 && paramField.length() > 0)
		{
			if(myField.equals(paramField))
			{
				++matchCount;
			}
			//return true;
		}
		myField = this.getPhone1();
		paramField = MBCounselor.getPhone2(canonicalData);
		if(myField != null && paramField != null && myField.length() > 0 && paramField.length() > 0)
		{
			if(myField.equals(paramField))
			{
				swapPhone1AndPhone2(canonicalData, dataFile);
				++matchCount; //return true;
			}
		}
		myField = this.getPhone2();
		paramField = MBCounselor.getPhone1(canonicalData);
		if(myField != null && paramField != null && myField.length() > 0 && paramField.length() > 0)
		{
			if(myField.equals(paramField))
			{
				swapPhone1AndPhone2(canonicalData, dataFile);
				++matchCount; //return true;
			}
		}
		myField = this.getFax();
		paramField = MBCounselor.getFax(canonicalData);
		if(myField != null && paramField != null && myField.length() > 0 && paramField.length() > 0)
		{
			if(myField.equals(paramField))
			{
				++matchCount;
			}
			//return true;
		}
		myField = this.getEmail();
		paramField = MBCounselor.getEmail(canonicalData);
		if(myField != null && paramField != null && myField.length() > 0 && paramField.length() > 0)
		{
			if(myField.equalsIgnoreCase(paramField))
			{
				++matchCount;
			}
			//return true;
		}
		myField = this.getEmail2();
		paramField = MBCounselor.getEmail2(canonicalData);
		if(myField != null && paramField != null && myField.length() > 0 && paramField.length() > 0)
		{
			if(myField.equalsIgnoreCase(paramField))
			{
				++matchCount;
			}
			//return true;
		}
		myField = this.getEmail2();
		paramField = MBCounselor.getEmail(canonicalData);
		if(myField != null && paramField != null && myField.length() > 0 && paramField.length() > 0)
		{
			if(myField.equalsIgnoreCase(paramField))
			{
				swapEmailAndEmail2(canonicalData, dataFile);
				++matchCount; //return true;
			}
		}
		myField = this.getEmail();
		paramField = MBCounselor.getEmail2(canonicalData);
		if(myField != null && paramField != null && myField.length() > 0 && paramField.length() > 0)
		{
			if(myField.equalsIgnoreCase(paramField))
			{
				swapEmailAndEmail2(canonicalData, dataFile);
				++matchCount; //return true;
			}
		}
		myField = this.getAddress1();
		paramField = MBCounselor.getAddress1(canonicalData);
		if(myField != null && paramField != null && myField.length() > 0 && paramField.length() > 0)
		{
			if(myField.equalsIgnoreCase(paramField))
			{
				++matchCount;
			}
			//return true;
		}
		myField = this.getAddress2();
		paramField = MBCounselor.getAddress2(canonicalData);
		if(myField != null && paramField != null && myField.length() > 0 && paramField.length() > 0)
		{
			if(myField.equalsIgnoreCase(paramField))
			{
				++matchCount;
			}
			//return true;
		}
				
		if(checkStandardComparisons)
		{
			myField = this.getFirstName();
			paramField = MBCounselor.getFirstName(canonicalData);
			if(myField != null && paramField != null && myField.length() > 0 && paramField.length() > 0)
			{
				if(this.firstnamesMatch(canonicalData))
				{
					System.out.println(">> Using the firstnamesMatch comparison to get a match: " + this + " <--> " + toString(canonicalData, dataFile));
					new Exception().printStackTrace(System.out);
					++matchCount; //return true;
				}
			}
		}
		
		return matchCount;
	}

	public void setLastNameSuffix(String lastNameSuffix)
	{
		this.lastNameSuffix = lastNameSuffix;
	}

	public String getLastNameSuffix()
	{
		return lastNameSuffix;
	}

}
