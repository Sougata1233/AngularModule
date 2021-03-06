import { Component, OnInit, AfterViewInit } from '@angular/core';
import * as $ from 'jquery';

import { HttpTestService } from '../../../services/http.service';
import { sessionServices } from '../../../services/session.services';
import { Router } from '@angular/router';
import {Observable} from 'rxjs/Rx';
import {GridOptions} from "ag-grid/main";
import {IMyDpOptions} from 'mydatepicker';
import {gridDeleteMasterComponent} from "../../common/gridRowDeleteMaster.component";
import { approverCreateModel } from '../../../models/approver/approverCreate.model';


@Component({
  selector: 'app-payroll',
  templateUrl: './createApprover.component.html'
})
export class createApproverComponent implements OnInit {

	public myDatePickerOptions: IMyDpOptions = {
        // other options...
        dateFormat: 'mm/dd/yyyy'
	};
	public usergroupList : any = [];
	public tasktypeList : any = [];
	public approverList : any = [];
	public approverCreateModel: approverCreateModel = new approverCreateModel();
	public createapproveresponsedata: any;
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
			{headerName: "TASK", field: "taskDsc", minWidth : 250, editable : true, cellEditor : 'text'},
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
				if(self.approverList != 'undefined'){
				   self.updateDeviation(params.node.id);
				   params.api.setRowData(self.approverList);
				}
				};
			
		}

		ngOnInit() {
			this.getSession();
			this.getUserGroup();
			this.loadapproverList();
			this.loadusergroupList();
			this.loadtasktypeList();
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
	createApprovermaster = function(){
			var self = this;
			this.http.createApprovermaster(self.approverCreateModel)
				.subscribe(
				(data) => {
					self.createapproveresponsedata = data;
					self.loadapproverList()
				},
				(error) => self.errorMsg = error,
				() => {
					self.successMsg = "Created Successfully.";
					self.approverCreateModel.taskDsc= "";
					self.approverCreateModel.userGroup= "";
					self.approverCreateModel.approvalLabel= "";
					
				}
			);
			var newItem =self.approverCreateModel;
			this.gridOptions.api.updateRowData({add: [newItem]});
			console.log("completed")
			
}
	
	
//load table data
			
loadapproverList = function() {
			var self = this;
			
			this.http.getApprovermaster()
				.subscribe(
				(data) => {
					self.approverList = data;
				},
				(error) => self.errorMsg = error,
				() => console.log("completed")
			);
}

//load data
loadusergroupList = function(){
	this.http.getUsergroupmaster()
	.subscribe(
		(data) =>{
			this.usergroupList = data;
			console.log(data);
		},
		(error) => this.errorMsg = error,
		() => console.log("complete")

	);
}
//load data
loadtasktypeList = function(){
	this.http.getTasktypemaster()
	.subscribe(
		(data) =>{
			this.tasktypeList = data;
			console.log(data);
		},
		(error) => this.errorMsg = error,
		() => console.log("complete")

	);
}
//edit data
	
updateDeviation = function(index){
			var self = this;
			self.approverList[index].deviation = (self.approverList[index].countryName - self.approverList[index].countryName);
			self.http.editApprovermaster( self.approverList[index] )
			.subscribe(
				(data) => {
					
					self.loadapproverList()
				},
				(error) => self.errorMsg = error,
				() => {
					self.successMsg = "Updated Successfully.";
					
			
						
				}
			);
			var newItem =self.approverCreateModel;
			this.gridOptions.api.updateRowData({add: [newItem]});
}
//delete data

deleteItem = function(indexdId){
			var self = this;
			this.gridOptions.api.setRowData(self.approverList);
			var id = self.approverList[indexdId].id
				this.http.deleteApprovermaster(id)
				.subscribe(
				() => {
					
					self.loadapproverList()
				},
				(error) => self.errorMsg = error,
				() => {
					self.successMsg = "Deleted Successfully."
					
				}
			);
			
			
	
}


}
