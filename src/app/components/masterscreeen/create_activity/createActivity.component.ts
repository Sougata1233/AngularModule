import { Component, OnInit, AfterViewInit } from '@angular/core';
import * as $ from 'jquery';

import { HttpTestService } from '../../../services/http.service';
import { sessionServices } from '../../../services/session.services';
import { Router } from '@angular/router';
import {Observable} from 'rxjs/Rx';
import {GridOptions} from "ag-grid/main";

import {gridDeleteMasterComponent} from "../../common/gridRowDeleteMaster.component";
import { activityCreateModel } from '../../../models/activity/activityCreate.model';
import {IMyDpOptions} from 'mydatepicker';

@Component({
  selector: 'app-payroll',
  templateUrl: './createActivity.component.html'
})
export class createActivityComponent implements OnInit {
	public myDatePickerOptions: IMyDpOptions = {
        // other options...
        dateFormat: 'yyyy-mm-dd'
    };
	public activityList : any = [];
	public date : any;
	public dateo : any;
	public activityCreateModel: activityCreateModel = new activityCreateModel();
	public createactivityResponsedata: any;
	public gridOptions: GridOptions;
	public successMsg: string ;
	public errorMsg: string ;
	public requestedURL : any;
	public userGroupData : any = '';
	public userMenuData : any = '';
	public userSelectionMenuData : any = [];
	public sessionData: any;
	public columnDef : any = [
		{headerName: "S NO", field: "id", minWidth : 150, editable : true, cellEditor : 'text'},
		{headerName: "NAME", field: "activityName", minWidth : 250, editable : true, cellEditor : 'text'},
		{headerName: "START DATE", field: "activityStartDate", minWidth : 250},
		{headerName: "END DATE", field: "activityEndDate", minWidth : 250, editable : true, cellEditor : 'text'},
		{headerName: "STATUS", field: "activityStatus", minWidth : 250},
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
				if(self.activityList != 'undefined'){
				   self.updateDeviation(params.node.id);
				   params.api.setRowData(self.activityList);
				}
			};
			
}
ngOnInit() {
			this.getSession();
			this.getUserGroup();
			this.loadactivityList();
			
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
createActivitymaster = function(){
			var self = this;
			self.activityCreateModel.activityStartDate = self.date.formatted;
			self.activityCreateModel.activityEndDate =  self.dateo.formatted;;
			this.http.createActivitymaster(self.activityCreateModel)
				.subscribe(
				(data) => {
					self.createactivityResponsedata = data;
					self.loadactivityList()
				},
				(error) => self.errorMsg = error,
				() => {
					self.successMsg = "Created Successfully.";
					self.date="";
					self.dateo="";
					self.activityCreateModel.id="";
					self.activityCreateModel.activityName="";
					self.activityCreateModel.activityStatus="";
				
					
				}
			);
			var newItem =self.activityCreateModel;
			this.gridOptions.api.updateRowData({add: [newItem]});
			console.log("completed")
			
}

//load data
loadactivityList = function(){
		this.http.getActivitymaster()
		.subscribe(
			(data) =>{
				this.activityList = data;
				console.log(data);
			},
			(error) => this.errorMsg = error,
			() => console.log("complete")

		);
}
//load delete data
deleteItem = function(indexdId){
			var self = this;
			this.gridOptions.api.setRowData(self.activityList);
			var id = self.activityList[indexdId].id
				this.http.deleteActivitymaster(id)
				.subscribe(
				() => {
					
					self.loadactivityList()
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
			self.activityList[index].deviation = (self.activityList[index].id - self.activityList[index].id);
			self.activityList[index].deviation = (self.activityList[index].activityName - self.activityList[index].activityName);
			self.activityList[index].deviation = (self.activityList[index].activityStartDate - self.activityList[index].activityStartDate);
			self.activityList[index].deviation = (self.activityList[index].activityEndDate - self.activityList[index].activityEndDate);
			self.activityList[index].deviation = (self.activityList[index].activityStatus - self.activityList[index].activityStatus);
			self.activityList[index].deviation = (self.activityList[index].taskType - self.activityList[index].taskType);
			self.http.editActivitymaster( self.activityList[index] )
			.subscribe(
				(data) => {
					
					self.loadactivityList()
				},
				(error) => self.errorMsg = error,
				() => {
					self.successMsg = "Updated Successfully.";
					
			
						
				}
			);
			var newItem =self.activityCreateModel
			this.gridOptions.api.updateRowData({add: [newItem]});
}

	

}
