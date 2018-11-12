import { Component, OnInit, AfterViewInit } from '@angular/core';
import * as $ from 'jquery';

import { HttpTestService } from '../../../../services/http.service';
import { sessionServices } from '../../../../services/session.services';
import { grnReceiveModel } from '../../../../models/grn/grnReceive.model';
import { Router } from '@angular/router';
import {GridOptions} from "ag-grid/main";
import {gridDateComponent} from "../../../common/gridDateFormat.component";
import {gridPOPrintLinkComponent} from "../../../common/gridPOPrintLink.Component";
import {gridMRLinkComponent} from "../../../common/gridMRLinkComponent";


@Component({
  selector: 'app-mr-worklist',
  templateUrl: './mrWorkList.component.html'
})


export class mrWorklistComponent implements OnInit {
	
	
	public errorMsg : string = "";
	public successMsg : string = "";
	
	public sessionData: any;
	public allOpenMrList : any = [];
	
	public gridOptions: GridOptions;
	public approvalData : any = [];
	
	public grnReceiveModel: grnReceiveModel = new grnReceiveModel();
	
	public columnDef : any = [
		{headerName: "MR Id", field: "materialGoodReceiveHeader.id", suppressMenu: true, cellRendererFramework: gridMRLinkComponent, minWidth : 350},
		{headerName: "MR Date", field: "materialGoodReceiveHeader.goodReceiptDate", suppressMenu: true, minWidth : 250, cellRendererFramework: gridDateComponent},
		{headerName: "PO No.", field: "materialGoodReceiveHeader.poId", suppressMenu: true, minWidth : 250, cellRendererFramework : gridPOPrintLinkComponent},
		{headerName: "Supplier Code", field: "materialGoodReceiveHeader.supplierId", suppressMenu: true, minWidth : 350},
		{headerName: "Submitter", field: "materialGoodReceiveHeader.submitter", suppressMenu: true, minWidth : 350}
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
			 self.router.navigate(['jute/mrworklist',params.data.materialGoodReceiveHeader.id]);
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
					if(self.approvalData[i].taskDesc == "MR"){
						if(self.approvalData[i].user1 && self.approvalData[i].user1.id == self.sessionData.sessionId){
							this.fetchOpenMr('1');
						}else if(self.approvalData[i].user2 && self.approvalData[i].user2.id == self.sessionData.sessionId){
							this.fetchOpenMr('17');
						}else if(self.approvalData[i].user3 && self.approvalData[i].user3.id == self.sessionData.sessionId){
							this.fetchOpenMr('18');
						}else if(self.approvalData[i].user4 && self.approvalData[i].user4.id == self.sessionData.sessionId){
							this.fetchOpenMr('19');
						}else if(self.approvalData[i].user5 && self.approvalData[i].user5.id == self.sessionData.sessionId){
							this.fetchOpenMr('20');
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
	fetchOpenMr = function(stat){
		var self = this;
		
		self.http.getMrbyStatus(stat)
			.subscribe(
				(data) => {
					this.allOpenMrList = data;
				},
				(error) => {
					this.errorMsg = error,
					this.allOpenMrList = []
				},
				() => {}
			);
	}
	
}
