import { Component, OnInit, AfterViewInit } from '@angular/core';
import * as $ from 'jquery';

import { HttpTestService } from '../../../services/http.service';
import { sessionServices } from '../../../services/session.services';
import { Router } from '@angular/router';
import {Observable} from 'rxjs/Rx';
import {GridOptions} from "ag-grid/main";
import {gridDeleteMasterComponent} from "../../common/gridRowDeleteMaster.component";
import {gridUomItemTriggerComponent} from "../../common/gridUomItemTrigger.component";
import { itemCreateModel } from '../../../models/item/itemCreate.model';

@Component({
  selector: 'app-payroll',
  templateUrl: './itemList.component.html'
})
export class itemListComponent implements OnInit {
	public itemList : any = [];
	public conditionClicked : any = "";
	public itemListid:any=[];
	public itemCreateModel: itemCreateModel = new itemCreateModel();
	public createitemResponsedata: any;
	public itemgroupList : any = [];
	public uomList : any = [];
	public gridOptions: GridOptions;
	public successMsg: string ;
	public errorMsg: string ;
	public requestedURL : any;
	public userGroupData : any = '';
	public userMenuData : any = '';
	public userSelectionMenuData : any = [];
	public sessionData: any;
	public columnDef : any = [
		{headerName: "S NO", field: "id", minWidth : 150},
		{headerName: "GROUP CODE", field: "grpCode", minWidth : 150},
		{headerName: "OLD ITEM CODE", field: "legacyItemCode", minWidth : 150, editable : true, cellEditor : 'text'},
		{headerName: "ITEM DESCRIPTION", field: "itemDsc", minWidth : 250, editable : true, cellEditor : 'text'},
		{headerName: "UOM CODE ", field: "uomCode", minWidth : 150,cellRendererFramework:gridUomItemTriggerComponent},
		{headerName: "HSN CODE", field: "hsnCode", minWidth : 150, editable : true, cellEditor : 'text'},
		{headerName: "MAKE", field: "make", minWidth : 250, editable : true, cellEditor : 'text'},
		{headerName: "MIN VALUE", field: "threshold", minWidth : 150, editable : true, cellEditor : 'text'},
		{headerName: "MAX VALUE", field: "max", minWidth : 150, editable : true, cellEditor : 'text'},
		{headerName: "MAX ORDER VALUE", field: "maxOrderValue", minWidth : 150, editable : true, cellEditor : 'text'},
		{headerName: "OPENING STOCK", field: "centralStock", minWidth : 150, editable : true, cellEditor : 'text'},
		{headerName: "Delete", field: "", minWidth : 80, maxWidth : 80, width : 80, cellRendererFramework: gridDeleteMasterComponent}
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
				if(clickedItem == "actualitemtrigger"){self.openClaimCondition(params);}
				if(clickedItem == "closed"){self.closeConditionDialog(params.node.id);}
				if(clickedItem == "closed"){self.updateCondition(params.node.id);}
					if(clickedItem == "remove"){self.deleteItem(params.node.id);
					console.log('hi')
				}
			};
			this.gridOptions.onCellEditingStopped = function(params) {
				if(self.itemList != 'undefined'){
				   self.updateDeviation(params.node.id);
				   params.api.setRowData(self.itemList);
				}
			};
			
}
ngOnInit() {
			this.getSession();
			this.getUserGroup();
			this.loaditemgroupList();
			this.loaduomList();
			this.loaditemList();

			
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

openClaimCondition = function(params){
	var self = this;
	self.conditionClicked = params.node.id;
	var id = self.itemList[params.node.id].id;
	console.log(self.itemList);
	this.loaditemListid(id);
	console.log(self.uomList);
}
closeConditionDialog = function(params){
	var self = this;
	self.conditionClicked = "";
}
	
//create function
createItemmaster = function(){
			var self = this;
			self.errorMsg = "";
			self.successMsg = ""; 
			this.http.createItemmaster(self.itemCreateModel)
				.subscribe(
				(data) => {
					self.createitemResponsedata = data;
					self.loaditemList()
				},
				(error) => self.errorMsg = error,
				() => {
					self.successMsg = "Created Successfully.";
					self.itemCreateModel.grpCode="";
					self.itemCreateModel.id="";
					self.itemCreateModel.itemDsc="";
					self.itemCreateModel.uomCode="";
					self.itemCreateModel.make="";
					self.itemCreateModel.hsnCode="";
					self.itemCreateModel.threshold="";
					self.itemCreateModel.legacyItemCode="";
					self.itemCreateModel.max="";
					self.itemCreateModel.centralStock="";
					self.itemCreateModel.maxOrderValue="";
					self.loaditemList();

					
				}
			);
			var newItem =self.itemCreateModel;
			this.gridOptions.api.updateRowData({add: [newItem]});
			console.log("completed")
			
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

//load data
loaditemList = function(){
		this.http.getItemmaster()
		.subscribe(
			(data) =>{
				this.itemList = data;
				console.log(data);
			},
			(error) => this.errorMsg = error,
			() => console.log("complete")

		);
}
// load id data	
loaditemListid = function(id){
	this.http.getIdItemmaster(id)
.subscribe(
	(data) =>{
		this.itemListid = data;
		console.log(data);
	},
	(error) => this.errorMsg = error,
	() => console.log("complete")

);
}
//load data
loaduomList = function(){
	this.http.getUom()
	.subscribe(
		(data) =>{
			this.uomList = data;
			console.log(data);
		},
		(error) => this.errorMsg = error,
		() => console.log("complete")

	);
}

//load delete data
deleteItem = function(indexdId){
			var self = this;
			self.errorMsg = "";
			self.successMsg = ""; 
			this.gridOptions.api.setRowData(self.itemList);
			var id = self.itemList[indexdId].id
				this.http.deleteItemmaster(id)
				.subscribe(
				() => {
					
					self.loaditemList()
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
			self.itemList[index].deviation = (self.itemList[index].legacyItemCode - self.itemList[index].legacyItemCode);
			self.itemList[index].deviation = (self.itemList[index].itemDsc - self.itemList[index].itemDsc);
			self.itemList[index].deviation = (self.itemList[index].hsnCode - self.itemList[index].hsnCode);
			self.itemList[index].deviation = (self.itemList[index].make - self.itemList[index].make);
			self.itemList[index].deviation = (self.itemList[index].threshold - self.itemList[index].threshold);
			self.itemList[index].deviation = (self.itemList[index].max - self.itemList[index].max);
			self.itemList[index].deviation = (self.itemList[index].maxOrderValue - self.itemList[index].maxOrderValue);
			self.itemList[index].deviation = (self.itemList[index].centralStock - self.itemList[index].centralStock);
			self.http.editItemmaster( self.itemList[index] )
			.subscribe(
				(data) => {
					
					self.loaditemList()
				},
				(error) => self.errorMsg = error,
				() => {
					self.successMsg = "Updated Successfully.";
							
				}
			);
			var newItem =self.itemCreateModel;
			this.gridOptions.api.updateRowData({add: [newItem]});
}
//updateCondition function
updateCondition = function(index){
	var self = this;
	self.errorMsg = "";
	self.successMsg = ""; 
	self.conditionClicked = "";
	self.itemUomCode = self.itemListid.uomCode;
	self.itemCreateModel.grpCode = self.itemListid.grpCode;
	self.itemCreateModel.id=self.itemListid.id;
	self.itemCreateModel.itemDsc=self.itemListid.itemDsc;
	self.itemCreateModel.make=self.itemListid.make;
	self.itemCreateModel.hsnCode=self.itemListid.hsnCode;
	self.itemCreateModel.threshold=self.itemListid.threshold;
	self.itemCreateModel.legacyItemCode=self.itemListid.legacyItemCode;
	self.itemCreateModel.max=self.itemListid.max;
	self.itemCreateModel.centralStock=self.itemListid.centralStock;
	self.itemCreateModel.maxOrderValue=self.itemListid.maxOrderValue;
	this.http.editItemmaster(self.itemCreateModel)
		.subscribe(
				(data) => {
					self.createitemResponsedata = data;
					self.itemCreateModel.grpCode="";
					self.itemCreateModel.id="";
					self.itemCreateModel.itemDsc="";
					self.itemCreateModel.uomCode="";
					self.itemCreateModel.make="";
					self.itemCreateModel.hsnCode="";
					self.itemCreateModel.threshold="";
					self.itemCreateModel.legacyItemCode="";
					self.itemCreateModel.max="";
					self.itemCreateModel.centralStock="";
					self.itemCreateModel.maxOrderValue="";
					self.loaditemList()
				},
				(error) => self.errorMsg = error,
				() => {
					self.successMsg = "Updated Successfully.";
					self.loaditemList();
				}
		);


	var newItem =self.itemCreateModel;
	this.gridOptions.api.updateRowData({add: [newItem]});
	console.log("completed")
	
}
}
