import { Component, OnInit, AfterViewInit } from '@angular/core';
import * as $ from 'jquery';

import { HttpTestService } from '../../../services/http.service';
import { sessionServices } from '../../../services/session.services';
import { Router } from '@angular/router';
import {Observable} from 'rxjs/Rx';
import {GridOptions} from "ag-grid/main";
import {gridDateComponent} from "../../common/gridDateFormat.component";
import {gridPOSupLinkComponent} from "../../common/gridPOSupLink.Component";

@Component({
  selector: 'app-worklist',
  templateUrl: './supplierWorklist.component.html'
})
export class supplierWorklistComponent implements OnInit {
	
	public approvalRequestAll : any;
	public successMsg: string ;
	public errorMsg: string ;
	public requestedURL : any;
	public userGroupData : any = '';
	public userMenuData : any = '';
	public userSelectionMenuData : any = [];
	public sessionData: any;
	public gridOptions: GridOptions;
	public approvalRequestAllfiltered : any = [];
	
	public columnDef : any = [
		{headerName: "INDENT NUMBER", field: "id", suppressMenu: true, cellRendererFramework: gridPOSupLinkComponent, minWidth : 350},
		{headerName: "INDENT TYPE", field: "type", suppressMenu: true, minWidth : 250},
		{headerName: "RAISED BY", field: "submitter", suppressMenu: true, minWidth : 350},
		{headerName: "RAISED ON", field: "createDate", cellRendererFramework: gridDateComponent, suppressMenu: true, minWidth : 350}
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
			 self.router.navigate(['purchase/supplier',params.data.id]);
		 };
	}
		
	ngOnInit() {
		this.getSession();
		this.getUserGroup();
		
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
			() => this.loadApprovalRequest()
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
	
	//load availabe indents
	loadApprovalRequest = function() {
		var self = this;
		
		this.http.getIndenApprovalList(14)
			.subscribe(
			(data) => {
				self.approvalRequestAll = data;
			},
			(error) => self.errorMsg = error,
			() => {
				if(self.userGroupData[0].userGroup.userGroupName == 'Jute User'){
				for(var i =0; i < self.approvalRequestAll.length; i++){
					if(self.approvalRequestAll[i].type == 'J'){
						self.approvalRequestAllfiltered.push(self.approvalRequestAll[i]);
					}
				}
				}else{
					for(var i =0; i < self.approvalRequestAll.length; i++){
					if(self.approvalRequestAll[i].type != 'J'){
						self.approvalRequestAllfiltered.push(self.approvalRequestAll[i]);
					}
				}
				}
				this.gridOptions.api.setRowData(self.approvalRequestAllfiltered);				
			}
		);
		
	}
}
