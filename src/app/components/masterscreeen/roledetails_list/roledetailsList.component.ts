import { Component, OnInit, AfterViewInit } from '@angular/core';
import * as $ from 'jquery';
// import 'jquery-ui';
// import { Datepicker } from 'jquery-datepicker';

import { HttpTestService } from '../../../services/http.service';
import { sessionServices } from '../../../services/session.services';
import { Router } from '@angular/router';
import {Observable} from 'rxjs/Rx';
import {GridOptions} from "ag-grid/main";
import {IMyDpOptions} from 'mydatepicker';
// import { MyDatePickerModule } from 'mydatepicker';

import {gridDeleteMasterComponent} from "../../common/gridRowDeleteMaster.component";
import { roledetailsCreateModel } from '../../../models/roledetails/roledetailsCreate.model';

@Component({
  selector: 'app-payroll',
  templateUrl: './roledetailsList.component.html'
})
export class roledetailsListComponent implements OnInit {
		
	public myDatePickerOptions: IMyDpOptions = {
        // other options...
		dateFormat: 'yyyy-mm-dd'
    };
	public roleList:any =[];
	public roledetailsCreateModel: roledetailsCreateModel = new roledetailsCreateModel();
	public createroledetailsresponsedata: any;
	public gridOptions: GridOptions;
	public successMsg: string ;
	public errorMsg: string ;
	public requestedURL : any;
	public userGroupData : any = '';
	public userMenuData : any = '';
	public userSelectionMenuData : any = [];
	public sessionData: any;
	public columnDef : any = [
			{headerName: "S NO", field: "id", minWidth : 250},
			{headerName: "Role", field: "role", minWidth : 250, editable : true, cellEditor : 'text'},
			{headerName: "From Date", field: "fromDate", minWidth : 250, editable : true, cellEditor : 'text'},
			{headerName: "To Date", field: "fromDate", minWidth : 250, editable : true, cellEditor : 'text'},
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
				if(self.roleList != 'undefined'){
				   self.updateDeviation(params.node.id);
				   params.api.setRowData(self.roleList);
				}
			};
			
	}

	ngOnInit() {
			this.getSession();
			this.getUserGroup();
			this.loadroleList();
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
	createRoleMaster = function(){
			var self = this;
			self.roledetailsCreateModel.fromDate = new Date(self.roledetailsCreateModel.fromDate.formatted);
			self.roledetailsCreateModel.toDate = new Date(self.roledetailsCreateModel.toDate.formatted);
			this.http.createRoleMaster(self.roledetailsCreateModel)
				.subscribe(
				(data) => {
					self.createroledetailsresponsedata = data;
					self.loadroleList()
				},
				(error) => self.errorMsg = error,
				() => {
					self.successMsg = "Created Successfully.";
					self.roledetailsCreateModel.fromDate="";
					self.roledetailsCreateModel.toDate ="";
					self.roledetailsCreateModel.role ="";
					self.roledetailsCreateModel.isEnable ="";
					self.loadroleList();
					
				
					
				}
			);
			var newItem =self.roledetailsCreateModel;
			this.gridOptions.api.updateRowData({add: [newItem]});
			console.log("completed")
			
	}
	//load data
	loadroleList = function(){
				this.http.getRoleMaster()
				.subscribe(
					(data) =>{
						this.roleList = data;
						console.log(data);
					},
					(error) => this.errorMsg = error,
					() => console.log("complete")
		
				);
			}
	
	//load delete Organization data
	deleteItem = function(indexdId){
			var self = this;
			this.gridOptions.api.setRowData(self.roleList);
			var id = self.roleList[indexdId].id
				this.http.deleteRoleMaster(id)
				.subscribe(
				() => {
					
					self.roleList()
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
	self.roleList[index].deviation = (self.roleList[index].usrgrpName - self.roleList[index].usrgrpName);
	self.roleList[index].deviation = (self.roleList[index].fromDate - self.roleList[index].fromDate);
	self.roleList[index].deviation = (self.roleList[index].toDate - self.roleList[index].toDate);

	self.http.editRoleMaster( self.roleList[index] )
	.subscribe(
		(data) => {
			
			self.loadroleList()
		},
		(error) => self.errorMsg = error,
		() => {
			self.successMsg = "Updated Successfully.";
			
	
				
		}
	);
	var newItem =self.roledetailsCreateModel;
	this.gridOptions.api.updateRowData({add: [newItem]});
}

	
}
