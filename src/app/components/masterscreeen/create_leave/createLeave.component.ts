import { Component, OnInit, AfterViewInit } from '@angular/core';
import * as $ from 'jquery';

import { HttpTestService } from '../../../services/http.service';
import { sessionServices } from '../../../services/session.services';
import { Router } from '@angular/router';
import {Observable} from 'rxjs/Rx';
import {GridOptions} from "ag-grid/main";
import {IMyDpOptions} from 'mydatepicker';
import {gridDeleteMasterComponent} from "../../common/gridRowDeleteMaster.component";
import { masterleaveCreateModel } from '../../../models/masterleave/masterleaveCreate.model';


@Component({
  selector: 'app-payroll',
  templateUrl: './createLeave.component.html'
})
export class createLeaveComponent implements OnInit {

	
	public myDatePickerOptions: IMyDpOptions = {
        // other options...
        dateFormat: 'mm/dd/yyyy'
	};
	
	public locationList : any =[];
	public leaveList : any = [];
	public masterleaveCreateModel: masterleaveCreateModel = new masterleaveCreateModel();
	public createleaveResponsedata: any;
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
		{headerName: "LOCATION", field: "locationMaster.locationArea", minWidth : 250, editable : true, cellEditor : 'text'},
		{headerName: "TYPE", field: "leaveType", minWidth : 250, editable : true, cellEditor : 'text'},
		{headerName: "MAX LEAVE IN YEAR", field: "maxNumInAYear", minWidth : 150, editable : true, cellEditor : 'text'},
		{headerName: "CARRY FORWARD", field: "isCarryFwd", minWidth : 250, editable : true, cellEditor : 'text'},
		{headerName: "MAX FORWARD LIMIT", field: "carrayFwdLimit", minWidth : 250, editable : true, cellEditor : 'text'},
		{headerName: "VALIDITY", field: "validity", minWidth : 250, editable : true, cellEditor : 'text'},
		{headerName: "STATUS", field: "status", minWidth : 150, editable : true, cellEditor : 'text'},
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
				if(self.leaveList != 'undefined'){
				   self.updateDeviation(params.node.id);
				   params.api.setRowData(self.leaveList);
				}
			};
			
}
ngOnInit() {
			this.getSession();
			this.getUserGroup();
			this.loadlocationList()
			this.loadleaveList();
			
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
createLeavemaster = function(){
			var self = this;
			this.http.createLeavemaster(self.masterleaveCreateModel)
				.subscribe(
				(data) => {
					self.createleaveResponsedata = data;
					self.loadleaveList()
				},
				(error) => self.errorMsg = error,
				() => {
					self.successMsg = "Created Successfully.";
					self.masterleaveCreateModel.leaveType="";
					self.masterleaveCreateModel.isCarryFwd="";
					self.masterleaveCreateModel.maxNumInAYear="";
					self.masterleaveCreateModel.carrayFwdLimit="";
					self.masterleaveCreateModel.validity="";
					self.masterleaveCreateModel.status="";
					self.masterleaveCreateModel.locationId="";
					
				}
			);
			var newItem =self.masterleaveCreateModel;
			this.gridOptions.api.updateRowData({add: [newItem]});
			console.log("completed")
			
}

//load data
loadleaveList = function(){
		this.http.getLeavemaster()
		.subscribe(
			(data) =>{
				this.leaveList = data;
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
//load delete data
deleteItem = function(indexdId){
			var self = this;
			this.gridOptions.api.setRowData(self.leaveList);
			var id = self.leaveList[indexdId].id
				this.http.deleteLeavemaster(id)
				.subscribe(
				() => {
					
					self.loadleaveList()
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

			self.leaveList[index].deviation = (self.leaveList[index].leaveType - self.leaveList[index].leaveType);
			self.leaveList[index].deviation = (self.leaveList[index].isCarryFwd - self.leaveList[index].isCarryFwd);
			self.leaveList[index].deviation = (self.leaveList[index].maxNumInAYear - self.leaveList[index].maxNumInAYear);
			self.leaveList[index].deviation = (self.leaveList[index].carrayFwdLimit - self.leaveList[index].carrayFwdLimit);
			self.leaveList[index].deviation = (self.leaveList[index].validity - self.leaveList[index].validity);
			self.leaveList[index].deviation = (self.leaveList[index].status - self.leaveList[index].status);


			self.http.editLeavemaster( self.leaveList[index] )
			.subscribe(
				(data) => {
					
					self.loadleaveList()
				},
				(error) => self.errorMsg = error,
				() => {
					self.successMsg = "Updated Successfully.";
					
			
						
				}
			);
			var newItem =self.masterleaveCreateModel;
			this.gridOptions.api.updateRowData({add: [newItem]});
}

}
