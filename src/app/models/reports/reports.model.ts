
var formattedmnth : any = new Date().getMonth()+1;
export class reportModel {
  "startdate"	: any = null;
  "enddate"	: any = null;
  "searchitemstring" : string = "";
  "selectedItemGroup" : any = "";
  "selectedItem" : any = "";
  "selectedType" : any = "";
  "selectedDepartment" : any = "";
  "reportdate" : Object = { 
							date: { year: new Date().getFullYear(), month: new Date().getMonth()+1, day: new Date().getDate() } ,
							formatted : new Date().getFullYear()+"-"+(formattedmnth).toString()+"-"+new Date().getDate()
						};
   "reportTodate" : Object = { 
							date: { year: new Date().getFullYear(), month: new Date().getMonth()+1, day: new Date().getDate() } ,
							formatted : new Date().getFullYear()+"-"+(formattedmnth).toString()+"-"+new Date().getDate()
						};
  }