import { Component, OnInit, AfterViewInit } from '@angular/core';
import * as $ from 'jquery';

import { HttpTestService } from '../../../services/http.service';
import { sessionServices } from '../../../services/session.services';
import { Router } from '@angular/router';
import {Observable} from 'rxjs/Rx';
import {GridOptions} from "ag-grid/main";
import {IMyDpOptions} from 'mydatepicker';
import {gridDeleteMasterComponent} from "../../common/gridRowDeleteMaster.component";
import { priceCreateModel } from '../../../models/price/priceCreate.model';

@Component({
  selector: 'app-payroll',
  templateUrl: './priceList.component.html'
})
export class priceListComponent implements OnInit {

	public myDatePickerOptions: IMyDpOptions = {
        // other options...
        dateFormat: 'mm/dd/yyyy'
	};

	public filteritemgroupList : any = [];
	public selecteditemgroupListid: any = [];
	public itemList:any=[];
	public priceList: any=[];
	public createPriceresponsedata: any;
	public priceCreateModel: priceCreateModel = new priceCreateModel();
	public gridOptions: GridOptions;
	public successMsg: string ;
	public errorMsg: string ;
	public requestedURL : any;
	public userGroupData : any = '';
	public userMenuData : any = '';
	public userSelectionMenuData : any = [];
	public sessionData: any;
	public columnDef : any = [
			{headerName: "S NO.", field: "priceId", minWidth : 150},
			{headerName: "ITEM GROUP", field: "itemGroup.groupDesc", minWidth : 250},
			{headerName: "ITEM", field: "item.itemDesc", minWidth : 250},
			{headerName: "Rate", field: "rate", minWidth : 250, editable : true, cellEditor : 'text'},
			{headerName: "RECEIVED QUANTITY", field: "receivedQty", minWidth : 250, editable : true, cellEditor : 'text'},
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
				//var typeofTarget = $(clickedItem.getAttribute("data-action-type");
				if(clickedItem == "remove"){self.deleteItem(params.node.id);
					console.log('hi')
				}
			};
			this.gridOptions.onCellEditingStopped = function(params) {
				if(self.priceList != 'undefined'){
				   self.updateDeviation(params.node.id);
				   params.api.setRowData(self.priceList);
				}
			};
			
}

ngOnInit() {
			this.getSession();
			this.getUserGroup();
			this.loadfilteritemgroupList();
			this.loadpriceList()
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
	
//createcity function
createPrice = function(){
			var self = this;
			self.errorMsg = "";
			self.successMsg = ""; 
		
			this.http.createPricemaster(self.priceCreateModel)
				.subscribe(
				(data) => {
					self.createPriceresponsedata = data;
					self.loadpriceList();
				},
				(error) => self.errorMsg = error,
				() => {
					self.successMsg = "Created Successfully.",
					
					self.priceCreateModel= new priceCreateModel();
			
					self.loadpriceList();
					
				}
			);
			var newItem =self.priceCreateModel;
			this.gridOptions.api.updateRowData({add: [newItem]});
			console.log("completed")
			
}
//load country data
loadfilteritemgroupList = function() {
			var self = this;
			
			this.http.getFilteritemgroupmaster()
				.subscribe(
				(data) => {
					self.filteritemgroupList = data;
					console.log(data);
				},
				(error) => self.errorMsg = error,
				() => console.log("completed")
			);
}

loaditemListid = function(value){

	this.http.getidItemmaster(value)
	.subscribe(
		(data) =>{
			this.itemList = data;
			// console.log(data);
			console.log(this.itemList);

		},
		(error) => this.errorMsg = error,
		() => console.log("complete")

	);
}

// load data
loadpriceList = function(){
		this.http.getAllpricemaster()
		.subscribe(
			(data) =>{
				this.priceList = data;
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
			this.gridOptions.api.setRowData(self.priceList);
			var priceId = self.priceList[indexdId].priceId
				this.http.deletePricemaster(priceId)
				.subscribe(
				() => {
					
					self.loadpriceList()
				},
				(error) => self.errorMsg = error,
				() => {
					self.successMsg = "Deleted Successfully.";
					self.loadpriceList()
					
				}
			);
			
			
}
//edit data
	
updateDeviation = function(index){
	var self = this;
	self.errorMsg = "";
	self.successMsg = ""; 
	self.priceList[index].deviation = (self.priceList[index].rate - self.priceList[index].rate);
	self.http.editPricemaster( self.priceList[index] )
	.subscribe(
		(data) => {
			
			self.loadpriceList()
		},
		(error) => self.errorMsg = error,
		() => {
			self.successMsg = "Updated Successfully.";
			self.loadpriceList()
			
	
				
		}
	);
	var newItem =self.priceCreateModel;
	this.gridOptions.api.updateRowData({add: [newItem]});
}

}
