import { Component, OnInit, AfterViewInit } from '@angular/core';
import * as $ from 'jquery';

import { HttpTestService } from '../../../services/http.service';
import { sessionServices } from '../../../services/session.services';
import { Router } from '@angular/router';
import {Observable} from 'rxjs/Rx';
import {GridOptions} from "ag-grid/main";
import {griditembuttonMasterComponent} from "../../common/gridRowitembuttonMaster";
import {gridDeleteMasterComponent} from "../../common/gridRowDeleteMaster.component";
import { brokerCreateModel} from '../../../models/broker/brokerCreate.model';


@Component({
  selector: 'app-payroll',
  templateUrl: './broakerList.component.html'
})
export class broakerListComponent implements OnInit {
	public inputParameters: any = [];
	public conditionClicked : any = "";
	public brokerCreateModel: brokerCreateModel = new brokerCreateModel();
	public createbrokerResponsedata: any;
	public brokerListid:any=[];
	public brokerList:any =[];
	public brokercheckedList:any[]=[];
	public brokerSelected:boolean=false;
	public supplierList : any = [];
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
		{headerName: "S NO", field: "brokerId", minWidth : 150},
		{headerName: "NAME", field: "brokerName", minWidth : 250, editable : true, cellEditor : 'text'},
		{headerName: "ADDRESS", field: "address", minWidth : 150, editable : true, cellEditor : 'text'},
		// {headerName: "PHONE", field: "phone", minWidth : 150, editable : true, cellEditor : 'text'},
		{headerName: "EMAIL", field: "email", minWidth : 150, editable : true, cellEditor : 'text'},
		{headerName: "GST", field: "gst", minWidth : 150, editable : true, cellEditor : 'text'},
		{headerName: "PAN", field: "pan", minWidth : 150, editable : true, cellEditor : 'text'},
		{headerName: "SUPPLIERS", field: "suppliers", editable : true,minWidth : 250, maxWidth : 250, width : 250,cellRendererFramework:griditembuttonMasterComponent},
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
			if(self.brokerList != 'undefined'){
			   self.updateDeviation(params.node.id);
			   params.api.setRowData(self.brokerList);
			}
		};
		
}
ngOnInit() {
		this.getSession();
		this.getUserGroup();
		this.loadsupplierList();
		this.loadbrokerList();

	

		
}

openClaimCondition = function(params){
	var self = this;
	self.conditionClicked = params.node.id;
	var brokerId = self.brokerList[params.node.id].brokerId;
	console.log(self.brokerList);
	this.loadbrokerListid(brokerId);
	console.log(self.supplierList);


	
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

onbrokerCheckbox(option, event) { 
	if(event.target.checked) {
		this.brokercheckedList.push(option);
	  } else {
		for(var i=0 ; i < this.brokerList.length; i++) {
		  if(this.brokercheckedList[i] == option){
			this.brokercheckedList.splice(i,1);
		  }
		}
	  }
	  if (typeof this.brokercheckedList !== 'undefined' && this.brokercheckedList.length > 0) {
		this.brokerSelected = true;
	   } else{
		this.brokerSelected = false;
	   }
	  console.log(this.brokercheckedList);
}
onCheckboxChange = function(event) {
	
   this.brokerListid.suppliers.forEach(function(element) {
	   if(element.id == event.target.value) {
		//    element.isMapped = !element.isMapped.toString();
		if(element.isMapped == "true"){
			element.isMapped = "false";
		} else {
			element.isMapped = "true";
		}
		 
	   }
   
   });
   console.log(this.brokerListid.suppliers);
}
	

	
// load id data	
loadbrokerListid = function(brokerId){
	this.http.getidBrokermaster(brokerId)
.subscribe(
	(data) =>{
		this.brokerListid = data;
		console.log(data);
	},
	(error) => this.errorMsg = error,
	() => console.log("complete")

);
}

// load data
loadbrokerList(){
var self = this;
this.http.getAllMasterBroker()
		.subscribe(
		(data) => {
			self.brokerList = data;
		},
		(error) => self.errorMsg = error,
		() => console.log("completed")
	);
}





// load data
loadsupplierList = function(){
	this.http.getSupplier()
	.subscribe(
		(data) =>{
			this.supplierList = data;
			console.log(data);
			this.inputParameters = this.supplierList.filter(parameter => (parameter.suppTyp=="JUTE"));
			console.log(this.inputParameters);
		},
		(error) => this.errorMsg = error,
		() =>  console.log("completed")
	);

	
}

//create function
createBroker = function(){
	var self = this;
	self.errorMsg = "";
	self.successMsg = ""; 
	self.brokerCreateModel.suppliers = self.brokercheckedList;
	this.http.createBrokermaster(self.brokerCreateModel)
		.subscribe(
		(data) => {
			self.createsupplierResponsedata = data;
			self.loadbrokerList()
		},
		(error) => self.errorMsg = error,
		() => {
			self.successMsg = "Created Successfully.";
			self.brokerCreateModel.brokerId="";
			self.brokerCreateModel.address="";
			self.brokerCreateModel.brokerName="";
			self.brokerCreateModel.phone="";
			self.brokerCreateModel.email="";
			self.brokerCreateModel.gst="";
			self.brokerCreateModel.pan="";
			self.brokerCreateModel.suppliers= [];
			self.brokercheckedList=[];
			self.loadbrokerList();
			this.loadsupplierList();
			
		}
	);
	var newItem =self.brokerCreateModel;
	this.gridOptions.api.updateRowData({add: [newItem]});
	console.log("completed")
	
}


//load delete data
deleteItem = function(indexdId){
	var self = this;
	self.errorMsg = "";
	self.successMsg = ""; 
	this.gridOptions.api.setRowData(self.brokerList);
	var brokerId = self.brokerList[indexdId].brokerId
		this.http.deleteBrokermaster(brokerId)
		.subscribe(
		() => {
			
			self.loadbrokerList();
		},
		(error) => self.errorMsg = error,
		() => {
			self.successMsg = "Deleted Successfully.";
			self.loadbrokerList();
			
		}
	);
	
	
}

//edit data	
updateDeviation = function(index){
	var self = this;
	self.errorMsg = "";
	self.successMsg = ""; 
	self.brokerList[index].deviation = (self.brokerList[index].brokerName - self.brokerList[index].brokerName);
	self.brokerList[index].deviation = (self.brokerList[index].address - self.brokerList[index].address);
	self.brokerList[index].deviation = (self.brokerList[index].phone - self.brokerList[index].phone);
	self.brokerList[index].deviation = (self.brokerList[index].email - self.brokerList[index].email);
	self.brokerList[index].deviation = (self.brokerList[index].gst - self.brokerList[index].gst);
	self.brokerList[index].deviation = (self.brokerList[index].pan - self.brokerList[index].pan);
	self.http.editBrokermaster( self.brokerList[index] )
	.subscribe(
		(data) => {
			
			self.loadbrokerList();
		},
		(error) => self.errorMsg = error,
		() => {
			self.successMsg = "Updated Successfully.";
			self.loadbrokerList();
	
				
		}
	);
	var newItem =self.brokerCreateModel;
	this.gridOptions.api.updateRowData({add: [newItem]});
	}
	
	
//updateCondition function
updateCondition = function(index){
			var self = this;
			self.errorMsg = "";
			self.successMsg = ""; 
			self.conditionClicked = "";
			self.brokerCreateModel.suppliers = self.brokerListid.suppliers;
			self.brokerCreateModel.brokerId=self.brokerListid.brokerId;
			self.brokerCreateModel.address=self.brokerListid.address;
			self.brokerCreateModel.brokerName=self.brokerListid.brokerName;
			self.brokerCreateModel.phone=self.brokerListid.phone;
			self.brokerCreateModel.email=self.brokerListid.email;
			self.brokerCreateModel.fax=self.brokerListid.fax;
			self.brokerCreateModel.email=self.brokerListid.email;
			self.brokerCreateModel.gst=self.brokerListid.gst;
			self.brokerCreateModel.pan=self.brokerListid.pan;
			
		
			this.http.editBrokermaster(self.brokerCreateModel)
				.subscribe(
				(data) => {
					self.createsupplierResponsedata = data;
					self.loadbrokerList()
				},
				(error) => self.errorMsg = error,
				() => {
					self.successMsg = "Updated Successfully.",
					self.brokerCreateModel.suppliers= [];
					self.brokerCreateModel.brokerId ="";
					self.brokerCreateModel.address ="";
					self.brokerCreateModel.brokerName="";
					self.brokerCreateModel.phone ="";
					self.brokerCreateModel.email="";
					self.brokerCreateModel.gst ="";
					self.brokerCreateModel.pan ="";
					self.loadbrokerList();
					
				
					
				}
			);
			var newItem =self.brokerCreateModel;
			// this.gridOptions.api.updateRowData({add: [newItem]});
			console.log("completed")
			
	}

	
}
