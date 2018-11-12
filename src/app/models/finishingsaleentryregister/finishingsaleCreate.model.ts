export class finishingsaleCreateModel {
 "hdrId":number;
"challanNo":string;
"challanDate": "";
"vehicleNo": string;
"driverName": string;
"transporter":string;
"whomToDispatch":string;
"grossWeight":number;
"netWeight":number;
"actualWeight":number;
"finishdtls": finishingsaledetailsCreateModel[] = [];

}
export class finishingsaledetailsCreateModel{
    "quality": string;
    "qualityDesc": string;
    "quantity": number;
    "unitId": string;
}




 


