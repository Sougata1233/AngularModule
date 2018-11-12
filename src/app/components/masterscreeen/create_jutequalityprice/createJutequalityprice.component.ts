import { Component, OnInit, AfterViewInit } from '@angular/core';
import * as $ from 'jquery';

import { HttpTestService } from '../../../services/http.service';
import { sessionServices } from '../../../services/session.services';
import { Router } from '@angular/router';
import {Observable} from 'rxjs/Rx';
import {GridOptions} from "ag-grid/main";

import {gridDeleteMasterComponent} from "../../common/gridRowDeleteMaster.component";
import { jutequalitypriceCreateModel } from '../../../models/jutequalityprice/jutequalitypriceCreate.model';




@Component({
  selector: 'app-payroll',
  templateUrl: './createJutequalityprice.component.html'
})
export class createJutequalitypriceComponent implements OnInit {

	public jutequalitypriceList : any = [];
	public itemofgroupList:any =[];
	public jutequalitypriceCreateModel: jutequalitypriceCreateModel = new jutequalitypriceCreateModel();
	public createjutequalitypriceResponsedata: any;
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
		{headerName: "JUTE TYPE", field: "itemCode",minWidth : 150},
		{headerName: "JUTE QUALITY", field: "juteQuality", minWidth : 250, editable : true, cellEditor : 'text'},
		{headerName: "RATE", field: "rate", minWidth : 250, editable : true, cellEditor : 'text'},
		{headerName: "CURRENCY", field: "currency", minWidth : 250, editable : true, cellEditor : 'text'},
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
				if(self.jutequalitypriceList != 'undefined'){
				   self.updateDeviation(params.node.id);
				   params.api.setRowData(self.jutequalitypriceList);
				}
			};
			
}
ngOnInit() {
			this.getSession();
			this.getUserGroup();
			this.loadjutequalitypriceList();
			this.loaditemofgroupList();
			
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
	
//create function
createJutequalitypricemaster = function(){
			var self = this;
			this.http.createJutequalitypricemaster(self.jutequalitypriceCreateModel)
				.subscribe(
				(data) => {
					self.createjutequalitypriceResponsedata = data;
					self.loadjutequalitypriceList()
				},
				(error) => self.errorMsg = error,
				() => {
					self.successMsg = "Created Successfully.",
					self. jutequalitypriceCreateModel.itemCode="";
					self. jutequalitypriceCreateModel.juteQuality="";
					self. jutequalitypriceCreateModel.rate="";
					self. jutequalitypriceCreateModel.currency="";
					self.loadjutequalitypriceList();
					
				}
			);
			var newItem =self. jutequalitypriceCreateModel;
			this.gridOptions.api.updateRowData({add: [newItem]});
			console.log("completed")
			
}


//load data
loadjutequalitypriceList = function(){
		this.http.getJutequalitypricemaster()
		.subscribe(
			(data) =>{
				this.jutequalitypriceList = data;
				console.log(data);
			},
			(error) => this.errorMsg = error,
			() => console.log("complete")

		);
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
//load delete data
deleteItem = function(indexdId){
			var self = this;
			this.gridOptions.api.setRowData(self.jutequalitypriceList);
			var id = self.jutequalitypriceList[indexdId].id
				this.http.deleteJutequalitypricemaster(id)
				.subscribe(
				() => {
					
					self.loadjutequalitypriceList()
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
			// self.jutequalitypriceList[index].deviation = (self.jutequalitypriceList[index].id - self.jutequalitypriceList[index].id);
			// self.jutequalitypriceList[index].deviation = (self.jutequalitypriceList[index].itemCode - self.jutequalitypriceList[index].itemCode);
			self.jutequalitypriceList[index].deviation = (self.jutequalitypriceList[index].juteQuality - self.jutequalitypriceList[index].juteQuality);
			self.jutequalitypriceList[index].deviation = (self.jutequalitypriceList[index].rate - self.jutequalitypriceList[index].rate);
			self.jutequalitypriceList[index].deviation = (self.jutequalitypriceList[index].currency - self.jutequalitypriceList[index].currency);
			self.http.editJutequalitypricemaster( self.jutequalitypriceList[index] )
			.subscribe(
				(data) => {
					
					self.loadjutequalitypriceList()
				},
				(error) => self.errorMsg = error,
				() => {
					self.successMsg = "Updated Successfully.";
					
			
						
				}
			);
			var newItem =self. jutequalitypriceCreateModel;
			// this.gridOptions.api.updateRowData({add: [newItem]});
}

}
