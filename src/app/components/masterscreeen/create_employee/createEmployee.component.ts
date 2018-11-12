import { Component, OnInit, AfterViewInit } from '@angular/core';
import * as $ from 'jquery';

import { HttpTestService } from '../../../services/http.service';
import { sessionServices } from '../../../services/session.services';
import { Router } from '@angular/router';
import {Observable} from 'rxjs/Rx';
import {GridOptions} from "ag-grid/main";
import {IMyDpOptions} from 'mydatepicker';
import {gridDeleteMasterComponent} from "../../common/gridRowDeleteMaster.component";
import { employeeCreateModel } from '../../../models/employeemaster/employeeCreate.model';



@Component({
  selector: 'app-payroll',
  templateUrl: './createEmployee.component.html'
})
export class createEmployeeComponent implements OnInit {

	public myDatePickerOptions: IMyDpOptions = {
        // other options...
        dateFormat: 'yyyy-mm-dd'
	};

	public departmentList:any =[];
	public date:any;
	public employeeList:any =[];
	public employeeCreateModel: employeeCreateModel = new employeeCreateModel();
	public createemployeeresponsedata: any;
	public gridOptions: GridOptions;
	public successMsg: string ;
	public errorMsg: string ;
	public requestedURL : any;
	public userGroupData : any = '';
	public userMenuData : any = '';
	public userSelectionMenuData : any = [];
	public sessionData: any;
	public columnDef : any = [
			{headerName: "EB NO", field: "id", minWidth : 250},
			{headerName: "EB ID  ", field: "ebId", minWidth : 250, editable : true, cellEditor : 'text'},
			{headerName: "EB FIXED ID  ", field: "ebFixedId", minWidth : 250, editable : true, cellEditor : 'text'},
			{headerName: "EMPLOYEE", field: "empName", minWidth : 250, editable : true, cellEditor : 'text'},
			{headerName: "DEPARTMENT", field: "departmentName", minWidth : 250},
			{headerName: "OCCUPATION", field: "occuId", minWidth : 250, editable : true, cellEditor : 'text'},
			{headerName: "DATE OF JOINING ", field: "dateOfJoining", minWidth : 250, editable : true, cellEditor : 'text'},
			{headerName: "ACTIVE", field: "active", minWidth : 250, editable : true, cellEditor : 'text'},
			{headerName: "DATE OF BIRTH", field: "dateOfBirth", minWidth : 250},
			{headerName: "GENDER", field: "sex", minWidth : 250},
			{headerName: "FATHER/HUSBAND", field: "fatherHusbandName", minWidth : 250},
			{headerName: "RELIGION", field: "religion", minWidth : 250},
			{headerName: "DATE OF PF JOINING  ", field: "dateOfPfJoining", minWidth : 250},
			{headerName: "DATE OF IN ACTIVE ", field: "dateOfInactive", minWidth : 250},
			{headerName: "CATA ID", field: "cataId", minWidth : 250},
			{headerName: "WORKING RELEY  ", field: "workingReley", minWidth : 150},
			{headerName: "QUARTER", field: "quarter", minWidth : 250},
			{headerName: "QUARTER NO", field: "quarterNo", minWidth : 250},
			// {headerName: "EMP NAME", field: "esiMember", minWidth : 250},
			{headerName: "ESI MEMBER ", field: "esiMember", minWidth : 250},
			{headerName: "PF MEMBER", field: "pfMember", minWidth : 250},
			{headerName: "FPF MEMBER", field: "fpfMember", minWidth : 250},
			{headerName: "ESI NO", field: "esiNo", minWidth : 250},
			{headerName: "PF NO ", field: "pfNo", minWidth : 250},
			{headerName: "FPF NO", field: "fpffNo", minWidth : 250},
			{headerName: "EDUCATION", field: "education", minWidth : 250},
			{headerName: "EDUCATION READ", field: "educationRead", minWidth : 250},
			{headerName: "EDUCATION WRITE ", field: "educationWrite", minWidth : 250},
			{headerName: "PREV EMPLOYMENT", field: "prevEmployment", minWidth : 250},
			{headerName: "IDENTICAL MARKS ", field: "identicalMarks", minWidth : 250},
			{headerName: "PERMANENT ADD1", field: "permanentAdd1", minWidth : 150},
			{headerName: "PERMANENT ADD2", field: "permanentAdd2", minWidth : 250},
			{headerName: "PERMANENT ADD3 ", field: "permanentAdd3", minWidth : 250},
			{headerName: "PERMANENT ADD4", field: "permanentAdd4", minWidth : 250},
			{headerName: "LOCAL ADD1", field: "localAdd1", minWidth : 250},
			{headerName: "LOCAL ADD2", field: "localAdd2", minWidth : 250},
			{headerName: "LOCAL ADD3", field: "localAdd3", minWidth : 250},
			{headerName: "LOCAL_ADD4", field: "localAdd4", minWidth : 250},
			{headerName: "PHONE NO", field: "phoneNo", minWidth : 250},
			{headerName: "MOBILE NO ", field: "mobileNo", minWidth : 250},
			{headerName: "OFFDAY", field: "offday", minWidth : 250},
			{headerName: "PHOTO DIR", field: "photoDir", minWidth : 250},
			{headerName: "UPDATED", field: "updated", minWidth : 250},
			{headerName: "USER ID", field: "userId", minWidth : 250},
			{headerName: "OCCU CODE", field: "occuCode", minWidth : 250},
			{headerName: "WRK TYPE", field: "wrkType", minWidth : 250},
			{headerName: "PHOTOFILE", field: "photofile", minWidth : 250},
			{headerName: "CHK OLD ", field: "chkOld", minWidth : 250},
			{headerName: "OLD EB ", field: "oldEb", minWidth : 250},
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
				if(self.employeeList != 'undefined'){
				   self.updateDeviation(params.node.id);
				   params.api.setRowData(self.employeeList);
				}
			};
			
	}

	ngOnInit() {
			this.getSession();
			this.getUserGroup();
			this.loaddepartmentList();
			this.loademployeeList();
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
	createEmployeemaster = function(){
			var self = this;
			self.employeeCreateModel.dateOfJoining = self.employeeCreateModel.dateOfJoining.formatted;
			self.employeeCreateModel.dateOfPfJoining = self.employeeCreateModel.dateOfPfJoining.formatted;
			self.employeeCreateModel.dateOfInactive = self.employeeCreateModel.dateOfInactive.formatted;
			self.employeeCreateModel.dateOfBirth = self.employeeCreateModel.dateOfBirth.formatted;
			this.http.createEmployeemaster(self.employeeCreateModel)
				.subscribe(
				(data) => {
					self.createemployeeresponsedata = data;
					self.loademployeeList()
				},
				(error) => self.errorMsg = error,
				() => {
					self.successMsg = "Created Successfully.";
					self.employeeCreateModel ="";
					self.employeeCreateModel.dateOfJoining="";
					self.employeeCreateModel.dateOfBirth="";
					self.employeeCreateModel.dateOfInactive="";
					self.employeeCreateModel.dateOfPfJoining="";
					self.loademployeeList();
					
				
					
				}
			);
			var newItem =self.employeeCreateModel;
			this.gridOptions.api.updateRowData({add: [newItem]});
			console.log("completed")
			
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

// load employee data
loademployeeList = function(){
	this.http.getEmployeemaster()
	.subscribe(
		(data) =>{
		this.employeeList = data;
			console.log(data);
				},
				(error) => this.errorMsg = error,
					() => console.log("complete")
		
			);
}
	
	//load delete Organization data
	deleteItem = function(indexdId){
			var self = this;
			this.gridOptions.api.setRowData(self.employeeList);
			var id = self.employeeList[indexdId].id
				this.http.deleteEmployeemaster(id)
				.subscribe(
				() => {
					
					self.loademployeeList()
				},
				(error) => self.errorMsg = error,
				() => {
					self.successMsg = "Deleted Successfully."
					
				}
			);
			
			
	
	}
	updateDeviation = function(index){
		var self = this;
		self.employeeList[index].deviation = (self.employeeList[index].ebId - self.employeeList[index].ebId);
		self.employeeList[index].deviation = (self.employeeList[index].ebFixedId - self.employeeList[index].ebFixedId);
		self.employeeList[index].deviation = (self.employeeList[index].empName - self.employeeList[index].empName);
		self.employeeList[index].deviation = (self.employeeList[index].ebFixedId - self.employeeList[index].ebFixedId);
		self.employeeList[index].deviation = (self.employeeList[index].occuId - self.employeeList[index].occuId);
		self.employeeList[index].deviation = (self.employeeList[index].dateOfJoining - self.employeeList[index].dateOfJoining);
		self.employeeList[index].deviation = (self.employeeList[index].active - self.employeeList[index].active);

		self.http.editEmployeemaster( self.employeeList[index] )
		.subscribe(
			(data) => {
				
				self.loademployeeList()
			},
			(error) => self.errorMsg = error,
			() => {
				self.successMsg = "Updated Successfully.";
				
		
					
			}
		);
		var newItem =self.employeeCreateModel;
		this.gridOptions.api.updateRowData({add: [newItem]});
}

}
