import { Component, OnInit, AfterViewInit } from '@angular/core';
import * as $ from 'jquery';

import { HttpTestService } from '../../../../services/http.service';
import { sessionServices } from '../../../../services/session.services';
import { AppSettings } from '../../../../config/settings/app-settings';
import { Router, ActivatedRoute } from '@angular/router';
import {GridOptions} from "ag-grid/main";
import {gridDaviationComponent} from "../../../common/gridDaviation.component";
import {gridConversionComponentBale} from "../../../common/gridBaleConvertion.Component";
	import {gridConversionComponentPer} from "../../../common/gridPerConvertion.Component";
	import {legacyCodeItemNameComponent} from "../../../common/legacy_item.component";
	import {numericRequiredEditorComponent} from "../../../editor/numericRequiredEditor.component";

@Component({
  selector: 'app-mr-work-dtls',
  templateUrl: './mrlistDtls.component.html'
})
export class mrDtlslistComponent implements OnInit {
	
	public sub: any;
	public requestedId: string;
	public GRNDtllData : any;
	public gridOptions: GridOptions;
	public statusChangeResponsedata : any;
	public supplierDtlData : any;
	public printableSupplierData : any = "";
	public errorMsg : string = "";
	public successMsg : string = "";
	public MRDtls : any;
	public company : string = "";
	public company_add_1 : string = "";
	public company_add_2 : string = "";
	public company_contact : string = "";
	public prefix : string = "";
	public totalAdvisedWt : any = 0;
	public totalconweight : any = 0;
	public totalActualWt : any = 0;
	public totalDeviation : any = 0;
	public printResponsedata : any = "";
	public printableagentdata : any = "";
	public allmukamdata : any = [];
	public printmukamdata : any = '';
	
	
	public columnDef : any = [
		{headerName: "Advised Jute Type", field: "advisedItem.name", suppressMenu: true, minWidth : 250, valueFormatter: function (params) {
          return params.data.advisedItem.legacyItemCode+"_"+params.value;
        }},
		{headerName: "Actual Jute Type", field: "item.name", suppressMenu: true, minWidth : 250, cellRendererFramework : legacyCodeItemNameComponent},
		{headerName: "Marka", field: "marka", suppressMenu: true, minWidth : 250},
		{headerName: "Advised Quality", field: "advisedQuality.name", suppressMenu: true, minWidth : 250},
		{headerName: "Actual Quality", field: "actualQuality.name", suppressMenu: true, minWidth : 250},
		{headerName: "Advised Weight", field: "advisedWeight", suppressMenu: true, minWidth : 350, valueFormatter: function (params) {
          return parseFloat(parseFloat(params.value).toFixed(2));
        }},
		{headerName: "Actual Weight", field: "actualWeight", suppressMenu: true, minWidth : 350, valueFormatter: function (params) {
          return parseFloat(parseFloat(params.value).toFixed(2));
        }},
		{headerName: "Deviation", field: "deviation", suppressMenu: true, minWidth : 350, valueFormatter: function (params) {
          return parseFloat(parseFloat(params.value).toFixed(2));
        }},
		{headerName: "Conversion Type", field: "unitConversionType", suppressMenu: true, minWidth : 150},
		{headerName: "Advised Conversion Quantity", field: "conversionQuantity", suppressMenu: true, minWidth : 350, valueFormatter: function (params) {
          return parseFloat(parseFloat(params.value).toFixed(2));
        }},
		{headerName: "Actual Conversion Quantity", field: "conversionActualQuantity", suppressMenu: true, minWidth : 350,  valueFormatter: function (params) {
		return parseFloat(parseFloat(params.value).toFixed(2));
		}},
		{headerName: "Allowable Moisture (%)", field: "allowableMoisturePercentage", suppressMenu: true, minWidth : 250},
		{headerName: "Rate", field: "rate", suppressMenu: true, minWidth : 200, valueFormatter: function (params) {
			return (params.value - params.data.claimsQuality).toFixed(2);
		}},
		{headerName: "Claims for Quality", field: "claimsQuality", suppressMenu: true, minWidth : 200},
		{headerName: "Claims for Condition", field: "claimsCondition", suppressMenu: true, minWidth : 200},
		{headerName: "Warehouse No.", field: "warehouseNo", suppressMenu: true, minWidth : 200},
		{headerName: "Remarks", field: "remarks", suppressMenu: true, minWidth : 200},
		{headerName: "status", field: "status", suppressMenu: true, minWidth : 200, hide:true}
	];
	
	public onQuickFilterChanged($event) {
        this.gridOptions.api.setQuickFilter($event.target.value);
    }
	
	constructor(public http: HttpTestService, public router: Router, public activatedRoute: ActivatedRoute , public session: sessionServices) {
		var self = this;
		this.prefix = AppSettings.PREFIX;
		this.company = AppSettings.COMPANY_NAME;
		this.company_add_1 = AppSettings.COMPANY_ADDRESS_ONE;
		this.company_add_2 = AppSettings.COMPANY_ADDRESS_TWO;
		this.company_contact = AppSettings.COMPANY_CONTACT;
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
	
	
	getMRdetailsfrmChalan  = function(emteredChalan,enteredsupp,enteredpo){
		
		var self = this;
		self.http.getMrdetailFrmChalan(emteredChalan,enteredsupp,enteredpo)
			.subscribe(
				(data) => {
					this.MRDtls = data;
				},
				(error) => {
					this.errorMsg = error,
					this.MRDtls = ""
				},
				() => {}
			);
	}
	
	//fetch GRN details
	loadGRNdetails = function(){
		var self = this;
		
		self.http.getMrbyId(self.requestedId)
			.subscribe(
				(data) => {
					this.GRNDtllData = data;
				},
				(error) => {
					this.errorMsg = error,
					this.GRNDtllData = ""
				},
				() => {
					self.getMRdetailsfrmChalan(self.GRNDtllData.materialGoodReceiveHeader.chalanNo,self.GRNDtllData.materialGoodReceiveHeader.supplierId,self.GRNDtllData.materialGoodReceiveHeader.poId);
					for(var i = 0; i < self.GRNDtllData.materialGrnItemList.length; i++){
						if(self.GRNDtllData.materialGrnItemList[i].status != '4'){
						self.totalAdvisedWt = self.totalAdvisedWt + self.GRNDtllData.materialGrnItemList[i].advisedWeight;
						self.totalActualWt = self.totalActualWt + self.GRNDtllData.materialGrnItemList[i].actualWeight;
						self.totalconweight = self.totalconweight + self.GRNDtllData.materialGrnItemList[i].conversionActualQuantity;
						self.totalDeviation = self.totalDeviation + self.GRNDtllData.materialGrnItemList[i].deviation;
						}
					}
					self.getSupplierDetails();
				}
			);
	}
	
	statusChange = function(changedstatus){
		var self = this;
		self.GRNDtllData.materialGoodReceiveHeader.status = changedstatus;
		//self.indentDetailData.reason = self.indentCreateModel.rejectionReason;
		this.http.updateMR(self.GRNDtllData)
			.subscribe(
			(data) => {
				self.statusChangeResponsedata = data;
			},
			(error) => self.errorMsg = error,
			() => {
				self.successMsg = "GRN Status Changed Successfully.",
				self.router.navigate(['store/mrworklist'])
			}
		);
	}
	
	getPrintCounter = function(){
		var self = this;
		this.http.getPrintCount("mr^"+self.requestedId)
			.subscribe(
			(data) => {
				self.printResponsedata = data;
			},
			//(error) => self.errorMsg = error,
			() => {
			}
		);
	}
	
	getSupplierDetails = function(){
		
		var self = this;
		this.http.getAllSuppliers()
			.subscribe(
			(data) => {
				self.supplierDtlData = data;
			},
			(error) => self.errorMsg = error,
			() => {
				for(var i=0; i < self.supplierDtlData.length; i++){
					if(self.supplierDtlData[i].id == self.GRNDtllData.materialGoodReceiveHeader.supplierId){
					self.printableSupplierData = self.supplierDtlData[i];
					}
					
					if(self.supplierDtlData[i].id == self.GRNDtllData.materialGoodReceiveHeader.agentId){
						self.printableagentdata = self.supplierDtlData[i];
					}
				}
				self.loadmukams();
				
			}
		);
	}
	
	loadmukams = function() {
		var self = this;
		self.errorMsg = "";
		self.successMsg = "";
		self.http.getAllMukams()
			.subscribe(
			(data) => {
				self.allMukamData = data;
			},
			(error) => self.errorMsg = error,
			() => {
				for(var i = 0; i<self.allMukamData.length; i++){
					if(self.allMukamData[i].mukamId == self.GRNDtllData.materialGoodReceiveHeader.exSTN){
						self.printmukamdata = self.allMukamData[i].mukamName;
					}
				}
			}
		);
	}
	
	
	
	print = function(){
		var self = this;
		if(self.printResponsedata == ""){
			self.printResponsedata = {
				"type" : "mr",
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
