import { Component, OnInit, AfterViewInit } from '@angular/core';
import * as $ from 'jquery';

import { HttpTestService } from '../../../services/http.service';
import { sessionServices } from '../../../services/session.services';
import { Router } from '@angular/router';
import {Observable} from 'rxjs/Rx';
import {GridOptions} from "ag-grid/main";
import {IMyDpOptions} from 'mydatepicker';
import {gridDeleteMasterComponent} from "../../common/gridRowDeleteMaster.component";
import { organizationCreateModel } from '../../../models/organization/organizationCreate.model';

@Component({
  selector: 'app-payroll',
  templateUrl: './organizationList.component.html'
})
export class organizationListComponent implements OnInit {

	public myDatePickerOptions: IMyDpOptions = {
        // other options...
        dateFormat: 'mm/dd/yyyy'
	};

	public organizationCreateModel: organizationCreateModel = new organizationCreateModel();
	public organizationList:any =[];
	public locationList : any =[];
	public headorganizationList:any=[];
	public enableDiv:boolean=false;
	public enableDivTwo:boolean=true;
	public createorganizationresponsedata: any;
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
			{headerName: "NAME", field: "orgName", minWidth : 250, editable : true, cellEditor : 'text'},
			{headerName: "LOCATION ", field: "location", minWidth : 250},
			{headerName: "SHORT CODE", field: "shortCode", minWidth : 250, editable : true, cellEditor : 'text'},
			{headerName: "TYPE", field: "orgTyp", minWidth : 250}
			// {headerName: "Delete", field: "", minWidth : 80, maxWidth : 80, width : 80, cellRendererFramework: gridDeleteMasterComponent}
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
				if(self.organizationList != 'undefined'){
				   self.updateDeviation(params.node.id);
				   params.api.setRowData(self.organizationList);
				}
			};
			
	}

	ngOnInit() {
			this.getSession();
			this.getUserGroup();
			this.loadorganizationList();
			this.loadlocationList();
			this.loadheadorganizationList();
	}


	onmukamChange = function(value) {
		this.enableDiv = (value == "branch");
		this.enableDivTwo = (value == "headoffice");
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
	
	//createOrganization function
	createOrganization = function(){
			var self = this;
			self.errorMsg = "";
			self.successMsg = ""; 
				this.http.createorganizationmaster(self.organizationCreateModel)
				.subscribe(
				(res) => {
					self.createorganizationresponsedata = res.json();
					self.loadorganizationList();
					if(res.status===208){
						self.errorMsg = "Already Exists.";
					}else{
						self.successMsg = "Created Successfully."; 
					}
				},
				(error) => self.errorMsg = error,
				() => {
					// self.successMsg = "Created Successfully.";
					self.organizationCreateModel.orgName= "";
					self.organizationCreateModel.locationId= "";
					self.organizationCreateModel.shortCode= "";
					self.organizationCreateModel.orgTyp= "";
					self.organizationCreateModel.hierarchyId= "";
					// self.head="";
					self.loadorganizationList();
					self.loadheadorganizationList();
					
				}
			);
			var newItem =self.organizationCreateModel;
			this.gridOptions.api.updateRowData({add: [newItem]});
			console.log("completed")
			
	}



	//load data
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

	//load data
		loadheadorganizationList = function() {
			var self = this;
			
			this.http.getheadorganizationmaster()
				.subscribe(
				(data) => {
					self.headorganizationList = data;
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
	
	//load delete Organization data
	deleteItem = function(indexdId){
			var self = this;
			self.errorMsg = "";
			self.successMsg = ""; 
			this.gridOptions.api.setRowData(self.organizationList);
			var id = self.organizationList[indexdId].id
				this.http.deleteorganizationmaster(id)
				.subscribe(
				() => {
					
					self.loadorganizationList()
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
	self.organizationList[index].deviation = (self.organizationList[index].orgName - self.organizationList[index].orgName);
	self.organizationList[index].deviation = (self.organizationList[index].orgLocation - self.organizationList[index].orgLocation);
	self.organizationList[index].deviation = (self.organizationList[index].shortCode - self.organizationList[index].shortCode);
	self.organizationList[index].deviation = (self.organizationList[index].orgTyp - self.organizationList[index].orgTyp);

	self.http.editorganizationmaster( self.organizationList[index] )
	.subscribe(
		(data) => {
			
			self.loadorganizationList()
		},
		(error) => self.errorMsg = error,
		() => {
			self.successMsg = "Updated Successfully.";
			
	
				
		}
	);
	var newItem =self.organizationCreateModel;
	this.gridOptions.api.updateRowData({add: [newItem]});
}


	
}
