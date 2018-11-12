import { Component, OnInit, AfterViewInit } from '@angular/core';
import * as $ from 'jquery';

import { HttpTestService } from '../../../services/http.service';
import { sessionServices } from '../../../services/session.services';
import { Router } from '@angular/router';
import {GridOptions} from "ag-grid/main";
import {gridDateComponent} from "../../common/gridDateFormat.component";
import {gridIndentLinkComponent} from "../../common/gridIndentLink.Component";


@Component({
  selector: 'app-worklist',
  templateUrl: './indentApprovalList.component.html'
})
export class indentApprovalListComponent implements OnInit {
	
	public gridOptions: GridOptions;
	
	public approvalRequestAll : any = [];
	public errorMsg : string = "";
	public successMsg : string = "";
	public sessionData: any;
	public requestedURL : any;
	public userGroupData : any = '';
	public userMenuData : any = '';
	public userSelectionMenuData : any = []; 
	public approvalRequestAllfiltered : any = [];
	public columnDef : any = [
		{headerName: "INDENT NUMBER", field: "id", suppressMenu: true, cellRendererFramework: gridIndentLinkComponent, minWidth : 350, width:350},
		{headerName: "INDENT TYPE", field: "type", suppressMenu: true, minWidth : 250, width:250},
		{headerName: "RAISED BY", field: "submitter", suppressMenu: true, minWidth : 350, width:350},
		{headerName: "RAISED ON", field: "createDate", cellRendererFramework: gridDateComponent, suppressMenu: true, minWidth : 350 , width:350}
	];
	
	
	
	
	
	public approvalData : any = [];
	
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
		 
		 this.gridOptions.onRowClicked = function(params) {
			 self.router.navigate(['store/worklist',params.data.id]);
		 };

		 
	}
		
	ngOnInit() {
		this.getSession();
		
		this.loadApprovalData();
		
		this.getUserGroup();
		
	}
	
	
	
	
	//get session details
	getSession = function(){
		this.sessionData = this.session.getSessionDetails();
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
					if(self.approvalData[i].taskDesc == "Indent"){
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
	
	loadApprovalRequest = function(stat) {
		var self = this;
		
		this.http.getIndenApprovalList(stat)
			.subscribe(
			(data) => {
				self.approvalRequestAll = data;
			},
			(error) => self.errorMsg = error,
			() => {
				for(var i =0; i < self.approvalRequestAll.length; i++){
					if(self.approvalRequestAll[i].type != 'J'&& self.approvalRequestAll[i].type != 'W' ){
						self.approvalRequestAllfiltered.push(self.approvalRequestAll[i]);
					}
				}
				self.gridOptions.api.setRowData(self.approvalRequestAllfiltered);
			}
		);
	}
	
	
	getUserGroup = function(){
		var self = this;
		this.http.getUserGroupById(this.sessionData.sessionId)
		  .subscribe(
			(data) => {
			  this.userGroupData = data;
			  },
			(error) => {
				this.errorMsg = error;
				this.userGroupData = "";
			},
			() => {
				
    			//this.loadApprovalRequest("1");
			}
		  );
	}
	
	
}
