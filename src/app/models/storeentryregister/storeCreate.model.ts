export class storeCreateModel {
    "inDate":"";
    "inTime":"";
    "hdrId":number;
    "dtlId":number;
    "challanNo": number;
    "driverName": string;
    "poNo": any[] = [];
    "polineitems": any[] = [];
    "remarks": string;
     "suppCode": string;
	 "chaalantype": string = "";
	  "supplierName": string;
	  "transporter": string;
	  "mukam" : any = "";
    "supplier": string;
     "vehicleNo": string;
    "updateBy": string;
	"po" : any;
	"selectedDept" : any = "";
	"selectrdGroup" : any = "";
	"selectrdItem" : any = "";
	"tareweight" : any = 0;
	"grossweight" : any = 0;
	"challanweight" : any = 0;
	"cnvtp" : string = "LOOSE";
	"vehicletype" : any = "";
	"selectedActualQuality" : any = "";
	"selectedQuality" : any = "";
	"reqquan" : any = "";
	"challandate"			: Object = { date: { year: new Date().getFullYear(), month: new Date().getMonth()+1, day: new Date().getDate() } };
	"createDate"			: Object = { date: { year: new Date().getFullYear(), month: new Date().getMonth()+1, day: new Date().getDate() } };
	"fromDaterange"			: Object = { date: { year: new Date().getFullYear(), month: new Date().getMonth(), day: new Date().getDate() } };
	"toDaterange"			: Object = { date: { year: new Date().getFullYear(), month: new Date().getMonth()+1, day: new Date().getDate() } };
    }
    export class polineitemsCreateModel{
        "dept": number;
        "hdrIdDtl": number;
        "dtlId":number;
        "itemId": string;
        "itemDesc": string;
        "reqQuantity":number;
        "actualQuantity":number;
        "unitId": string;
        "deptName":string;
        "quantity":number;
    }
    export class searchCreateModel{
        "fromDate":"";
        "toDate":"";
    
    }
    
    export class suppliermasterCreateModel{
        "id":string;
        "suppName":string;
    
    }
    