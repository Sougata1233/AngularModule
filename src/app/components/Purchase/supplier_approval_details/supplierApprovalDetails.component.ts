import { Component, OnInit, AfterViewInit } from '@angular/core';
import * as $ from 'jquery';

import { HttpTestService } from '../../../services/http.service';
import { AppSettings } from '../../../config/settings/app-settings';
import { Router, ActivatedRoute } from '@angular/router';
import { supplierListModel } from '../../../models/purchase/supplierList.model';
import {Observable} from 'rxjs/Rx';

import {GridOptions} from "ag-grid/main";
	import {gridConversionComponentBale} from "../../common/gridBaleConvertion.Component";
	import {gridConversionComponentPer} from "../../common/gridPerConvertion.Component";
	import {gridPOTotPriceComponent} from "../../common/PurchaseTotalPrice.Component";
	import {gridPOPyblPriceComponent} from "../../common/PurchasePayablePrice.Component";
	import {gridGSTComponent} from "../../common/gridGst.component";
	import {gridSGSTComponent} from "../../common/gridSGst.component";
	import {gridTaxComponent} from "../../common/gridTax.component";
	import {legacyCodeItemNameComponent} from "../../common/legacy_item.component";
	import {numericRequiredEditorComponent} from "../../editor/numericRequiredEditor.component";

@Component({
  selector: 'app-worklist',
  templateUrl: './supplierApprovalDetails.component.html'
})
export class supplierApprovalDetailsComponent implements OnInit {
	
	public sub: any;
	public requestedId: string;
	public indentDetailData : any;
	public indentDetailDataOld : any;
	public statusChangeResponsedata : any;
	public supplierData: any;
	public supplierList : any;
	public prefix : string = "";
	public errorMsg : string = "";
	public successMsg : string = "";
	
	public requestedURL : any;
	public loggedInUserID : string = "";
	public userGroupData : any = '';
	public userMenuData : any = '';
	public userSelectionMenuData : any = [];
	public edited : boolean = false;
	public startingNumber : any;
	public approvalDetailsData : any = [];
	
	
	public gridOptions: GridOptions;
	public hideCol: boolean = true;
	
	public supplierListModel: supplierListModel = new supplierListModel();
	
	public supplierIndentPostData : any;
	
	public columnDef : any = [
		{headerName: "status", field: "status", hide:true, filter:"text"},
		{headerName: "Item Group", field: "itemGroup.name", suppressMenu: true, minWidth : 350},
		{headerName: "Item Descrption", field: "item.name", suppressMenu: true, minWidth : 350, cellRendererFramework: legacyCodeItemNameComponent},
		{headerName: "HSN Code", field: "item.hsnCode", suppressMenu: true, hide : this.hideCol, minWidth : 250},
		{headerName: "Department", field: "deptId", suppressMenu: true, minWidth : 350},
		{headerName: "Quantity", field: "indentQuantity", suppressMenu: true, minWidth : 150, valueFormatter: function (params) {
			return parseFloat(parseFloat(params.value).toFixed(2));
		}},
		{headerName: "Unit", field: "unitId", suppressMenu: true, minWidth : 150},
		{headerName: "Price/Unit", field: "rate", suppressMenu: true, editable : true, minWidth : 200, cellEditorFramework : numericRequiredEditorComponent, valueFormatter: function (params) {
			return (params.value && params.value != undefined && params.value !='')?parseFloat(parseFloat(params.value).toFixed(2)):'';
		}},
		{headerName: "CGST", field: "item.itemTax.gst", suppressMenu: true, cellRendererFramework : gridSGSTComponent, minWidth : 100, hide : true},
		{headerName: "SGST", field: "item.itemTax.gst", suppressMenu: true, cellRendererFramework : gridSGSTComponent, minWidth : 100, hide : true},
		{headerName: "IGST", field: "item.itemTax.gst", suppressMenu: true, cellRendererFramework : gridGSTComponent, minWidth : 100, hide : true},
		{headerName: "Price", field: "indentQuantity", suppressMenu: true, cellRendererFramework: gridPOTotPriceComponent, minWidth : 200, valueFormatter: function (params) {
			return parseFloat(parseFloat(params.value).toFixed(2));
		}},
		{headerName: "Tax", field: "indentQuantity", suppressMenu: true, cellRendererFramework: gridTaxComponent, minWidth : 200, valueFormatter: function (params) {
			return parseFloat(parseFloat(params.value).toFixed(2));
		}},
		{headerName: "Payable", field: "indentQuantity", suppressMenu: true, cellRendererFramework: gridPOPyblPriceComponent, minWidth : 200, valueFormatter: function (params) {
			return parseFloat(parseFloat(params.value).toFixed(2));
		}},
		{headerName: "Additional Requirement", field: "additionalRequirement", suppressMenu: true, minWidth : 350}
	];
	
	public onQuickFilterChanged($event) {
        this.gridOptions.api.setQuickFilter($event.target.value);
    }
	
	constructor(public http: HttpTestService, public router: Router, public activatedRoute: ActivatedRoute) {
		var self = this;
		this.prefix = AppSettings.PREFIX;
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
		 this.gridOptions.onGridReady = function(params){
			 var athleteFilterComponent = params.api.getFilterInstance("status");
			athleteFilterComponent.setModel({
						type:'equals',
						filter:'1'
						});
			params.api.onFilterChanged()
    };
		 this.gridOptions.onCellEditingStopped = function(params) {
			 // if(self.indentDetailData != 'undefined'){
			// var editedVal =	 parseFloat(self.indentDetailData.indentList[params.node.id].rate);
			// self.indentDetailData.indentList[params.node.id].rate = parseFloat(editedVal.toFixed(2));
			 // params.api.setRowData(self.indentDetailData.indentList);
			 params.api.redrawRows();
			 var athleteFilterComponent = self.gridOptions.api.getFilterInstance("status");
			athleteFilterComponent.setModel({
						type:'equals',
						filter:'1'
			});
			self.gridOptions.api.onFilterChanged()
			 };
	}
		
	ngOnInit() {
		this.sub = this.activatedRoute.params.subscribe(params => {
			this.requestedId = params['id'];
		});
		this.getSupplierApprovalDetails();
		this.loadIndentDetrails();
		
		this.loggedInUserID = window.sessionStorage.getItem('id');
		//this.getUserGroup();
		
		
		}
		
		
		
		//get menu items by user group
	getSupplierApprovalDetails = function(){ 
		var self = this;
		
		
		self.http.getSupApprovalDetail(this.requestedId)
			.subscribe(
				(data) => {
					this.approvalDetailsData = data;
				},
				(error) => {
					this.errorMsg = error
				},
				() => {}
			);
		
	}
	
	
	

	
	loadIndentDetrails = function() {
		var self = this;
		
		this.http.getIndentData(this.requestedId)
			.subscribe(
			(data) => {
				self.indentDetailData = data;
				self.indentDetailDataOld = data;
			},
			(error) => self.errorMsg = error,
			() => {});
	}
	
	 
	

		
		
	approveIndentSupplier  = function(){
		var self = this;
		
		var validation = true;
		
		this.http.saveSupplierApprovalData(self.approvalDetailsData)
			.subscribe(
			(data) => {
				self.statusChangeResponsedata = data;
			},
			(error) => self.errorMsg = error,
			() => {
				self.successMsg = "Supplier Rate Approved Successfully.";
				self.statusChange("15");
			}
		);
		
		
		//console.log(self.indentDetailData.indentList);
	}
	

  
  statusChange = function(changedstatus){
		var self = this;
		self.indentDetailData.indentHeader.status = changedstatus;
		//self.indentDetailData.reason = self.indentCreateModel.rejectionReason;
		this.http.updateIndent(self.indentDetailData)
			.subscribe(
			(data) => {
				self.statusChangeResponsedata = data;
			},
			(error) => self.errorMsg = error,
			() => {
				//self.successMsg = "Indent Status Changed Successfully.",
				//self.router.navigate(['store/worklist'])
				self.router.navigate(['purchase/supplierapprovallist']);
			}
		);
	}
  
}
