import { Component, OnInit, AfterViewInit } from '@angular/core';
import * as $ from 'jquery';

import { HttpTestService } from '../../../services/http.service';
import { sessionServices } from '../../../services/session.services';
import { Router } from '@angular/router';
import {Observable} from 'rxjs/Rx';
import {GridOptions} from "ag-grid/main";
import {IMyDpOptions} from 'mydatepicker';
import {juteCreateModel,polineitemsCreateModel,suppliermasterCreateModel} from '../../../models/juteentryregister/juteCreate.model';
import { error } from 'selenium-webdriver';




@Component({
  selector: 'app-payroll',
  templateUrl: './juteRegister.component.html'
})
export class juteRegisterComponent implements OnInit {


	public withOutButton:boolean=false;
	public withButton:boolean=false;

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

	public juteCreateModel: juteCreateModel = new juteCreateModel();
	public polineitemDetails: polineitemsCreateModel = new polineitemsCreateModel();
	public polineitemsCreateModel:polineitemsCreateModel[] = [];
	public juteResponsedata : any;

	public suppliermasterCreateModel: any = [];
	public juteEntrySupplierList:any = [];
	public myOptions:any = [];
	public supplierMasternameAddress:string="";
	public supplierMastername:any=[];
	public supplierMasternamesuppCode:string="";
	public posupplierBypono:any=[];
	public ponodetails:any=[];
	public polinedeetails:boolean=false;
	public check:boolean=false;
	public checktwo:boolean=false;
	public po:boolean=false;
	public Alljutequlity:any=[];
	public Allfinancialyear:any=[];
	public juteQuality:string;
	
	public approvedpoNumberList:any =[];
	public poNumberinput :boolean =true;
	public supplierByponumber :boolean =false;

	public withPoDiv:boolean = true;
	public withoutPoDiv:boolean = false;

	public withPomukam:boolean = true;
	public withoutPomukam:boolean = false;

	public itemofgroupList:any =[];
	public juteType:number;

	public allVehicles : any = [];
	public vehiclesById :any = [];
	public disableButton :boolean=false;
	public balesValue:number = 0;
	public looseValue:number = 100;

	public vehicleType:number;
	public poQuantity:number;

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
		// this.loadAlljutequlity();
		// this.loadSuppliermaster();
		this.loadJuteentrySupplier();
		this.loadAllFinancialyear();
		// this.loaditemofgroupList();
		this.getAllVehicles();

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
		this.http.getSearchJuteentry(fromDate.formatted,toDate.formatted)
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
//supplierbyPono
supplierbyPono=function(event){
	this.juteCreateModel.suppName="";
	this.juteCreateModel.mukam="";
	this.juteCreateModel.suppCode="";
	this.juteCreateModel.brokerAddress="";
	this.supplierMasternameAddress="";
	if(event.target.checked){
		this.poNumberinput = false;
		this.supplierByponumber = true;
		this.juteCreateModel.poNo ="";
		this.juteCreateModel.supplierName ="";
		this.juteCreateModel.suppCode ="";
		this.ponodetails=[];
		this.checktwo=true;
	}else{
		this.poNumberinput = true;
		this.supplierByponumber = false;
		this.juteCreateModel.poNo ="";
		this.juteCreateModel.supplierName ="";
		this.juteCreateModel.suppCode ="";
		this.ponodetails=[];
		this.checktwo=false;
	}
}

	loadData =function(event,poId){
		this.loadPosupplierbypono(event,poId);
		this.loadPONODATA(event,poId);
	}
	
	withoutPo =function(event){
		this.juteCreateModel.poNo ="";
		this.ponodetails = [];
		this.juteCreateModel.suppName="";
		this.juteCreateModel.mukam="";
		this.juteCreateModel.suppCode="";
		this.juteCreateModel.brokerAddress="";
		this.supplierMasternameAddress="";
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
			this.withPoDiv = false;
			this.withoutPoDiv = true;
			this.withPomukam = false;
			this.withoutPomukam = true;
			
		}else{
			this.po = false;
			this.polinedeetails=false;
			this.check=false;
			this.checktwo=false;
			this.poNumberinput = true;
			this.supplierByponumber = false;
			this.withPoDiv = true;
			this.withoutPoDiv = false;
			this.withPomukam = true;
			this.withoutPomukam = false;
			
		
	
		
		}
	}
// supplierMaster/getJuteSupplier

loadJuteentrySupplier = function(){
	var self = this;
	this.http.getJuteentrySupplier()

	.subscribe(
		(data) => {
			self.suppliermasterCreateModel = data;
			for(var i = 0; i<self.suppliermasterCreateModel.length; i++){
				
						var createObj = {
							value : self.suppliermasterCreateModel[i].suppCode,
							label : self.suppliermasterCreateModel[i].suppName,
						};
						self.myOptions.push(createObj);
					}
						console.log(self.myOptions);
		},
		(error) => self.errorMsg = error,
		() => console.log("complete")
		
	);

}

loadsuppNamePoData =function(event,suppCode){
	this.loadSuppliermastername(event,suppCode);
	this.loadapprovedsuppNamePonumber(event,suppCode);
}
// load  security/poheader/getapprovedpobysuppname
// load  security/poheader/getapprovedpobysuppname
loadapprovedsuppNamePonumber = function(event,suppCode){
	this.http.grtApprovedBySuppcode(suppCode)
	.subscribe(
		(data) =>{
			this.approvedpoNumberList = data;
			this.juteCreateModel.poNo = this.approvedpoNumberList.id;
			console.log(this.approvedpoNumberList.id)
		},
		(error) => this.errorMsg = error,
		() => console.log("complete")

	);
}
// load  suppliername data
loadSuppliermastername = function(event,suppCode){

	this.http.getBrokerAndSupplierCode(suppCode)
	.subscribe(
		(data) =>{
			this.supplierMastername = data;
			this.supplierMasternameAddress = this.supplierMastername.address1;
			// this.supplierMasternameMukam = data.mukam;
			this.supplierMasternamesuppCode = this.supplierMastername.suppName;
			this.juteCreateModel.mukam = this.supplierMastername.mukams.mukamName;
		
	
		},
		(error) => this.errorMsg = error,
		() => console.log("complete")

	);
	
}

//security/polineitem/getlineitembyponum
loadPONODATA = function(event,pono){
	this.ponodetails=[];
	if(pono){
		this.http.getJutelineitemBypono(pono)
		.subscribe(
			(data) =>{
				// this.ponoData = data;
				// console.log(data)
				data.forEach(elem => {
					// elem.actualQuality = "";
					elem.isPOAmment = "";
					elem.remarks = "";
					});
				this.ponodetails = data;
				console.log(data);
										
			}),
			(error) => this.errorMsg = error,
				() => console.log("complete")
		
			
		
	}

}

//security/poheader/getPoSupplierBbyPoNum

loadPosupplierbypono = function(event,id){
	this.posupplierBypono=[];
	this.juteCreateModel.brokerAddress="";
	this.juteCreateModel.suppName="";
	this.juteCreateModel.mukam="";
	this.juteCreateModel.suppCode="";
	// this.disable=true;
	this.http.getJutePosupplierBypono(id)
	.subscribe(
		(data) =>{
			this.posupplierBypono = data;
			this.juteCreateModel.brokerAddress = this.posupplierBypono.address1;
			this.juteCreateModel.suppCode = this.posupplierBypono.suppName;
			console.log(this.juteCreateModel.suppName);
			this.juteCreateModel.suppCode = this.posupplierBypono.suppCode;
			this.juteCreateModel.mukam = this.posupplierBypono.mukams.mukamName;
		
		
			
		},
		(error) => this.errorMsg = error,
		() => console.log("complete")

	);
	
}

addPolineItems = function(){
	
	var self = this;
	self.polineitemsCreateModel.push(self.polineitemDetails);
	self.polineitemDetails = new polineitemsCreateModel();
	self.juteType=0;
}

//load data
loadAlljutequlity = function(id){
	this.http.getAllQuality(id)
	.subscribe(
		(data) =>{
			this.Alljutequlity = data;
			console.log(data);
		},
		(error) => this.errorMsg = error,
		() => console.log("complete")

	);
}

//load data
loadAllFinancialyear = function(){
	this.http.getAllFinancialyear()
	.subscribe(
		(data) =>{
			this.Allfinancialyear = data;
			console.log(data);
		},
		(error) => this.errorMsg = error,
		() => console.log("complete")

	);
}

//load itemofgroupList data
loaditemofgroupList = function(mukam){
	this.http.getMukamByName(mukam)
	.subscribe(
		(data) =>{
			this.itemofgroupList = data;
			console.log(data);
		},
		(error) => this.errorMsg = error,
		() => console.log("complete")

	);
}

//get all vehicles
getAllVehicles = function(){
	this.http.getAllVehicles()
	  .subscribe(
		(data) => {
		  this.allVehicles = data;
		  },
		(error) => {
			this.errorMsg = error;
			this.allVehicles = "";
		},
		() => {}
	  );
}
loadVehicleById = function(event,id){
	this.polineitemsCreateModel = [];
		this.http.getVehicleById(id)
		.subscribe(
			(data) =>{
				this.vehiclesById = data;
				this.poQuantity = this.vehiclesById.weight;
				console.log(this.poQuantity);
				this.polineitemDetails.poConvertedQuantity =  Math.round((this.poQuantity)/1.5);
				console.log(this.polineitemDetails.poConvertedQuantity);
				this.balesValue = this.polineitemDetails.poConvertedQuantity;
				console.log(this.balesValue);
				
				},
			(error) => this.errorMsg = error,
			() => console.log("complete")
	
		);
		
}
onChangeUnitConversion = function(value){
	// this.polineitemDetails = [];
	// this.polineitemsCreateModel = [];

}
onChangeLoose = function(value){
	if(this.polineitemDetails.quantity <= this.looseValue){
		this.disableButton = false;
	}else{
			this.disableButton = true;
		}
}
onChangeBale = function(value){
	if(this.polineitemDetails.quantity <= this.balesValue){
			this.disableButton = false;
	}else{
		this.disableButton = true;
	}
	
}
addPolineItemsBale = function(){
	this.polineitemDetails.advisedQuantity = Math.round((this.polineitemDetails.quantity)*1.5)
	this.polineitemsCreateModel.push(Object.assign({},this.polineitemDetails));
	this.balesValue = this.balesValue - this.polineitemDetails.quantity;
	if(this.balesValue == 0){
		this.polineitemDetails = new polineitemsCreateModel();
	}else{
		this.polineitemDetails.quantity = 0;
		this.onChangeBale(this.polineitemDetails.quantity);
	}
	// this.polineitemDetails = new polineitemsCreateModel();
	this.juteType=0;
}

addPolineItemsLoose = function(){
	this.polineitemDetails.advisedQuantity = Math.round((this.polineitemDetails.quantity / 100)* this.poQuantity);
	this.polineitemsCreateModel.push(Object.assign({},this.polineitemDetails));
	this.looseValue = this.looseValue - this.polineitemDetails.quantity;
	if(this.looseValue == 0){
		this.polineitemDetails = new polineitemsCreateModel();
	}else{
		this.polineitemDetails.quantity = 0;
		this.onChangeLoose(this.polineitemDetails.quantity);
	}
	// this.polineitemDetails = new polineitemsCreateModel();
	this.juteType=0;
}


addNewLineItems = function(){

	this.polinedeetails = true;
	this.withOutButton = false;
	this.withButton = true;
}
//create function

createJuteEntry =function(){
	this.errorMsg="";
	this.successMsg="";
	this.ponodetails.forEach(poNOdetail => {
		console.log(poNOdetail);
		this.juteCreateModel.polineitem.push(poNOdetail);
		console.log(this.juteCreateModel);
		});
	this.polineitemsCreateModel.forEach(element => {
			this.juteCreateModel.polineitem.push(element);
				console.log(this.juteCreateModel);
		});	
	this.juteCreateModel.chalanDate = this.date.formatted;
	this.juteCreateModel.inDate = this.inDate.formatted;
	this.juteCreateModel.inTime = this.time;
	
	this.juteCreateModel.brokerAddress = this.supplierMasternameAddress;
	// this.juteCreateModel.suppCode = this.supplierMasternamesuppCode;
	this.http.createJuteentry(this.juteCreateModel)
	.subscribe(
		(res) =>{
			this.juteResponsedata = res.json();
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
			this.supplierMasternameAddress="";
			// this.supplierMasternamesuppCode = "";
			this.ponodetails=[];
			this.polineitemsCreateModel=[];
			this.polinedeetails = false;
			this.po = false;
			this.check = false;
			this.checktwo=false;
			this.disable = false;
			this.juteCreateModel = new juteCreateModel();
		}
	);
	
}

	
}
