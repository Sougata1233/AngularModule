import { Component, OnInit, AfterViewInit } from '@angular/core';
import * as $ from 'jquery';

import { HttpTestService } from '../../../services/http.service';
import { sessionServices } from '../../../services/session.services';
import { Router, ActivatedRoute } from '@angular/router';
import {Observable} from 'rxjs/Rx';
declare var numberToWords: any;

import {GridOptions} from "ag-grid/main";
import {gridConversionComponentBale} from "../../common/gridBaleConvertion.Component";
import {gridConversionComponentPer} from "../../common/gridPerConvertion.Component";
import {gridPOTotPriceComponent} from "../../common/PurchaseTotalPrice.Component";
import {gridPOPyblPriceComponent} from "../../common/PurchasePayablePrice.Component";
import {gridIndentSearchLinkComponent} from "../../common/gridIndentSearchLink.Component";
import {legacyCodeItemNameComponent} from "../../common/legacy_item.component";
import { AppSettings } from '../../../config/settings/app-settings';

@Component({
  selector: 'app-POcanceldtl',
  templateUrl: './poCancelDetails.component.html'
})
export class purchaseOrderDetails implements OnInit {
	
	public sub: any;
	public requestedId: string;
	public poDetailData : any;
	public statusChangeResponsedata : any;
	public supplierDtlData : any;
	public successMsg: string ;
	public errorMsg: string ;
	public requestedURL : any;
	public userGroupData : any = '';
	public userMenuData : any = '';
	public userSelectionMenuData : any = [];
	public sessionData: any;
	public inWordData : string;
	public mukams:any;
	public poFormat : string = "";
	
	public gridOptions: GridOptions;
	public hideCol: boolean = true;
	
	public totJuteQuantity : number = 0;
	
	public approvalData : any = [];
	public stat : string = "";
	public printableSupplierData:any = "";
	public printableMukam:any = "";
	public allVehicles : any;
	public printableVehicle:any = "";
	public printResponsedata : any = "";
	public company : string = "";
	public company_add_1 : string = "";
	public company_add_2 : string = "";
	public company_contact : string = "";
	public company_state : string = "";
	public prefix : string = "";
	
	public columnDef : any = [
		{headerName: "status", field: "status", hide:true, filter:"text"},
		{headerName: "Item Group", field: "itemGroup.name", suppressMenu: true, minWidth : 350},
		{headerName: "Item Descrption", field: "item.name", suppressMenu: true, minWidth : 350, cellRendererFramework: legacyCodeItemNameComponent},
		{headerName: "Quality", field: "quality.name", suppressMenu: true, hide : this.hideCol, minWidth : 250},
		{headerName: "HSN Code", field: "item.hsnCode", suppressMenu: true, minWidth : 250},
		//{headerName: "Indent No.", field: "indentId", suppressMenu: true, minWidth : 250, cellRendererFramework : gridIndentSearchLinkComponent},
		{headerName: "Order Price/Item", field: "rate", suppressMenu: true, minWidth : 200, valueFormatter: function (params) {
			return parseFloat(parseFloat(params.value).toFixed(2));
		}},
		{headerName: "Quantity", field: "poQuantity", suppressMenu: true, minWidth : 200, valueFormatter: function (params) {
			return parseFloat(parseFloat(params.value).toFixed(2));
		}},
		{headerName: "Unit", field: "quantityUnit.name", suppressMenu: true, minWidth : 200},
		{headerName: "Discount (%)", field: "discount", suppressMenu: true, minWidth : 250},
		{headerName: "Total Price", field: "poQuantity", suppressMenu: true, cellRendererFramework: gridPOTotPriceComponent, minWidth : 200, valueFormatter: function (params) {
			return parseFloat(parseFloat(params.value).toFixed(2));
		}},
		{headerName: "GST", field: "item.itemTax.gst", suppressMenu: true, minWidth : 100},
		{headerName: "Payable Price", field: "poQuantity", suppressMenu: true, cellRendererFramework: gridPOPyblPriceComponent, minWidth : 200, valueFormatter: function (params) {
			return parseFloat(parseFloat(params.value).toFixed(2));
		}},
		{headerName: "Additional Requirement", field: "additionalRequirement", suppressMenu: true, minWidth : 350}
	];
	
	public onQuickFilterChanged($event) {
        this.gridOptions.api.setQuickFilter($event.target.value);
    }
	
	constructor(public http: HttpTestService, public router: Router, public session: sessionServices, public activatedRoute: ActivatedRoute) {
		var self = this;
		this.company = AppSettings.COMPANY_NAME;
		this.company_add_1 = AppSettings.COMPANY_ADDRESS_ONE;
		this.company_add_2 = AppSettings.COMPANY_ADDRESS_TWO;
		this.company_contact = AppSettings.COMPANY_CONTACT;
		this.company_state = AppSettings.COMPANY_STATE;
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
			 if(self.poDetailData.poHeader != undefined && self.poDetailData.poHeader.status != '4'){
			athleteFilterComponent.setModel({
						type:'equals',
						filter:'1'
						});
			params.api.onFilterChanged()
			 }
    };
	}
		
	ngOnInit() {
		this.getSession();
		this.loadApprovalData();
		//this.getUserGroup();
		this.sub = this.activatedRoute.params.subscribe(params => {
			this.requestedId = params['id'];
		});
		this.loadPODetails();
		this.getPrintCounter();
		
	}
	
	withDecimal = function(n) {
		var self = this;
    var nums:any = n.toString().split('.')
    var whole:any = self.convertNumberToWords(nums[0])
    if (nums.length == 2) {
        var fraction:any = self.convertNumberToWords(nums[1])
        return whole + 'and ' + fraction;
    } else {
        return whole;
    }
	}

	
	convertNumberToWords = function(amount:any) {
    var words:any = new Array();
    words[0] = '';
    words[1] = 'One';
    words[2] = 'Two';
    words[3] = 'Three';
    words[4] = 'Four';
    words[5] = 'Five';
    words[6] = 'Six';
    words[7] = 'Seven';
    words[8] = 'Eight';
    words[9] = 'Nine';
    words[10] = 'Ten';
    words[11] = 'Eleven';
    words[12] = 'Twelve';
    words[13] = 'Thirteen';
    words[14] = 'Fourteen';
    words[15] = 'Fifteen';
    words[16] = 'Sixteen';
    words[17] = 'Seventeen';
    words[18] = 'Eighteen';
    words[19] = 'Nineteen';
    words[20] = 'Twenty';
    words[30] = 'Thirty';
    words[40] = 'Forty';
    words[50] = 'Fifty';
    words[60] = 'Sixty';
    words[70] = 'Seventy';
    words[80] = 'Eighty';
    words[90] = 'Ninety';
    amount = amount.toString();
    var atemp:any = amount.split(".");
    var number:any = atemp[0].split(",").join("");
    var n_length:any = number.length;
    var words_string:any = "";
    if (n_length <= 9) {
        var n_array:any = new Array(0, 0, 0, 0, 0, 0, 0, 0, 0);
        var received_n_array:any = new Array();
        for (var i = 0; i < n_length; i++) {
            received_n_array[i] = number.substr(i, 1);
        }
        for (var i = 9 - n_length, j = 0; i < 9; i++, j++) {
            n_array[i] = received_n_array[j];
        }
        for (var i = 0, j = 1; i < 9; i++, j++) {
            if (i == 0 || i == 2 || i == 4 || i == 7) {
                if (n_array[i] == 1) {
                    n_array[j] = 10 + parseInt(n_array[j]);
                    n_array[i] = 0;
                }
            }
        }
        var value:any = "";
        for (var i = 0; i < 9; i++) {
            if (i == 0 || i == 2 || i == 4 || i == 7) {
                value = n_array[i] * 10;
            } else {
                value = n_array[i];
            }
            if (value != 0) {
                words_string += words[value] + " ";
            }
            if ((i == 1 && value != 0) || (i == 0 && value != 0 && n_array[i + 1] == 0)) {
                words_string += "Crores ";
            }
            if ((i == 3 && value != 0) || (i == 2 && value != 0 && n_array[i + 1] == 0)) {
                words_string += "Lakhs ";
            }
            if ((i == 5 && value != 0) || (i == 4 && value != 0 && n_array[i + 1] == 0)) {
                words_string += "Thousand ";
            }
            if (i == 6 && value != 0 && (n_array[i + 1] != 0 && n_array[i + 2] != 0)) {
                words_string += "Hundred and ";
            } else if (i == 6 && value != 0) {
                words_string += "Hundred ";
            }
        }
        words_string = words_string.split("  ").join(" ");
    }
    return words_string;
}
	
	
	NumToWord = function(int) {
  if (int === 0) return 'zero';

  var ONES  = ['','one','two','three','four','five','six','seven','eight','nine','ten','eleven','twelve','thirteen','fourteen','fifteen','sixteen','seventeen','eighteen','nineteen'];
  var TENS  = ['','','twenty','thirty','fourty','fifty','sixty','seventy','eighty','ninety'];
  var SCALE = ['','thousand','million','billion','trillion','quadrillion','quintillion','sextillion','septillion','octillion','nonillion'];

  // Return string of first three digits, padded with zeros if needed
  function get_first(str) {
    return ('000' + str).substr(-3);
  }

  // Return string of digits with first three digits chopped off
  function get_rest(str) {
    return str.substr(0, str.length - 3);
  }

  // Return string of triplet convereted to words
  function triplet_to_words(_3rd, _2nd, _1st) {
    return (_3rd == '0' ? '' : ONES[_3rd] + ' hundred ') + (_1st == '0' ? TENS[_2nd] : TENS[_2nd] && TENS[_2nd] + '-' || '') + (ONES[_2nd + _1st] || ONES[_1st]);
  }

  // Add to words, triplet words with scale word
  function add_to_words(words, triplet_words, scale_word) {
    return triplet_words ? triplet_words + (scale_word && ' ' + scale_word || '') + ' ' + words : words;
  }

  function iter(words, i, first, rest) {
    if (first == '000' && rest.length === 0) return words;
    return iter(add_to_words(words, triplet_to_words(first[0], first[1], first[2]), SCALE[i]), ++i, get_first(rest), get_rest(rest));
  }

  return iter('', 0, get_first(String(int)), get_rest(String(int)));
}
	
	
	
	refreshTotals = function(){
		 var self = this;
		 self.totJuteQuantity = 0;
		for(var i = 0; i < self.poDetailData.poItemList.length; i++){
			self.totJuteQuantity = self.totJuteQuantity + parseInt(self.poDetailData.poItemList[i].poQuantity);
		}
	}
	
	
	
	//get session details
	getSession = function(){
		this.sessionData = this.session.getSessionDetails();
	}
	
	loadApprovalData = function(){
		var self = this;
		
		this.http.getApprovalData(this.sessionData.sessionId)
			.subscribe(
			(data) => {
				self.approvalData = data;
			},
			(error) => {
				self.approvalData = [], 
				self.errorMsg = "Service Error."
				},
			() => {
				for(var i = 0; i<self.approvalData.length; i++){
					if(self.approvalData[i].taskDesc == "PO"){
						self.stat = "2";
					}else if(self.approvalData[i].taskDesc == "PO2"){
						self.stat = "3";
					}
				}
			}
		);
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
	
	cancelIt = function(){
		var confirmation = confirm("Are you sure you want to permanently delete the data.");
		if(confirmation){
			this.statusChange('6');
		}
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
	
	loadPODetails = function() {
		var self = this;
		
		this.http.getPOData(self.requestedId)
			.subscribe(
			(data) => {
				self.poDetailData = data;
			},
			(error) => self.errorMsg = error,
			() => {
				
				for(var i = 0; i < self.poDetailData.poItemList.length; i++){
					self.totJuteQuantity = self.totJuteQuantity + self.poDetailData.poItemList[i].poQuantity;
				}
				if(self.poDetailData && self.poDetailData != 'undefined'){
				this.inWordData = self.withDecimal(self.poDetailData.poHeader.valueWithTax),
				this.getSupplierDetails();
				self.refreshTotals();
				}
				
				if(self.poDetailData.poHeader.type == "J"){
					self.poFormat = self.prefix+"/"+self.poDetailData.poHeader.type+"/PO/101"+self.poDetailData.poHeader.id;
				}else if(self.poDetailData.poHeader.type == "G"){
					self.poFormat = self.prefix+"/"+self.poDetailData.poHeader.type+"/PO/102"+self.poDetailData.poHeader.id;
				}else if(self.poDetailData.poHeader.type == "O"){
					self.poFormat = self.prefix+"/"+self.poDetailData.poHeader.type+"/PO/103"+self.poDetailData.poHeader.id;
				}else if(self.poDetailData.poHeader.type == "H"){
					self.poFormat = self.prefix+"/"+self.poDetailData.poHeader.type+"/PO/104"+self.poDetailData.poHeader.id;
				}else if(self.poDetailData.poHeader.type == "P"){
					self.poFormat = self.prefix+"/"+self.poDetailData.poHeader.type+"/PO/105"+self.poDetailData.poHeader.id;
				}else if(self.poDetailData.poHeader.type == "M"){
					self.poFormat = self.prefix+"/"+self.poDetailData.poHeader.type+"/PO/106"+self.poDetailData.poHeader.id;
				}
				
				if(self.poDetailData.poHeader.type == 'J'){
					self.hideCol = false;
					if(self.poDetailData.poHeader.juteUnit == 'BALE' || self.poDetailData.poHeader.juteUnit == 'PAKA BALE' || self.poDetailData.poHeader.juteUnit == 'HALF BALE'){
						self.columnDef = [
		{headerName: "status", field: "status", hide:true, filter:"text"},
						//{headerName: "Item Group", field: "itemGroup.name", suppressMenu: true, minWidth : 350},
						{headerName: "Item Descrption", field: "item.name", suppressMenu: true, minWidth : 350, cellRendererFramework: legacyCodeItemNameComponent},
						{headerName: "Quality", field: "quality.name", suppressMenu: true, hide : this.hideCol, minWidth : 250},
						{headerName: "HSN Code", field: "item.hsnCode", suppressMenu: true, minWidth : 250},
						//{headerName: "Indent No.", field: "indentId", suppressMenu: true, minWidth : 250, cellRendererFramework : gridIndentSearchLinkComponent, hide:true},
						{headerName: "Order Price/Item", field: "rate", suppressMenu: true, minWidth : 200, valueFormatter: function (params) {
			return parseFloat(parseFloat(params.value).toFixed(2));
		}},
						{headerName: "Weight", field: "poQuantity", suppressMenu: true, minWidth : 200, valueFormatter: function (params) {
			return parseFloat(parseFloat(params.value).toFixed(2));
		}},
						{headerName: "Unit", field: "quantityUnit.name", suppressMenu: true, minWidth : 200},
						{headerName: "Allowable Moisture (%)", field: "allowableMoisturePercentage", suppressMenu: true, minWidth : 250},
						{headerName: "Converted Quantity", field: "conversionQuantity", suppressMenu: true, minWidth : 250, 
							valueFormatter: function (params) {
							if(params.data.unitConversionType == "LOOSE"){	
								return  parseFloat(((params.data.poActualQuantity/self.totJuteQuantity)*100).toFixed(2)) +" %";
							}else{
								return params.value +" BALE";
							}
						}},
							{headerName: "Discount (%)", field: "discount", suppressMenu: true, minWidth : 250},
							{headerName: "Total Price", field: "poQuantity", suppressMenu: true, cellRendererFramework: gridPOTotPriceComponent, minWidth : 200, valueFormatter: function (params) {
			return parseFloat(parseFloat(params.value).toFixed(2));
		}},
						{headerName: "GST", field: "item.itemTax.gst", suppressMenu: true, minWidth : 100},
						{headerName: "Payable Price", field: "poQuantity", suppressMenu: true, cellRendererFramework: gridPOPyblPriceComponent, minWidth : 200, valueFormatter: function (params) {
			return parseFloat(parseFloat(params.value).toFixed(2));
		}},
						{headerName: "Additional Requirement", field: "additionalRequirement", suppressMenu: true, minWidth : 350}
	];
					}else{
						self.columnDef = [
		{headerName: "status", field: "status", hide:true, filter:"text"},
						{headerName: "Item Group", field: "itemGroup.name", suppressMenu: true, minWidth : 350},
						{headerName: "Item Descrption", field: "item.name", suppressMenu: true, minWidth : 350, cellRendererFramework: legacyCodeItemNameComponent},
						{headerName: "Quality", field: "quality.name", suppressMenu: true, hide : this.hideCol, minWidth : 250},
						{headerName: "HSN Code", field: "item.hsnCode", suppressMenu: true, minWidth : 250},
						//{headerName: "Indent No.", field: "indentId", suppressMenu: true, minWidth : 250, cellRendererFramework : gridIndentSearchLinkComponent, hide:true},
						{headerName: "Order Price/Item", field: "rate", suppressMenu: true, minWidth : 200, valueFormatter: function (params) {
			return parseFloat(parseFloat(params.value).toFixed(2));
		}},
						{headerName: "Weight", field: "poQuantity", suppressMenu: true, minWidth : 200, valueFormatter: function (params) {
			return parseFloat(parseFloat(params.value).toFixed(2));
		}},
						{headerName: "Unit", field: "quantityUnit.name", suppressMenu: true, minWidth : 200},
						//{headerName: "Allowable Moisture (%)", field: "allowableMoisturePercentage", suppressMenu: true, minWidth : 250},
						{headerName: "Converted Quantity", field: "conversionQuantity", suppressMenu: true, minWidth : 250, 
							valueFormatter: function (params) {
							if(params.data.unitConversionType == "LOOSE"){	
								return  parseFloat(((params.data.poActualQuantity/self.totJuteQuantity)*100).toFixed(2)) +" %";
							}else{
								return params.value +" BALE";
							}
							}
						},
						{headerName: "Discount (%)", field: "discount", suppressMenu: true, minWidth : 250},
						{headerName: "Total Price", field: "poQuantity", suppressMenu: true, cellRendererFramework: gridPOTotPriceComponent, minWidth : 200, valueFormatter: function (params) {
			return parseFloat(parseFloat(params.value).toFixed(2));
		}},
						{headerName: "GST", field: "item.itemTax.gst", suppressMenu: true, minWidth : 100},
						{headerName: "Payable Price", field: "poQuantity", suppressMenu: true, cellRendererFramework: gridPOPyblPriceComponent, minWidth : 200, valueFormatter: function (params) {
			return parseFloat(parseFloat(params.value).toFixed(2));
		}},
						{headerName: "Additional Requirement", field: "additionalRequirement", suppressMenu: true, minWidth : 350}
	];
					}
					
				}
			}
		);
	}
	
	updateQuantity = function(e, indexId){
		var self = this;
		var elementObjVal = e.target.value;
		self.poDetailData.poItemList[indexId].poQuantity = elementObjVal;
		
	}
	
	updateOrderVal = function(e, indexId){
		var self = this;
		var elementObjVal = e.target.value;
		self.poDetailData.poItemList[indexId].valueWithoutTax = elementObjVal;
		
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
					if(self.supplierDtlData[i].id == self.poDetailData.poHeader.supplierId){
					self.printableSupplierData = self.supplierDtlData[i];
					}
					
					console.log(self.printableSupplierData);
				}
				
				if(self.poDetailData.poHeader.type == 'J'){
						self.loadMukam(self.printableSupplierData.id);
				}
			}
		);
	}
	
	loadMukam = function(supplier){
	  var self = this;
		this.http.getAllMukamsbysup(supplier)
		  .subscribe(
			(data) => {
			  this.mukams = data;
			  },
			(error) => {
				this.errorMsg = error;
				this.mukams = "";
			},
			() => {
				
				for(var i=0; i < self.mukams.length; i++){
					if(self.mukams[i].mukamId == self.poDetailData.poHeader.mukam){
					self.printableMukam = self.mukams[i];
					}
				}
				
				self.getAllVehicles();
			}
		  );
  }
  
  getAllVehicles = function(){
	  var self = this;
		this.http.getAllVehicles()
		  .subscribe(
			(data) => {
			  this.allVehicles = data;
			  },
			(error) => {
				this.errorMsg = error;
				this.allVehicles = "";
			},
			() => {
				for(var i=0; i < self.allVehicles.length; i++){
					if(self.allVehicles[i].id == self.poDetailData.poHeader.vehicleTypeId){
					self.printableVehicle = self.allVehicles[i];
					}
				}
				
			}
		  );
	}
	
	statusChange = function(changedstatus){
		var self = this;
		self.poDetailData.poHeader.status = changedstatus;
		//self.indentDetailData.reason = self.indentCreateModel.rejectionReason;
		this.http.updatePO(self.poDetailData)
			.subscribe(
			(data) => {
				self.statusChangeResponsedata = data;
			},
			(error) => self.errorMsg = error,
			() => {
				self.successMsg = "Purchase Order Status Changed Successfully.",
				self.router.navigate(['purchase/list'])
			}
		);
	}
	
	getPrintCounter = function(){
		var self = this;
		this.http.getPrintCount("po^"+self.requestedId)
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
				"type" : "po",
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
