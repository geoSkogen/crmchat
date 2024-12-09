<script language="c#" runat="server">
public void Page_Load(object sender, EventArgs e)
{
	// may need to dig out a query string var for team 
	
    DateTime curr = DateTime.Now;
	// for now we assume weekends off, weekdays 9:30 - 4:45;
	int startHour = 9;
	int startMinute = 00;
	int endHour = 17;//14
	int endMinute = 00;
	
	int startHour2 = 9;
	int startMinute2 = 00;
	int endHour2 = 12;//14
	int endMinute2 = 00;
	
	int startHour3 = 9;
	int startMinute3 = 30;
	int endHour3 = 17;//14
	int endMinute3 = 00;
	
	
	System.DayOfWeek day = curr.DayOfWeek;
	bool thingsAreOpen = true;
	if ((day == System.DayOfWeek.Sunday) || (day == System.DayOfWeek.Saturday) || (day == System.DayOfWeek.Friday) ) 
	{
		thingsAreOpen = false;
	}
	else if ((day == System.DayOfWeek.Monday) || (day == System.DayOfWeek.Tuesday)  ) 
	{
		thingsAreOpen =  (
			(
				(curr.Hour > startHour)  ||  
				((curr.Hour == startHour) && (curr.Minute >= startMinute))
			)
			&&  
			(
				(curr.Hour < endHour)  ||
				((curr.Hour == endHour) && (curr.Minute < endMinute))
			)
		);
	}
	else if ((day == System.DayOfWeek.Wednesday)  ) 
	{
		thingsAreOpen =  (
			(
				(curr.Hour > startHour2)  ||  
				((curr.Hour == startHour2) && (curr.Minute >= startMinute2))
			)
			&&  
			(
				(curr.Hour < endHour2)  ||
				((curr.Hour == endHour2) && (curr.Minute < endMinute2))
			)
		);
	}
	else if ((day == System.DayOfWeek.Thursday)  ) 
	{
		thingsAreOpen =  (
			(
				(curr.Hour > startHour3)  ||  
				((curr.Hour == startHour3) && (curr.Minute >= startMinute3))
			)
			&&  
			(
				(curr.Hour < endHour3)  ||
				((curr.Hour == endHour3) && (curr.Minute < endMinute3))
			)
		);
	}
	
	
	Response.Write(thingsAreOpen?"Open":"Closed");
	
}
</script>