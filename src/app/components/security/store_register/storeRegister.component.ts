import { Component, OnInit, AfterViewInit } from '@angular/core';
import * as $ from 'jquery';

import { HttpTestService } from '../../../services/http.service';
import { sessionServices } from '../../../services/session.services';
import { Router } from '@angular/router';
import {Observable} from 'rxjs/Rx';
import {IMyDpOptions} from 'mydatepicker';
import { storeCreateModel,polineitemsCreateModel,suppliermasterCreateModel} from '../../../models/storeentryregister/storeCreate.model';
import { error } from 'selenium-webdriver';




@Component({
  selector: 'app-payroll',
  templateUrl: './storeRegister.component.html'
})
export class storeRegisterComponent implements OnInit {

	public withOutButton:boolean=false;
	public withButton:boolean=false;
	public map = new Object();
	public inputPoId :string = "";
	public poItems = [];
	public selectedIds = [];
	public ponodata = {};
	public ponoIds = [];
	public polineItems :boolean =false;
	public time : string ;
	public currentDate = new Date();
	public day = this.currentDate.getDate();
	public month = this.currentDate.getMonth() + 1;
	public year = this.currentDate.getFullYear();
	public myDatePickerOptions: IMyDpOptions = {
        // other options...
		dateFormat: 'yyyy-mm-dd'
	};
	public disable:boolean=false;
	public inDate: Object = { date: { year: new Date().getFullYear(), month: new Date().getMonth()+1, day: new Date().getDate() },formatted : new Date().getFullYear() + "-" + (new Date().getMonth()+1) + "-" + new Date().getDate() };
	public date: Object = { date: { year: new Date().getFullYear(), month: new Date().getMonth()+1, day: new Date().getDate() },formatted : new Date().getFullYear() + "-" + (new Date().getMonth()+1) + "-" + new Date().getDate() };
	public fromDate: Object = { date: { year: new Date().getFullYear(), month: new Date().getMonth()+1, day: new Date().getDate() },formatted : new Date().getFullYear() + "-" + (new Date().getMonth()+1) + "-" + new Date().getDate()};
	public toDate:Object = { date: { year: new Date().getFullYear(), month: new Date().getMonth()+1, day: new Date().getDate() },formatted : new Date().getFullYear() + "-" + (new Date().getMonth()+1) + "-" + new Date().getDate()};
	public storeCreateModel: storeCreateModel = new storeCreateModel();
	public polineitemDetails: polineitemsCreateModel = new polineitemsCreateModel();
	public polineitemsCreateModel:polineitemsCreateModel[] = [];
	public storeResponsedata : any;
	public myOptions:any = [];
	public myOptionstwo:any = [];
	public approvedpoNumberList:any =[];
	public supplierMastercode: any=[];
	public supplierMastername:any=[];
	public posupplierBypono:any=[];
	public ponodetails:any=[];
	public ponoallData:any=[];
	public uomList : any = [];
	public departmentsList:any=[];
	public itmgrpByDeptList:any=[];
	public ItemDescByGrpIdList:any=[];
	public itemId:string;
	public check:boolean=false;
	public checktwo:boolean=false;
	public po:boolean=false;
	public polinedeetails:boolean=false;
	public poNumberinput :boolean =true;
	public supplierByponumber :boolean =false;
	public settings = {};
	public successMsg: string ;
	public errorMsg: string ;
	public requestedURL : any;
	public userGroupData : any = '';
	public userMenuData : any = '';
	public userSelectionMenuData : any = [];
	public sessionData: any;
	constructor(private http: HttpTestService, private router: Router, private session: sessionServices,) {}
ngOnInit() {
		this.getSession();
		this.getUserGroup();
		this.startTime();
		this.startDate();
		this.loadSuppliermaster();
		this.loadPoallno();
		this.loaduomList();
		this.loadDepartments();
	
}

getSession = function(){
	this.sessionData = this.session.getSessionDetails();
}
//get menu items by user group
getMenuItemsByUserGroup = function(){ 
	var self = this;
	self.http.getSubMenuByUserGroup(self.userGroupData[0].userGroup.id)
		.subscribe(
			(data) => {
				this.userMenuData = data;
			},
			(error) => {
				this.errorMsg = error
			},
			() => {
				for(var i = 0; i < this.userMenuData.length; i++){
					if(this.userMenuData[i].menuItem.menuName == 'Purchase'){
						self.userSelectionMenuData.push(this.userMenuData[i]);
					}
					
				}
			}
		);
	
}

//get user group details
getUserGroup = function(){
	this.http.getUserGroupById(this.sessionData.sessionId)
	  .subscribe(
		(data) => {
		  this.userGroupData = data;
		  },
		(error) => {
			this.errorMsg = error;
			this.userGroupData = "";
		},
		() => this.getMenuItemsByUserGroup()
	  );
}

//routing based on 
routeSelection(e){
  var self = this;
  var requestedId = e.target.value;
  
  this.http.getRouteURL(requestedId)
		.subscribe(
		(data) => {
			self.requestedURL = data;
		},
		(error) => {self.errorMsg = error},
		() => {
			self.router.navigate([self.requestedURL.url]);
		}
	);
}
//curent time
startTime = function(){
	var today = new Date();
	let h = today.getHours();
	let m = today.getMinutes();
	let s = today.getSeconds();
	m = this.checkTime(m);
	s = this.checkTime(s);
	this.time = h + ':' + m + ':' + s
	setTimeout(() => {
	  this.startTime();
	}, 500);
  }
 
 checkTime = function(i) {
    if (i < 10) {i = "0" + i};  
    return i;
}
//curent date
startDate = function(){
this.currentDate= this.day + "/" + this.month + "/" + this.year;
}

//search date
search = function(event,fromDate,toDate){
	console.log(fromDate);
	console.log(toDate);
		this.http.getSearchstore(fromDate.formatted,toDate.formatted)
		.subscribe(
			(data) =>{
				this.searchList = data;
				this.http.setSearchDate(this.searchList);
				console.log(data);
			},
			(error) => this.errorMsg = error,
			() => console.log("complete")
	
		);
}
//withoutPo date
withoutPo =function(event){
	this.storeCreateModel.supplierName="";
	this.storeCreateModel.suppCode = "";
	this.inputPoId = "";
	this.selectedIds=[];
	this.ponodata = {};
	this.ponoIds = [];
	this.storeCreateModel.poNo =[];
	this.ponodetails = [];
	this.checktwo=false;
	// this.po = false;
	// this.polineitemDetails = new polineitemsCreateModel();
	// this.polineitemsCreateModel= new polineitemsCreateModel();
	this.polineitemDetails = new polineitemsCreateModel();
	this.polineitemsCreateModel = [];
	if(event.target.checked) {
		this.po = true;
		this.polinedeetails=true;
		this.check=true;
		this.checktwo=false;
		this.poNumberinput = true;
		this.supplierByponumber = false;
		this.withOutButton = true;
		this.withButton = false;
	}else{
		this.po = false;
		this.polinedeetails=false;
		this.check=false;
		this.checktwo=false;
		this.poNumberinput = true;
		this.supplierByponumber = false;
		this.withOutButton = false;
		this.withButton = true;

	}
}
//supplierbyPono
supplierbyPono=function(event){
	if(event.target.checked){
		this.approvedpoNumberList=[];
		this.selectedIds=[];
		this.ponodata = {};
		this.ponoIds = [];
		this.poNumberinput = false;
		this.supplierByponumber = true;
		this.storeCreateModel.poNo =[];
		this.storeCreateModel.supplierName ="";
		this.storeCreateModel.suppCode ="";
		this.ponodetails=[];
		this.checktwo=true;
		
	}else{
		this.selectedIds = [];
		this.ponodata = {};
		this.ponoIds = [];
		this.poNumberinput = true;
		this.supplierByponumber = false;
		this.storeCreateModel.poNo =[];
		this.storeCreateModel.supplierName ="";
		this.storeCreateModel.suppCode ="";
		this.ponodetails=[];
		this.checktwo=false;
	}
}
//security/supplierMaster/getStoreSupplier
loadSuppliermaster = function() {
	var self = this;
	
	this.http.supplierMAsterdata()
		.subscribe(
		(data) => {
			self.suppliermasterCreateModel = data;
			for(var i = 0; i<self.suppliermasterCreateModel.length; i++){
				
						var createObj = {
							value : self.suppliermasterCreateModel[i].suppName,
							label : self.suppliermasterCreateModel[i].suppName,
						};
						self.myOptions.push(createObj);
						
					
						var createObjteo = {
							value : self.suppliermasterCreateModel[i].suppCode,
							label : self.suppliermasterCreateModel[i].suppCode,
						};
						self.myOptionstwo.push(createObjteo);
					}
					console.log(self.myOptions);
		},
		(error) => self.errorMsg = error,
		() => console.log("complete")
		
	);
}
// load  security/supplierMaster/getSupplierBySuppCode and 
// load  security/poheader/getapprovedpobysuppcode

loadpoData =function(event,suppCode){
	this.loadSuppliermastercode(event,suppCode);
	this.loadapprovedPonumber(event,suppCode);
}
// load  security/poheader/getapprovedpobysuppcode
loadapprovedPonumber = function(event,suppCode){
	this.http.grtApprovedBySuppcode(suppCode)
	.subscribe(
		(data) =>{
			this.approvedpoNumberList = data;
			this.storeCreateModel.poNo = this.approvedpoNumberList.id;
			console.log(this.approvedpoNumberList.id)
		},
		(error) => this.errorMsg = error,
		() => console.log("complete")

	);
}
// load  security/supplierMaster/getSupplierBySuppCode
loadSuppliermastercode = function(event,suppCode){
	this.supplierMastercode=[];
	this.myOptionsid=[];
	this.http.getSupplierid(suppCode)
	.subscribe(
		(data) =>{
			this.supplierMastercode = data;
			this.storeCreateModel.supplierName = this.supplierMastercode.suppName;
		},
		(error) => this.errorMsg = error,
		() => console.log("complete")

	);
}
// load security/supplierMaster/getSupplierBySuppName and 
// load  security/poheader/getapprovedpobysuppname

loadsuppNamePoData =function(event,suppName){
	this.loadSuppliermastername(event,suppName);
	this.loadapprovedsuppNamePonumber(event,suppName);
}
// load  security/poheader/getapprovedpobysuppname
loadapprovedsuppNamePonumber = function(event,suppName){
	this.http.grtApprovedBySuppname(suppName)
	.subscribe(
		(data) =>{
			this.approvedpoNumberList = data;
			this.storeCreateModel.poNo = this.approvedpoNumberList.id;
			console.log(this.approvedpoNumberList.id)
		},
		(error) => this.errorMsg = error,
		() => console.log("complete")

	);
}

// load  security/supplierMaster/getSupplierBySuppName
loadSuppliermastername = function(event,suppName){
	this.supplierMastername=[];
	this.myOptionssuppName=[];
	this.http.getSuppliername(suppName)
	.subscribe(
		(data) =>{
			this.supplierMastername = data;
			this.storeCreateModel.suppCode = this.supplierMastername.suppCode;
		},
		(error) => this.errorMsg = error,
		() => console.log("complete")

	);
	
}

// load  security/poheader/getPoSupplierBbyPoNum and 
// load  security/polineitem/getlineitembyponum
loadData =function(event,poId,input){
	if(input){
		this.loadPosupplierbypono(event,poId);
		this.loadPONODATA(event,poId);
		this.selectedIds=[];
		this.ponodata = {};
		this.ponoIds = [];
	}else if(event.target.checked){
		this.selectedIds.push(event.target.value);
		// this.loadPosupplierbypono(event,poId);
		delete this.ponodata[event.target.value];
		this.ponoIds = this.ponoIds.filter(el => el!=event.target.value);
		this.loadPONODATA(event,poId);

	}else{
		var index = this.selectedIds.indexOf(event.target.value);
		this.selectedIds.splice(index,1);
		// this.posupplierBypono=[];
		delete this.ponodata[event.target.value];
		this.ponoIds = this.ponoIds.filter(el => el!=event.target.value);
	}

}




// onbrokerCheckbox(poId, event) { 
// 	if(event.target.checked) {
// 		this.loadPosupplierbypono(event,poId);
// 		this.loadPONODATA(event,poId);
// 	  }
// }
// load  security/poheader/getPoSupplierBbyPoNum
loadPosupplierbypono = function(event,id){
	this.posupplierBypono=[];
	this.disable=true;
	this.http.getStorePosupplierBypono(event.target.value)
	.subscribe(
		(data) =>{
			this.posupplierBypono = data;
			this.storeCreateModel.suppCode = this.posupplierBypono.suppCode;
			this.storeCreateModel.supplierName = this.posupplierBypono.suppName;
		},
		(error) => this.errorMsg = error,
		() => console.log("complete")
	);
}

// load  security/polineitem/getlineitembyponum
loadPONODATA = function(event,poId){
	this.ponodetails=[];
	if(event.target.value){
		this.http.getPno(event.target.value)
		.subscribe(
			(data:any) =>{
				// data.forEach(elem => {
				// 	// elem.reqQuantity = "";
				// 	elem.dept = "";
				// 	});
				if(data.length > 0){
					this.ponodata = {...this.ponodata, [data[0].poId]:data };
					this.ponoIds.push(data[0].poId);
				}
				// this.ponodetails = data;
				console.log(data);
			}),
			(error) => this.errorMsg = error,
				() => console.log("complete")
	}
}

// load  security/polineitem/getalllineitem
loadPoallno = function(){
		this.http.getPallno()
		.subscribe(
			(data) =>{
				this.ponoallData = data;
			},
			(error) => this.errorMsg = error,
			() => console.log("complete")
		);
	}




//load security/uommaster/getuomcode
loaduomList = function(){
	this.http.getUomall()
	.subscribe(
		(data) =>{
			this.uomList = data;
			console.log(data);
		},
		(error) => this.errorMsg = error,
		() => console.log("complete")

	);
}





loadDepartments = function(){

	this.itemDescitemId="";
	this.http.getAllDepartments()
	.subscribe(
		(data) =>{
			this.departmentsList = data;
			
			this.departmentsList.forEach(dept => {
				this.map[dept.id]=dept.name;
				})
			console.log(data);
		},
		(error) => this.errorMsg = error,
		() => console.log("complete")

	);
}


//l

loadItmgrpByDept= function(value){
	this.ItemDescByGrpIdList=[];
	this.http.getItmgrpByDept(value)
	.subscribe(
		(data) =>{
			this.itmgrpByDeptList = data;
			console.log(data);
		},
		(error) => this.errorMsg = error,
		() => console.log("complete")

	);
}
loadItemDescByGrpId= function(value){
	this.http.getItemDescByGrpId(value)
	.subscribe(
		(data) =>{
			this.ItemDescByGrpIdList = data;
			console.log(data);
		},
		(error) => this.errorMsg = error,
		() => console.log("complete")

	);
}



addNewLineItems = function(){

	this.polinedeetails = true;
	this.withOutButton = false;
	this.withButton = true;
}

addwithPolineItems = function(inputPoId){
	var self = this;
	self.itemDescitemId="";
	self.polineitemDetails.quantity = self.polineitemDetails.reqQuantity;
	
	self.ponodata[inputPoId].push(self.polineitemDetails);
	console.log(self.ponodata[self.ponoIds]);
	self.polineitemDetails = new polineitemsCreateModel();
}


//additems
addPolineItems = function(){
	
	var self = this;
	self.itemDescitemId="";
	// self.polineitemDetails.dept = self.departmentsList.name;
	self.polineitemDetails.deptName = self.map[self.polineitemDetails.dept];
	console.log(self.polineitemDetails.deptName);
 	self.polineitemsCreateModel.push(self.polineitemDetails);
	self.polineitemDetails = new polineitemsCreateModel();
}
//create function
createStore =function(){
	this.errorMsg="";
	this.successMsg="";

	if(this.selectedIds.length != 0){
		this.storeCreateModel.poNo = this.selectedIds;
	}else if(this.inputPoId != ""){
		this.storeCreateModel.poNo.push(this.inputPoId)	;
	}else{
		this.storeCreateModel.poNo = [];
	}
	
	this.polineitemsCreateModel.forEach(element => {
		console.log(element);
		this.poItems.push(element);
	// this.storeCreateModel.polineitems.push(element);
		// console.log(this.storeCreateModel);
	});
	var poItem = {'polineitems':this.poItems};
	
	for(var i=0; i < this.ponoIds.length;i++) {
		console.log(this.ponoIds[i]);
		var poData = this.ponodata[this.ponoIds[i]];
		var map = {'polineitems':poData};
		
		this.ponodetails.push(map);
	  }
	  console.log(this.ponodetails);
	  if(this.ponodetails.length != 0){
		this.storeCreateModel.polineitems = this.ponodetails;
	  }else{
		this.storeCreateModel.polineitems.push(poItem);
	  }
	 

		this.storeCreateModel.challanDate = this.date.formatted;
		this.storeCreateModel.inDate = this.inDate.formatted;
		this.storeCreateModel.inTime = this.time;
	this.http.createStoreentry(this.storeCreateModel)
	.subscribe(
		(res) =>{
			this.storeResponsedata = res.json();
			if(res.status===208){
				this.errorMsg = "Already Exists.";
			}else{
				this.successMsg = "Created Successfully."; 
			}
		},
		(error) => this.errorMsg = error,
		() =>{
			// this.successMsg = "Created Successfully";
			// this.date = "";
			this.approvedpoNumberList=[];
			this.selectedIds=[];
			this.ponodata = {};
			this.ponoIds = [];
			this.inputPoId = "";
			this.ponodetails=[];
			this.polineitemsCreateModel=[];
			this.polinedeetails = false;
			this.po = false;
			this.check = false;
			this.disable = false;
			this.storeCreateModel = new storeCreateModel();
		}
	);
	var newItem =this.storeCreateModel;
}




	
}
