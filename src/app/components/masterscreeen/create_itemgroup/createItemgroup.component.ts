import { Component, OnInit, AfterViewInit } from '@angular/core';
import * as $ from 'jquery';

import { HttpTestService } from '../../../services/http.service';
import { sessionServices } from '../../../services/session.services';
import { Router } from '@angular/router';
import {Observable} from 'rxjs/Rx';
import {GridOptions} from "ag-grid/main";
import { griditembuttonMasterComponent} from "../../common/gridRowitembuttonMaster";
import {gridDeleteMasterComponent} from "../../common/gridRowDeleteMaster.component";
import { itemgroupCreateModel } from '../../../models/itemgroup/itemgroupCreate.model';


@Component({
  selector: 'app-payroll',
  templateUrl: './createItemgroup.component.html'
})
export class createItemgroupComponent implements OnInit {
	public conditionClicked : any = "";
	public departmentList:any =[];
	public departmentcheckedList:any[]=[];
	public departmentSelected:boolean=false;
	public itemgroupList : any = [];
	public itemgroupListid:any=[];
	public itemgroupCreateModel: itemgroupCreateModel = new itemgroupCreateModel();
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
		{headerName: "GROUP CODE", field: "id",  minWidth : 120, maxWidth : 120, width : 120,},
		{headerName: "DESCRIPTION", field: "grpDsc", minWidth : 250, editable : true, cellEditor : 'text'},
		{headerName: "DEPARTMENT", field: "department", editable : true, minWidth : 120, maxWidth : 120, width : 120,cellRendererFramework:griditembuttonMasterComponent}, 
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
				if(self.itemgroupList != 'undefined'){
				   self.updateDeviation(params.node.id);
				   params.api.setRowData(self.itemgroupList);
				}
			};
			
}
ngOnInit() {
			this.getSession();
			this.getUserGroup();
			this.loaditemgroupList();
			this.loaddepartmentList();
			
}

openClaimCondition = function(params){
	var self = this;
	self.conditionClicked = params.node.id;
	var id = self.itemgroupList[params.node.id].id;
	console.log(self.itemgroupList);
	this.loaditemgroupListid(id);
	console.log(self.departmentList);


	
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

ondepartmentCheckbox(option, event) { 
	if(event.target.checked) {
		this.departmentcheckedList.push(option);
	  } else {
		for(var i=0 ; i < this.departmentList.length; i++) {
		  if(this.departmentcheckedList[i] == option){
			this.departmentcheckedList.splice(i,1);
		  }
		}
	  }
	  if (typeof this.departmentcheckedList !== 'undefined' && this.departmentcheckedList.length > 0) {
		this.departmentSelected = true;
	   } else{
		this.departmentSelected = false;
	   }
	  console.log(this.departmentcheckedList);
}
onCheckboxChange = function(event) {
	
   this.itemgroupListid.department.forEach(function(element) {
	   if(element.id == event.target.value) {
		//    element.isMapped = !element.isMapped.toString();
		if(element.isMapped == "true"){
			element.isMapped = "false";
		} else {
			element.isMapped = "true";
		}
		 
	   }
   
   });
   console.log(this.itemgroupListid.department);
}
	
// load department data
		loaddepartmentList = function(){
			this.http.getDepartmentmaster()
			.subscribe(
				(data) =>{
					this.departmentList = data;
					console.log(data);
				},
				(error) => this.errorMsg = error,
				() => console.log("complete")
	
			);
		}
	
		loaditemgroupListid = function(id){
			// var id = this.mukamList[indexdId].id
			this.http.getidItemgroupmaster(id)
			.subscribe(
				(data) =>{
					this.itemgroupListid = data;
					console.log(data);
				},
				(error) => this.errorMsg = error,
				() => console.log("complete")
	
			);
		}
	
//load data
loaditemgroupList = function(){
		this.http.getItemgroupmaster()
		.subscribe(
			(data) =>{
				this.itemgroupList = data;
				console.log(data);
			},
			(error) => this.errorMsg = error,
			() => console.log("complete")

		);
}
//create function
createItemgroupmaster = function(){
	var self = this;
	self.errorMsg = "";
	self.successMsg = ""; 
	self.itemgroupCreateModel.department = self.departmentcheckedList;
	this.http.createItemgroupmaster(self.itemgroupCreateModel)
		.subscribe(
		(res) => {
			self.createItemgroupResponsedata = res.json();
			self.loaditemgroupList();
			if(res.status===208){
				self.errorMsg = "Already Exists.";
			}else{
				self.successMsg = "Created Successfully."; 
			}
		},
		(error) => self.errorMsg = error,
		() => {

			self.itemgroupCreateModel.id="";
			self.itemgroupCreateModel.grpDsc="";
			self.itemgroupCreateModel.department= [];
			self.departmentcheckedList=[];
			self.loaditemgroupList();
			this.loaddepartmentList();
			
		},
		
	);
	var newItem =self.itemgroupCreateModel;
	this.gridOptions.api.updateRowData({add: [newItem]});
	console.log("completed")
	
}

//load delete data
deleteItem = function(indexdId){
			var self = this;
			self.errorMsg = "";
			self.successMsg = ""; 
			this.gridOptions.api.setRowData(self.itemgroupList);
			var id = self.itemgroupList[indexdId].id
				this.http.deleteItemgroupmaster(id)
				.subscribe(
				() => {
					
					self.loaditemgroupList()
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
			self.itemgroupList[index].deviation = (self.itemgroupList[index].grpDsc - self.itemgroupList[index].grpDsc);

			self.http.editItemgroupmaster( self.itemgroupList[index] )
			.subscribe(
				(data) => {
					
					self.loaditemgroupList()
				},
				(error) => self.errorMsg = error,
				() => {
					self.successMsg = "Updated Successfully.";
	
								
				}
			);
			var newItem =self.itemgroupCreateModel;
			this.gridOptions.api.updateRowData({add: [newItem]});
}

	//updateCondition function
	updateCondition = function(index){
		var self = this;
		self.errorMsg = "";
		self.successMsg = ""; 
		self.conditionClicked = "";
		self.itemgroupCreateModel.department = self.itemgroupListid.department;
		self.itemgroupCreateModel.id=self.itemgroupListid.id;
		self.itemgroupCreateModel.grpDsc=self.itemgroupListid.grpDsc;
		self.itemgroupCreateModel.inactiveTag=self.itemgroupListid.inactiveTag;
		self.itemgroupCreateModel.activeFlag=self.itemgroupListid.activeFlag;
			
		this.http.editItemgroupmaster(self.itemgroupCreateModel)
			.subscribe(
			(data) => {
				self.createItemgroupResponsedata = data;
				self.loaditemgroupList();
			},
			(error) => self.errorMsg = error,
			() => {
				self.successMsg = "Updated Successfully.",
				self.itemgroupCreateModel.department= [];
				self.itemgroupCreateModel.id="";
				self.itemgroupCreateModel.grpDsc="";
				self.itemgroupCreateModel.inactiveTag="";
				self.itemgroupCreateModel.activeFlag="";
				self.loaditemgroupList();
				
			
				
			}
		);
		var newItem =self.itemgroupCreateModel;
		// this.gridOptions.api.updateRowData({add: [newItem]});
		console.log("completed")
		
}

}
