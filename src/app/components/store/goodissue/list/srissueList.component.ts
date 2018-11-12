import { Component, OnInit, AfterViewInit } from '@angular/core';
import * as $ from 'jquery';

import { HttpTestService } from '../../../../services/http.service';
import { sessionServices } from '../../../../services/session.services';
import { grnReceiveModel } from '../../../../models/grn/grnReceive.model';
import { Router } from '@angular/router';
import {GridOptions} from "ag-grid/main";
import {gridDateComponent} from "../../../common/gridDateFormat.component";
import {gridPOPrintLinkComponent} from "../../../common/gridPOPrintLink.Component";
import {gridSrIssueSearchLinkComponent} from "../../../common/srIssueSearchLink";
import {gridtatusComponent} from "../../../common/gridDtatus.component";


@Component({
  selector: 'app-mr-list',
  templateUrl: './srissueList.component.html'
})


export class srissueListComponent implements OnInit {
	
	
	public errorMsg : string = "";
	public successMsg : string = "";
	
	public sessionData: any;
	public allOpenMrList : any;
	public allMrIssueList : any = [];
	
	public gridOptions: GridOptions;
	
	public grnReceiveModel: grnReceiveModel = new grnReceiveModel();
	
	public columnDef : any = [
		{headerName: "Issue Id", field: "issueHeader.id", suppressMenu: true, cellRendererFramework: gridSrIssueSearchLinkComponent, minWidth : 350},
		{headerName: "Issue Date", field: "issueHeader.issueDate", suppressMenu: true, minWidth : 250, cellRendererFramework: gridDateComponent},
		{headerName: "Issue Type", field: "issueHeader.type", suppressMenu: true, minWidth : 250},
		{headerName: "Submitter", field: "issueHeader.submitter", suppressMenu: true, minWidth : 350}
		//{headerName: "Status", field: "issueHeader.status", suppressMenu: true, minWidth : 150, cellRendererFramework : gridtatusComponent}
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
			 self.router.navigate(['store/srgoodissue',params.data.issueHeader.id]);
		 };
	}
		
	ngOnInit() {
		this.getSession();
		this.fetchOpenMr();
	}
	
	
	//get session details
	getSession = function(){
		this.sessionData = this.session.getSessionDetails();
	}
	
	
	//etch all open mr-worklist
	fetchOpenMr = function(){
		var self = this;
		
		self.http.getAllIssue()
			.subscribe(
				(data) => {
					this.allOpenMrList = data;
				},
				(error) => {
					this.errorMsg = error,
					this.allOpenMrList = ""
				},
				() => {
					for(var i = 0; i < self.allOpenMrList.length; i++){
						if(self.allOpenMrList[i].issueHeader.goodType == "SR"){
							self.allMrIssueList.push(self.allOpenMrList[i]);
						}
					}
					this.gridOptions.api.setRowData(self.allMrIssueList);
				}
			);
	}
	
}
