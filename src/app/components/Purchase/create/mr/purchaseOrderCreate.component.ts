import { Component, OnInit, AfterViewInit } from '@angular/core';
import * as $ from 'jquery';
import {IMyDpOptions} from 'mydatepicker';
import { AppSettings } from '../../../../config/settings/app-settings';
import { HttpTestService } from '../../../../services/http.service';
import { sessionServices } from '../../../../services/session.services';
import { Router } from '@angular/router';
import {Observable} from 'rxjs/Rx';
import {GridOptions} from "ag-grid/main";
import {gridConversionComponentBale} from "../../../common/gridBaleConvertion.Component";
import {gridConversionComponentPer} from "../../../common/gridPerConvertion.Component";
import {gridPOPyblPriceComponent} from "../../../common/PurchasePayablePrice.Component";
import {numericRequiredEditorComponent} from "../../../editor/numericRequiredEditor.component";
import {numericPercentageEditorComponent} from "../../../editor/numaricpercentageEditor.component";
import {legacyCodeItemNameComponent} from "../../../common/legacy_item.component";
import {gridDeleteComponent} from "../../../common/gridRowDelete.component";

import { purchaseCreateModel } from '../../../../models/purchase/purchaseCreate.model';

@Component({
  selector: 'app-create-indent',
  templateUrl: './purchaseOrderCreate.component.html'
})


export class createMRPOComponent implements OnInit {
	
	public supplierListJute : any = [];
	public mukams : any = [];
	public itemData : any = [];
	public indentData : any = [];
	public allVehicles : any = [];
	public departments: any ;
	public juteDept: any ;
	public itemGroup: any ;
	public juteItemGrp: any ;
	public units: any ;
	public Qunits: any ;
	public itemQuality: any ;
	public indentdtldata : any;
	public looseMaxVal : number = 100; 
	public baleMaxVal : number = 0;
	public itemsForIndent : any = [];
	public createIndentResponseData : any = [];
	public allBroker : any = [];
	
	
	
	
	
	public successMsg: string ;
	public errorMsg: string ;
	public purchaseCreateModel: purchaseCreateModel = new purchaseCreateModel();
	public sessionData: any;
	public requestedURL : any;
	public userSelectionMenuData : any = [];
	public indentListAll : any = [];
	public indentDetailData : any = [];
	public rateComparedata : any = [];
	public userGroupData : any;
	public prefix : string = '';
	public totJuteQuantity : number = 0;
	public alreadycreatedPOItems : any = [];
	
	public clock = Observable
        .interval(1000)
	.map(()=> new Date());
	
	
	public allTypes : any;
	public addedItems : any = [];
	public TotalQuantity : number = 0;
	public Math : any;
	public columnDef : any = [
		//{headerName: "Item Group", field: "itemGroup.name", suppressMenu: true, minWidth : 250},
		{headerName: "Item Descrption", field: "item.name", suppressMenu: true, minWidth : 250, cellRendererFramework: legacyCodeItemNameComponent},
		{headerName: "Quality", field: "quality.name", suppressMenu: true, minWidth : 250},
		
		{headerName: "Price/Unit", field: "rate", suppressMenu: true, minWidth : 250, cellEditorFramework: numericRequiredEditorComponent, editable : true, valueFormatter: function (params) {
			return parseFloat(parseFloat(params.value).toFixed(2));
		}},
		{headerName: "Previous Purchase Rate", field: "poActualRate", suppressMenu: true, minWidth : 250, valueFormatter: function (params) {
			return parseFloat(parseFloat(params.value).toFixed(2));
		}},
		{headerName: "Allowable Moisture (%)", field: "allowableMoisturePercentage", suppressMenu: true, minWidth : 250, cellEditorFramework: numericPercentageEditorComponent, editable : true},
		
		{headerName: "Weight", field: "poActualQuantity", suppressMenu: true, minWidth : 250,  valueFormatter: function (params) {
			return parseFloat(parseFloat(params.value).toFixed(2));
		}},
		{headerName: "Unit", field: "quantityUnit.name", suppressMenu: true, minWidth : 250},
		{headerName: "Converted Quantity", field: "", suppressMenu: true, minWidth : 250},
		{headerName: "Payable", field: "valueWithoutTax", suppressMenu: true, minWidth : 250, valueFormatter: function (params) {
			return parseFloat(parseFloat(params.value).toFixed(2));
		}},
		{headerName: "Discount(%)", field: "discount", suppressMenu: true, minWidth : 250, editable : true, cellEditorFramework: numericPercentageEditorComponent, valueFormatter: function (params) {
			return (isNaN(params.value))?0:parseFloat(parseFloat(params.value).toFixed(2));
		}},
		{headerName: "Additional Requirement", field: "additionalRequirement", suppressMenu: true, minWidth : 250, editable : true, cellEditor : 'largeText'},
		{headerName: "Delete", field: "", suppressMenu: true, minWidth : 250, hide : true, cellRendererFramework: gridDeleteComponent}
	];
	
	
	public myDatePickerOptions: IMyDpOptions = {
        // other options...
        dateFormat: 'yyyy-mm-dd',
		disableSince : { year: new Date().getFullYear(), month: new Date().getMonth()+1, day: new Date().getDate()+1 }
    };
	
	public gridOptions: GridOptions;
	
	public poPostData = {
	"poHeader": {
		"type": "O",
		"status": "Pending",
		"submitter": "7",
		"finnacialYear": "2017      ",
		"createDate": 1504302145000,
		"poDate": 1504302088000,
		"approverFirst": null,
		"approverSecond": null,
		"approveFirstDate": null,
		"approveSecondDate": null,
		"footerNote": "haha",
		"supplierId": "T002",
		"companyCode": "1",
		"mukam": null,
		"deliveryAddress": null,
		"tax": 20.0,
		"valueWithTax": 120.0,
		"valueWithoutTax": 100.0,
		"discount"		:	0,
		"frieghtCharge"	:	0,
		"deliveryTimeline" : null,
		"juteUnit"	:	null,
		"vehicleTypeId" : null,
		"vehicleQuantity" : null
		
	},
	"poItemList": []
};

	public createIndentPostData = {
	"indentHeader": {

		"type": "O",
		"status": null,
		"mukam": null,
		"vehicleTypeId": null,
		"vehicleQuantity": null,
		"submitter": "dhriti",
		"finnacialYear": "2017",
		"createDate": 1503987015000,
		"indentDate": 1503987015000
	},
	"indentList": []
};
	
	
	constructor(public http: HttpTestService, public router: Router, public session: sessionServices) { 
		var self = this;
		self.Math = Math;
		this.prefix = AppSettings.PREFIX;
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
		 this.gridOptions.onRowClicked = function(params) {
			 var clickedItem = $(params.event.target).attr("data-action-type");
			 //var typeofTarget = $(clickedItem.getAttribute("data-action-type");
			 if(clickedItem == "remove"){self.deleteItem(params.node.id)}
		 };
		 this.gridOptions.onCellEditingStopped = function(params) {
			 if(self.addedItems != 'undefined'){
				 
				 
				var totPrice = 0;
				var totTax = 0;
				for(var i = 0; i < self.addedItems.length; i++){
				if(self.addedItems[i].status != "4"){
					self.addedItems[i].discount = (isNaN(self.addedItems[i].discount))?0:parseFloat(parseFloat(self.addedItems[i].discount).toFixed(2));
					self.addedItems[i].valueWithoutTax = (self.addedItems[i].poQuantity * self.addedItems[i].rate) - (self.addedItems[i].poQuantity * self.addedItems[i].rate * (self.addedItems[i].discount/100));
					self.addedItems[i].tax = (self.addedItems[i].valueWithoutTax * self.addedItems[i].item.itemTax.gst)/100;
					totPrice = totPrice + self.addedItems[i].valueWithoutTax;
					totTax = totTax + self.addedItems[i].tax;
					}
				}
				
				// self.poDetailData.poHeader.valueWithoutTax = totPrice - (totPrice * (self.poDetailData.poHeader.discount/100));
				// self.poDetailData.poHeader.tax = totTax;
				// self.poDetailData.poHeader.valueWithTax = self.poDetailData.poHeader.valueWithoutTax + totTax;
				 
				 
				 params.api.setRowData(self.addedItems);
				}
			 };
		 
	}
	
	
		
	ngOnInit() {
		this.getSession();
		this.getUserGroup();
		this.getSupByType();
		this.getAllVehicles();
		this.loadDepartments();
		this.loadUnits();
		this.loadItemGroups();
		this.loadAllBroker();
		
		this.loadTypes();
	}
	
	validatePOQuantity = function(e){
		var self = this;
		self.errorMsg = "";
		self.successMsg = "";
		self.totJuteQuantity = 0;
		self.purchaseCreateModel.conversiontype = "LOOSE";
		self.purchaseCreateModel.selectedmrItem= "";
		self.purchaseCreateModel.selectedQuality = "";
		self.purchaseCreateModel.selectedQuantity = "";
		self.looseMaxVal = 100;
		self.baleMaxVal = 0;
		self.addedItems = [];
		var selectedVal = e.target.value;
		var maxNumber = (self.purchaseCreateModel.vehicleQuantity * self.allVehicles[self.purchaseCreateModel.vehicleType].weight);
		var minNumber = 1;
		if(self.allVehicles[self.purchaseCreateModel.vehicleType].vehicleType == "LARGE"){
			var index;
			for(var i = 0; i < self.allVehicles.length; i++){
				console.log(self.allVehicles[i].vehicleType);
				if(self.allVehicles[i].vehicleType == "BIG"){index = i}
			}
			
			minNumber = (self.purchaseCreateModel.vehicleQuantity * self.allVehicles[index].weight) + 1;
		}
		if(self.allVehicles[self.purchaseCreateModel.vehicleType].vehicleType == "BIG"){
			var index;
			for(var i = 0; i < self.allVehicles.length; i++){
				console.log(self.allVehicles[i].vehicleType);
				if(self.allVehicles[i].vehicleType == "MEDIUM"){index = i}
			}
			
			minNumber = (self.purchaseCreateModel.vehicleQuantity * self.allVehicles[index].weight) + 1;
		}
		if(self.allVehicles[self.purchaseCreateModel.vehicleType].vehicleType == "MEDIUM"){
			var index;
			for(var i = 0; i < self.allVehicles.length; i++){
				console.log(self.allVehicles[i].vehicleType);
				if(self.allVehicles[i].vehicleType == "SMALL"){index = i}
			}
			
			minNumber = (self.purchaseCreateModel.vehicleQuantity * self.allVehicles[index].weight) + 1;
		}
		
		if(selectedVal > maxNumber){
			self.purchaseCreateModel.poQuantity = maxNumber;
		}
		
		if(selectedVal < minNumber){
			self.purchaseCreateModel.poQuantity = minNumber;
		}
	}
	
	pocreateTypeChange = function(e){
		var self = this;
		self.errorMsg = "";
		self.successMsg = "";
		self.totJuteQuantity = 0;
		self.purchaseCreateModel.mrsupplier = "";
		self.purchaseCreateModel.selectedmrItem = "";
		self.itemData = "";
		self.purchaseCreateModel.vehicleQuantity = 1;
		self.purchaseCreateModel.conversiontype = "LOOSE";
		self.purchaseCreateModel.creditTerm = 1;
		self.purchaseCreateModel.flightcharge = "";
		self.purchaseCreateModel.createDate = { date: { year: new Date().getFullYear(), month: new Date().getMonth()+1, day: new Date().getDate() } };
		self.purchaseCreateModel.mrmukam = "";
		self.mukams = [];
		self.purchaseCreateModel.vehicleType = "";
		self.purchaseCreateModel.discounthdr = 0;
		self.purchaseCreateModel.deliveryTime = "";
		self.purchaseCreateModel.mrIndent = "";
		self.indentData = [];
		self.purchaseCreateModel.selectedQuality = "";
		self.itemQuality = [];
		self.purchaseCreateModel.selectedQuantity = "";
		self.looseMaxVal = 100;
		self.baleMaxVal = 0;
		self.addedItems = [];
		self.itemsForIndent = [];
		self.indentdtldata = "";
		self.purchaseCreateModel.poQuantity = 0;
		if(e.target.value == "withoutindent"){
		self.columnDef = [
		//{headerName: "Item Group", field: "itemGroup.name", suppressMenu: true, minWidth : 250},
		{headerName: "Item Descrption", field: "item.name", suppressMenu: true, minWidth : 250, cellRendererFramework: legacyCodeItemNameComponent},
		{headerName: "Quality", field: "quality.name", suppressMenu: true, minWidth : 250},
		
		{headerName: "Price/Unit", field: "rate", suppressMenu: true, minWidth : 250, cellEditorFramework: numericRequiredEditorComponent, editable : true, valueFormatter: function (params) {
			return parseFloat(parseFloat(params.value).toFixed(2));
		}},
		
		{headerName: "Previous Purchase Rate", field: "poActualRate", suppressMenu: true, minWidth : 250, valueFormatter: function (params) {
			return parseFloat(parseFloat(params.value).toFixed(2));
		}},
		{headerName: "Allowable Moisture (%)", field: "allowableMoisturePercentage", suppressMenu: true, minWidth : 250, cellEditorFramework: numericPercentageEditorComponent, editable : true},
		{headerName: "Weight", field: "poActualQuantity", suppressMenu: true, minWidth : 250, valueFormatter: function (params) {
			return parseFloat(parseFloat(params.value).toFixed(2));
		}},
		{headerName: "Unit", field: "quantityUnit.name", suppressMenu: true, minWidth : 250},
		{headerName: "Converted Quantity", field: "", suppressMenu: true, minWidth : 250, 
		valueFormatter: function (params) {
			self.addedItems[params.node.id].unitConversionType = "LOOSE";
			self.addedItems[params.node.id].conversionQuantity = parseFloat(params.data.poActualQuantity).toFixed(2);
          return parseFloat(((params.data.poActualQuantity/(self.purchaseCreateModel.poQuantity))*100).toFixed(2)) +" %";
        }},
		{headerName: "Payable", field: "valueWithoutTax", suppressMenu: true, minWidth : 250, valueFormatter: function (params) {
			return parseFloat(parseFloat(params.value).toFixed(2));
		}},
		{headerName: "Discount(%)", field: "discount", suppressMenu: true, minWidth : 250, editable : true, cellEditorFramework: numericPercentageEditorComponent, valueFormatter: function (params) {
			return (isNaN(params.value))?0:parseFloat(parseFloat(params.value).toFixed(2));
		}},
		{headerName: "Additional Requirement", field: "additionalRequirement", suppressMenu: true, minWidth : 250, editable : true, cellEditor : 'largeText'},
		{headerName: "Delete", field: "", suppressMenu: true, minWidth : 250, hide : false, cellRendererFramework: gridDeleteComponent}
	];
		}else{
			self.columnDef = [
		//{headerName: "Item Group", field: "itemGroup.name", suppressMenu: true, minWidth : 250},
		{headerName: "Item Descrption", field: "item.name", suppressMenu: true, minWidth : 250, cellRendererFramework: legacyCodeItemNameComponent},
		{headerName: "Quality", field: "quality.name", suppressMenu: true, minWidth : 250},
		
		{headerName: "Price/Unit", field: "rate", suppressMenu: true, minWidth : 250, cellEditorFramework: numericRequiredEditorComponent, editable : true, valueFormatter: function (params) {
			return parseFloat(parseFloat(params.value).toFixed(2));
		}},
		{headerName: "Previous Purchase Rate", field: "poActualRate", suppressMenu: true, minWidth : 250, valueFormatter: function (params) {
			return parseFloat(parseFloat(params.value).toFixed(2));
		}},
		{headerName: "Allowable Moisture (%)", field: "allowableMoisturePercentage", suppressMenu: true, minWidth : 250, cellEditorFramework: numericPercentageEditorComponent, editable : true},
		
		{headerName: "Weight", field: "poActualQuantity", suppressMenu: true, minWidth : 250, valueFormatter: function (params) {
			return parseFloat(parseFloat(params.value).toFixed(2));
		}},
		{headerName: "Unit", field: "quantityUnit.name", suppressMenu: true, minWidth : 250},
		{headerName: "Converted Quantity", field: "", suppressMenu: true, minWidth : 250, 
			valueFormatter: function (params) {
				self.addedItems[params.node.id].unitConversionType = "LOOSE";
				self.addedItems[params.node.id].conversionQuantity = parseFloat(params.data.poActualQuantity).toFixed(2);
				return  parseFloat(((params.data.poActualQuantity/self.totJuteQuantity)*100).toFixed(2)) +" %";
        }
		},
		{headerName: "Payable", field: "valueWithoutTax", suppressMenu: true, minWidth : 250, valueFormatter: function (params) {
			return parseFloat(parseFloat(params.value).toFixed(2));
		}},
		{headerName: "Discount(%)", field: "discount", suppressMenu: true, minWidth : 250, editable : true, cellEditorFramework: numericPercentageEditorComponent, valueFormatter: function (params) {
			return (isNaN(params.value))?0:parseFloat(parseFloat(params.value).toFixed(2));
		}},
		{headerName: "Additional Requirement", field: "additionalRequirement", suppressMenu: true, minWidth : 250, editable : true, cellEditor : 'largeText'},
		{headerName: "Delete", field: "", suppressMenu: true, minWidth : 250, hide : true}
	];
		}
		
	}
	
	
	loadAllBroker = function(){
		$("#page_loader_service").fadeIn()
		 this.http.getAllMasterBroker()
		  .subscribe(
			(data) => {
			  this.allBroker = data;
			  },
			(error) => {
				this.errorMsg = error;
				this.allBroker = "";
			},
			() => {$("#page_loader_service").fadeOut()}
		  );
	}
	
	vehicletypechange = function(){
		var self = this;
		self.errorMsg = "";
		self.successMsg = "";
		self.totJuteQuantity = 0;
		self.purchaseCreateModel.selectedmrItem = "";
		self.purchaseCreateModel.vehicleQuantity = 1;
		self.purchaseCreateModel.conversiontype = "LOOSE";
		self.purchaseCreateModel.discounthdr = 0;
		self.purchaseCreateModel.selectedQuality = "";
		self.itemQuality = [];
		self.purchaseCreateModel.selectedQuantity = "";
		self.looseMaxVal = 100;
		self.baleMaxVal = 0;
		self.addedItems = [];
		self.itemsForIndent = [];
		self.indentdtldata = "";
		self.purchaseCreateModel.poQuantity = 0;
		self.updateBale();
	}
	
	
	
	vehicleQuanchange = function(){
		var self = this;
		self.errorMsg = "";
		self.successMsg = "";
		self.totJuteQuantity = 0;
		self.purchaseCreateModel.selectedmrItem = "";
		self.purchaseCreateModel.conversiontype = "LOOSE";
		self.purchaseCreateModel.selectedQuality = "";
		self.itemQuality = [];
		self.purchaseCreateModel.selectedQuantity = "";
		self.looseMaxVal = 100;
		self.baleMaxVal = 0;
		self.addedItems = [];
		self.itemsForIndent = [];
		self.indentdtldata = "";
		self.updateBale();
	}
	
	brokerChange = function(e){
		$("#page_loader_service").fadeIn()
		var self = this;
		self.errorMsg = "";
		self.successMsg = "";
		self.totJuteQuantity = 0;
		self.purchaseCreateModel.mrsupplier = "";
		self.purchaseCreateModel.selectedmrItem = "";
		self.itemData = "";
		self.purchaseCreateModel.vehicleQuantity = 1;
		self.purchaseCreateModel.conversiontype = "LOOSE";
		self.purchaseCreateModel.creditTerm = 1;
		self.purchaseCreateModel.flightcharge = "";
		self.purchaseCreateModel.createDate = { date: { year: new Date().getFullYear(), month: new Date().getMonth()+1, day: new Date().getDate() } };
		self.purchaseCreateModel.mrmukam = "";
		self.mukams = [];
		self.purchaseCreateModel.vehicleType = "";
		self.purchaseCreateModel.discounthdr = 0;
		self.purchaseCreateModel.deliveryTime = "";
		self.purchaseCreateModel.mrIndent = "";
		self.indentData = [];
		self.purchaseCreateModel.selectedQuality = "";
		self.itemQuality = [];
		self.purchaseCreateModel.selectedQuantity = "";
		self.looseMaxVal = 100;
		self.baleMaxVal = 0;
		self.addedItems = [];
		self.itemsForIndent = [];
		self.indentdtldata = "";
		self.purchaseCreateModel.poQuantity = 0;
		if(self.purchaseCreateModel.mrpoindent == "withoutindent"){
		self.columnDef = [
		//{headerName: "Item Group", field: "itemGroup.name", suppressMenu: true, minWidth : 250},
		{headerName: "Item Descrption", field: "item.name", suppressMenu: true, minWidth : 250, cellRendererFramework: legacyCodeItemNameComponent},
		{headerName: "Quality", field: "quality.name", suppressMenu: true, minWidth : 250},
		
		{headerName: "Price/Unit", field: "rate", suppressMenu: true, minWidth : 250, cellEditorFramework: numericRequiredEditorComponent, editable : true, valueFormatter: function (params) {
			return parseFloat(parseFloat(params.value).toFixed(2));
		}},
		{headerName: "Previous Purchase Rate", field: "poActualRate", suppressMenu: true, minWidth : 250, valueFormatter: function (params) {
			return parseFloat(parseFloat(params.value).toFixed(2));
		}},
		{headerName: "Allowable Moisture (%)", field: "allowableMoisturePercentage", suppressMenu: true, minWidth : 250, cellEditorFramework: numericPercentageEditorComponent, editable : true},
		
		{headerName: "Weight", field: "poActualQuantity", suppressMenu: true, minWidth : 250, valueFormatter: function (params) {
			return parseFloat(parseFloat(params.value).toFixed(2));
		}},
		{headerName: "Unit", field: "quantityUnit.name", suppressMenu: true, minWidth : 250},
		{headerName: "Converted Quantity", field: "", suppressMenu: true, minWidth : 250, 
		valueFormatter: function (params) {
			self.addedItems[params.node.id].unitConversionType = "LOOSE";
			self.addedItems[params.node.id].conversionQuantity = parseFloat(params.data.poActualQuantity).toFixed(2);
          return parseFloat(((params.data.poActualQuantity/(self.purchaseCreateModel.poQuantity))*100).toFixed(2)) +" %";
        }},
		{headerName: "Payable", field: "valueWithoutTax", suppressMenu: true, minWidth : 250, valueFormatter: function (params) {
			return parseFloat(parseFloat(params.value).toFixed(2));
		}},
		{headerName: "Discount(%)", field: "discount", suppressMenu: true, minWidth : 250, editable : true, cellEditorFramework: numericPercentageEditorComponent, valueFormatter: function (params) {
			return (isNaN(params.value))?0:parseFloat(parseFloat(params.value).toFixed(2));
		}},
		{headerName: "Additional Requirement", field: "additionalRequirement", suppressMenu: true, minWidth : 250, editable : true, cellEditor : 'largeText'},
		{headerName: "Delete", field: "", suppressMenu: true, minWidth : 250, hide : false, cellRendererFramework: gridDeleteComponent}
	];
		}else{
			self.columnDef = [
		//{headerName: "Item Group", field: "itemGroup.name", suppressMenu: true, minWidth : 250},
		{headerName: "Item Descrption", field: "item.name", suppressMenu: true, minWidth : 250, cellRendererFramework: legacyCodeItemNameComponent},
		{headerName: "Quality", field: "quality.name", suppressMenu: true, minWidth : 250},
		
		{headerName: "Price/Unit", field: "rate", suppressMenu: true, minWidth : 250, cellEditorFramework: numericRequiredEditorComponent, editable : true, valueFormatter: function (params) {
			return parseFloat(parseFloat(params.value).toFixed(2));
		}},
		{headerName: "Previous Purchase Rate", field: "poActualRate", suppressMenu: true, minWidth : 250, valueFormatter: function (params) {
			return parseFloat(parseFloat(params.value).toFixed(2));
		}},
		{headerName: "Allowable Moisture (%)", field: "allowableMoisturePercentage", suppressMenu: true, minWidth : 250, cellEditorFramework: numericPercentageEditorComponent, editable : true},
		
		{headerName: "Weight", field: "poActualQuantity", suppressMenu: true, minWidth : 250, valueFormatter: function (params) {
			return parseFloat(parseFloat(params.value).toFixed(2));
		}},
		{headerName: "Unit", field: "quantityUnit.name", suppressMenu: true, minWidth : 250},
		{headerName: "Converted Quantity", field: "", suppressMenu: true, minWidth : 250, 
			valueFormatter: function (params) {
				self.addedItems[params.node.id].unitConversionType = "LOOSE";
			self.addedItems[params.node.id].conversionQuantity = parseFloat(params.data.poActualQuantity).toFixed(2);
          return  parseFloat(((params.data.poActualQuantity/self.totJuteQuantity)*100).toFixed(2)) +" %";
        }
		},
		{headerName: "Payable", field: "valueWithoutTax", suppressMenu: true, minWidth : 250, valueFormatter: function (params) {
			return parseFloat(parseFloat(params.value).toFixed(2));
		}},
		{headerName: "Discount(%)", field: "discount", suppressMenu: true, minWidth : 250, editable : true, cellEditorFramework: numericPercentageEditorComponent, valueFormatter: function (params) {
			return (isNaN(params.value))?0:parseFloat(parseFloat(params.value).toFixed(2));
		}},
		{headerName: "Additional Requirement", field: "additionalRequirement", suppressMenu: true, minWidth : 250, editable : true, cellEditor : 'largeText'},
		{headerName: "Delete", field: "", suppressMenu: true, minWidth : 250, hide : true}
	];
		}
		self.supplierListJute.length = 0;
		if(e.target.value != ""){
			self.http.getSupplierByBroker(self.allBroker[e.target.value].brokerId)
			.subscribe(
			(data) => {
				self.supplierListJute = data;
			},
			(error) => self.errorMsg = error,
			() => $("#page_loader_service").fadeOut()
			);
		}else{
			self.http.getSupByType("J")
			.subscribe(
			(data) => {
				self.supplierListJute = data;
			},
			(error) => self.errorMsg = error,
			() => $("#page_loader_service").fadeOut()
			);
		}
		
		
	}
	
	conversionChange = function(e){
		var self = this;
		self.errorMsg = "";
		self.successMsg = "";
		self.addedItems.length = 0;
		self.totJuteQuantity = 0;
		self.purchaseCreateModel.selectedmrItem= "";
		self.purchaseCreateModel.selectedQuality = "";
		self.purchaseCreateModel.selectedQuantity = "";
		self.looseMaxVal = 100; 
		self.baleMaxVal = 0;
		var selectedVal = e.target.value;
		if(selectedVal == "LOOSE"){
			if(self.purchaseCreateModel.mrpoindent == "withoutindent"){
				self.columnDef = [
				//{headerName: "Item Group", field: "itemGroup.name", suppressMenu: true, minWidth : 250},
				{headerName: "Item Descrption", field: "item.name", suppressMenu: true, minWidth : 250, cellRendererFramework: legacyCodeItemNameComponent},
				{headerName: "Quality", field: "quality.name", suppressMenu: true, minWidth : 250},
				
				{headerName: "Price/Unit", field: "rate", suppressMenu: true, minWidth : 250, cellEditorFramework: numericRequiredEditorComponent, editable : true, valueFormatter: function (params) {
			return parseFloat(parseFloat(params.value).toFixed(2));
		}},
		{headerName: "Previous Purchase Rate", field: "poActualRate", suppressMenu: true, minWidth : 250, valueFormatter: function (params) {
			return parseFloat(parseFloat(params.value).toFixed(2));
		}},
		{headerName: "Allowable Moisture (%)", field: "allowableMoisturePercentage", suppressMenu: true, minWidth : 250, cellEditorFramework: numericPercentageEditorComponent, editable : true},
				
				{headerName: "Weight", field: "poActualQuantity", suppressMenu: true, minWidth : 250, valueFormatter: function (params) {
			return parseFloat(parseFloat(params.value).toFixed(2));
		}},
				{headerName: "Unit", field: "quantityUnit.name", suppressMenu: true, minWidth : 250},
				{headerName: "Converted Quantity", field: "", suppressMenu: true, minWidth : 250, 
				valueFormatter: function (params) {
				  self.addedItems[params.node.id].unitConversionType = "LOOSE";
				  self.addedItems[params.node.id].conversionQuantity = parseFloat(params.data.poActualQuantity).toFixed(2);
				  return  parseFloat(((params.data.poActualQuantity/(self.purchaseCreateModel.poQuantity))*100).toFixed(2)) +" %";
				}},
				{headerName: "Payable", field: "valueWithoutTax", suppressMenu: true, minWidth : 250, valueFormatter: function (params) {
			return parseFloat(parseFloat(params.value).toFixed(2));
		}},
				{headerName: "Discount(%)", field: "discount", suppressMenu: true, minWidth : 250, editable : true, cellEditorFramework: numericPercentageEditorComponent, valueFormatter: function (params) {
			return (isNaN(params.value))?0:parseFloat(parseFloat(params.value).toFixed(2));
		}},
				{headerName: "Additional Requirement", field: "additionalRequirement", suppressMenu: true, minWidth : 250, editable : true, cellEditor : 'largeText'},
				{headerName: "Delete", field: "", suppressMenu: true, minWidth : 250, hide : false, cellRendererFramework: gridDeleteComponent}
			];
				}else{
					self.columnDef = [
				//{headerName: "Item Group", field: "itemGroup.name", suppressMenu: true, minWidth : 250},
				{headerName: "Item Descrption", field: "item.name", suppressMenu: true, minWidth : 250, cellRendererFramework: legacyCodeItemNameComponent},
				{headerName: "Quality", field: "quality.name", suppressMenu: true, minWidth : 250},
				
				{headerName: "Price/Unit", field: "rate", suppressMenu: true, minWidth : 250, cellEditorFramework: numericRequiredEditorComponent, editable : true, valueFormatter: function (params) {
			return parseFloat(parseFloat(params.value).toFixed(2));
		}},
		{headerName: "Previous Purchase Rate", field: "poActualRate", suppressMenu: true, minWidth : 250, valueFormatter: function (params) {
			return parseFloat(parseFloat(params.value).toFixed(2));
		}},
		{headerName: "Allowable Moisture (%)", field: "allowableMoisturePercentage", suppressMenu: true, minWidth : 250, cellEditorFramework: numericPercentageEditorComponent, editable : true},
				
				{headerName: "Weight", field: "poActualQuantity", suppressMenu: true, minWidth : 250, valueFormatter: function (params) {
			return parseFloat(parseFloat(params.value).toFixed(2));
		}},
				{headerName: "Unit", field: "quantityUnit.name", suppressMenu: true, minWidth : 250},
				{headerName: "Converted Quantity", field: "", suppressMenu: true, minWidth : 250, 
					valueFormatter: function (params) {
					self.addedItems[params.node.id].unitConversionType = "LOOSE";
					self.addedItems[params.node.id].conversionQuantity = 	parseFloat(params.data.poActualQuantity).toFixed(2);
				  return  parseFloat(((params.data.poActualQuantity/self.totJuteQuantity)*100).toFixed(2)) +" %";
				}
				},
				{headerName: "Payable", field: "valueWithoutTax", suppressMenu: true, minWidth : 250, valueFormatter: function (params) {
			return parseFloat(parseFloat(params.value).toFixed(2));
		}},
				{headerName: "Discount(%)", field: "discount", suppressMenu: true, minWidth : 250, editable : true, cellEditorFramework: numericPercentageEditorComponent, valueFormatter: function (params) {
			return (isNaN(params.value))?0:parseFloat(parseFloat(params.value).toFixed(2));
		}},
				{headerName: "Additional Requirement", field: "additionalRequirement", suppressMenu: true, minWidth : 250, editable : true, cellEditor : 'largeText'},
				{headerName: "Delete", field: "", suppressMenu: true, minWidth : 250, hide : true}
			];
				}
		}else{
			self.baleMaxVal = Math.round((self.purchaseCreateModel.poQuantity)/1.5);
			self.columnDef = [
		//{headerName: "Item Group", field: "itemGroup.name", suppressMenu: true, minWidth : 250},
		{headerName: "Item Descrption", field: "item.name", suppressMenu: true, minWidth : 250, cellRendererFramework: legacyCodeItemNameComponent},
		{headerName: "Quality", field: "quality.name", suppressMenu: true, minWidth : 250},
		
		{headerName: "Price/Unit", field: "rate", suppressMenu: true, minWidth : 250, cellEditorFramework: numericRequiredEditorComponent, editable : true, valueFormatter: function (params) {
			return parseFloat(parseFloat(params.value).toFixed(2));
		}},
		{headerName: "Previous Purchase Rate", field: "poActualRate", suppressMenu: true, minWidth : 250, valueFormatter: function (params) {
			return parseFloat(parseFloat(params.value).toFixed(2));
		}},
		{headerName: "Allowable Moisture (%)", field: "allowableMoisturePercentage", suppressMenu: true, minWidth : 250, cellEditorFramework: numericPercentageEditorComponent, editable : true},
		
		{headerName: "Weight", field: "poActualQuantity", suppressMenu: true, minWidth : 250, valueFormatter: function (params) {
			return parseFloat(parseFloat(params.value).toFixed(2));
		}},
		{headerName: "Unit", field: "quantityUnit.name", suppressMenu: true, minWidth : 250},
		{headerName: "Converted Quantity", field: "poActualQuantity", suppressMenu: true, minWidth : 250, valueFormatter: function (params) {
					self.addedItems[params.node.id].unitConversionType = "BALE";
					self.addedItems[params.node.id].conversionQuantity = 	Math.round(params.value / 1.5);
				  return  Math.round(params.value / 1.5) +" BALE";
				}},
		{headerName: "Payable", field: "valueWithoutTax", suppressMenu: true, minWidth : 250, valueFormatter: function (params) {
			return parseFloat(parseFloat(params.value).toFixed(2));
		}},
		{headerName: "Discount(%)", field: "discount", suppressMenu: true, minWidth : 250, editable : true, cellEditorFramework: numericPercentageEditorComponent, valueFormatter: function (params) {
			return (isNaN(params.value))?0:parseFloat(parseFloat(params.value).toFixed(2));
		}},
		{headerName: "Additional Requirement", field: "additionalRequirement", suppressMenu: true, minWidth : 250, editable : true, cellEditor : 'largeText'},
		{headerName: "Delete", field: "", suppressMenu: true, minWidth : 250, hide : false, cellRendererFramework: gridDeleteComponent}
	];
		}
	}
	
	
	getSupByType = function(){
	  var self = this;
	  $("#page_loader_service").fadeIn()
	  self.http.getSupByType("J")
			.subscribe(
			(data) => {
				self.supplierListJute = data;
			},
			(error) => self.errorMsg = error,
			() => $("#page_loader_service").fadeOut()
			);
  }
  
  loadMukam = function(e){
	  var self = this;
	  $("#page_loader_service").fadeIn()
	  self.errorMsg = "";
		self.successMsg = "";
		self.purchaseCreateModel.selectedmrItem = "";
		self.totJuteQuantity = 0;
		self.itemData = "";
		self.purchaseCreateModel.vehicleQuantity = 1;
		self.purchaseCreateModel.poQuantity = 0;
		self.purchaseCreateModel.conversiontype = "LOOSE";
		self.purchaseCreateModel.creditTerm = 1;
		self.purchaseCreateModel.flightcharge = "";
		self.purchaseCreateModel.createDate = { date: { year: new Date().getFullYear(), month: new Date().getMonth()+1, day: new Date().getDate() } };
		self.purchaseCreateModel.mrmukam = "";
		self.mukams = [];
		self.purchaseCreateModel.vehicleType = "";
		self.purchaseCreateModel.discounthdr = 0;
		self.purchaseCreateModel.deliveryTime = "";
		self.purchaseCreateModel.mrIndent = "";
		self.indentData = [];
		self.purchaseCreateModel.selectedQuality = "";
		self.itemQuality = [];
		self.purchaseCreateModel.selectedQuantity = "";
		self.looseMaxVal = 100;
		self.baleMaxVal = 0;
		self.addedItems = [];
		self.itemsForIndent = [];
		self.indentdtldata = "";
		self.purchaseCreateModel.poQuantity = 0;
	  var selectedItem = e.target.value;
	  
	  this.http.getAllMukamsbysup(self.supplierListJute[selectedItem].id)
		  .subscribe(
			(data) => {
			  this.mukams = data;
			  },
			(error) => {
				this.errorMsg = error;
				this.mukams = "";
			},
			() => {$("#page_loader_service").fadeOut()}
		  );
  }
  
  getIndentorItem = function(e){
	  var self = this;
	  self.errorMsg = "";
		self.successMsg = "";
		self.purchaseCreateModel.selectedmrItem = "";
		self.totJuteQuantity = 0;
		self.itemData = "";
		self.purchaseCreateModel.vehicleQuantity = 1;
		self.purchaseCreateModel.conversiontype = "LOOSE";
		self.purchaseCreateModel.creditTerm = 1;
		self.purchaseCreateModel.flightcharge = "";
		self.purchaseCreateModel.createDate = { date: { year: new Date().getFullYear(), month: new Date().getMonth()+1, day: new Date().getDate() } };
		self.purchaseCreateModel.vehicleType = "";
		self.purchaseCreateModel.discounthdr = 0;
		self.purchaseCreateModel.poQuantity = 0;
		self.purchaseCreateModel.deliveryTime = "";
		self.purchaseCreateModel.mrIndent = "";
		self.indentData = [];
		self.purchaseCreateModel.selectedQuality = "";
		self.itemQuality = [];
		self.purchaseCreateModel.selectedQuantity = "";
		self.looseMaxVal = 100;
		self.baleMaxVal = 0;
		self.addedItems = [];
		self.itemsForIndent = [];
		self.indentdtldata = "";
	  var selectedItem = e.target.value;
	  if(self.purchaseCreateModel.mrpoindent == "withindent"){
		  self.getIndents(self.mukams[selectedItem].mukamId);
	  }else{
		  self.getItems(self.mukams[selectedItem].mukamId);
	  }
	  
  }
  
  //get items by mukam
	getItems = function(id){
		$("#page_loader_service").fadeIn()
		var self = this;
		self.addedItems.length = 0;
		self.totJuteQuantity = 0;
		self.errorMsg = "";
		self.successMsg = "";
		self.purchaseCreateModel.vehicleType = "";
		self.purchaseCreateModel.conversiontype = "LOOSE";
		self.purchaseCreateModel.selectedmrItem = "";
		self.purchaseCreateModel.vehicleQuantity= 1;
		self.purchaseCreateModel.selectedQuality = "";
		self.purchaseCreateModel.selectedQuantity = "";
		self.purchaseCreateModel.poQuantity = 0;
		self.itemData = [];
		self.itemQuality = [];
		self.looseMaxVal = 100; 
		self.baleMaxVal = 0;
		this.http.getAllItemsByMukams(id)
		  .subscribe(
			(data) => {
			  this.itemData = data;
			  },
			(error) => {
				this.errorMsg = error;
				this.itemData.length = 0;
			},
			() => {$("#page_loader_service").fadeOut()}
		  );
	}
	
	//get indent by mukam
	getIndents = function(id){
		$("#page_loader_service").fadeIn()
		var self = this;
		this.http.getAllIndentsByMukams(id)
		  .subscribe(
			(data) => {
			  this.indentData = data;
			  },
			(error) => {
				this.errorMsg = error;
				this.indentData.length = 0;
			},
			() => {$("#page_loader_service").fadeOut()}
		  );
	}
	
	//get all vehicles
	getAllVehicles = function(){
		this.http.getAllVehicles()
		  .subscribe(
			(data) => {
			  this.allVehicles = data;
			  },
			(error) => {
				this.errorMsg = error;
				this.allVehicles = "";
			},
			() => {}
		  );
	}
	
	//load All Units
	loadUnits = function() {
		var self = this;
		
		this.http.getAllUnits()
			.subscribe(
			(data) => {
				self.units = data;
			},
			(error) => self.errorMsg = error,
			() => {
				for (var i = 0; i < self.units.length; i++ ){
					if(self.units[i].id == "QNT"){
						self.Qunits = self.units[i];
					}
				}
			}
		);
	}
	
	
	//get quality by item
	getQuality = function(e){
		$("#page_loader_service").fadeIn()
		var self = this;
		self.errorMsg = "";
		self.successMsg = "";
		self.purchaseCreateModel.selectedQuality = "";
		self.purchaseCreateModel.selectedQuantity = "";
		self.itemQuality = [];
		
		var selectedItem = e.target.value;
		this.http.getAllQuality(self.itemData.items[selectedItem].id)
			.subscribe(
			(data) => {
				self.itemQuality = data;
			},
			(error) => self.errorMsg = error,
			() => $("#page_loader_service").fadeOut()
		);
	}
	
	updateBale = function(){
		var self = this;
		if(this.purchaseCreateModel.vehicleType != ''){
		this.purchaseCreateModel.poQuantity = this.purchaseCreateModel.vehicleQuantity * this.allVehicles[this.purchaseCreateModel.vehicleType].weight;
		this.baleMaxVal = Math.round((self.purchaseCreateModel.poQuantity)/1.5);
		}
	}
	
	loadIndentLines = function(e){
		$("#page_loader_service").fadeIn()
		var self = this;
		var selectedVal = e.target.value;
		this.http.getIndentData(self.indentData[selectedVal].id)
			.subscribe(
			(data) => {
				self.indentdtldata = data;
			},
			(error) => self.errorMsg = error,
			() => {
				for(var i=0; i < self.indentdtldata.indentList.length; i++){
					if(self.indentdtldata.indentList[i].status == '1'){
						self.TotalQuantity = self.TotalQuantity + self.indentdtldata.indentList[i].indentQuantity;
				
					}
				}
				self.getPOLineItems();
				$("#page_loader_service").fadeOut();
			}
		);
	}
	
	getPOLineItems = function(){
		var self = this;
		self.totJuteQuantity = 0;
		self.addedItems.length = 0;
		for(var i=0; i < self.indentdtldata.indentList.length; i++){
		  if(self.indentdtldata.indentList[i].status == '1'){
				var createdObj:any = {
					"itemGroup"			: self.indentdtldata.indentList[i].itemGroup,
					"item" 				: self.indentdtldata.indentList[i].item,
					"indentId" 			: self.indentdtldata.indentList[i].indentId,
					"department" 		: self.indentdtldata.indentList[i].department,
					"rate" 				: self.indentdtldata.indentList[i].quality.rate,
					"poQuantity" 		: self.indentdtldata.indentList[i].indentQuantity,
					"poActualQuantity" 	: self.indentdtldata.indentList[i].indentQuantity,
					"poActualRate" 		: self.indentdtldata.indentList[i].quality.rate,
					"tax"				: null,
					"quantityUnit" 		: self.indentdtldata.indentList[i].quantityUnit,
					"valueWithoutTax"	:(self.indentdtldata.indentList[i].quality.rate * self.indentdtldata.indentList[i].indentQuantity),
					"status"			: "1",
					"submitter"			: self.sessionData.sessionUserName,
					"approverFirst"		: null,
					"approverSecond"	: null,
					"approveFirstDate"	: null,
					"approveSecondDate"	: null,
					"type"				: "J",
					"marka"				: self.indentdtldata.indentList[i].marka,
					"quality"			: self.indentdtldata.indentList[i].quality,
					"discount" 			: 0,
					"additionalRequirement" : null,
					"allowableMoisturePercentage" : 18,
					"unitConversionType" : self.purchaseCreateModel.conversiontype,
					"conversionQuantity" : null
				};
				self.totJuteQuantity = self.totJuteQuantity + self.indentdtldata.indentList[i].indentQuantity;
				self.addedItems.push(createdObj);
		    }
		}
	}
	
	createpoclicked = function(){
		var self = this;
		if(self.purchaseCreateModel.mrpoindent == 'withindent'){
			console.log("po");
			self.createPO();
		}else{
			console.log("indent + po");
			self.createIndent();
		}
	}
	
	createIndent = function(){
		$("#page_loader_service").fadeIn()
		var self = this;
		var today = new Date();
		self.createIndentResponseData = "";
		self.createIndentPostData.indentHeader.type = "J";
		self.createIndentPostData.indentHeader.status = "3";
		self.createIndentPostData.indentHeader.mukam = self.mukams[self.purchaseCreateModel.mrmukam].mukamId;
		self.createIndentPostData.indentHeader.vehicleTypeId = self.allVehicles[self.purchaseCreateModel.vehicleType].id;
		self.createIndentPostData.indentHeader.vehicleQuantity = self.purchaseCreateModel.vehicleQuantity;
		self.createIndentPostData.indentHeader.submitter = self.sessionData.sessionId;
		self.createIndentPostData.indentHeader.finnacialYear = today.getFullYear();
		self.createIndentPostData.indentHeader.createDate = today.getTime();
		self.createIndentPostData.indentHeader.indentDate = today.getTime();
		self.createIndentPostData.indentList = self.itemsForIndent;
		
		this.http.createIndent(self.createIndentPostData)
			.subscribe(
			(data) => {
				self.createIndentResponseData = data;
			},
			(error) => self.errorMsg = error,
			() => {
				for(var i = 0; i < self.addedItems.length; i++){
					self.addedItems[i].indentId = self.createIndentResponseData.indentHeader.id;
				}
				self.createPO();
			}
		);
	}
	
	
	createPO = function(){
		var self = this;
		self.errorMsg = "";
		
		var totPrice = 0;
		var totTax = 0;
		for(var i = 0; i < self.addedItems.length; i++){
			if(self.addedItems[i].status != "4"){
			self.addedItems[i].valueWithoutTax = (self.addedItems[i].poQuantity * self.addedItems[i].rate) - (self.addedItems[i].poQuantity * self.addedItems[i].rate * (self.addedItems[i].discount/100));
			self.addedItems[i].tax = (self.addedItems[i].valueWithoutTax * self.addedItems[i].item.itemTax.gst)/100;
			totPrice = totPrice + self.addedItems[i].valueWithoutTax;
			totTax = totTax + self.addedItems[i].tax;
			}
		}
		
		self.poPostData.poHeader.valueWithoutTax = totPrice - (totPrice * (self.poPostData.poHeader.discount/100));
		self.poPostData.poHeader.tax = totTax;
		self.poPostData.poHeader.valueWithTax = self.poPostData.poHeader.valueWithoutTax + totTax;
		
		
		
		
		self.poPostData.poHeader.supplierId = self.supplierListJute[self.purchaseCreateModel.mrsupplier].id;
				self.poPostData.poHeader.brokerId = (self.purchaseCreateModel.brkr=='')?null:self.allBroker[self.purchaseCreateModel.brkr].brokerId;
				self.poPostData.poHeader.brokerName = (self.purchaseCreateModel.brkr=='')?null:self.allBroker[self.purchaseCreateModel.brkr].brokerName;
				self.poPostData.poHeader.type = "J";
				self.poPostData.poHeader.mukam = self.mukams[self.purchaseCreateModel.mrmukam].mukamId;
				self.poPostData.poHeader.status = "1";
				self.poPostData.poHeader.submitter = self.sessionData.sessionId;
				self.poPostData.poHeader.finnacialYear = self.purchaseCreateModel.createDate.date.year;
				self.poPostData.poHeader.createDate = new Date(self.purchaseCreateModel.createDate.date.year, self.purchaseCreateModel.createDate.date.month-1, self.purchaseCreateModel.createDate.date.day).getTime();
				self.poPostData.poHeader.poDate = new Date(self.purchaseCreateModel.createDate.date.year, self.purchaseCreateModel.createDate.date.month-1, self.purchaseCreateModel.createDate.date.day).getTime();
				self.poPostData.poHeader.juteUnit = self.purchaseCreateModel.conversiontype;
				self.poPostData.poHeader.discount = self.purchaseCreateModel.discounthdr;
				self.poPostData.poHeader.frieghtCharge = self.purchaseCreateModel.flightcharge;
				self.poPostData.poHeader.deliveryTimeline = self.purchaseCreateModel.deliveryTime;
				self.poPostData.poHeader.deliveryAddress = self.purchaseCreateModel.creditTerm;
				if(self.purchaseCreateModel.mrpoindent == 'withindent'){
					self.poPostData.poHeader.vehicleTypeId = self.indentdtldata.indentHeader.vehicleTypeId;
					self.poPostData.poHeader.vehicleQuantity = self.indentdtldata.indentHeader.vehicleQuantity;
				}else{
					self.poPostData.poHeader.vehicleTypeId = self.allVehicles[self.purchaseCreateModel.vehicleType].id;
					self.poPostData.poHeader.vehicleQuantity = self.purchaseCreateModel.vehicleQuantity;
				}
				
				self.poPostData.poItemList = self.addedItems;
				
				
				
				
				this.http.createPO(self.poPostData)
			.subscribe(
			(data) => {
				self.createIndentResponseData = data;
			},
			(error) => self.errorMsg = error,
			() => {
				self.successMsg = "Purchase Order No. "+self.createIndentResponseData.poHeader.id+" Created Successfully.",
				self.purchaseCreateModel.mrpoindent = "",
				self.purchaseCreateModel.mrsupplier = "",
				self.purchaseCreateModel.selectedmrItem = "",
				self.itemData = "",
				self.purchaseCreateModel.vehicleQuantity = 1,
				self.purchaseCreateModel.conversiontype = "LOOSE",
				self.purchaseCreateModel.creditTerm = 1,
				self.purchaseCreateModel.flightcharge = "",
				self.purchaseCreateModel.createDate = { date: { year: new Date().getFullYear(), month: new Date().getMonth()+1, day: new Date().getDate() } },
				self.purchaseCreateModel.mrmukam = "",
				self.mukams = [],
				self.purchaseCreateModel.vehicleType = "",
				self.purchaseCreateModel.discounthdr = 0,
				self.purchaseCreateModel.deliveryTime = "",
				self.purchaseCreateModel.mrIndent = "",
				self.indentData = [],
				self.purchaseCreateModel.selectedQuality = "",
				self.itemQuality = [],
				self.purchaseCreateModel.selectedQuantity = "",
				self.purchaseCreateModel.creditTerm = "",
				self.looseMaxVal = 100,
				self.baleMaxVal = 0,
				self.addedItems = [],
				self.itemsForIndent = [],
				self.indentdtldata = "",
				self.totJuteQuantity = 0,
				$("#broker").val(""),
				self.http.getSupByType("J")
				.subscribe(
				(data) => {
					self.supplierListJute = data;
				},
				(error) => self.errorMsg = error,
				() => $("#page_loader_service").fadeOut()
				);
				}
				)
	}


addItems = function(){
		var self = this;
		var duplicate = false;
		self.errorMsg = "";
		var itemQuantity = 0;
		
		for(var i = 0; i < self.addedItems.length; i++){
			if(self.addedItems[i].item.id == self.itemData.items[self.purchaseCreateModel.selectedmrItem].id && self.addedItems[i].quality.id == self.itemQuality[self.purchaseCreateModel.selectedQuality].id){duplicate = true;}
		}
		
		if(duplicate){
			self.errorMsg = "Duplicate Entry is not allowed.";
		}else{
			if(self.purchaseCreateModel.conversiontype =='LOOSE'){
					itemQuantity = (self.purchaseCreateModel.poQuantity) * self.purchaseCreateModel.selectedQuantity/100;
					self.looseMaxVal = self.looseMaxVal - self.purchaseCreateModel.selectedQuantity;
			}else{
					itemQuantity = self.purchaseCreateModel.selectedQuantity * 1.5;
					self.baleMaxVal = self.baleMaxVal - self.purchaseCreateModel.selectedQuantity;
			}
			
			var createdObjforIndent = {
					"department" 	: self.juteDept,
					"itemGroup" 	: self.juteItemGrp,
					"item" 			: self.itemData.items[self.purchaseCreateModel.selectedmrItem],
					"quantityUnit" 	: self.Qunits,
					"stock" 		: self.itemData.items[self.purchaseCreateModel.selectedmrItem].stock,
					"indentQuantity": parseFloat(itemQuantity.toFixed(2)),
					"indentCancelledQuantity" 	: 0,
					"status" 		: "1",
					"submitter" 	: self.sessionData.sessionId,
					"quality" 		: self.itemQuality[self.purchaseCreateModel.selectedQuality],
					"additionalRequirement":null
				};
				
				self.itemsForIndent.push(createdObjforIndent);
				
				var createdObj:any = {
					"itemGroup"			: self.juteItemGrp,
					"item" 				: self.itemData.items[self.purchaseCreateModel.selectedmrItem],
					"indentId" 			: null,
					"department" 		: self.juteDept,
					"rate" 				: self.itemQuality[self.purchaseCreateModel.selectedQuality].rate,
					"poQuantity" 		: parseFloat(itemQuantity.toFixed(2)),
					"poActualQuantity" 	: parseFloat(itemQuantity.toFixed(2)),
					"poActualRate" 		: self.itemQuality[self.purchaseCreateModel.selectedQuality].rate,
					"tax"				: 0,
					"quantityUnit" 		: self.Qunits,
					"valueWithoutTax"	: (self.itemQuality[self.purchaseCreateModel.selectedQuality].rate * itemQuantity),
					"status"			: "1",
					"submitter"			: self.sessionData.sessionUserName,
					"approverFirst"		: null,
					"approverSecond"	: null,
					"approveFirstDate"	: null,
					"approveSecondDate"	: null,
					"type"				: "J",
					"marka"				: null,
					"quality"			: self.itemQuality[self.purchaseCreateModel.selectedQuality],
					"discount" 			: 0,
					"additionalRequirement" : null,
					"allowableMoisturePercentage" : 18,
					"unitConversionType" : self.purchaseCreateModel.conversiontype,
					"conversionQuantity" : (self.purchaseCreateModel.conversiontype == "LOOSE")?parseFloat(itemQuantity.toFixed(2)): self.purchaseCreateModel.selectedQuantity
				};
				
				self.totJuteQuantity = self.totJuteQuantity + itemQuantity;
				self.addedItems.push(createdObj);
				self.purchaseCreateModel.selectedmrItem= "";
				self.purchaseCreateModel.selectedQuality= "";
				self.purchaseCreateModel.selectedQuantity = null;
		
		}
		
			if(typeof self.gridOptions.api != 'undefined'){
			self.gridOptions.api.setRowData(self.addedItems);
		}	
				
				
				
				
				
				
			
				
	}
	
	//load All Departments
	loadDepartments = function() {
		var self = this;
		
		this.http.getAllDepartments()
			.subscribe(
			(data) => {
				self.departments = data;
			},
			(error) => self.errorMsg = error,
			() => {
				for (var i = 0; i < self.departments.length; i++ ){
					if(self.departments[i].name == "JUTE"){
						self.juteDept = self.departments[i];
					}
				}
			}
		);
	}
	
	//load item Groups
	loadItemGroups = function() {
		var self = this;
		
		this.http.getItemGroups()
			.subscribe(
			(data) => {
				self.itemGroup = data;
			},
			(error) => self.errorMsg = error,
			() => {
				for (var i = 0; i < self.itemGroup.length; i++ ){
					if(self.itemGroup[i].name == "JUTE"){
						self.juteItemGrp = self.itemGroup[i];
					}
				}
			}
		);
	}
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	//get session details
	getSession = function(){
		this.sessionData = this.session.getSessionDetails();
	}
	
	//get menu items by user group
	getMenuItemsByUserGroup = function(){ 
		var self = this;
		
		
		self.http.getSubMenuByUserGroup(self.userGroupData[0].userGroup.id)
			.subscribe(
				(data) => {
					this.userMenuData = data;
				},
				(error) => {
					this.errorMsg = error
				},
				() => {
					for(var i = 0; i < this.userMenuData.length; i++){
						if(this.userMenuData[i].menuItem.menuName == 'Purchase'){
							self.userSelectionMenuData.push(this.userMenuData[i]);
						}
						
					}
				}
			);
		
	}
	
	//get user group details
	
	getUserGroup = function(){
		this.http.getUserGroupById(this.sessionData.sessionId)
		  .subscribe(
			(data) => {
			  this.userGroupData = data;
			  },
			(error) => {
				this.errorMsg = error;
				this.userGroupData = "";
			},
			() => this.getMenuItemsByUserGroup()
		  );
	}
	
	
	deleteItem = function(indexdId){
		var self = this;
		self.totJuteQuantity = self.totJuteQuantity - self.addedItems[indexdId].poActualQuantity+9;
		if(self.purchaseCreateModel.conversiontype =='LOOSE'){
			self.looseMaxVal = self.looseMaxVal + (self.addedItems[indexdId].poActualQuantity*100)/(self.purchaseCreateModel.poQuantity);
		}else{
			self.baleMaxVal = self.baleMaxVal + Math.round(self.addedItems[indexdId].poActualQuantity/1.5);
		}
		self.addedItems.splice(indexdId, 1);
		if(self.purchaseCreateModel.mrpoindent != 'withindent'){
		self.itemsForIndent.splice(indexdId, 1);
		}
		
		this.gridOptions.api.setRowData(self.addedItems);
		
	}
	
	
	//routing based on 
	routeSelection(e){
	  var self = this;
	  var requestedId = e.target.value;
	  
	  this.http.getRouteURL(requestedId)
			.subscribe(
			(data) => {
				self.requestedURL = data;
			},
			(error) => {self.errorMsg = error},
			() => {
				self.router.navigate([self.requestedURL.url]);
			}
		);
  }
  
  
  //load all indent types
	loadTypes = function(){
		var self = this;
		self.indentDetailData = [];
		this.http.getIndentTypes()
			.subscribe(
			(data) => {
				self.allTypes = data;
			},
			(error) => self.errorMsg = error,
			() => console.log("completed")
		);
	}
  
  
  

  
//load indents based on supplier selection
  loadIndents = function(e){
	  $("#page_loader_service").fadeIn()
	var self = this;
	self.purchaseCreateModel.selectedIndent = "";
	self.purchaseCreateModel.selectedSupplier = "";
	self.indentDetailData = [];
	self.supplierListJute = [];
	self.purchaseCreateModel.creditTerm = null;
	self.purchaseCreateModel.deliveryTime = "";
	self.indentListAll = [];
	self.purchaseCreateModel.createDate = { date: { year: new Date().getFullYear(), month: new Date().getMonth()+1, day: new Date().getDate() } };
	self.addedItems = [];
	self.rateComparedata = [];
	self.purchaseCreateModel.selectedSup = "INPC0";
	self.purchaseCreateModel.rejectionReason = "";
	self.purchaseCreateModel.selectedSupplier == "";
	var selectedType = e.target.value;
	if(selectedType != ""){
		if(selectedType == "J"){
			self.http.getApprovedPOList(3)
			.subscribe(
			(data) => {
				self.indentListAll = data;
			},
			(error) => self.errorMsg = error,
			() => {self.getSupByType(), $("#page_loader_service").fadeOut()}
		);
		}else{
			self.http.getIndentByType(selectedType)
			.subscribe(
			(data) => {
				self.indentListAll = data;
			},
			(error) => self.errorMsg = error,
			() => $("#page_loader_service").fadeOut()
		);
		}
	}else{
		self.indentListAll = [];
		$("#page_loader_service").fadeOut();
	}
  }
  
  
  //rate comparison
  compareRate = function(selectedIndent){
	  var self = this;
	  self.alreadycreatedPOItems = [];
	  self.http.getRateComparison(selectedIndent)
			.subscribe(
			(data) => {
				self.rateComparedata = data;
			},
			(error) => self.errorMsg = error,
			() => {
				for(var i = 0; i < self.rateComparedata.supplierIndentVoList.length; i++){
					self.alreadycreatedPOItems.push(self.rateComparedata.supplierIndentVoList[i].indentItemId);
				}
				self.getAddedItems(),
				$("#page_loader_service").fadeOut()
				}
			);
  }
  
  
  
  
  //get added Items
  getAddedItems = function(){
	  var self = this;
	  self.totJuteQuantity = 0;
	  if(self.purchaseCreateModel.selectedPOType != "J"){
	  for(var i=0; i < self.indentDetailData.indentList.length; i++){
		  if(self.alreadycreatedPOItems.indexOf(self.indentDetailData.indentList[i].indentItemId) > -1 && self.indentDetailData.indentList[i].status == '1'){
		 var createdObj:any = {
					"itemGroup"			: self.indentDetailData.indentList[i].itemGroup,
					"item" 				: self.indentDetailData.indentList[i].item,
					"indentId" 			: self.indentDetailData.indentList[i].indentId,
					"department" 		: self.indentDetailData.indentList[i].department,
					"rate" 				: self.indentDetailData.indentList[i].lastPurchasedRate,
					"poQuantity" 		: self.indentDetailData.indentList[i].indentQuantity,
					"poActualQuantity" 	: self.indentDetailData.indentList[i].indentQuantity,
					"poActualRate" 		: self.indentDetailData.indentList[i].lastPurchasedRate,
					"tax"				: null,
					"quantityUnit" 		: self.indentDetailData.indentList[i].quantityUnit,
					"valueWithoutTax"	: null,
					"status"			: "1",
					"submitter"			: self.sessionData.sessionUserName,
					"approverFirst"		: null,
					"approverSecond"	: null,
					"approveFirstDate"	: null,
					"approveSecondDate"	: null,
					"type"				: self.purchaseCreateModel.selectedPOType,
					"marka"				: self.indentDetailData.indentList[i].marka,
					"quality"			: self.indentDetailData.indentList[i].quality,
					"discount" 			: 0
				};
				self.totJuteQuantity = self.totJuteQuantity + self.indentDetailData.indentList[i].indentQuantity;
				self.addedItems.push(createdObj);
		  }
		}
	  }else{
		  for(var i=0; i < self.indentDetailData.indentList.length; i++){
			  if(self.indentDetailData.indentList[i].status == '1'){
		 var createdObj:any = {
					"itemGroup"			: self.indentDetailData.indentList[i].itemGroup,
					"item" 				: self.indentDetailData.indentList[i].item,
					"indentId" 			: self.indentDetailData.indentList[i].indentId,
					"department" 		: self.indentDetailData.indentList[i].department,
					"rate" 				: self.indentDetailData.indentList[i].lastPurchasedRate,
					"poQuantity" 		: self.indentDetailData.indentList[i].indentQuantity,
					"poActualQuantity" 	: self.indentDetailData.indentList[i].indentQuantity,
					"poActualRate" 		: self.indentDetailData.indentList[i].lastPurchasedRate,
					"tax"				: null,
					"quantityUnit" 		: self.indentDetailData.indentList[i].quantityUnit,
					"valueWithoutTax"	: null,
					"status"			: "1",
					"submitter"			: self.sessionData.sessionUserName,
					"approverFirst"		: null,
					"approverSecond"	: null,
					"approveFirstDate"	: null,
					"approveSecondDate"	: null,
					"type"				: self.purchaseCreateModel.selectedPOType,
					"marka"				: self.indentDetailData.indentList[i].marka,
					"quality"			: self.indentDetailData.indentList[i].quality,
					"discount" 			: 0
				};
				self.totJuteQuantity = self.totJuteQuantity + self.indentDetailData.indentList[i].indentQuantity;
				self.addedItems.push(createdObj);
			  }
		  }
	}		
		
		self.refreshTotals();
	}
	
	
	
	refreshTotals = function(){
		 var self = this;
		 self.totJuteQuantity = 0;
		for(var i = 0; i < self.addedItems.length; i++){
			self.totJuteQuantity = self.totJuteQuantity + parseInt(self.addedItems[i].poQuantity);
		}
	}
  
  
  //get indent details
  getIndentDetails = function(e){
	  
	  var self = this;
	self.indentDetailData = [];
	self.addedItems = [];
	self.rateComparedata = [];
	self.purchaseCreateModel.selectedSup = "INPC0";
	self.purchaseCreateModel.rejectionReason = "";
	 var selectedIndent = e.target.value;
	  if(selectedIndent != ""){
		  $("#page_loader_service").fadeIn();
		  if(self.purchaseCreateModel.selectedPOType != "J"){
			this.http.getIndentData(selectedIndent)
			.subscribe(
			(data) => {
				self.indentDetailData = data;
			},
			(error) => self.errorMsg = error,
			() => {
				self.compareRate(selectedIndent);
			}
		); 
		  }else{
			  this.http.getIndentDtlFrJt(selectedIndent)
			.subscribe(
			(data) => {
				self.indentDetailData = data;
			},
			(error) => self.errorMsg = error,
			() => {
				if(self.purchaseCreateModel.selectedPOType != "J"){
					self.compareRate(selectedIndent);
				}else{
					self.getAddedItems(),
					$("#page_loader_service").fadeOut()
					//self.compareRate(selectedIndent);
				}
			}
		); 
		  }
	  }else{
		  self.indentDetailData = [];
	  }
  }
  
  selectsupplier = function(indexId){
	  alert(indexId);
  }
  
  
  
  
	  
}
