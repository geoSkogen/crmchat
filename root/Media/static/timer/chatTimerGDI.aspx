<script language="c#" runat="server">
public void Page_Load(object sender, EventArgs e)
{
	// may need to dig out a query string var for team 
	
    DateTime curr = DateTime.Now;
	// for now we assume weekends off, weekdays 9:30 - 4:45;
	int startHour = 9;
	int startMinute = 00;
	int endHour = 15;//14
	int endMinute = 00;
	System.DayOfWeek day = curr.DayOfWeek;
	bool thingsAreOpen = false;
//	if ((day == System.DayOfWeek.Sunday) || (day == System.DayOfWeek.Saturday)) 
//	{
//		thingsAreOpen = false;
//	}
//	else 
//	{
//		thingsAreOpen =  (
//			(
//				(curr.Hour > startHour)  ||  
//				((curr.Hour == startHour) && (curr.Minute >= startMinute))
//			)
//			&&  
//			(
//				(curr.Hour < endHour)  ||
//				((curr.Hour == endHour) && (curr.Minute < endMinute))
//			)
//		);
//	}
	Response.Write(thingsAreOpen?"Open":"Closed");
	
}
</script>