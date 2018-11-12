import { Component, OnInit, AfterViewInit } from '@angular/core';
import * as $ from 'jquery';

import { HttpTestService } from '../../../../services/http.service';
import { sessionServices } from '../../../../services/session.services';
import { Router } from '@angular/router';
import {Observable} from 'rxjs/Rx';
import { indentCreateModel } from '../../../../models/indent/indentCreate.model';
import {GridOptions} from "ag-grid/main";
import {gridDateComponent} from "../../../common/gridDateFormat.component";
import {billpassLinkComponent} from "../../../common/billpassLink.component";


@Component({
  selector: 'app-create-user',
  templateUrl: './billPassList.component.html'
})


export class billPassList implements OnInit {
	
	
	
	public gridOptions: GridOptions;

	public AllPOData : any;
	public successMsg: string ;
	public errorMsg: string ;
	public sessionData: any;
	
	public columnDef : any = [
		{headerName: "Bill No", field: "billNo", suppressMenu: true, minWidth : 250, cellRendererFramework : billpassLinkComponent},
		{headerName: "Bill Date", field: "billDate", suppressMenu: true, minWidth : 250, cellRendererFramework : gridDateComponent},
		{headerName: "Supplier Name", field: "supplierCode", suppressMenu: true, minWidth : 250},
		{headerName: "Bill Ammount", field: "billAmount", suppressMenu: true, minWidth : 250}
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
			 self.router.navigate(['store/billpass',params.data.id]);
		 };

	}
		
	ngOnInit() {
		this.getSession();
		this.loadDRCRList();
	}
	
	
	//get session details
	getSession = function(){
		this.sessionData = this.session.getSessionDetails();
	}
	
	
	
	


	//load all PO Data
	
	loadDRCRList = function(){
		var self = this;
		
		this.http.getAllBillPass()
			.subscribe(
			(data) => {
				self.AllPOData = data;
			},
			(error) => self.errorMsg = error,
			() => console.log("completed")
		);
	}
	
}