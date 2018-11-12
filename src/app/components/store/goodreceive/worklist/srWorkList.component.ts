import { Component, OnInit, AfterViewInit } from '@angular/core';
import * as $ from 'jquery';

import { HttpTestService } from '../../../../services/http.service';
import { sessionServices } from '../../../../services/session.services';
import { grnReceiveModel } from '../../../../models/grn/grnReceive.model';
import { Router } from '@angular/router';

import {GridOptions} from "ag-grid/main";
import {gridDateComponent} from "../../../common/gridDateFormat.component";
import {gridPOPrintLinkComponent} from "../../../common/gridPOPrintLink.Component";
import {gridSRLinkComponent} from "../../../common/gridSRLinkComponent";


@Component({
  selector: 'app-sr-worklist',
  templateUrl: './srWorkList.component.html'
})


export class srWorklistComponent implements OnInit {
	
	
	public errorMsg : string = "";
	public successMsg : string = "";
	
	public sessionData: any;
	public allOpenSrList : any = [];
	public approvalData : any = [];
	public gridOptions: GridOptions;
	
	public grnReceiveModel: grnReceiveModel = new grnReceiveModel();
	
	
	public columnDef : any = [
		{headerName: "SR Id", field: "storeGoodReceiveHeader.id", suppressMenu: true, cellRendererFramework: gridSRLinkComponent, minWidth : 350},
		{headerName: "SR Date", field: "storeGoodReceiveHeader.goodReceiptDate", suppressMenu: true, minWidth : 250, cellRendererFramework: gridDateComponent},
		{headerName: "PO No.", field: "storeGoodReceiveHeader.poId", suppressMenu: true, minWidth : 250, cellRendererFramework : gridPOPrintLinkComponent},
		{headerName: "Supplier Code", field: "storeGoodReceiveHeader.supplierId", suppressMenu: true, minWidth : 350},
		{headerName: "Submitter", field: "storeGoodReceiveHeader.submitter", suppressMenu: true, minWidth : 350}
	];
	
	public onQuickFilterChanged($event) {
        this.gridOptions.api.setQuickFilter($event.target.value);
    }
	
	constructor(public http: HttpTestService, public session: sessionServices, public router: Router) {
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
			 self.router.navigate(['store/srworklist',params.data.storeGoodReceiveHeader.id]);
		 };
	}
		
	ngOnInit() {
		this.getSession();
		this.loadApprovalData();
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
					self.allOpenMrList = "notauth";
				}else{
				for(var i = 0; i<self.approvalData.length; i++){
					if(self.approvalData[i].taskDesc == "SR"){
						if(self.approvalData[i].user1 && self.approvalData[i].user1.id == self.sessionData.sessionId){
							this.fetchOpenSr('1');
						}else if(self.approvalData[i].user2 && self.approvalData[i].user2.id == self.sessionData.sessionId){
							this.fetchOpenSr('17');
						}else if(self.approvalData[i].user3 && self.approvalData[i].user3.id == self.sessionData.sessionId){
							this.fetchOpenSr('18');
						}else if(self.approvalData[i].user4 && self.approvalData[i].user4.id == self.sessionData.sessionId){
							this.fetchOpenSr('19');
						}else if(self.approvalData[i].user5 && self.approvalData[i].user5.id == self.sessionData.sessionId){
							this.fetchOpenSr('20');
						}else{
							self.allOpenMrList = "notauth";
						}
						
					}
				}
				}
			}
		);
	}
	
	
	//etch all open mr-worklist
	fetchOpenSr = function(stat){
		var self = this;
		
		self.http.getSrbyStatus(stat)
			.subscribe(
				(data) => {
					this.allOpenSrList = data;
				},
				(error) => {
					this.errorMsg = error,
					this.allOpenSrList = ""
				},
				() => {}
			);
	}
	
}
