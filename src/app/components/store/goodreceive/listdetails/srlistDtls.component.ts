import { Component, OnInit, AfterViewInit } from '@angular/core';
import * as $ from 'jquery';

import { HttpTestService } from '../../../../services/http.service';
import { sessionServices } from '../../../../services/session.services';
import { Router, ActivatedRoute } from '@angular/router';
import { AppSettings } from '../../../../config/settings/app-settings';
import {GridOptions} from "ag-grid/main";
import {gridDateComponent} from "../../../common/gridDateFormat.component";
import {legacyCodeItemNameComponent} from "../../../common/legacy_item.component";

@Component({
  selector: 'app-mr-work-dtls',
  templateUrl: './srlistDtls.component.html'
})
export class srDtlslistComponent implements OnInit {
	
	public sub: any;
	public requestedId: string;
	public errorMsg : string = "";
	public successMsg : string = "";
	public GRNDtllData : any;
	public statusChangeResponsedata : any;
	public company : string = "";
	public company_add_1 : string = "";
	public company_add_2 : string = "";
	public company_contact : string = "";
	public gridOptions: GridOptions;
	public printResponsedata : any = "";
	public grossamount : any = 0;
	public grosstax : any = 0;
	public prefix : string = "";
	
	public columnDef : any = [
		{headerName: "Item Code", field: "item.id", suppressMenu: true, minWidth : 100},
		{headerName: "Item Description", field: "item.name", suppressMenu: true, minWidth : 350, cellRendererFramework: legacyCodeItemNameComponent},
		{headerName: "Additional Requirement", field: "additionalRequirements", suppressMenu: true, minWidth : 350},
		{headerName: "Advised Quantity", field: "advisedQuantity", suppressMenu: true, minWidth : 150, valueFormatter: function (params) {
			return parseFloat(parseFloat(params.value).toFixed(2));
		}},
		{headerName: "Actual Quantity", field: "actualQuantity", suppressMenu: true, minWidth : 150, valueFormatter: function (params) {
			return parseFloat(parseFloat(params.value).toFixed(2));
		}},
		{headerName: "Rejected Quantity", field: "orderedPrice", suppressMenu: true, minWidth : 150, valueFormatter: function (params) {
			return parseFloat(parseFloat(params.value).toFixed(2));
		}},
		{headerName: "Deviation", field: "deviation", suppressMenu: true, minWidth : 150, valueFormatter: function (params) {
			return parseFloat(parseFloat(params.value).toFixed(2));
		}},
		{headerName: "Received Price", field: "receivedPrice", suppressMenu: true, minWidth : 150, valueFormatter: function (params) {
			return parseFloat(parseFloat(params.value).toFixed(2));
		}},
		{headerName: "Rejection Code", field: "claims", suppressMenu: true, minWidth : 350},
		{headerName: "Store Id", field: "storeId", suppressMenu: true, minWidth : 100},
		{headerName: "Floor No", field: "floor", suppressMenu: true, minWidth : 100},
		{headerName: "Room No", field: "room", suppressMenu: true, minWidth : 100},
		{headerName: "Rack No", field: "rack", suppressMenu: true, minWidth : 100},
		{headerName: "Position", field: "position", suppressMenu: true, minWidth : 100},
		{headerName: "Expiry Date", field: "expiryDate", suppressMenu: true, cellRendererFramework: gridDateComponent, minWidth : 200},
		{headerName: "Remarks", field: "remarks", suppressMenu: true, minWidth : 350},
		{headerName: "status", field: "status", suppressMenu: true, minWidth : 350, hide:true}
	];
	
	
	public onQuickFilterChanged($event) {
        this.gridOptions.api.setQuickFilter($event.target.value);
    }

	
	constructor(public http: HttpTestService, public router: Router, public activatedRoute: ActivatedRoute , public session: sessionServices) {
		 this.company = AppSettings.COMPANY_NAME;
		 this.prefix = AppSettings.PREFIX;
		this.company_add_1 = AppSettings.COMPANY_ADDRESS_ONE;
		this.company_add_2 = AppSettings.COMPANY_ADDRESS_TWO;
		this.company_contact = AppSettings.COMPANY_CONTACT;
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
		 this.gridOptions.onGridReady = function(params){
			 var athleteFilterComponent = params.api.getFilterInstance("status");
			athleteFilterComponent.setModel({
						type:'notEqual',
						filter:'4'
						});
			params.api.onFilterChanged()
    };
	}
		
	ngOnInit() {
			this.getSession();
			
			this.sub = this.activatedRoute.params.subscribe(params => {
				this.requestedId = params['id'];
			});
			
			this.loadGRNdetails();
			this.getPrintCounter();
		}
	
	//get session details
	getSession = function(){
		this.sessionData = this.session.getSessionDetails();
	}
	
	//fetch GRN details
	loadGRNdetails = function(){
		var self = this;
		
		self.http.getSrbyId(self.requestedId)
			.subscribe(
				(data) => {
					this.GRNDtllData = data;
				},
				(error) => {
					this.errorMsg = error,
					this.GRNDtllData = ""
				},
				() => {
					
					for(var i = 0; i < self.GRNDtllData.storeGrnItemList.length; i++){
						if(self.GRNDtllData.storeGrnItemList[i].status != '4'){
						self.grossamount = self.grossamount + (self.GRNDtllData.storeGrnItemList[i].actualQuantity*self.GRNDtllData.storeGrnItemList[i].receivedPrice);
						self.grosstax = self.grosstax + ((self.GRNDtllData.storeGrnItemList[i].actualQuantity*self.GRNDtllData.storeGrnItemList[i].receivedPrice)*(self.GRNDtllData.storeGrnItemList[i].item.itemTax.gst/100));
						}
					}
				}
			);
	}
	
	
	statusChange = function(changedstatus){
		var self = this;
		self.GRNDtllData.storeGoodReceiveHeader.status = changedstatus;
		//self.indentDetailData.reason = self.indentCreateModel.rejectionReason;
		this.http.updateSR(self.GRNDtllData)
			.subscribe(
			(data) => {
				self.statusChangeResponsedata = data;
			},
			(error) => self.errorMsg = error,
			() => {
				self.successMsg = "GRN Status Changed Successfully.",
				self.router.navigate(['store/srworklist'])
			}
		);
	}
	
	getPrintCounter = function(){
		var self = this;
		this.http.getPrintCount("sr^"+self.requestedId)
			.subscribe(
			(data) => {
				self.printResponsedata = data;
			},
			//(error) => self.errorMsg = error,
			() => {
			}
		);
	}
	
	print = function(){
		var self = this;
		if(self.printResponsedata == ""){
			self.printResponsedata = {
				"type" : "sr",
				"id" : self.requestedId,
				"counter" : 1
			};
		}else{
			self.printResponsedata.counter = self.printResponsedata.counter + 1;
		}
		this.http.addCounter(self.printResponsedata)
			.subscribe(
			(data) => {
				//self.supplierDtlData = data;
			},
			(error) => self.errorMsg = error,
			() => {
				window.print();
			}
		);
		
	}
	
}
