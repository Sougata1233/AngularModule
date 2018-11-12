export class supplierCreateModel {

"id": string = "";
"suppName": string = "";
"suppTyp": string = "";
"address1": string = "";
"phone1": number;
"fax": number;
"email":string = "";
"cin": number;
"gstNo": number;
"panNo": string = "";
"country": string = "";
"state": string = "";
"district": string = "";
"pincode": number;
"isMapped":string = "";
"mukam":mukamCreateModel[] = [];

}

export class mukamCreateModel {
    "id":number;
    "mukamName":string = "";
    "isMapped":string = "";
}

 


