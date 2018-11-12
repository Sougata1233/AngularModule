import { Component, OnInit, AfterViewInit } from '@angular/core';
import * as $ from 'jquery';

import { HttpTestService } from '../../../services/http.service';
import { sessionServices } from '../../../services/session.services';
import { Router } from '@angular/router';
import {Observable} from 'rxjs/Rx';
import {GridOptions} from "ag-grid/main";
import {IMyDpOptions} from 'mydatepicker';
import {gridDeleteMasterComponent} from "../../common/gridRowDeleteMaster.component";
import { holidayCreateModel} from '../../../models/holiday/holidayCreate.model';

@Component({
  selector: 'app-payroll',
  templateUrl: './createHoliday.component.html'
})
export class createHolidayComponent implements OnInit {
	public myDatePickerOptions: IMyDpOptions = {
        // other options...
        dateFormat: 'yyyy-mm-dd'
    };
	public holidayCreateModel: holidayCreateModel = new holidayCreateModel();
	// public locationMasterdetails: locationMasterdetails = new locationMasterdetails();
	public locationList : any =[];
	public date:any;
	public holidayList: any =[];
	public createholidayresponsedata: any;
	public gridOptions: GridOptions;
	public successMsg: string ;
	public errorMsg: string ;
	public requestedURL : any;
	public userGroupData : any = '';
	public userMenuData : any = '';
	public userSelectionMenuData : any = [];
	public sessionData: any;
	public columnDef : any = [
			{headerName: "S NO.", field: "id", minWidth : 150},
			{headerName: "HOLIDAY", field: "holiday", minWidth : 250, editable : true, cellEditor : 'text'},
			{headerName: "YEAR", field: "holidayYr", minWidth : 250},
			{headerName: "TYPE", field: "holidayTyp", minWidth : 250, editable : true, cellEditor : 'text'},
			{headerName: "DESCRIPTION", field: "description", minWidth : 250, editable : true, cellEditor : 'text'},
			{headerName: "Delete", field: "", minWidth : 80, maxWidth : 80, width : 80, cellRendererFramework: gridDeleteMasterComponent}
		];

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
				if(self.holidayList != 'undefined'){
				   self.updateDeviation(params.node.id);
				   params.api.setRowData(self.holidayList);
				}
			};
			
}
ngOnInit() {
			this.getSession();
			this.getUserGroup();
			this.loadlocationList();
			this.loadholidayList()
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
	createHolidaymaster = function(){
			var self = this;
			
			self.holidayCreateModel.holiday = self.date.formatted;

			
			this.http.createHolidaymaster(self.holidayCreateModel)
				.subscribe(
				(data) => {
					self.createholidayresponsedata = data;
					self.loadholidayList()
				},
				(error) => self.errorMsg = error,
				() => {
					self.successMsg = "Created Successfully.";
					self.date= "";
					self.holidayCreateModel.description= "";
					self.holidayCreateModel.holidayTyp= "";
					self.holidayCreateModel.locationId= "";
					self.holidayCreateModel.holidayYr= "";
					self.loadholidayList();
					
			
				}
			);
			var newItem =self.holidayCreateModel;
			this.gridOptions.api.updateRowData({add: [newItem]});
			console.log("completed")
			
}


loadlocationList = function() {
	var self = this;
	
	this.http.getLocationmaster()
		.subscribe(
		(data) => {
			self.locationList = data;
			console.log(self.locationList);
		},
		(error) => self.errorMsg = error,
		() => console.log("completed")
	);
}

loadholidayList = function() {
	var self = this;
	
	this.http.getHolidaymaster()
		.subscribe(
		(data) => {
			self.holidayList = data;
		},
		(error) => self.errorMsg = error,
		() => console.log("completed")
	);
}
//load delete data
deleteItem = function(indexdId){
			var self = this;
			this.gridOptions.api.setRowData(self.holidayList);
			var id = self.holidayList[indexdId].id
				this.http.deleteHolidaymaster(id)
				.subscribe(
				() => {
					
					self.loadholidayList()
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
	self.holidayList[index].deviation = (self.holidayList[index].holiday - self.holidayList[index].holiday);
	self.holidayList[index].deviation = (self.holidayList[index].holidayYr - self.holidayList[index].holidayYr);
	self.holidayList[index].deviation = (self.holidayList[index].holidayTyp - self.holidayList[index].holidayTyp);
	self.holidayList[index].deviation = (self.holidayList[index].description - self.holidayList[index].description);
	

	self.http.editHolidaymaster( self.holidayList[index] )
	.subscribe(
		(data) => {
			
			self.loadholidayList()
		},
		(error) => self.errorMsg = error,
		() => {
			self.successMsg = "Updated Successfully.";
			
	
				
		}
	);
	var newItem =self.holidayCreateModel;
	this.gridOptions.api.updateRowData({add: [newItem]});
}


}
