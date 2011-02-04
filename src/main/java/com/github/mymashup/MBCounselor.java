package com.github.mymashup;

public class MBCounselor 
{
	public static boolean reportValuesChanged = false;
	public static boolean reportNotMergingBecauseOfOwnership = false;

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
	
	
	public static void swapFirstNameAndLastName(String[] canonicalData)
	{
		String firstName = getFirstName(canonicalData);
		String lastName = getLastName(canonicalData);
		
		setValue("canonical", "First_Name", lastName, canonicalData);
		setValue("canonical", "Last_Name", firstName, canonicalData);
	}
	
	public static void swapPhone1AndPhone2(String[] canonicalData)
	{
		String phone1 = getPhone1(canonicalData);
		String phone2 = getPhone2(canonicalData);
		
		setValue("canonical", "Phone1", phone2, canonicalData);
		setValue("canonical", "Phone2", phone1, canonicalData);
	}
	
	public static void swapEmailAndEmail2(String[] canonicalData)
	{
		String email = getEmail(canonicalData);
		String email2 = getEmail2(canonicalData);
		
		setValue("canonical", "Email", email2, canonicalData);
		setValue("canonical", "Email2", email, canonicalData);
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

	public static void setValue(String dataOrigin, String name, String value, String[] mbData)
	{
		ImportField field = ImportField.findByName(name);
		setValue(dataOrigin, field, value, mbData);
	}

	public static void setValue(String dataOrigin, int index, String value, String[] mbData)
	{
		ImportField field = ImportField.findByIndex(index);
		setValue(dataOrigin, field, value, mbData);
	}

	public static void setValue(String dataOrigin, ImportField field, String value, String[] mbData)
	{
		if(dataOrigin.equals(field.getOwner()) || "canonical".equalsIgnoreCase(dataOrigin))
		{
			// need logic here to determine if mbData[index] is empty or null or whether it
			// should be overwritten then allow it to be overwritten by value
			if(value != null && value.length() > 0/* && (mbData[field.getIndex()] == null || mbData[field.getIndex()].length() <= 0)*/)
			{
				if(mbData[field.getIndex()] != null && mbData[field.getIndex()].length() > 0 && !value.equals(mbData[field.getIndex()]) && reportValuesChanged)
				{
					System.out.println("Changing value of field '" + field.getName() + "' from '" + mbData[field.getIndex()] + "' to '" + value + "' -- " + getRegistrationNumber(mbData));
				}
				
				mbData[field.getIndex()] = value;
			}
		}
		else if(reportNotMergingBecauseOfOwnership)
		{
			System.out.println("Not merging data '" + value + "' into field '" + field.getName() + "' becuase the data origin '" + dataOrigin + "' does not own it: " + field.getOwner());
		}
	}
	
	public static String toString(String[] vals)
	{
		String retVal = "";
		for(String val : vals)
		{
			retVal += val + " :: ";
		}
		
		return retVal;
	}


	
	
	
	

	
	protected String[] values;
	
	public MBCounselor(String[] values)
	{
		this.values = values;
	}
	
	public String toString()
	{
		return toString(values);
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

	public void mergeData(String[] mbData, String dataOrigin)
	{
		// based on the dataOrigin, use the mbData to update this MBCounselor's values array
		for(int i = 0; i < values.length; ++i)
		{
			setValue(dataOrigin, i, mbData[i], values);			
		}
	}

	// personId, lastName, firstName, address1, address2, phone1, phone2, fax, email, email2
	public boolean matchesOtherAttributes(String[] canonicalData, String dataOrigin)
	{
		String myRegNumber = this.getRegistrationNumber();
		String paramRegNumber = MBCounselor.getRegistrationNumber(canonicalData);
		if(myRegNumber != null && paramRegNumber != null && myRegNumber.length() > 0 && paramRegNumber.length() > 0)
		{
			return myRegNumber.equals(paramRegNumber);
		}
		
		// make sure that the last names match
		String myLastName = this.getLastName();
		String paramLastName = MBCounselor.getLastName(canonicalData);
		if(myLastName == null || myLastName.length() <= 0 ||
		   paramLastName == null || paramLastName.length() <= 0 ||
		   !myLastName.equalsIgnoreCase(paramLastName))
		{
			//MAY need to add code to see if the first name and last name got swapped in the data
			//if the dataOrigin of the canonicalData parameter is DoubleKnot then we need to
			//do the first name check but if the dataOrigin in National then we can assume
			//that the canonicalData parameter's lastName will truly be the lastname
			
			// this should almost never happen, so I am logging it
			System.out.println("The last names do not match inside matchesOtherAttributes " + myLastName + " :: " + paramLastName);
			return false;
		}
		
		// last names match by now, let's see if we match on one other piece of data
		// phone1, phone2, fax, email, email2, address1, address2
		String myField = this.getPhone1();
		String paramField = MBCounselor.getPhone1(canonicalData);
		if(myField != null && paramField != null && myField.length() > 0 && paramField.length() > 0)
		{
			if(myField.equals(paramField)) return true;
		}
		myField = this.getPhone2();
		paramField = MBCounselor.getPhone2(canonicalData);
		if(myField != null && paramField != null && myField.length() > 0 && paramField.length() > 0)
		{
			if(myField.equals(paramField)) return true;
		}
		myField = this.getPhone1();
		paramField = MBCounselor.getPhone2(canonicalData);
		if(myField != null && paramField != null && myField.length() > 0 && paramField.length() > 0)
		{
			if(myField.equals(paramField))
			{
				swapPhone1AndPhone2(canonicalData);
				return true;
			}
		}
		myField = this.getPhone2();
		paramField = MBCounselor.getPhone1(canonicalData);
		if(myField != null && paramField != null && myField.length() > 0 && paramField.length() > 0)
		{
			if(myField.equals(paramField))
			{
				swapPhone1AndPhone2(canonicalData);
				return true;
			}
		}
		myField = this.getFax();
		paramField = MBCounselor.getFax(canonicalData);
		if(myField != null && paramField != null && myField.length() > 0 && paramField.length() > 0)
		{
			if(myField.equals(paramField)) return true;
		}
		myField = this.getEmail();
		paramField = MBCounselor.getEmail(canonicalData);
		if(myField != null && paramField != null && myField.length() > 0 && paramField.length() > 0)
		{
			if(myField.equalsIgnoreCase(paramField)) return true;
		}
		myField = this.getEmail2();
		paramField = MBCounselor.getEmail2(canonicalData);
		if(myField != null && paramField != null && myField.length() > 0 && paramField.length() > 0)
		{
			if(myField.equalsIgnoreCase(paramField)) return true;
		}
		myField = this.getEmail2();
		paramField = MBCounselor.getEmail(canonicalData);
		if(myField != null && paramField != null && myField.length() > 0 && paramField.length() > 0)
		{
			if(myField.equalsIgnoreCase(paramField))
			{
				swapEmailAndEmail2(canonicalData);
				return true;
			}
		}
		myField = this.getEmail();
		paramField = MBCounselor.getEmail2(canonicalData);
		if(myField != null && paramField != null && myField.length() > 0 && paramField.length() > 0)
		{
			if(myField.equalsIgnoreCase(paramField))
			{
				swapEmailAndEmail2(canonicalData);
				return true;
			}
		}
		myField = this.getAddress1();
		paramField = MBCounselor.getAddress1(canonicalData);
		if(myField != null && paramField != null && myField.length() > 0 && paramField.length() > 0)
		{
			if(myField.equalsIgnoreCase(paramField)) return true;
		}
		myField = this.getAddress2();
		paramField = MBCounselor.getAddress2(canonicalData);
		if(myField != null && paramField != null && myField.length() > 0 && paramField.length() > 0)
		{
			if(myField.equalsIgnoreCase(paramField)) return true;
		}
				
		// if nothing else then check the first three chars of firstName
		myField = this.getFirstName();
		paramField = MBCounselor.getFirstName(canonicalData);
		if(myField != null && paramField != null && myField.length() > 0 && paramField.length() > 0)
		{
			if(myField.substring(0,3).equalsIgnoreCase(paramField.substring(0,3)))
			{
				System.out.println("Using the first three chars of firstName to get a match: " + this + " <--> " + toString(canonicalData));
				return true;
			}
		}
		
		return false;
	}

}
