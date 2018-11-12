import { Component, OnInit, AfterViewInit } from '@angular/core';
import * as $ from 'jquery';

import { HttpTestService } from '../../../../services/http.service';
import { sessionServices } from '../../../../services/session.services';
import { grnReceiveModel } from '../../../../models/grn/grnReceive.model';
import { Router } from '@angular/router';
import {GridOptions} from "ag-grid/main";
import {gridDateComponent} from "../../../common/gridDateFormat.component";
import {gridPOPrintLinkComponent} from "../../../common/gridPOPrintLink.Component";
import {gridMRSearchLinkComponent} from "../../../common/gridMRSearchLink";
import {gridtatusComponent} from "../../../common/gridDtatus.component";


@Component({
  selector: 'app-mr-list',
  templateUrl: './mrList.component.html'
})


export class mrListComponent implements OnInit {
	
	
	public errorMsg : string = "";
	public successMsg : string = "";
	
	public sessionData: any;
	public allOpenMrList : any;
	public viewableMrList : any = [];
	
	public gridOptions: GridOptions;
	
	public grnReceiveModel: grnReceiveModel = new grnReceiveModel();
	
	public columnDef : any = [
		{headerName: "MR Id", field: "materialGoodReceiveHeader.id", suppressMenu: true, cellRendererFramework: gridMRSearchLinkComponent, minWidth : 350},
		{headerName: "MR Date", field: "materialGoodReceiveHeader.goodReceiptDate", suppressMenu: true, minWidth : 250, cellRendererFramework: gridDateComponent},
		{headerName: "PO No.", field: "materialGoodReceiveHeader.poId", suppressMenu: true, minWidth : 250, cellRendererFramework : gridPOPrintLinkComponent},
		{headerName: "Supplier Code", field: "materialGoodReceiveHeader.supplierId", suppressMenu: true, minWidth : 350},
		{headerName: "Submitter", field: "materialGoodReceiveHeader.submitter", suppressMenu: true, minWidth : 350},
		{headerName: "Status", field: "materialGoodReceiveHeader.status", suppressMenu: true, minWidth : 150, cellRendererFramework : gridtatusComponent}
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
			 self.router.navigate(['jute/materialreceive',params.data.materialGoodReceiveHeader.id]);
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
		
		self.http.getAllMr()
			.subscribe(
				(data) => {
					this.allOpenMrList = data;
				},
				(error) => {
					this.errorMsg = error,
					this.allOpenMrList = ""
				},
				() => {
					for(var i=0; i<self.allOpenMrList.length; i++){
						if(self.allOpenMrList[i].materialGoodReceiveHeader.status != "16"){
							self.viewableMrList.push(self.allOpenMrList[i]);
						}
					}
					self.gridOptions.api.setRowData(self.viewableMrList);
				}
			);
	}
	
}
