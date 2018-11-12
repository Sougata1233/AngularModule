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
import {gridDaviationComponent} from "../../common/gridDaviation.component";
import {gridReceiveRejectComponent} from "../../common/gridReceiveRejectComponent";
import {claimforconditioncomponent} from "../../common/claimForCondition.Component";
import {legacyCodeItemNameComponent} from "../../common/legacy_item.component";


@Component({
  selector: 'app-mr-reading',
  templateUrl: './mrReading.component.html'
})
export class mrReadingComponent implements OnInit {
	
	
	public errorMsg : string = "";
	public successMsg : string = "";
	
	public sessionData: any;
	public MRDtls : any;
	public GRNDtllData : any = "";
	public procced : boolean = true;
	
	public grnReceiveModel: grnReceiveModel = new grnReceiveModel();
	
	public chalanDtls : any;
	public totJuteQuantity : number = 0;
	public addedItems : any = [];
	public createGrnResponsedata : any; 
	
	public gridOptions: GridOptions;
	public conditionClicked : any = "";
	public saveReadingResponseData : any;
	public myOptions:any = [];
	public myChalanOptions:any = [];
	public vendorAllData : any = [];
	public chalanAllData : any = [];
	public myPOOptions:any = [];
	public POAllData : any = [];
	
	public conditionReadingData : any = [
	{
		"chalanNo": null,
		"mrNo": null,
		"poNo": null,
		"poLineItemId": null,
		"advisedJuteType": null,
		"actualJuteType": null,
		"advisedQuality": null,
		"actualQuality": null,
		"advisedQuantity": null,
		"actualQuantity": null,
		"reading": null,
		"createUser": null,
		"createDate": null
	},
	{
		"chalanNo": null,
		"mrNo": null,
		"poNo": null,
		"poLineItemId": null,
		"advisedJuteType": null,
		"actualJuteType": null,
		"advisedQuality": null,
		"actualQuality": null,
		"advisedQuantity": null,
		"actualQuantity": null,
		"reading": null,
		"createUser": null,
		"createDate": null
	},
	{
		"chalanNo": null,
		"mrNo": null,
		"poNo": null,
		"poLineItemId": null,
		"advisedJuteType": null,
		"actualJuteType": null,
		"advisedQuality": null,
		"actualQuality": null,
		"advisedQuantity": null,
		"actualQuantity": null,
		"reading": null,
		"createUser": null,
		"createDate": null
	},
	{
		"chalanNo": null,
		"mrNo": null,
		"poNo": null,
		"poLineItemId": null,
		"advisedJuteType": null,
		"actualJuteType": null,
		"advisedQuality": null,
		"actualQuality": null,
		"advisedQuantity": null,
		"actualQuantity": null,
		"reading": null,
		"createUser": null,
		"createDate": null
	},
	{
		"chalanNo": null,
		"mrNo": null,
		"poNo": null,
		"poLineItemId": null,
		"advisedJuteType": null,
		"actualJuteType": null,
		"advisedQuality": null,
		"actualQuality": null,
		"advisedQuantity": null,
		"actualQuantity": null,
		"reading": null,
		"createUser": null,
		"createDate": null
	},
	{
		"chalanNo": null,
		"mrNo": null,
		"poNo": null,
		"poLineItemId": null,
		"advisedJuteType": null,
		"actualJuteType": null,
		"advisedQuality": null,
		"actualQuality": null,
		"advisedQuantity": null,
		"actualQuantity": null,
		"reading": null,
		"createUser": null,
		"createDate": null
	},
	{
		"chalanNo": null,
		"mrNo": null,
		"poNo": null,
		"poLineItemId": null,
		"advisedJuteType": null,
		"actualJuteType": null,
		"advisedQuality": null,
		"actualQuality": null,
		"advisedQuantity": null,
		"actualQuantity": null,
		"reading": null,
		"createUser": null,
		"createDate": null
	},
	{
		"chalanNo": null,
		"mrNo": null,
		"poNo": null,
		"poLineItemId": null,
		"advisedJuteType": null,
		"actualJuteType": null,
		"advisedQuality": null,
		"actualQuality": null,
		"advisedQuantity": null,
		"actualQuantity": null,
		"reading": null,
		"createUser": null,
		"createDate": null
	},
	{
		"chalanNo": null,
		"mrNo": null,
		"poNo": null,
		"poLineItemId": null,
		"advisedJuteType": null,
		"actualJuteType": null,
		"advisedQuality": null,
		"actualQuality": null,
		"advisedQuantity": null,
		"actualQuantity": null,
		"reading": null,
		"createUser": null,
		"createDate": null
	},
	{
		"chalanNo": null,
		"mrNo": null,
		"poNo": null,
		"poLineItemId": null,
		"advisedJuteType": null,
		"actualJuteType": null,
		"advisedQuality": null,
		"actualQuality": null,
		"advisedQuantity": null,
		"actualQuantity": null,
		"reading": null,
		"createUser": null,
		"createDate": null
	}
	];
	
	//public conditionReadingData : any = [];
	
	
	
	public columnDef : any = [
		{headerName: "Item Descrption", field: "item.name", suppressMenu: true, width : 350, cellRendererFramework: legacyCodeItemNameComponent},
		{headerName: "Marka", field: "marka", suppressMenu: true, width : 250, editable : true, cellEditor : 'text'},
		{headerName: "Quality", field: "actualQuality.name", suppressMenu: true, width : 250},
		//{headerName: "Actual Quality", field: "actualQuality.name", suppressMenu: true, minWidth : 350, editable : true, cellEditor : 'text'},
		//{headerName: "Advised Weight", field: "advisedWeight", suppressMenu: true, minWidth : 350},
		//{headerName: "Actual Weight", field: "actualWeight", suppressMenu: true, minWidth : 350, cellEditorFramework: numericRequiredEditorComponent, editable : true},
		{headerName: "Allowable Moisture (%)", field: "allowableMoisturePercentage", suppressMenu: true, width : 250},
		{headerName: "Claims for Condition(%)", field: "claimsCondition", suppressMenu: true, width : 350, cellRendererFramework : claimforconditioncomponent, valueFormatter: function (params) {
			return parseFloat(parseFloat(params.value).toFixed(2));
		}},
		{headerName: "Receive/Reject", field: "status", suppressMenu: true, minWidth : 350, cellRendererFramework : gridReceiveRejectComponent} 
];
	
	
	public onQuickFilterChanged($event) {
        this.gridOptions.api.setQuickFilter($event.target.value);
    }
	
	
	
	
	public grnPostData : any = {
	"materialGoodReceiveHeader": {
		"id" : null,
		"goodReceiptDate": null,
		"supplierId": "",
		"poId": "",
		"poDate": null,
		"contractNo": "",
		"contractDate": null,
		"chalanNo": null,
		"chalanDate": null,
		"warehouseNo": "",
		"exSTN": null,
		"status": "1",
		"submitter": "sss",
		"createDate": null
	},
	"materialGrnItemList": []
};
	
	
	
	
	public myDatePickerOptions: IMyDpOptions = {
        // other options...
        dateFormat: 'yyyy-mm-dd',
		disableSince : { year: new Date().getFullYear(), month: new Date().getMonth()+1, day: new Date().getDate()+1 }
    };
	
	
	constructor(public http: HttpTestService, public router: Router, public session: sessionServices) { 
		var self = this;
		this.gridOptions = <GridOptions>{};
		 this.gridOptions.columnDefs = this.columnDef;
		 this.gridOptions.paginationPageSize = 5;
		 this.gridOptions.domLayout = 'autoHeight';
		 this.gridOptions.pagination = true;
		 this.gridOptions.enableFilter = true;
		 this.gridOptions.enableSorting = true;
		 this.gridOptions.enableColResize = false;
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
			 if(clickedItem == "addcondition"){self.openClaimCondition(params);}
		 };
		  this.gridOptions.onCellEditingStopped = function(params) {
			 if(self.addedItems != 'undefined'){
				// console.log(params.node.id);
				self.addedItems[params.node.id].deviation = self.addedItems[params.node.id].advisedWeight - self.addedItems[params.node.id].actualWeight;
				params.api.setRowData(self.addedItems);
			}
			 };
	}
		
	ngOnInit() {
		this.getSession();
		this.loadVendorDetrails();
	}
	
	//get session details
	getSession = function(){
		this.sessionData = this.session.getSessionDetails();
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
					if(self.vendorAllData[i].type == 'J'){
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
		var self = this;
		self.errorMsg = "";
		self.successMsg = "";
		self.chalanAllData = [];
		self.myChalanOptions= [];
		self.POAllData =[];
		self.myPOOptions = [];
		this.chalanDtls = "";
		self.addedItems = [];
		var selectedVal = e.value;
		this.http.getMrChalanBySupplier(selectedVal)
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
			}
		);
	}
	
	fetchPOOptions = function(e){
		
		var self = this;
		self.errorMsg = "";
		self.successMsg = "";
		var emteredChalan = e.value;
		self.addedItems = [];
		self.POAllData =[];
		self.myPOOptions = [];
		self.chalanDtls = "";
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
			}
			);
	}
	
	fetchChalanDetails = function(e){
		
		var self = this;
		self.errorMsg = "";
		self.successMsg = "";
		var enteredpo = e.value;
		self.addedItems = [];
		
		if(enteredpo != ""){
			self.http.getChallanDtlsMr(self.grnReceiveModel.chalanNo+"^"+self.grnReceiveModel.supplierId+"^"+enteredpo)
			.subscribe(
				(data) => {
					this.chalanDtls = data;
				},
				(error) => {
					this.errorMsg = error,
					this.chalanDtls = "",
					this.MRDtls = ""
				},
				() => {
					this.getMRdetailsfrmChalan(self.grnReceiveModel.chalanNo,self.grnReceiveModel.supplierId,enteredpo)
					}
			);
		}else{
			this.chalanDtls = "";
			this.MRDtls = "";
		}
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
				() => {
					self.loadGRNdetails();
					}
			);
	}
	
	
		loadGRNdetails = function(){
		var self = this;
		self.errorMsg = "";
		self.successMsg = "";
		self.http.getMrbyId(self.MRDtls[0].mrNo)
			.subscribe(
				(data) => {
					this.GRNDtllData = data;
					if(data.materialGoodReceiveHeader.status != "16"){
					self.successMsg = "An MR already created against selected chalan, Supplier and PO combination.";
					self.procced = false;
					}
					self.addedItems = data.materialGrnItemList;
				},
				(error) => {
					//this.errorMsg = error,
					this.GRNDtllData = "";
					self.procced = true;
					this.createAddedItemList();
					
				},
				() => {
				}
			);
}
	
	
	
	createAddedItemList = function(){
		var self = this;
		self.totJuteQuantity = 0;
		for(var i=0; i < self.chalanDtls.poItemList.length; i++){
			if(self.chalanDtls.poItemList[i].poActualQuantity > 0){
		 var createdObj:any = {
					"advisedItem"       : self.chalanDtls.poItemList[i].item,
					"item"				: self.chalanDtls.poItemList[i].item,
					"quantityUnit"		: self.chalanDtls.poItemList[i].quantityUnit,
					"quantity"			: self.chalanDtls.poItemList[i].poActualQuantity,
					"marka"				: self.chalanDtls.poItemList[i].marka,
					"advisedQuality"	: self.chalanDtls.poItemList[i].quality,
					"actualQuality"		: self.chalanDtls.poItemList[i].quality,
					"advisedWeight"		: self.chalanDtls.poItemList[i].poActualQuantity,
					"actualWeight"		: self.chalanDtls.poItemList[i].poActualQuantity,
					"deviation"			: 0,
					"rate"				: self.chalanDtls.poItemList[i].rate,
					"claimsQuality"		: "",
					"claimsCondition"	: "",
					"status"			: "16",
					"warehouseNo"		: "",
					"remarks"			: "",
					"totalPrice"		: self.chalanDtls.poItemList[i].valueWithoutTax,
					"debitNotesFlag"	: "N",
					"approverFirst"		: null,
					"approverSecond"	: null,
					"approveFirstDate"	: null,
					"approveSecondDate"	: null,
					"allowableMoisturePercentage" : self.chalanDtls.poItemList[i].allowableMoisturePercentage,
					"unitConversionType" : self.chalanDtls.poItemList[i].unitConversionType,
					"conversionQuantity" : self.chalanDtls.poItemList[i].conversionQuantity,
					"conversionActualQuantity" : self.chalanDtls.poItemList[i].conversionQuantity
					
				};
				self.addedItems.push(createdObj);
				self.totJuteQuantity = self.totJuteQuantity + parseInt(self.chalanDtls.poItemList[i].poActualQuantity);
			}
		}
	}
	
	changeMRItmStat = function(params){
		var self = this;
		var selected = params.event.target.checked;
		if(selected){
			self.addedItems[params.node.id].status = "16";
		}else{
			self.addedItems[params.node.id].status = "4";
		}
		
		this.gridOptions.api.setRowData(self.addedItems);
	}
	
	openClaimCondition = function(params){
		var self = this;
		self.conditionClicked = params.node.id;
		
		
		self.http.getReading(self.chalanDtls.poHeader.id+"^"+self.chalanDtls.poItemList[self.conditionClicked].poItemId)
			.subscribe(
				(data) => {
					if(data.length>0){
						self.conditionReadingData = data;
					}else{
						self.conditionReadingData = [
										{
											"chalanNo": null,
											"mrNo": null,
											"poNo": null,
											"poLineItemId": null,
											"advisedJuteType": null,
											"actualJuteType": null,
											"advisedQuality": null,
											"actualQuality": null,
											"advisedQuantity": null,
											"actualQuantity": null,
											"reading": null,
											"createUser": null,
											"createDate": null
										},
										{
											"chalanNo": null,
											"mrNo": null,
											"poNo": null,
											"poLineItemId": null,
											"advisedJuteType": null,
											"actualJuteType": null,
											"advisedQuality": null,
											"actualQuality": null,
											"advisedQuantity": null,
											"actualQuantity": null,
											"reading": null,
											"createUser": null,
											"createDate": null
										},
										{
											"chalanNo": null,
											"mrNo": null,
											"poNo": null,
											"poLineItemId": null,
											"advisedJuteType": null,
											"actualJuteType": null,
											"advisedQuality": null,
											"actualQuality": null,
											"advisedQuantity": null,
											"actualQuantity": null,
											"reading": null,
											"createUser": null,
											"createDate": null
										},
										{
											"chalanNo": null,
											"mrNo": null,
											"poNo": null,
											"poLineItemId": null,
											"advisedJuteType": null,
											"actualJuteType": null,
											"advisedQuality": null,
											"actualQuality": null,
											"advisedQuantity": null,
											"actualQuantity": null,
											"reading": null,
											"createUser": null,
											"createDate": null
										},
										{
											"chalanNo": null,
											"mrNo": null,
											"poNo": null,
											"poLineItemId": null,
											"advisedJuteType": null,
											"actualJuteType": null,
											"advisedQuality": null,
											"actualQuality": null,
											"advisedQuantity": null,
											"actualQuantity": null,
											"reading": null,
											"createUser": null,
											"createDate": null
										},
										{
											"chalanNo": null,
											"mrNo": null,
											"poNo": null,
											"poLineItemId": null,
											"advisedJuteType": null,
											"actualJuteType": null,
											"advisedQuality": null,
											"actualQuality": null,
											"advisedQuantity": null,
											"actualQuantity": null,
											"reading": null,
											"createUser": null,
											"createDate": null
										},
										{
											"chalanNo": null,
											"mrNo": null,
											"poNo": null,
											"poLineItemId": null,
											"advisedJuteType": null,
											"actualJuteType": null,
											"advisedQuality": null,
											"actualQuality": null,
											"advisedQuantity": null,
											"actualQuantity": null,
											"reading": null,
											"createUser": null,
											"createDate": null
										},
										{
											"chalanNo": null,
											"mrNo": null,
											"poNo": null,
											"poLineItemId": null,
											"advisedJuteType": null,
											"actualJuteType": null,
											"advisedQuality": null,
											"actualQuality": null,
											"advisedQuantity": null,
											"actualQuantity": null,
											"reading": null,
											"createUser": null,
											"createDate": null
										},
										{
											"chalanNo": null,
											"mrNo": null,
											"poNo": null,
											"poLineItemId": null,
											"advisedJuteType": null,
											"actualJuteType": null,
											"advisedQuality": null,
											"actualQuality": null,
											"advisedQuantity": null,
											"actualQuantity": null,
											"reading": null,
											"createUser": null,
											"createDate": null
										},
										{
											"chalanNo": null,
											"mrNo": null,
											"poNo": null,
											"poLineItemId": null,
											"advisedJuteType": null,
											"actualJuteType": null,
											"advisedQuality": null,
											"actualQuality": null,
											"advisedQuantity": null,
											"actualQuantity": null,
											"reading": null,
											"createUser": null,
											"createDate": null
										}
							];
					}
				},
				(error) => {
					this.errorMsg = error;
				},
				() => {
					if(self.conditionReadingData[0].chalanNo == null){
					for(var i = 0; i<self.conditionReadingData.length; i++){
						self.conditionReadingData[i].chalanNo = self.chalanDtls.chalanNo;
						self.conditionReadingData[i].mrNo = self.MRDtls[0].mrNo;;
						self.conditionReadingData[i].poNo = self.chalanDtls.poHeader.id;
						self.conditionReadingData[i].poLineItemId = self.chalanDtls.poItemList[self.conditionClicked].poItemId;
						self.conditionReadingData[i].advisedJuteType = self.chalanDtls.poItemList[self.conditionClicked].item.name;
						self.conditionReadingData[i].actualJuteType = self.chalanDtls.poItemList[self.conditionClicked].item.name;
						self.conditionReadingData[i].advisedQuality = self.chalanDtls.poItemList[self.conditionClicked].quality.id;
						self.conditionReadingData[i].actualQuality = self.chalanDtls.poItemList[self.conditionClicked].quality.id;
						self.conditionReadingData[i].advisedQuantity = self.chalanDtls.poItemList[self.conditionClicked].poQuantity;
						self.conditionReadingData[i].actualQuantity = self.chalanDtls.poItemList[self.conditionClicked].poActualQuantity;
						self.conditionReadingData[i].createUser = self.sessionData.sessionUserName;
						self.conditionReadingData[i].createDate = new Date(self.grnReceiveModel.mrdate.date.year, self.grnReceiveModel.mrdate.date.month-1, self.grnReceiveModel.mrdate.date.day).getTime();
					}
					}
					}
			);
		
	}
	
	closeConditionDialog = function(){
		var self = this;
		self.conditionReadingData = [
	{
		"chalanNo": null,
		"mrNo": null,
		"poNo": null,
		"poLineItemId": null,
		"advisedJuteType": null,
		"actualJuteType": null,
		"advisedQuality": null,
		"actualQuality": null,
		"advisedQuantity": null,
		"actualQuantity": null,
		"reading": null,
		"createUser": null,
		"createDate": null
	},
	{
		"chalanNo": null,
		"mrNo": null,
		"poNo": null,
		"poLineItemId": null,
		"advisedJuteType": null,
		"actualJuteType": null,
		"advisedQuality": null,
		"actualQuality": null,
		"advisedQuantity": null,
		"actualQuantity": null,
		"reading": null,
		"createUser": null,
		"createDate": null
	},
	{
		"chalanNo": null,
		"mrNo": null,
		"poNo": null,
		"poLineItemId": null,
		"advisedJuteType": null,
		"actualJuteType": null,
		"advisedQuality": null,
		"actualQuality": null,
		"advisedQuantity": null,
		"actualQuantity": null,
		"reading": null,
		"createUser": null,
		"createDate": null
	},
	{
		"chalanNo": null,
		"mrNo": null,
		"poNo": null,
		"poLineItemId": null,
		"advisedJuteType": null,
		"actualJuteType": null,
		"advisedQuality": null,
		"actualQuality": null,
		"advisedQuantity": null,
		"actualQuantity": null,
		"reading": null,
		"createUser": null,
		"createDate": null
	},
	{
		"chalanNo": null,
		"mrNo": null,
		"poNo": null,
		"poLineItemId": null,
		"advisedJuteType": null,
		"actualJuteType": null,
		"advisedQuality": null,
		"actualQuality": null,
		"advisedQuantity": null,
		"actualQuantity": null,
		"reading": null,
		"createUser": null,
		"createDate": null
	},
	{
		"chalanNo": null,
		"mrNo": null,
		"poNo": null,
		"poLineItemId": null,
		"advisedJuteType": null,
		"actualJuteType": null,
		"advisedQuality": null,
		"actualQuality": null,
		"advisedQuantity": null,
		"actualQuantity": null,
		"reading": null,
		"createUser": null,
		"createDate": null
	},
	{
		"chalanNo": null,
		"mrNo": null,
		"poNo": null,
		"poLineItemId": null,
		"advisedJuteType": null,
		"actualJuteType": null,
		"advisedQuality": null,
		"actualQuality": null,
		"advisedQuantity": null,
		"actualQuantity": null,
		"reading": null,
		"createUser": null,
		"createDate": null
	},
	{
		"chalanNo": null,
		"mrNo": null,
		"poNo": null,
		"poLineItemId": null,
		"advisedJuteType": null,
		"actualJuteType": null,
		"advisedQuality": null,
		"actualQuality": null,
		"advisedQuantity": null,
		"actualQuantity": null,
		"reading": null,
		"createUser": null,
		"createDate": null
	},
	{
		"chalanNo": null,
		"mrNo": null,
		"poNo": null,
		"poLineItemId": null,
		"advisedJuteType": null,
		"actualJuteType": null,
		"advisedQuality": null,
		"actualQuality": null,
		"advisedQuantity": null,
		"actualQuantity": null,
		"reading": null,
		"createUser": null,
		"createDate": null
	},
	{
		"chalanNo": null,
		"mrNo": null,
		"poNo": null,
		"poLineItemId": null,
		"advisedJuteType": null,
		"actualJuteType": null,
		"advisedQuality": null,
		"actualQuality": null,
		"advisedQuantity": null,
		"actualQuantity": null,
		"reading": null,
		"createUser": null,
		"createDate": null
	}
	];
		self.conditionClicked = "";
	}
	
	updateCondition = function(){
		var self = this;
		var sumVal = 0;
		for(var i=0; i<self.conditionReadingData.length; i++){
			sumVal = sumVal + parseFloat(self.conditionReadingData[i].reading);
		}
		
		
		this.http.createReading(self.conditionReadingData)
			.subscribe(
			(data) => {
				self.saveReadingResponseData = data;
			},
			(error) => self.errorMsg = error,
			() => {
				var avrg = sumVal/self.conditionReadingData.length;
				self.addedItems[self.conditionClicked].claimsCondition = avrg;
				self.conditionClicked = "";
				this.gridOptions.api.setRowData(self.addedItems);
				}
		);
		
		
	}
	
	addRowCondition = function(){
		var self = this;
		var addedObject = {
		"chalanNo": self.chalanDtls.chalanNo,
		"mrNo": self.MRDtls[0].mrNo,
		"poNo": self.chalanDtls.poHeader.id,
		"poLineItemId": self.chalanDtls.poItemList[self.conditionClicked].poItemId,
		"advisedJuteType": self.chalanDtls.poItemList[self.conditionClicked].item.name,
		"actualJuteType": self.chalanDtls.poItemList[self.conditionClicked].item.name,
		"advisedQuality": self.chalanDtls.poItemList[self.conditionClicked].quality.id,
		"actualQuality": self.chalanDtls.poItemList[self.conditionClicked].quality.id,
		"advisedQuantity": self.chalanDtls.poItemList[self.conditionClicked].poQuantity,
		"actualQuantity": self.chalanDtls.poItemList[self.conditionClicked].poActualQuantity,
		"reading": null,
		"createUser": self.sessionData.sessionUserName,
		"createDate": new Date(self.grnReceiveModel.mrdate.date.year, self.grnReceiveModel.mrdate.date.month-1, self.grnReceiveModel.mrdate.date.day).getTime()
	};
		self.conditionReadingData.push(addedObject);
	}
	
	deleteRowCondition = function(index){
		var self = this;
		
		
		self.conditionReadingData.splice(index, 1);
	}
	
	updateDeviation = function(e, index){
		var self = this;
		var enteredVal = e.target.value.trim();
		if(enteredVal != ""){
			self.addedItems[index].deviation = (self.addedItems[index].advisedWeight - enteredVal);
		}
	}
	
	createMR = function(){
		var self = this;
		self.errorMsg = "";
		self.successMsg = "";
		self.grnPostData.materialGoodReceiveHeader.id = self.MRDtls[0].mrNo;
		self.grnPostData.materialGoodReceiveHeader.goodReceiptDate = new Date(self.grnReceiveModel.mrdate.date.year, self.grnReceiveModel.mrdate.date.month-1, self.grnReceiveModel.mrdate.date.day).getTime();
		self.grnPostData.materialGoodReceiveHeader.supplierId = self.chalanDtls.poHeader.supplierId;
		self.grnPostData.materialGoodReceiveHeader.poId = self.chalanDtls.poHeader.id;
		self.grnPostData.materialGoodReceiveHeader.poDate = self.chalanDtls.poHeader.createDate;
		self.grnPostData.materialGoodReceiveHeader.contractNo = self.grnReceiveModel.contractNo;
		self.grnPostData.materialGoodReceiveHeader.contractDate = new Date(self.grnReceiveModel.contractDate.date.year, self.grnReceiveModel.contractDate.date.month-1, self.grnReceiveModel.contractDate.date.day).getTime();;
		self.grnPostData.materialGoodReceiveHeader.chalanNo = self.grnReceiveModel.chalanNo;
		self.grnPostData.materialGoodReceiveHeader.chalanDate = self.chalanDtls.chalanDate;
		self.grnPostData.materialGoodReceiveHeader.exSTN = self.grnReceiveModel.exstn;
		self.grnPostData.materialGoodReceiveHeader.status = "16";
		self.grnPostData.materialGoodReceiveHeader.submitter = self.sessionData.sessionUserName;
		self.grnPostData.materialGoodReceiveHeader.createDate = new Date(self.grnReceiveModel.mrdate.date.year, self.grnReceiveModel.mrdate.date.month-1, self.grnReceiveModel.mrdate.date.day).getTime();
		// for(var i = 0; i<self.addedItems.length; i++){
				// var avrg = self.addedItems[i].claimsCondition;
				// var allowableMoisture = self.addedItems[i].allowableMoisturePercentage;
				// if(avrg > allowableMoisture){
				// self.addedItems[i].deviation = self.addedItems[i].deviation + (self.addedItems[i].actualWeight * (avrg-allowableMoisture)/100);
				// self.addedItems[i].actualWeight = self.addedItems[i].actualWeight - (self.addedItems[i].actualWeight * (avrg-allowableMoisture)/100);
				// }
		// }
		self.grnPostData.materialGrnItemList = self.addedItems;
		
		this.http.createMR(self.grnPostData)
			.subscribe(
			(data) => {
				self.createGrnResponsedata = data;
			},
			(error) => self.errorMsg = error,
			() => {
				
				self.successMsg = "MR reading saved successfully.",
				self.grnReceiveModel.mrdate = { date: { year: new Date().getFullYear(), month: new Date().getMonth()+1, day: new Date().getDate() } },
				self.chalanDtls = "",
				self.grnReceiveModel.chalanNo = "",
				self.grnReceiveModel.poId = "",
				self.grnReceiveModel.contractDate = { date: { year: new Date().getFullYear(), month: new Date().getMonth()+1, day: new Date().getDate() } },
				self.grnReceiveModel.exstn = "",
				self.addedItems = [],
				self.grnReceiveModel.supplierId = "",
				self.myChalanOptions.length = 0,
				self.POAllData.length = 0,
				self.myPOOptions.length = 0
			}
		);
	}
	
	refreshTotals = function(){
		 var self = this;
		 self.totJuteQuantity = 0;

		for(var i = 0; i < self.chalanDtls.poItemList.length; i++){
			
			self.totJuteQuantity = self.totJuteQuantity + parseInt(self.chalanDtls.poItemList[i].poQuantity);
		}
	}
}