import { Component, OnInit, AfterViewInit } from '@angular/core';
import * as $ from 'jquery';

import { HttpTestService } from '../../../services/http.service';
import { sessionServices } from '../../../services/session.services';
import { Router } from '@angular/router';
import {Observable} from 'rxjs/Rx';
import {GridOptions} from "ag-grid/main";
import {gridRowsupplierbuttonMasterComponent} from "../../common/gridRowsupplierbuttonMaster";
import {gridDeleteMasterComponent} from "../../common/gridRowDeleteMaster.component";
import { supplierCreateModel} from '../../../models/supplier/supplierCreate.model';



@Component({
  selector: 'app-payroll',
  templateUrl: './createSupplier.component.html'
})
export class createSupplierComponent implements OnInit {
	public conditionClicked : any = "";
	public supplierCreateModel: supplierCreateModel = new supplierCreateModel();
	public createsupplierResponsedata: any;
	public supplierList : any = [];
	public supplierListid:any=[];
	public mukamList:any =[];
	public mukamcheckedList:any[]=[];
	public mukamSelected:boolean=false;
	public countryList : any = [];
	public stateList : any = [];
	public selectedCountryList: any = [];
	public enableGst:boolean=true;
	public enableDiv:boolean=false;
	public settings = {};
	public date : any;
	public gridOptions: GridOptions;
	public successMsg: string ;
	public errorMsg: string ;
	public requestedURL : any;
	public userGroupData : any = '';
	public userMenuData : any = '';
	public userSelectionMenuData : any = [];
	public sessionData: any;
	public columnDef : any = [
		{headerName: "CODE", field: "id", minWidth : 150, editable : true, cellEditor : 'text'},
		{headerName: "NAME", field: "suppName", minWidth : 250, editable : true, cellEditor : 'text'},
		{headerName: "TYPE", field: "suppTyp", minWidth : 250},
		{headerName: "GST NO", field: "gstNo", minWidth : 150, editable : true, cellEditor : 'text'},
		{headerName: "COUNTRY", field: "country", minWidth : 250},
		{headerName: "STATE", field: "state", minWidth : 150},
		{headerName: "PINCODE", field: "pincode", minWidth : 250, editable : true, cellEditor : 'text'},
		{headerName: "ADDRESS", field: "address1", minWidth : 250, editable : true, cellEditor : 'text'},
		{headerName: "PHONE", field: "phone1", minWidth : 250, editable : true, cellEditor : 'text'},
		{headerName: "FAX", field: "fax", minWidth : 150, editable : true, cellEditor : 'text'},
		{headerName: "E-mail", field: "email", minWidth : 250, editable : true, cellEditor : 'text'},
		{headerName: "CIN", field: "cin", minWidth : 250, editable : true, cellEditor : 'text'},
		{headerName: "PAN NO", field: "panNo", minWidth : 250, editable : true, cellEditor : 'text'},
		{headerName: "DISTRICT", field: "district", minWidth : 250, editable : true, cellEditor : 'text'},
		{headerName: "MUKAM", field: "mukam", editable : true,minWidth : 150, maxWidth : 150, width : 150,cellRendererFramework:gridRowsupplierbuttonMasterComponent},
		{headerName: "Delete", field: "id", minWidth : 80, maxWidth : 80, width : 80, cellRendererFramework: gridDeleteMasterComponent}
];

	 public onQuickFilterChanged($event) {
        this.gridOptions.api.setQuickFilter($event.target.value);
	}
	constructor(public http: HttpTestService, public router: Router, public session: sessionServices) { 
		var self = this;
		this.gridOptions = <GridOptions>{};
		this.gridOptions.columnDefs = this.columnDef;
		this.gridOptions.paginationPageSize = 5;
		this.gridOptions.domLayout = 'autoHeight';
		this.gridOptions.pagination = true;
		this.gridOptions.enableFilter = true;
		this.gridOptions.enableSorting = true;
		this.gridOptions.enableColResize = true;
		this.gridOptions.floatingFilter = true;
		this.gridOptions.suppressMovableColumns = true;
		this.gridOptions.rowHeight = 30;
		this.gridOptions.floatingFiltersHeight = 40;
		this.gridOptions.rowSelection = 'single';
		this.gridOptions.showToolPanel = false;
		this.gridOptions.onGridReady = function(params) {params.api.sizeColumnsToFit();};
		this.gridOptions.onRowClicked = function(params) {
			var clickedItem = $(params.event.target).attr("data-action-type");
			if(clickedItem == "addcondition"){self.openClaimCondition(params);}
			if(clickedItem == "closed"){self.closeConditionDialog(params.node.id);}
			if(clickedItem == "closed"){self.updateCondition(params.node.id);}
			if(clickedItem == "remove"){self.deleteItem(params.node.id);
				console.log('hi')
			}
		};
		this.gridOptions.onCellEditingStopped = function(params) {
			if(self.supplierList != 'undefined'){
			   self.updateDeviation(params.node.id);
			   params.api.setRowData(self.supplierList);
			}
		};
		
}
ngOnInit() {
		this.getSession();
		this.getUserGroup();
		this.loadsupplierList();
		this.loadcountryList();
		this.loadmukamList();
		
}

openClaimCondition = function(params){
	var self = this;
	self.conditionClicked = params.node.id;
	var id = self.supplierList[params.node.id].id;
	console.log(self.supplierList);
	this.loadsupplierListid(id);
	console.log(self.mukamList);


	
}
closeConditionDialog = function(params){
	var self = this;
	self.conditionClicked = "";
}

//get session details
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

ongstChange = function(value) {
	this.enableGst = (value !="u");
   }
   onmukamChange = function(value) {
	   this.enableDiv = (value == "J");
   }

onmukamCheckbox(option, event) { 
	if(event.target.checked) {
		this.mukamcheckedList.push(option);
	  } else {
		for(var i=0 ; i < this.mukamList.length; i++) {
		  if(this.mukamcheckedList[i] == option){
			this.mukamcheckedList.splice(i,1);
		  }
		}
	  }
	//   if (typeof this.mukamcheckedList !== 'undefined' && this.mukamcheckedList.length > 0) {
	// 	this.mukamSelected = true;
	//    } else{
	// 	this.mukamSelected = false;
	//    }
	  console.log(this.mukamcheckedList);
}
onCheckboxChange = function(event) {
	
   this.supplierListid.mukam.forEach(function(element) {
	   if(element.id == event.target.value) {
		//    element.isMapped = !element.isMapped.toString();
		if(element.isMapped == "true"){
			element.isMapped = "false";
		} else {
			element.isMapped = "true";
		}
		 
	   }
   
   });
   console.log(this.supplierListid.mukam);
}
	

//load country data
loadcountryList = function() {
	var self = this;
	
	this.http.getCountry()
		.subscribe(
		(data) => {
			self.countryList = data;
		},
		(error) => self.errorMsg = error,
		() => console.log("completed")
	);
	}
	
	//load state data
loadstateList = function(value) {
	
		this.stateList = [];
		console.log(this.stateList);
		this.selectedCountryList = this.countryList.filter(country => country.countryName == value);
		console.log(this.selectedCountryList[0]);
		this.selectedCountryList[0].state.forEach(state => this.stateList.push(state));
}

//load data
loadsupplierList = function(){
	this.http.getSupplier()
	.subscribe(
		(data) =>{
			this.supplierList = data;
		},
		(error) => this.errorMsg = error,
		() => console.log("complete")

	);
}

	
//load id data	
loadsupplierListid = function(id){
	this.http.getidSuppliermaster(id)
.subscribe(
	(data) =>{
		this.supplierListid = data;
		console.log(data);
	},
	(error) => this.errorMsg = error,
	() => console.log("complete")

);
}

//load data
loadmukamList(){

	var self = this;
	
	this.http.getMukammaster()
		.subscribe(
		(data) => {
			self.mukamList = data;
		},
		(error) => self.errorMsg = error,
		() => console.log("completed")
	);
}

//create function
createSupplier = function(){
	var self = this;
	self.errorMsg = "";
	self.successMsg = ""; 
	self.supplierCreateModel.mukam = self.mukamcheckedList;
	this.http.createSupplier(self.supplierCreateModel)
		.subscribe(
		(res) => {
			self.createsupplierResponsedata = res.json();
			self.loadsupplierList();
			if(res.status===208){
				self.errorMsg = "Already Exists.";
			}else{
				self.successMsg = "Created Successfully."; 
			}
		},
		(error) => self.errorMsg = error,
		() => {
			// self.successMsg = "Created Successfully.";
			self.supplierCreateModel.id="";
			self.supplierCreateModel.suppName="";
			self.supplierCreateModel.suppTyp="";
			self.supplierCreateModel.address1="";
			self.supplierCreateModel.phone1="";
			self.supplierCreateModel.fax="";
			self.supplierCreateModel.email="";
			self.supplierCreateModel.cin="";
			self.supplierCreateModel.gstNo="";
			self.supplierCreateModel.panNo="";
			self.supplierCreateModel.country="";
			self.supplierCreateModel.state="";
			self.supplierCreateModel.district="";
			self.supplierCreateModel.pincode="";
			self.supplierCreateModel.mukam= [];
			self.mukamcheckedList=[];
			self.loadsupplierList();
			self.loadmukamList();
		}
	);
	var newItem =self.supplierCreateModel;
	this.gridOptions.api.updateRowData({add: [newItem]});
	console.log("completed")
	
}


//load delete data
deleteItem = function(indexdId){
	var self = this;
	self.errorMsg = "";
	self.successMsg = ""; 
	this.gridOptions.api.setRowData(self.supplierList);
	var id = self.supplierList[indexdId].id
		this.http.deleteSupplier(id)
		.subscribe(
		() => {
			
			self.loadsupplierList();
		},
		(error) => self.errorMsg = error,
		() => {
			self.successMsg = "Deleted Successfully.";
			self.loadsupplierList()
			
		}
	);
	
	
}

//edit data	
updateDeviation = function(index){
	var self = this;
	self.errorMsg = "";
	self.successMsg = ""; 
	self.supplierList[index].deviation = (self.supplierList[index].suppName - self.supplierList[index].suppName);
	self.supplierList[index].deviation = (self.supplierList[index].address1 - self.supplierList[index].address1);
	self.supplierList[index].deviation = (self.supplierList[index].phone1 - self.supplierList[index].phone1);
	self.supplierList[index].deviation = (self.supplierList[index].fax - self.supplierList[index].fax);
	self.supplierList[index].deviation = (self.supplierList[index].email - self.supplierList[index].email);
	self.supplierList[index].deviation = (self.supplierList[index].gstNo - self.supplierList[index].gstNo);
	self.supplierList[index].deviation = (self.supplierList[index].district - self.supplierList[index].district);
	self.supplierList[index].deviation = (self.supplierList[index].pincode - self.supplierList[index].pincode);

	self.http.editSupplier( self.supplierList[index] )
	.subscribe(
		(data) => {
			
			self.loadsupplierList()
		},
		(error) => self.errorMsg = error,
		() => {
			self.successMsg = "Updated Successfully.";
			self.loadsupplierList()
			
	
				
		}
	);
	var newItem =self.supplierCreateModel;
	this.gridOptions.api.updateRowData({add: [newItem]});
	}
	
	
//updateCondition function
updateCondition = function(index){
			var self = this;
			self.errorMsg = "";
			self.successMsg = ""; 
			self.conditionClicked = "";
			self.supplierCreateModel.mukam = self.supplierListid.mukam;
			self.supplierCreateModel.id=self.supplierListid.id;
			self.supplierCreateModel.suppName=self.supplierListid.suppName;
			self.supplierCreateModel.suppTyp=self.supplierListid.suppTyp;
			self.supplierCreateModel.address1=self.supplierListid.address1;
			self.supplierCreateModel.phone1=self.supplierListid.phone1;
			self.supplierCreateModel.fax=self.supplierListid.fax;
			self.supplierCreateModel.email=self.supplierListid.email;
			self.supplierCreateModel.cin=self.supplierListid.cin;
			self.supplierCreateModel.gstNo=self.supplierListid.gstNo;
			self.supplierCreateModel.panNo=self.supplierListid.panNo;
			self.supplierCreateModel.country=self.supplierListid.country;
			self.supplierCreateModel.state=self.supplierListid.state;
			self.supplierCreateModel.district=self.supplierListid.district;
			self.supplierCreateModel.pincode=self.supplierListid.pincode;
		
			this.http.editSupplier(self.supplierCreateModel)
				.subscribe(
				(data) => {
					self.createsupplierResponsedata = data;
					self.loadsupplierList()
				},
				(error) => self.errorMsg = error,
				() => {
					self.successMsg = "Updated Successfully.",
					self.supplierCreateModel.mukam= [];
					self.supplierCreateModel.id ="";
					self.supplierCreateModel.suppName ="";
					self.supplierCreateModel.suppTyp="";
					self.supplierCreateModel.address1 ="";
					self.supplierCreateModel.phone1="";
					self.supplierCreateModel.fax ="";
					self.supplierCreateModel.email ="";
					self.supplierCreateModel.cin ="";
					self.supplierCreateModel.gstNo ="";
					self.supplierCreateModel.panNo ="";
					self.supplierCreateModel.country ="";
					self.supplierCreateModel.state ="";
					self.supplierCreateModel.district ="";
					self.supplierCreateModel.pincode ="";
					self.loadsupplierList()
					
				
					
				}
			);
			var newItem =self.supplierCreateModel;
			// this.gridOptions.api.updateRowData({add: [newItem]});
			console.log("completed")
			
	}


	
	
}
