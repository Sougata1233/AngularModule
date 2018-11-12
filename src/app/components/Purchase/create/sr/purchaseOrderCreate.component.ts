import { Component, OnInit, AfterViewInit } from '@angular/core';
import * as $ from 'jquery';
import {IMyDpOptions} from 'mydatepicker';

import { HttpTestService } from '../../../../services/http.service';
import { sessionServices } from '../../../../services/session.services';
import { Router } from '@angular/router';
import {Observable} from 'rxjs/Rx';
import {GridOptions} from "ag-grid/main";
import {legacyCodeItemNameComponent} from "../../../common/legacy_item.component";
import { AppSettings } from '../../../../config/settings/app-settings';
import { purchaseCreateModel } from '../../../../models/purchase/purchaseCreate.model';
import {gridPOPyblPriceComponent} from "../../../common/PurchasePayablePrice.Component";
import {SGSTComponent} from "../../../common/SGSTComponent";
import {IGSTComponent} from "../../../common/IGSTComponent";

@Component({
  selector: 'app-create-indent',
  templateUrl: './purchaseOrderCreate.component.html'
})


export class createPOComponent implements OnInit {
	
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
	public supplierListJute : any = [];
	public totJuteQuantity : number = 0;
	public alreadycreatedPOItems : any = [];
	public prefix : string = '';
	public clock = Observable
        .interval(1000)
	.map(()=> new Date());
	
	
	public allTypes : any;
	public addedItems : any = [];
	
	
	public columnDef : any = [
		//{headerName: "Item Descrption", field: "item.name", suppressMenu: true, minWidth : 250, cellRendererFramework: legacyCodeItemNameComponent},
		{headerName: "Rate", field: "rate", suppressMenu: true, width : 50, valueFormatter: function (params) {
			return parseFloat(parseFloat(params.value).toFixed(2));
		}},
		//{headerName: "Quantity", field: "indentQuantity", suppressMenu: true, width : 75},
		{headerName: "CGST", field: "item.itemTax.gst", suppressMenu: true, width : 50, cellRendererFramework : SGSTComponent},
		{headerName: "SGST", field: "item.itemTax.gst", suppressMenu: true, width : 50, cellRendererFramework : SGSTComponent},
		{headerName: "IGST", field: "item.itemTax.gst", suppressMenu: true, width : 50, cellRendererFramework : IGSTComponent},
		{headerName: "Payable Ammount", field: "indentQuantity", suppressMenu: true, width : 100, cellRendererFramework: gridPOPyblPriceComponent, valueFormatter: function (params) {
			return parseFloat(parseFloat(params.value).toFixed(2));
		}}
	];
	
	public columnDefOnlyItem : any = [
		{headerName: "Item Descrption", field: "item.name", suppressMenu: true, width : 300, cellRendererFramework: legacyCodeItemNameComponent},
		{headerName: "Quantity", field: "indentQuantity", suppressMenu: true, width : 75, valueFormatter: function (params) {
			return parseFloat(parseFloat(params.value).toFixed(2));
		}}
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
		"juteUnit"	:	null
	},
	"poItemList": []
};
	
	
	constructor(public http: HttpTestService, public router: Router, public session: sessionServices) { 
		var self = this;
		this.prefix = AppSettings.PREFIX;
		this.gridOptions = <GridOptions>{};
		 this.gridOptions.headerHeight = 40;
		 this.gridOptions.paginationPageSize = 5;
		 this.gridOptions.domLayout = 'autoHeight';
		 this.gridOptions.pagination = false;
		 this.gridOptions.enableFilter = false;
		 this.gridOptions.enableSorting = false;
		 this.gridOptions.enableColResize = false;
		 this.gridOptions.floatingFilter = false;
		 this.gridOptions.suppressMovableColumns = true;
		 this.gridOptions.rowHeight = 30;
		 this.gridOptions.floatingFiltersHeight = 40;
		 this.gridOptions.rowSelection = 'single';
		 this.gridOptions.showToolPanel = false;
		 this.gridOptions.getRowStyle = function(params) {
				if (params.data.status != '1') {
				return { display: 'none' }
			}
		}
		this.gridOptions.onGridReady = function(params) {
				params.api.sizeColumnsToFit();
		}
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
		this.loadTypes();
	}
	
	toggle = function(e){
		$(e.target).parents(".supplierRateBox").find(".expandarea").slideToggle();
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
		self.addedItems.splice(indexdId, 1);
		self.refreshTotals();
		
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
			() => {}
		);
	}
  
  getSupByType = function(){
	  $("#page_loader_service").fadeIn()
	  var self = this;
	  
	  self.http.getSupByType("J")
			.subscribe(
			(data) => {
				self.supplierListJute = data;
			},
			(error) => self.errorMsg = error,
			() => $("#page_loader_service").fadeOut()
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
					"discount" 			: 0,
					"additionalRequirement" : self.indentDetailData.indentList[i].additionalRequirement
				};
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
					"discount" 			: 0,
					"additionalRequirement" : self.indentDetailData.indentList[i].additionalRequirement
				};
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
  
  
  
  createPO = function(){
	  $("#page_loader_service").fadeIn();
		var self = this;
		self.errorMsg = "";
		if(self.purchaseCreateModel.selectedPOType == "J"){
			if(self.purchaseCreateModel.selectedPOType == "" || self.purchaseCreateModel.selectedIndent == "" || self.purchaseCreateModel.createDate == "" || self.purchaseCreateModel.deliveryTime == "" || self.purchaseCreateModel.mukam == ""){
				self.errorMsg = "Please fill all mandatory fields.";
			}else if(self.addedItems.length == 0){
				self.errorMsg = "No line item to create PO.";
			}else if(self.purchaseCreateModel.selectedSupplier == ""){
				self.errorMsg = "Please select a supplier.";
			}else{
				var totPrice = 0;
				var totTax = 0;
				for(var i = 0; i < self.addedItems.length; i++){
					self.poPostData.poHeader.supplierId = self.supplierListJute[self.purchaseCreateModel.selectedSupplier].id;
					self.addedItems[i].discount = ( isNaN(self.addedItems[i].discount))?0:parseFloat(parseFloat(self.addedItems[i].discount).toFixed(2));
					self.addedItems[i].valueWithoutTax = (self.addedItems[i].poQuantity * self.addedItems[i].rate) - (self.addedItems[i].poQuantity * self.addedItems[i].rate * (self.addedItems[i].discount/100));
					self.addedItems[i].tax = (self.addedItems[i].valueWithoutTax * self.addedItems[i].item.itemTax.gst)/100;
					totPrice = totPrice + self.addedItems[i].valueWithoutTax;
					totTax = totTax + self.addedItems[i].tax;
				}
				
				self.poPostData.poHeader.type = self.purchaseCreateModel.selectedPOType;
				self.poPostData.poHeader.mukam = self.purchaseCreateModel.mukam;
				self.poPostData.poHeader.status = "1";
				self.poPostData.poHeader.submitter = self.sessionData.sessionId;
				self.poPostData.poHeader.finnacialYear = self.purchaseCreateModel.createDate.date.year;
				self.poPostData.poHeader.createDate = new Date(self.purchaseCreateModel.createDate.date.year, self.purchaseCreateModel.createDate.date.month-1, self.purchaseCreateModel.createDate.date.day).getTime();
				self.poPostData.poHeader.poDate = new Date(self.purchaseCreateModel.createDate.date.year, self.purchaseCreateModel.createDate.date.month-1, self.purchaseCreateModel.createDate.date.day).getTime();
				
				self.poPostData.poHeader.valueWithoutTax = totPrice - (totPrice * (self.purchaseCreateModel.discounthdr/100));
				self.poPostData.poHeader.tax = totTax;
				self.poPostData.poHeader.valueWithTax = self.poPostData.poHeader.valueWithoutTax + totTax;
				self.poPostData.poHeader.juteUnit = self.purchaseCreateModel.juteType;
				self.poPostData.poHeader.discount = self.purchaseCreateModel.discounthdr;
				self.poPostData.poHeader.frieghtCharge = self.purchaseCreateModel.flightcharge;
				self.poPostData.poHeader.deliveryTimeline = self.purchaseCreateModel.deliveryTime;
				self.poPostData.poHeader.deliveryAddress = self.purchaseCreateModel.creditTerm;
				self.poPostData.poItemList = self.addedItems;
				
				
				
				this.http.createPO(self.poPostData)
			.subscribe(
			(data) => {
				self.createIndentResponseData = data;
			},
			(error) => self.errorMsg = error,
			() => {
				self.successMsg = "Purchase Order No. "+self.createIndentResponseData.poHeader.id+" Created Successfully.",
				self.purchaseCreateModel.selectedPOType = "",
				self.purchaseCreateModel.creditTerm = null,
				self.purchaseCreateModel.deliveryTime = "",
				self.purchaseCreateModel.selectedIndent = "",
				self.indentListAll = [],
				self.purchaseCreateModel.createDate = { date: { year: new Date().getFullYear(), month: new Date().getMonth()+1, day: new Date().getDate() } },
				self.addedItems = [],
				self.rateComparedata = [],
				self.purchaseCreateModel.selectedSup = "INPC0",
				self.purchaseCreateModel.rejectionReason = "",
				self.purchaseCreateModel.selectedSupplier = "",
				self.purchaseCreateModel.discounthdr = 0,
				self.purchaseCreateModel.flightcharge = 0,
				self.purchaseCreateModel.deliveryTime = "",
				self.purchaseCreateModel.creditTerm = "",
				$("#page_loader_service").fadeOut()
			}
		);
			}
		}else{
			if(self.purchaseCreateModel.selectedPOType == "" || self.purchaseCreateModel.selectedIndent == "" || self.purchaseCreateModel.createDate == "" || self.purchaseCreateModel.deliveryTime == ""){
				self.errorMsg = "Please fill all mandatory fields.";
			}else if(self.addedItems.length == 0){
				self.errorMsg = "No line item to create PO.";
			}else if(self.purchaseCreateModel.selectedSup != "INPC0" && self.purchaseCreateModel.reasonComment == ""){
				self.errorMsg = "Please give a reason for choosing costly supplier.";
			}else{
				var selectedSupplier = self.purchaseCreateModel.selectedSup;
				var selectedType  = selectedSupplier.substring(0,4);
				var selectedIndex  = selectedSupplier.substring(4);
				var totPrice = 0;
				var totTax = 0;
				for(var i = 0; i < self.addedItems.length; i++){
					if(selectedType == "INPC"){
						self.poPostData.poHeader.supplierId = self.rateComparedata.sortedIndentSuppliers[selectedIndex].supplier.id;
							
						for(var m = 0; m < self.rateComparedata.sortedIndentSuppliers[selectedIndex].supplierIndentList.length; m++){
							if(self.rateComparedata.sortedIndentSuppliers[selectedIndex].supplierIndentList[m].item.id == self.addedItems[i].item.id){
								self.addedItems[i].rate = self.rateComparedata.sortedIndentSuppliers[selectedIndex].supplierIndentList[m].rate;
								self.addedItems[i].poActualRate = self.rateComparedata.sortedIndentSuppliers[selectedIndex].supplierIndentList[m].rate;
								self.addedItems[i].discount = ( isNaN(self.addedItems[i].discount))?0:parseFloat(parseFloat(self.addedItems[i].discount).toFixed(2));
								self.addedItems[i].valueWithoutTax = (self.addedItems[i].poQuantity * self.rateComparedata.sortedIndentSuppliers[selectedIndex].supplierIndentList[m].rate) - (self.addedItems[i].poQuantity * self.rateComparedata.sortedIndentSuppliers[selectedIndex].supplierIndentList[m].rate * (self.addedItems[i].discount/100));
								self.addedItems[i].tax = self.addedItems[i].valueWithoutTax * (self.rateComparedata.sortedIndentSuppliers[selectedIndex].supplierIndentList[m].item.itemTax.gst)/100;
								totPrice = totPrice + self.addedItems[i].valueWithoutTax;
								totTax = totTax + self.addedItems[i].tax;
								
							}

						}
					}else{
						self.poPostData.poHeader.supplierId = self.rateComparedata.sortedIndentItemSuppliers[selectedIndex].supplier.id;
				
						for(var m = 0; m < self.rateComparedata.sortedIndentItemSuppliers[selectedIndex].supplierIndentList.length; m++){
							if(self.rateComparedata.sortedIndentItemSuppliers[selectedIndex].supplierIndentList[m].item.id == self.addedItems[i].item.id){
								self.addedItems[i].rate = self.rateComparedata.sortedIndentItemSuppliers[selectedIndex].supplierIndentList[m].rate;
								self.addedItems[i].poActualRate = self.rateComparedata.sortedIndentItemSuppliers[selectedIndex].supplierIndentList[m].rate;
								
								self.addedItems[i].valueWithoutTax = (self.addedItems[i].poQuantity * self.rateComparedata.sortedIndentItemSuppliers[selectedIndex].supplierIndentList[m].rate)-((self.addedItems[i].poQuantity * self.rateComparedata.sortedIndentItemSuppliers[selectedIndex].supplierIndentList[m].rate * (self.addedItems[i].discount/100)));
								self.addedItems[i].tax = self.addedItems[i].valueWithoutTax * (self.rateComparedata.sortedIndentItemSuppliers[selectedIndex].supplierIndentList[m].item.itemTax.gst/100);
								totPrice = totPrice + self.addedItems[i].valueWithoutTax;
								totTax = totTax + self.addedItems[i].tax;
								
							}

						}
					}
				}
				
				
				
				self.poPostData.poHeader.type = self.purchaseCreateModel.selectedPOType;
				self.poPostData.poHeader.footerNote = self.purchaseCreateModel.rejectionReason;
				self.poPostData.poHeader.status = "1";
				self.poPostData.poHeader.submitter = self.sessionData.sessionId;
				self.poPostData.poHeader.finnacialYear = self.purchaseCreateModel.createDate.date.year;
				self.poPostData.poHeader.createDate = new Date(self.purchaseCreateModel.createDate.date.year, self.purchaseCreateModel.createDate.date.month-1, self.purchaseCreateModel.createDate.date.day).getTime();
				self.poPostData.poHeader.poDate = new Date(self.purchaseCreateModel.createDate.date.year, self.purchaseCreateModel.createDate.date.month-1, self.purchaseCreateModel.createDate.date.day).getTime();
				self.poPostData.poHeader.tax = totTax;
				self.poPostData.poHeader.valueWithoutTax = totPrice - (totPrice * (self.purchaseCreateModel.discounthdr/100));
				self.poPostData.poHeader.valueWithTax = self.poPostData.poHeader.valueWithoutTax + totTax;
				self.poPostData.poHeader.juteUnit = null;
				self.poPostData.poItemList = self.addedItems;
				self.poPostData.poHeader.discount = self.purchaseCreateModel.discounthdr;
				self.poPostData.poHeader.frieghtCharge = self.purchaseCreateModel.flightcharge;
				self.poPostData.poHeader.deliveryTimeline = self.purchaseCreateModel.deliveryTime;
				self.poPostData.poHeader.deliveryAddress = self.purchaseCreateModel.creditTerm;
				
				this.http.createPO(self.poPostData)
			.subscribe(
			(data) => {
				self.createIndentResponseData = data;
			},
			(error) => self.errorMsg = error,
			() => {
				self.successMsg = "Purchase Order No. "+self.createIndentResponseData.poHeader.id+" Created Successfully.",
				self.purchaseCreateModel.selectedPOType = "",
				self.purchaseCreateModel.creditTerm = null,
				self.purchaseCreateModel.deliveryTime = "",
				self.purchaseCreateModel.selectedIndent = "",
				self.indentListAll = [],
				self.purchaseCreateModel.createDate = { date: { year: new Date().getFullYear(), month: new Date().getMonth()+1, day: new Date().getDate() } },
				self.addedItems = [],
				self.rateComparedata = [],
				self.purchaseCreateModel.selectedSup = "INPC0",
				self.purchaseCreateModel.rejectionReason = "",
				self.purchaseCreateModel.discounthdr = 0,
				self.purchaseCreateModel.flightcharge = 0,
				self.purchaseCreateModel.deliveryTime = "",
				self.purchaseCreateModel.creditTerm = "",
				$("#page_loader_service").fadeOut()
			}
		);
			}
		}
		
		
}
	  
}
