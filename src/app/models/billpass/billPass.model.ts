export class billPassModel {
  "createDate"	: Object = { date: { year: new Date().getFullYear(), month: new Date().getMonth()+1, day: new Date().getDate() } };
  "SRNo"	: string = "";
  "PONo"	: string = "";
  "DRCRQuan" : string = "";
  "itemCode" : string = "";
  "DRCRType" : string = "";
  "billammount" : number = 0;
  "GRNType"	:	string = "";
  "billpassno"	:	string = "";
  }