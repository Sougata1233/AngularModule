export class leaveModel {
	"selectedYear" : any =  new Date().getFullYear();
    "fromDate"	: Object = { date: { year: new Date().getFullYear(), month: new Date().getMonth()+1, day: new Date().getDate() } };
    "toDate"	: Object = { date: { year: new Date().getFullYear(), month: new Date().getMonth()+1, day: new Date().getDate()+1 } };
    "dayType"   : string = "FULL";
    "leaveType" : any = "";
    "userId" : any = "";
    "locationId" : any = "";
    "unitId" : any = "";
    "leaveTransactionId"? :any = "";
}