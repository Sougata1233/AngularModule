import { Component, OnInit, AfterViewInit } from '@angular/core';
import * as $ from 'jquery';

import { HttpTestService } from '../../../../services/http.service';
import { sessionServices } from '../../../../services/session.services';
import { grnReceiveModel } from '../../../../models/grn/grnReceive.model';
import { Router } from '@angular/router';

import {GridOptions} from "ag-grid/main";
import {gridDateComponent} from "../../../common/gridDateFormat.component";
import {gridPOPrintLinkComponent} from "../../../common/gridPOPrintLink.Component";
import {gridSRSearchLinkComponent} from "../../../common/gridSRSearchLink";
import {gridtatusComponent} from "../../../common/gridDtatus.component";


@Component({
  selector: 'app-sr-list',
  templateUrl: './srList.component.html'
})


export class srListComponent implements OnInit {
	
	
	public errorMsg : string = "";
	public successMsg : string = "";
	
	public sessionData: any;
	public allOpenSrList : any;
	
	public gridOptions: GridOptions;
	
	public grnReceiveModel: grnReceiveModel = new grnReceiveModel();
	
	
	public columnDef : any = [
		{headerName: "SR Id", field: "storeGoodReceiveHeader.id", suppressMenu: true, cellRendererFramework: gridSRSearchLinkComponent, minWidth : 350},
		{headerName: "SR Date", field: "storeGoodReceiveHeader.goodReceiptDate", suppressMenu: true, minWidth : 250, cellRendererFramework: gridDateComponent},
		{headerName: "PO No.", field: "storeGoodReceiveHeader.poId", suppressMenu: true, minWidth : 250, cellRendererFramework : gridPOPrintLinkComponent},
		{headerName: "Supplier Code", field: "storeGoodReceiveHeader.supplierId", suppressMenu: true, minWidth : 350},
		{headerName: "Submitter", field: "storeGoodReceiveHeader.submitter", suppressMenu: true, minWidth : 350},
		{headerName: "Status", field: "storeGoodReceiveHeader.status", suppressMenu: true, minWidth : 150, cellRendererFramework : gridtatusComponent}
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
			 self.router.navigate(['store/storereceive',params.data.storeGoodReceiveHeader.id]);
		 };
	}
		
	ngOnInit() {
		this.getSession();
		this.fetchOpenSr();
	}
	
	
	//get session details
	getSession = function(){
		this.sessionData = this.session.getSessionDetails();
	}
	
	
	//etch all open mr-worklist
	fetchOpenSr = function(){
		var self = this;
		
		self.http.getAllSr()
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
