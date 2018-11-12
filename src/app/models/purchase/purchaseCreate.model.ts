export class purchaseCreateModel {
  "selectedPOType"		: string = "";
  "discounthdr"			: number = 0;
  "flightcharge"		: number = 0;
  "selectedSupplier"	: string = "";
  "purchaseAddress"		: string = "";
  "selectedItemGroup"	: string = "";
  "selectedItem"		: string = "";
  "selectedIndent"		: string = "";
  "selectedDepartment"	: string = "";
  "editedPrice"			: number = 0;
  "quantity"			: number = 1;
  "unit"				: string = "";
  "quality"				: string = "";
  "marka"				: string = "";
  "mukam"				: string = "";
  "totVal"				: number = 0;
  "rejectionReason"		: string = "";
  "creditTerm"			: number = 1;
  "deliveryTime"		: string = "";
  "reasonComment"	 	: string = "";
  "juteType"			: string = "LOOSE";
  "selectedSup"			: string = "INPC0";
  "createDate"			: Object = { date: { year: new Date().getFullYear(), month: new Date().getMonth()+1, day: new Date().getDate() } };
  "searchInput"			: string = "";
  "mrsupplier"			: string = "";
  "mrmukam"				: string = "";
  "mrpoindent"			: string = "";
  "selectedmrItem"		: string = "";
  "vehicleType"			: string = "";
  "vehicleQuantity"		: number = 1;
  "conversiontype"		: string = "LOOSE";
  "selectedQuality"		: string = "";
  "mrIndent"			: string = "";
  "poQuantity"			: number = 0;
  "brkr"			: any = "";
  
 }