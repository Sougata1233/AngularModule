import { Component, OnInit, AfterViewInit } from '@angular/core';
import * as $ from 'jquery';

import { HttpTestService } from '../../../../services/http.service';
import { sessionServices } from '../../../../services/session.services';
import { Router, ActivatedRoute } from '@angular/router';
import {GridOptions} from "ag-grid/main";
import {gridDaviationComponent} from "../../../common/gridDaviation.component";
import {gridConversionComponentBale} from "../../../common/gridBaleConvertion.Component";
import {gridConversionComponentPer} from "../../../common/gridPerConvertion.Component";
import {legacyCodeItemNameComponent} from "../../../common/legacy_item.component";
import {batchcellrenderer} from "../../../common/batchcellrenderer.component";

@Component({
  selector: 'app-mr-work-dtls',
  templateUrl: './issueDtls.component.html'
})
export class issueDetailsComponent implements OnInit {
	
	public sub: any;
	public requestedId: string;
	public errorMsg : string = "";
	public successMsg : string = "";
	public GRNDtllData : any;
	public gridOptions: GridOptions;
	public statusChangeResponsedata : any;
	public hideCol: boolean = true;
	
	public columnDef : any = [
		{headerName: "Item Group", field: "itemGroup.name", suppressMenu: true, minWidth : 250},
		{headerName: "Item Descrption", field: "item.name", suppressMenu: true, minWidth : 250, cellRendererFramework: legacyCodeItemNameComponent},
		{headerName: "Quality", field: "quality.name", suppressMenu: true, minWidth : 250},
		{headerName: "Stock", field: "stock", suppressMenu: true, minWidth : 250, valueFormatter: function (params) {
			return parseFloat(parseFloat(params.value).toFixed(2));
		}},
		{headerName: "Quantity", field: "issueQuantity", suppressMenu: true, minWidth : 250, valueFormatter: function (params) {
			return parseFloat(parseFloat(params.value).toFixed(2));
		}},
		{headerName: "Unit", field: "quantityUnit.name", suppressMenu: true, minWidth : 250},
		{headerName: "Additional Requirements", field: "additionalRequirement", suppressMenu: true, minWidth : 250},
		{headerName: "Remarks", field: "remark", suppressMenu: true, minWidth : 250}
	];
	
	public onQuickFilterChanged($event) {
        this.gridOptions.api.setQuickFilter($event.target.value);
    }
	
	constructor(public http: HttpTestService, public router: Router, public activatedRoute: ActivatedRoute , public session: sessionServices) {
		var self = this;
		this.gridOptions = <GridOptions>{};
		 //this.gridOptions.columnDefs = this.columnDef;
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
		 
		 
	}
		
	ngOnInit() {
			this.getSession();
			
			this.sub = this.activatedRoute.params.subscribe(params => {
				this.requestedId = params['id'];
			});
			
			this.loadGRNdetails();
		}
	
	//get session details
	getSession = function(){
		this.sessionData = this.session.getSessionDetails();
	}
	
	//fetch GRN details
	loadGRNdetails = function(){
		var self = this;
		
		self.http.getIssuebyId(self.requestedId)
			.subscribe(
				(data) => {
					this.GRNDtllData = data;
				},
				(error) => {
					this.errorMsg = error,
					this.GRNDtllData = ""
				},
				() => {
					if(self.GRNDtllData.issueHeader.goodType == "MR"){
						self.columnDef = [
		{headerName: "Item Group", field: "itemGroup.name", suppressMenu: true, minWidth : 250, hide:true},
		{headerName: "Item Descrption", field: "item.name", suppressMenu: true, minWidth : 250, cellRendererFramework: legacyCodeItemNameComponent},
		{headerName: "Quality", field: "quality.name", suppressMenu: true, minWidth : 250},
		{headerName: "Physical Stock", field: "stock", suppressMenu: true, minWidth : 250, valueFormatter: function (params) {
			return parseFloat(parseFloat(params.value).toFixed(2));
		}},
		{headerName: "Issued Quantity", field: "issueQuantity", suppressMenu: true, minWidth : 250, valueFormatter: function (params) {
			return parseFloat(parseFloat(params.value).toFixed(2));
		}},
		{headerName: "Unit", field: "quantityUnit.name", suppressMenu: true, minWidth : 250},
		{headerName: "Batch Type", field: "serviceBatchType", suppressMenu: true, minWidth : 250, cellRendererFramework: batchcellrenderer},
		{headerName: "Remarks", field: "remark", suppressMenu: true, minWidth : 250}
	];
					}else{
						self.columnDef = [
		{headerName: "Item Group", field: "itemGroup.name", suppressMenu: true, minWidth : 250, hide:false},
		{headerName: "Item Descrption", field: "item.name", suppressMenu: true, minWidth : 250, cellRendererFramework: legacyCodeItemNameComponent},
		{headerName: "Quality", field: "quality.name", suppressMenu: true, minWidth : 250, hide:true},
		{headerName: "Physical Stock", field: "stock", suppressMenu: true, minWidth : 250, valueFormatter: function (params) {
			return parseFloat(parseFloat(params.value).toFixed(2));
		}},
		{headerName: "Issued Quantity", field: "issueQuantity", suppressMenu: true, minWidth : 250, valueFormatter: function (params) {
			return parseFloat(parseFloat(params.value).toFixed(2));
		}},
		{headerName: "Unit", field: "quantityUnit.name", suppressMenu: true, minWidth : 250},
		{headerName: "Remarks", field: "remark", suppressMenu: true, minWidth : 250}
	];
					}
					
				}
			);
	}
	
	
	
}
