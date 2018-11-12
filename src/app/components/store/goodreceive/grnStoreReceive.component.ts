import { Component, OnInit, AfterViewInit } from '@angular/core';
import * as $ from 'jquery';

import { HttpTestService } from '../../../services/http.service';
import { Router, ActivatedRoute } from '@angular/router';
import { sessionServices } from '../../../services/session.services';
import {Observable} from 'rxjs/Rx';
import { grnReceiveModel } from '../../../models/grn/grnReceive.model';
import {IMyDpOptions} from 'mydatepicker';

import {GridOptions} from "ag-grid/main";
import {numericRequiredEditorComponent} from "../../editor/numericRequiredEditor.component";
import {gridDaviationSRComponent} from "../../common/gridDaviationSR.component";
import {gridReceiveRejectComponent} from "../../common/gridReceiveRejectComponent";
import {griddateSRcomponent} from "../../common/gridDatepickerSR.component";
import {legacyCodeItemNameComponent} from "../../common/legacy_item.component";
import {gridStoreEditTriggerComponent} from "../../common/gridStoreEditTriggerComponent";


@Component({
  selector: 'app-good-receive',
  templateUrl: './grnStoreReceive.component.html'
})
export class grnStoreReceiveComponent implements OnInit {
	
	
	public errorMsg : string = "";
	public successMsg : string = "";
	public GRNDtllData : any = "";
	public sessionData: any;
	public procced : boolean = true;
	public grnReceiveModel: grnReceiveModel = new grnReceiveModel();
	
	public chalanDtls : any;
	public totJuteQuantity : number = 0;
	public addedItems : any = [];
	public createGrnResponsedata : any;
	public gridOptions: GridOptions;
	public myOptions:any = [];
	public myChalanOptions:any = [];
	public vendorAllData : any = [];
	public chalanAllData : any = [];
	public myPOOptions:any = [];
	public POAllData : any = [];
	public SRdetails : any = "";
	public storeedit : any = "";
	public allStores : any = [];
	
	
	public grnPostData : any = {
  "storeGoodReceiveHeader": {
	"goodReceiptDate": null,
    "supplierId": null,
    "poId": null,
    "poDate": null,
    "chalanNo": null,
    "chalanDate": null,
    "storeNo": 0,
    "status": null,
    "submitter": null,
    "createDate": null
  },
  "storeGrnItemList": []
};
	
	
	public myDatePickerOptions: IMyDpOptions = {
        // other options...
        dateFormat: 'yyyy-mm-dd',
		disableSince : { year: new Date().getFullYear(), month: new Date().getMonth()+1, day: new Date().getDate()+1 }
    };
	
	public expiryDateOptions: IMyDpOptions = {
        // other options...
        dateFormat: 'yyyy-mm-dd'
	};
	
	public expOpn : boolean = false;
	public expOpnId : number = null;
	
	public columnDef : any = [
		{headerName: "Item Code", field: "item.id", suppressMenu: true, minWidth : 250},
		{headerName: "Item Description", field: "item.name", suppressMenu: true, minWidth : 350, cellRendererFramework: legacyCodeItemNameComponent},
		{headerName: "Additional Requirement", field: "additionalRequirements", suppressMenu: true, minWidth : 350, editable : true, cellEditor : 'largeText'},
		{headerName: "Advised Quantity", field: "advisedQuantity", suppressMenu: true, minWidth : 200, valueFormatter: function (params) {
			return parseFloat(parseFloat(params.value).toFixed(2));
		}},
		{headerName: "Actual Quantity", field: "actualQuantity", suppressMenu: true, minWidth : 200, cellEditorFramework: numericRequiredEditorComponent, editable : true, valueFormatter: function (params) {
			return parseFloat(parseFloat(params.value).toFixed(2));
		}},
		{headerName: "Rejected Quantity", field: "orderedPrice", suppressMenu: true, minWidth : 200, cellEditorFramework: numericRequiredEditorComponent, editable : true, valueFormatter: function (params) {
			return parseFloat(parseFloat(params.value).toFixed(2));
		}},
		{headerName: "Deviation", field: "deviation", suppressMenu: true, minWidth : 200, valueFormatter: function (params) {
			return parseFloat(parseFloat(params.value).toFixed(2));
		}},
		{headerName: "Received Price", field: "receivedPrice", suppressMenu: true, minWidth : 200, cellEditorFramework: numericRequiredEditorComponent, editable : true, valueFormatter: function (params) {
			return parseFloat(parseFloat(params.value).toFixed(2));
		}},
		{headerName: "Rejection Code", field: "claims", suppressMenu: true, minWidth : 100, editable : true, cellEditor : 'text'},
		{headerName: "Store Id", field: "storeId", suppressMenu: true, minWidth : 200, cellRendererFramework: gridStoreEditTriggerComponent},
		{headerName: "Floor No", field: "floor", suppressMenu: true, minWidth : 200, cellEditorFramework: numericRequiredEditorComponent, editable : true},
		{headerName: "Room No", field: "room", suppressMenu: true, minWidth : 200, cellEditorFramework: numericRequiredEditorComponent, editable : true},
		{headerName: "Rack No", field: "rack", suppressMenu: true, minWidth : 200, cellEditorFramework: numericRequiredEditorComponent, editable : true},
		{headerName: "Position", field: "position", suppressMenu: true, minWidth : 200, editable : true, cellEditor : 'text'},
		{headerName: "Expiry Date", field: "expiryDate", suppressMenu: true, minWidth : 200, cellRendererFramework : griddateSRcomponent},
		{headerName: "Remarks", field: "remarks", suppressMenu: true, minWidth : 350, editable : true, cellEditor : 'largeText'},
		{headerName: "Receive/Reject", field: "status", suppressMenu: true, minWidth : 200, cellRendererFramework : gridReceiveRejectComponent} 
	];
	
	
	public onQuickFilterChanged($event) {
        this.gridOptions.api.setQuickFilter($event.target.value);
    }
	
	
	
	constructor(public http: HttpTestService, public router: Router, public session: sessionServices) {
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
		 this.gridOptions.onRowClicked = function(params) {
			 var clickedItem = $(params.event.target).attr("data-action-type");
			 //var typeofTarget = $(clickedItem.getAttribute("data-action-type");
			 if(clickedItem == "receive"){self.changeMRItmStat(params);}
			 if(clickedItem == "expdtpckr"){self.changeExprDate(params);}
			 if(clickedItem == "storeEditTrigger"){self.openStoreEdit(params);}
		 };
		  this.gridOptions.onCellEditingStopped = function(params) {
			 if(self.addedItems != 'undefined'){
				self.updateDeviation(params.node.id, params);
				params.api.setRowData(self.addedItems);
			 }
			 };
	}
		
	ngOnInit() {
		this.getSession();
		this.loadVendorDetrails();
	}
	
	openStoreEdit = function(params){
		var self = this;
		self.storeedit  = params.node.id;
		self.grnReceiveModel.SRStoreSelect = "";
		self.http.getAllStores()
			.subscribe(
			(data) => {
				self.allStores = data;
			},
			(error) => self.errorMsg = error,
			() => {
				for(var i = 0; i<self.allStores.length; i++){
					if(self.allStores[i].storeId == params.data.storeId){
						self.grnReceiveModel.SRStoreSelect = i;
					}
				}
			}
		);
	}
	
	closeStoreDialog = function(){
		var self = this;
		self.storeedit = "";
		self.gridOptions.api.setRowData(self.addedItems);
	}
	
	updateStoreNumber = function(){
		var self = this;
		self.addedItems[self.storeedit].storeId = self.allStores[self.grnReceiveModel.SRStoreSelect].storeId;
		self.closeStoreDialog();
	}
	
	
	loadVendorDetrails = function() {
		var self = this;
		
		this.http.getAllSuppliers()
			.subscribe(
			(data) => {
				self.vendorAllData = data;
			},
			(error) => self.errorMsg = error,
			() => {
				for(var i = 0; i<self.vendorAllData.length; i++){
					if(self.vendorAllData[i].type != 'J'){
						var createObj = {
							value : self.vendorAllData[i].id,
							label : self.vendorAllData[i].name+"("+self.vendorAllData[i].id+")"
						};
						self.myOptions.push(createObj);
					}
				}
			}
		);
	}
	
	
	generateChalan = function(e){
		 $("#page_loader_service").fadeIn();
		var self = this;
		self.chalanAllData = [];
		self.myChalanOptions= [];
		self.grnReceiveModel.poId = "";
		self.grnReceiveModel.chalanNo = "";
		this.chalanDtls = "";
		self.POAllData =[];
		self.myPOOptions = [];
		self.addedItems = [];
		var selectedVal = e.value;
		this.http.getChalanBySupplier(selectedVal)
			.subscribe(
			(data) => {
				self.chalanAllData = data;
			},
			(error) => self.errorMsg = error,
			() => {
				for(var i = 0; i<self.chalanAllData.length; i++){
					var createObj = {
						value : self.chalanAllData[i].chalanNo,
						label : self.chalanAllData[i].chalanNo
					};
					self.myChalanOptions.push(createObj);
				}
				 $("#page_loader_service").fadeOut();
			}
		);
	}
	
	fetchPOOptions = function(e){
		 $("#page_loader_service").fadeIn();
		var self = this;
		self.errorMsg = "";
		self.successMsg = "";
		var emteredChalan = e.value;
		self.addedItems = [];
		self.POAllData =[];
		self.myPOOptions = [];
		self.chalanDtls = "";
		self.grnReceiveModel.poId = "";
		self.http.getPODtlsMr(self.grnReceiveModel.supplierId, emteredChalan)
			.subscribe(
			(data) => {
				self.POAllData = data;
			},
			(error) => self.errorMsg = error,
			() => {
				for(var i = 0; i<self.POAllData.length; i++){
					var createObj = {
						value : self.POAllData[i].id,
						label : self.POAllData[i].id
					};
					self.myPOOptions.push(createObj);
				}
				 $("#page_loader_service").fadeOut();
			}
			);
	}
	
	//get session details
	getSession = function(){
		this.sessionData = this.session.getSessionDetails();
	}
	
	fetchChalanDetails = function(e){
		 $("#page_loader_service").fadeIn()
		var self = this;
		self.errorMsg = "";
		self.successMsg = "";
		var enteredpo = e.value;
		self.addedItems = [];
		
		if(enteredpo != ""){
			self.http.getChallanDtlsSr(self.grnReceiveModel.chalanNo+"^"+self.grnReceiveModel.supplierId+"^"+enteredpo)
			.subscribe(
				(data) => {
					this.chalanDtls = data;
				},
				(error) => {
					this.errorMsg = error,
					this.chalanDtls = ""
				},
				() => {
					this.getSRdetailsfrmChalan(self.grnReceiveModel.chalanNo,self.grnReceiveModel.supplierId,enteredpo)
					//this.createAddedItemList()
					}
			);
		}else{
			this.chalanDtls = "";
		}
	}
	
	
	getSRdetailsfrmChalan  = function(emteredChalan,enteredsupp,enteredpo){
		
		var self = this;
		self.errorMsg = "";
		self.successMsg = "";
		self.http.getSrdetailFrmChalan(emteredChalan,enteredsupp,enteredpo)
			.subscribe(
				(data) => {
					if(data.storeGoodReceiveHeader && data.storeGoodReceiveHeader != undefined){
						this.GRNDtllData = data;
						if(data.storeGoodReceiveHeader.status != "0"){
						self.successMsg = "An SR already created against selected chalan, Supplier and PO combination.";
						self.procced = false;
						}
						self.addedItems = data.storeGrnItemList;
						 $("#page_loader_service").fadeOut();
					}else{
						this.GRNDtllData = "";
						self.procced = true;
						this.createAddedItemList();
					}
				},	
				(error) => {
					this.GRNDtllData = "";
					self.procced = true;
					this.createAddedItemList();
				},
				() => {}
			);
	}
	
	
	
	
	
	
	createAddedItemList = function(){
		var self = this;
		self.totJuteQuantity = 0;
		for(var i=0; i < self.chalanDtls.poItemList.length; i++){
		 var createdObj:any = {
					"item"					 : self.chalanDtls.poItemList[i].item,
					"additionalRequirements" : self.chalanDtls.poItemList[i].additionalRequirement,
					"advisedQuantity"		 : self.chalanDtls.poItemList[i].poQuantity,
					"actualQuantity"		 : self.chalanDtls.poItemList[i].poActualQuantity,
					"deviation"				 : self.chalanDtls.poItemList[i].poQuantity - self.chalanDtls.poItemList[i].poActualQuantity,
					"orderedPrice"			 : 0,
					"receivedPrice"			 : self.chalanDtls.poItemList[i].rate,
					"claims"				 : null,
					"remarks"				 : "",
					"receiveDate"			 : new Date(self.grnReceiveModel.srdate.date.year, self.grnReceiveModel.srdate.date.month-1, self.grnReceiveModel.srdate.date.day).getTime(),
					"storeId"				 : 0,
					"floor"					 : 0,
					"room"					 : 0,
					"rack"					 : 0,
					"position"				 : 0,
					"expiryDate"			 : null,
					"status"				 : "1",
					"uomCode"				 : self.chalanDtls.poItemList[i].quantityUnit,
					"debitNotesFlag"		 : "N",
					"approverFirst"			 : null,
					"approverSecond"		 : null,
					"approveFirstDate"		 : null,
					"approveSecondDate"		 : null
					
				};
				self.addedItems.push(createdObj);
				self.totJuteQuantity = self.totJuteQuantity + parseInt(self.chalanDtls.poItemList[i].poActualQuantity);
				 $("#page_loader_service").fadeOut();
		}
	}
	
	updateDeviation = function(index,params){
		var self = this;
		if(params.colDef.field == 'actualQuantity'){
			if(parseFloat(self.addedItems[index].actualQuantity) < 0){
				self.addedItems[index].actualQuantity = 0;
			}
			
			if(parseFloat(self.addedItems[index].actualQuantity) > (parseFloat(self.addedItems[index].advisedQuantity) - parseFloat(self.addedItems[index].orderedPrice))){
				self.addedItems[index].actualQuantity = (parseFloat(self.addedItems[index].advisedQuantity) - parseFloat(self.addedItems[index].orderedPrice));
			}
			
		}
		
		if(params.colDef.field == 'orderedPrice'){
			if(parseFloat(self.addedItems[index].orderedPrice) < 0){
				self.addedItems[index].orderedPrice = 0;
			}
			
			if(parseFloat(self.addedItems[index].orderedPrice) > (parseFloat(self.addedItems[index].advisedQuantity) - parseFloat(self.addedItems[index].deviation))){
				self.addedItems[index].orderedPrice = (parseFloat(self.addedItems[index].advisedQuantity) - parseFloat(self.addedItems[index].deviation));
			}
			
			self.addedItems[index].actualQuantity = parseFloat(self.addedItems[index].advisedQuantity) - (parseFloat(self.addedItems[index].orderedPrice) + parseFloat(self.addedItems[index].deviation));
			
		}
		self.addedItems[index].deviation = (parseFloat(self.addedItems[index].advisedQuantity) - (parseFloat(self.addedItems[index].actualQuantity) + parseFloat(self.addedItems[index].orderedPrice)));
	}
	
	
	changeExprDate = function(params){
		var self = this;
		self.expOpn = true;
		self.expOpnId = params.node.id;
	}
	
	setExpVal = function(index){
		var self = this;
		self.addedItems[index].expiryDate = new Date(self.grnReceiveModel.exdate.date.year, self.grnReceiveModel.exdate.date.month-1, self.grnReceiveModel.exdate.date.day).getTime();
		self.expOpn = false;
		self.expOpnId = null;
		self.grnReceiveModel.exdate = { date: { year: new Date().getFullYear(), month: new Date().getMonth()+1, day: new Date().getDate() } };
		this.gridOptions.api.setRowData(self.addedItems);
		console.log(self.addedItems);
	}
	
	changeMRItmStat = function(params){
		var self = this;
		var selected = params.event.target.checked;
		if(selected){
			self.addedItems[params.node.id].status = "1";
		}else{
			self.addedItems[params.node.id].status = "4";
		}
		
		this.gridOptions.api.setRowData(self.addedItems);
	}
	
	
	
	
	createMR = function(){
		 $("#page_loader_service").fadeIn();
		var self = this;
		self.errorMsg = "";
		self.successMsg = "";
		
		self.grnPostData.storeGoodReceiveHeader.goodReceiptDate = new Date(self.grnReceiveModel.srdate.date.year, self.grnReceiveModel.srdate.date.month-1, self.grnReceiveModel.srdate.date.day).getTime();
		self.grnPostData.storeGoodReceiveHeader.supplierId = self.chalanDtls.poHeader.supplierId;
		self.grnPostData.storeGoodReceiveHeader.poId = self.chalanDtls.poHeader.id;
		self.grnPostData.storeGoodReceiveHeader.poDate = self.chalanDtls.poHeader.createDate;
		self.grnPostData.storeGoodReceiveHeader.chalanNo = self.grnReceiveModel.chalanNo;
		self.grnPostData.storeGoodReceiveHeader.chalanDate = self.chalanDtls.chalanDate;
		self.grnPostData.storeGoodReceiveHeader.status = "1";
		self.grnPostData.storeGoodReceiveHeader.submitter = self.sessionData.sessionUserName;
		self.grnPostData.storeGoodReceiveHeader.createDate = new Date(self.grnReceiveModel.srdate.date.year, self.grnReceiveModel.srdate.date.month-1, self.grnReceiveModel.srdate.date.day).getTime();
		
		self.grnPostData.storeGrnItemList = self.addedItems;
		
		
		this.http.createSR(self.grnPostData)
			.subscribe(
			(data) => {
				self.createGrnResponsedata = data;
			},
			(error) => self.errorMsg = error,
			() => {
				
				self.successMsg = "SR No "+self.createGrnResponsedata.storeGoodReceiveHeader.id+" created successfully.",
				self.grnReceiveModel.srdate = { date: { year: new Date().getFullYear(), month: new Date().getMonth()+1, day: new Date().getDate() } },
				self.chalanDtls = "",
				self.grnReceiveModel.chalanNo = "",
				self.grnReceiveModel.poId = "",
				self.grnReceiveModel.contractDate = { date: { year: new Date().getFullYear(), month: new Date().getMonth()+1, day: new Date().getDate() } },
				self.addedItems = [],
				self.chalanDtls = "",
				self.myChalanOptions = [],
				self.chalanAllData = [],
				self.grnReceiveModel.supplierId = "",
				self.POAllData.length = 0,
				self.myPOOptions.length = 0,
				 $("#page_loader_service").fadeOut()
			}
		);
	}
	
	
	
	
	
	
	
}