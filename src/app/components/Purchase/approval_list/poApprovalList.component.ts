import { Component, OnInit, AfterViewInit } from '@angular/core';
import * as $ from 'jquery';


import { HttpTestService } from '../../../services/http.service';
import { sessionServices } from '../../../services/session.services';
import { Router } from '@angular/router';
import {Observable} from 'rxjs/Rx';
import {GridOptions} from "ag-grid/main";
import {gridDateComponent} from "../../common/gridDateFormat.component";
import {gridPOWorklistLinkComponent} from "../../common/gridPOWorklistLink.Component";


@Component({
  selector: 'app-worklist',
  templateUrl: './poApprovalList.component.html'
})
export class purchaseApprovalListComponent implements OnInit {
	
	public approvalRequestAll : any;
	public successMsg: string ;
	public errorMsg: string ;
	public requestedURL : any;
	public userGroupData : any = '';
	public userMenuData : any = '';
	public userSelectionMenuData : any = [];
	public sessionData: any;
	public approvalData : any = [];
	public approvalRequestAllfiltered : any = [];
	
	public gridOptions: GridOptions;
	
	public columnDef : any = [
		{headerName: "PO NUMBER", field: "id", suppressMenu: true, cellRendererFramework: gridPOWorklistLinkComponent, minWidth : 350},
		{headerName: "PO TYPE", field: "type", suppressMenu: true, minWidth : 250},
		{headerName: "RAISED BY", field: "submitter", suppressMenu: true, minWidth : 350},
		{headerName: "RAISED ON", field: "createDate", suppressMenu: true, cellRendererFramework: gridDateComponent, minWidth : 350}
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
			 self.router.navigate(['purchase/worklist',params.data.id]);
		 };
	}
		
	ngOnInit() {
		this.getSession();
		this.getUserGroup();
		this.loadApprovalData();
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
			() => {}
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
	
	loadApprovalData = function(){
		var self = this;
		
		this.http.getApprovalData(this.sessionData.sessionId)
			.subscribe(
			(data) => {
				self.approvalData = data;
			},
			(error) => {
				self.approvalData = [], 
				self.errorMsg = "Service Error."
				},
			() => {
				if(self.approvalData.length == 0){
					self.approvalRequestAll = "notauth";
				}else{
				for(var i = 0; i<self.approvalData.length; i++){
					if(self.approvalData[i].taskDesc == "PO"){
						if(self.approvalData[i].user1 && self.approvalData[i].user1.id == self.sessionData.sessionId){
							this.loadApprovalRequest(1);
						}else if(self.approvalData[i].user2 && self.approvalData[i].user2.id == self.sessionData.sessionId){
							this.loadApprovalRequest(17);
						}else if(self.approvalData[i].user3 && self.approvalData[i].user3.id == self.sessionData.sessionId){
							this.loadApprovalRequest(18);
						}else if(self.approvalData[i].user4 && self.approvalData[i].user4.id == self.sessionData.sessionId){
							this.loadApprovalRequest(19);
						}else if(self.approvalData[i].user5 && self.approvalData[i].user5.id == self.sessionData.sessionId){
							this.loadApprovalRequest(20);
						}else{
							self.approvalRequestAll = "notauth";
						}
						
					}
				}
				}
			}
		);
	}
	
	//load availabe indents
	loadApprovalRequest = function(stat) {
		var self = this;
		
		this.http.getPOApprovalList(stat)
			.subscribe(
			(data) => {
				self.approvalRequestAll = data;
			},
			(error) => self.errorMsg = error,
			() => {
				
					for(var i =0; i < self.approvalRequestAll.length; i++){
						if(self.approvalRequestAll[i].type != 'J'){
							self.approvalRequestAllfiltered.push(self.approvalRequestAll[i]);
						}
					}
				this.gridOptions.api.setRowData(self.approvalRequestAllfiltered);
			}
		);
	}
}
