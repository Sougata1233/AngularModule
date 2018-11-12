import { Component, OnInit, AfterViewInit } from '@angular/core';
import * as $ from 'jquery';

import { HttpTestService } from '../../../services/http.service';
import { sessionServices } from '../../../services/session.services';
import { Router } from '@angular/router';
import {Observable} from 'rxjs/Rx';
import {GridOptions} from "ag-grid/main";
import {IMyDpOptions} from 'mydatepicker';
import {gridDeleteMasterComponent} from "../../common/gridRowDeleteMaster.component";
import { weekendCreateModel } from '../../../models/weekend/weekendCreate.model';


@Component({
  selector: 'app-payroll',
  templateUrl: './weekendList.component.html'
})
export class weekendListComponent implements OnInit {
	public myDatePickerOptions: IMyDpOptions = {
        // other options...
        dateFormat: 'mm/dd/yyyy'
	};

	public locationList : any =[];
	public organizationList:any =[];
	public weekendList : any = [];
	public weekendCreateModel: weekendCreateModel = new weekendCreateModel();
	public createweekendResponsedata: any;
	public gridOptions: GridOptions;
	public successMsg: string ;
	public errorMsg: string ;
	public requestedURL : any;
	public userGroupData : any = '';
	public userMenuData : any = '';
	public userSelectionMenuData : any = [];
	public sessionData: any;
	public columnDef : any = [
		{headerName: "ID", field: "id", minWidth : 150},
		{headerName: "LOCATION", field: "locationId", minWidth : 250},
		{headerName: "ORGANIZATION", field: "unitId", minWidth : 250},
		{headerName: "WEEKEND 1", field: "weekend1", minWidth : 150, editable : true, cellEditor : 'text'},
		{headerName: "WEEKEND 2", field: "weekend2", minWidth : 250, editable : true, cellEditor : 'text'},
		{headerName: "FORWORD", field: "alterforw1", minWidth : 250},
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
				if(self.weekendList != 'undefined'){
				   self.updateDeviation(params.node.id);
				   params.api.setRowData(self.weekendList);
				}
			};
			
}
ngOnInit() {
			this.getSession();
			this.getUserGroup();
			this.loadlocationList();
			this.loadweekendList();
			this.loadorganizationList();
			
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
createWeekendmaster = function(){
			var self = this;
			this.http.createWeekendmaster(self.weekendCreateModel)
				.subscribe(
				(data) => {
					self.createweekendResponsedata = data;
					self.loadweekendList()
				},
				(error) => self.errorMsg = error,
				() => {
					self.successMsg = "Created Successfully.";
					self.weekendCreateModel.id="";
					self.weekendCreateModel.locationId="";
					self.weekendCreateModel.unitId="";
					self.weekendCreateModel.weekend1="";
					self.weekendCreateModel.weekend2="";
					self.weekendCreateModel.alterforw1="";
					self.loadweekendList();
					
				}
			);
			var newItem =self.weekendCreateModel;
			this.gridOptions.api.updateRowData({add: [newItem]});
			console.log("completed")
			
}

//load data
loadweekendList = function(){
		this.http.getWeekendmaster()
		.subscribe(
			(data) =>{
				this.weekendList = data;
				console.log(data);
			},
			(error) => this.errorMsg = error,
			() => console.log("complete")

		);
}
loadlocationList = function() {
	var self = this;
	
	this.http.getLocationmaster()
		.subscribe(
		(data) => {
			self.locationList = data;
		},
		(error) => self.errorMsg = error,
		() => console.log("completed")
	);
}

//load Organization data
loadorganizationList = function(){
	this.http.getorganizationmaster()
	.subscribe(
		(data) =>{
			this.organizationList = data;
			console.log(data);
		},
		(error) => this.errorMsg = error,
		() => console.log("complete")

	);
}
//load delete data
deleteItem = function(indexdId){
			var self = this;
			this.gridOptions.api.setRowData(self.weekendList);
			var id = self.weekendList[indexdId].id
				this.http.deleteWeekendmaster(id)
				.subscribe(
				() => {
					
					self.loadweekendList()
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
			self.weekendList[index].deviation = (self.weekendList[index].weekend1 - self.weekendList[index].weekend1);
			self.weekendList[index].deviation = (self.weekendList[index].weekend2 - self.weekendList[index].weekend2);
			
			

			self.http.editWeekendmaster( self.weekendList[index] )
			.subscribe(
				(data) => {
					
					self.loadweekendList()
				},
				(error) => self.errorMsg = error,
				() => {
					self.successMsg = "Updated Successfully.";
					
			
						
				}
			);
			var newItem =self.weekendCreateModel;
			this.gridOptions.api.updateRowData({add: [newItem]});
}

}
