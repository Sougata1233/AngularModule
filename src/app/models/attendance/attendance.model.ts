export class attendanceModel {
	"selectedPeriodDate" : Object = { date: { year: new Date().getFullYear(), month: new Date().getMonth()+1, day: new Date().getDate() } };
	"startdate"  : Object = { date: { year: new Date().getFullYear(), month: new Date().getMonth(), day: new Date().getDate() } };
	"enddate"  : Object = { date: { year: new Date().getFullYear(), month: new Date().getMonth()+1, day: new Date().getDate() } };
	"selectedDepartment" : any = "";
	"empId" : any = "";
	"swipeIn" : any = "";
	"swipeout" : any = "";
	"swipeInLoc" : any = "";
	"swipeoutLoc" : any = "";
	"reason" : any = "";
 }