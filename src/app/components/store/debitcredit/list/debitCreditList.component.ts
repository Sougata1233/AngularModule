import { Component, OnInit, AfterViewInit } from '@angular/core';
import * as $ from 'jquery';

import { HttpTestService } from '../../../../services/http.service';
import { sessionServices } from '../../../../services/session.services';
import { Router } from '@angular/router';
import {Observable} from 'rxjs/Rx';
import { indentCreateModel } from '../../../../models/indent/indentCreate.model';
import {GridOptions} from "ag-grid/main";
import {gridDateComponent} from "../../../common/gridDateFormat.component";
import {gridDRCRLinkComponent} from "../../../common/gridDRCRLink.component";


@Component({
  selector: 'app-drcr-search',
  templateUrl: './debitCreditList.component.html'
})


export class debitCreditList implements OnInit {
	
	
	public gridOptions: GridOptions;

	public AllPOData : any;
	public successMsg: string ;
	public errorMsg: string ;
	public sessionData: any;
	
	public columnDef : any = [
		{headerName: "DR/CR Type", field: "adjustmentType", suppressMenu: true, minWidth : 100},
		{headerName: "DR/CR Number", field: "id", suppressMenu: true, minWidth : 200, cellRendererFramework : gridDRCRLinkComponent},
		{headerName: "GRN Number", field: "grnNo", suppressMenu: true, minWidth : 200},
		{headerName: "Supplier Code", field: "supplierCode", suppressMenu: true, minWidth : 200},
		{headerName: "DR/CR Quantity", field: "adjustmentQunatity", suppressMenu: true, minWidth : 200},
		{headerName: "DR/CR Value", field: "adjustmentValue", suppressMenu: true, minWidth : 200},
		{headerName: "DR/CR Date", field: "adjustmentDate", suppressMenu: true, cellRendererFramework: gridDateComponent, minWidth : 200}
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
			 self.router.navigate(['store/debitCredit',params.data.id]);
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
		
		this.http.getAllDRCR()
			.subscribe(
			(data) => {
				self.AllPOData = data;
			},
			(error) => self.errorMsg = error,
			() => console.log("completed")
		);
	}
	
}
