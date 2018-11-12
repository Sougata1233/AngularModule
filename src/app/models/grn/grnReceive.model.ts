export class grnReceiveModel {
  "mrdate"	: Object = { date: { year: new Date().getFullYear(), month: new Date().getMonth()+1, day: new Date().getDate() } };
  "srdate"	: Object = { date: { year: new Date().getFullYear(), month: new Date().getMonth()+1, day: new Date().getDate() } };
  "chalanNo"	: string = "";
  "supplierId"	: string = "";
  "exstn"		: string = "";
  "store"		: string = "";
  "batchNo"		: string = "";
  "rackId"		: string = "";
  "salesId"		: string = "";
   "challanDt"	: Object = { date: { year: new Date().getFullYear(), month: new Date().getMonth()+1, day: new Date().getDate() } };
  "strRcvDt"	: Object = { date: { year: new Date().getFullYear(), month: new Date().getMonth()+1, day: new Date().getDate() } };
  "searchMr"	: string = "";
  "contractNo"	: string = "";
  "contractDate"	: Object = { date: { year: new Date().getFullYear(), month: new Date().getMonth()+1, day: new Date().getDate() } };
  "exdate"	: Object = { date: { year: new Date().getFullYear(), month: new Date().getMonth()+1, day: new Date().getDate() } };
  "selectedQuality" : any = "";
  "selectedactualitem" : any = "";
  "agentId" : any = "";
   "poId" : string = "";
   "selectedAddItem" : any = "";
   "selectedAddQuality" : any = "";
   "conversiontype" : string = "LOOSE";
   "receivedQuantity" : any = "";
   "receivedRate" : any = "";
    "cfcon" : any = "";
	"SRStoreSelect" : any = "";
}