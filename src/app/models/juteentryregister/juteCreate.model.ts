export class juteCreateModel {
    "inDate":"";
    "inTime":"";
    "challanWeight":number;
    "hdrId":number;
    "dtlId":number;
    "chalanNo":number;
    "chalanDate":"";
    "poNo":string;
    "polineitem":polineitemsCreateModel[] = [];
    "brokerName":string;
    "brokerAddress":string;
    "mukam":string;
    "finYear":string;
    "transporter":string;
    "vehicleNo":string;
    "driverName":string;
    "netWeight":number;
    "grossWeight":number;
    "actualWeight":number;
    "suppCode":string;
    "suppName":string;
    "supplierName": string;
    // "suppCode": string;
    "suppAddress": string;
    }
    export class polineitemsCreateModel{
     "hdrIdDtl": number;
     "actualJuteTyp":string;
     "actualQuality":string;
     "actualQuantity":number;
     "advisedJuteTyp":string;
     "advisedQuality":string;
     "advisedQuantity":string;
     "itemCode":string;
     "kgs":number;
     "openClose":string;
     "polineitemnum":number;
     "quantity":number;
     "receivedIn":string;
     "remarks":string;
     "uom":string;
     "isPOAmment":string;
     "vehicleType":number;
     "poQuantity":number;
    }
    export class suppliermasterCreateModel{
        "id":string;
        "suppName":string;
    
    }
    export class mukamCreateModel{
        "id":number;
        "mukamName":string;
        "isMapped":string;
    
    }

    
    
    
    
     
    
    
    