export class itemgroupCreateModel {
    "id":string = "";
    "grpDsc": string = "";
    "inactiveTag": string = "";
    "activeFlag": string = "";
    "department":departmentCreateModel[] = [];
    
     }
export class departmentCreateModel {
        "id":number;
        "deptName":string = "";
        "isMapped": string = "";
 }
    
    
    
    