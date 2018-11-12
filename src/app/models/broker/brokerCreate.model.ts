export class brokerCreateModel {

"brokerId": number;
"address": string = "";
"brokerName": string = "";
"phone": number;
"email":string = "";
"gst": number;
"pan": string = "";
"isMapped":string = "";
"suppliers":suppliersCreateModel[] = [];

}

export class suppliersCreateModel {
    "id":number;
    "suppName":string = "";
    "isMapped":string = "";
}

 


