import { Component, OnInit, AfterViewInit } from '@angular/core';
import * as $ from 'jquery';

import { HttpTestService } from '../../../services/http.service';
import { sessionServices } from '../../../services/session.services';
import { Router } from '@angular/router';
import {Observable} from 'rxjs/Rx';
import {GridOptions} from "ag-grid/main";
import {griditembuttonMasterComponent} from "../../common/gridRowitembuttonMaster";
import {gridDeleteMasterComponent} from "../../common/gridRowDeleteMaster.component";
import { mukamCreateModel} from '../../../models/mukam/mukamCreate.model';

@Component({
  selector: 'app-payroll',
  templateUrl: './mukamList.component.html'
})
export class mukamListComponent implements OnInit {
	public conditionClicked : any = "";
	public itemofgroupList:any =[];
	public itemofgroupcheckedList:any[]=[];
	public itemofgroupSelected:boolean=false;
	public mukamList : any = [];
	public mukamListid:any=[];
	public mukamCreateModel: mukamCreateModel = new mukamCreateModel();
	public createItemgroupResponsedata: any;
	public gridOptions: GridOptions;
	public successMsg: string ;
	public errorMsg: string ;
	public existMsg: string ;
	public requestedURL : any;
	public userGroupData : any = '';
	public userMenuData : any = '';
	public userSelectionMenuData : any = [];
	public sessionData: any;
	public columnDef : any = [
		{headerName: "S NO", field: "id", minWidth : 250},
		{headerName: "MUKAM NAME", field: "mukamName", minWidth : 250, editable : true, cellEditor : 'text'},
		{headerName: "ITEM", field: "itemJuteCode",editable : true,minWidth : 150, maxWidth : 150, width : 150,cellRendererFramework:griditembuttonMasterComponent}, 
		{headerName: "DELETE", field: "id", minWidth : 80, maxWidth : 80, width : 80, cellRendererFramework: gridDeleteMasterComponent}
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
				if(self.mukamList != 'undefined'){
				   self.updateDeviation(params.node.id);
				   params.api.setRowData(self.mukamList);
				}
			};
			
}
ngOnInit() {
			this.getSession();
			this.getUserGroup();
			this.loadmukamList();
			this.loaditemofgroupList();
			
}

openClaimCondition = function(params){
	var self = this;
	self.conditionClicked = params.node.id;
	var id = self.mukamList[params.node.id].id;
	console.log(self.mukamList);
	this.loadmukamListid(id);
	console.log(self.itemofgroupList);


	
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

onitemofgroupCheckbox(option, event) { 
	if(event.target.checked) {
		this.itemofgroupcheckedList.push(option);
	  } else {
		for(var i=0 ; i < this.itemofgroupList.length; i++) {
		  if(this.itemofgroupcheckedList[i] == option){
			this.itemofgroupcheckedList.splice(i,1);
		  }
		}
	  }
	  if (typeof this.itemofgroupcheckedList !== 'undefined' && this.itemofgroupcheckedList.length > 0) {
		this.itemofgroupSelected = true;
	   } else{
		this.itemofgroupSelected = false;
	   }
	  console.log(this.itemofgroupcheckedList);
}
onCheckboxChange = function(event) {
	
   this.mukamListid.itemJuteCode.forEach(function(element) {
	   if(element.id == event.target.value) {
		//    element.isMapped = !element.isMapped.toString();
		if(element.isMapped == "true"){
			element.isMapped = "false";
		} else {
			element.isMapped = "true";
		}
		 
	   }
   
   });
   console.log(this.mukamListid.itemJuteCode);
}
	

//load itemofgroupList data
loaditemofgroupList = function(){
	this.http.getitemofgroupmaster()
	.subscribe(
		(data) =>{
			this.itemofgroupList = data;
			console.log(data);
		},
		(error) => this.errorMsg = error,
		() => console.log("complete")

	);
}
	
//load id data	
loadmukamListid = function(id){
		this.http.getidMukammaster(id)
	.subscribe(
		(data) =>{
			this.mukamListid = data;
			console.log(data);
		},
		(error) => this.errorMsg = error,
		() => console.log("complete")

	);
}
//load data
loadmukamList = function(){
	this.http.getMukammaster()
	.subscribe(
		(data) =>{
			this.mukamList = data;
			console.log(data);
		},
		(error) => this.errorMsg = error,
		() => console.log("complete")

	);
}

//create function
createMukammaster = function(){
	var self = this;
	self.errorMsg = "";
	self.successMsg = ""; 
	self.mukamCreateModel.itemJuteCode = self.itemofgroupcheckedList;

	this.http.createMukammaster(self.mukamCreateModel)
		.subscribe(
		(data) => {
			self.createmukamresponsedata = data;
			self.loadmukamList()
		},
		(error) => self.errorMsg = error,
		() => {
			self.successMsg = "Created Successfully.",
			self.mukamCreateModel.id="";
			self.mukamCreateModel.mukamName ="";
			self.mukamCreateModel.itemJuteCode= [];
			self.itemofgroupcheckedList=[];
			self.loadmukamList();
			this.loaditemofgroupList();

		}
	);
	var newItem =self.mukamCreateModel;
	this.gridOptions.api.updateRowData({add: [newItem]});
	console.log("completed")
	
}

//delete data	

deleteItem = function(indexdId){
	var self = this;
	self.errorMsg = "";
	self.successMsg = ""; 
	this.gridOptions.api.setRowData(self.mukamList);
	var id = self.mukamList[indexdId].id
		this.http.deleteMukammaster(id)
		.subscribe(
		() => {
			
			self.loadmukamList()
		},
		(error) => self.errorMsg = error,
		() => {
			self.successMsg = "Deleted Successfully."
			
		}
	);
	
	

}


//edit data	
updateDeviation = function(index){
var self = this;
self.errorMsg = "";
self.successMsg = ""; 
self.mukamList[index].deviation = (self.mukamList[index].mukamName - self.mukamList[index].mukamName);
self.http.editMukammaster( self.mukamList[index] )
.subscribe(
	(data) => {
		
		self.loadmukamList()
	},
	(error) => self.errorMsg = error,
	() => {
		self.successMsg = "Updated Successfully.";
		

			
	}
);
var newItem =self.mukamCreateModel;
this.gridOptions.api.updateRowData({add: [newItem]});
}


	//updateCondition function
	updateCondition = function(index){
		var self = this;
		self.errorMsg = "";
		self.successMsg = ""; 
		self.conditionClicked = "";
		self.mukamCreateModel.itemJuteCode = self.mukamListid.itemJuteCode;
		self.mukamCreateModel.id=self.mukamListid.id;
		self.mukamCreateModel.mukamName=self.mukamListid.mukamName;
	
		this.http.editMukammaster(self.mukamCreateModel)
			.subscribe(
			(data) => {
				self.createmukamresponsedata = data;
				self.loadmukamList();
			},
			(error) => self.errorMsg = error,
			() => {
				self.successMsg = "Updated Successfully.",
				self.mukamCreateModel.itemJuteCode= [];
				self.mukamCreateModel.id="";
				self.mukamCreateModel.mukamName="";
				self.loadmukamList();
				
			
				
			}
		);
		var newItem =self.mukamCreateModel;
		// this.gridOptions.api.updateRowData({add: [newItem]});
		console.log("completed")
		
}

	
}
