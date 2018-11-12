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
import {gridActualQuantityTriggerComponent} from "../../common/gridActualQuantityTrigger.component";
import {gridActualItemTriggerComponent} from "../../common/gridActualItemTrigger.component";
import {gridWaEdirehousetTriggerComponent} from "../../common/gridWaEdirehousetTriggerComponent";
import { AppSettings } from '../../../config/settings/app-settings';


@Component({
  selector: 'app-good-receive',
  templateUrl: './grnmaterialReceive.component.html'
})
export class grnMaterialReceiveComponent implements OnInit {
	
	
	public errorMsg : string = "";
	public successMsg : string = "";
	public addItemMode : boolean = false;
	public sessionData: any;
	public AllJuteTypes: any = [];
	public MRDtls : any = "";
	public GRNDtllData : any = "";
	public procced : boolean = true;
	public actualQualityEdit : any = "";
	public actualItemEdit : any = "";
	public grnReceiveModel: grnReceiveModel = new grnReceiveModel();
	public AllQualityAddItem : any = [];
	public chalanDtls : any;
	public totJuteQuantity : number = 0;
	public addedItems : any = [];
	public createGrnResponsedata : any; 
	
	public gridOptions: GridOptions;
	public conditionClicked : any = "";
	
	public conditionReadingData : any = [];
	
	public myOptions:any = [];
	public myAgents:any = [];
	public myChalanOptions:any = [];
	public vendorAllData : any = [];
	public chalanAllData : any = [];
	public itemQuality : any = [];
	public jutetypes : any = [];
	public company : string = "";
	public myPOOptions:any = [];
	public POAllData : any = [];
	public warehouseedit : any = "";
	public allWarehouse : any = [];
	
	
	
	public columnDef : any = [
		{headerName: "Advised Jute Type", field: "advisedItem.name", suppressMenu: true, minWidth : 250, function (params) {
          return params.data.advisedItem.legacyItemCode+"_"+params.value;
        }},
		{headerName: "Actual Jute Type", field: "item.name", suppressMenu: true, minWidth : 250, cellRendererFramework : gridActualItemTriggerComponent},
		//{headerName: "Coverted Quantity", field: "advisedWeight", suppressMenu: true, minWidth : 150},
		{headerName: "Marka", field: "marka", suppressMenu: true, minWidth : 250, editable : true, cellEditor : 'text'},
		{headerName: "Advised Quality", field: "advisedQuality.name", suppressMenu: true, minWidth : 250},
		{headerName: "Actual Quality", field: "actualQuality.name", suppressMenu: true, minWidth : 350, cellRendererFramework : gridActualQuantityTriggerComponent},
		{headerName: "Advised Weight", field: "advisedWeight", suppressMenu: true, minWidth : 350, valueFormatter: function (params) {
          return parseFloat(parseFloat(params.value).toFixed(2));
        }},
		{headerName: "Actual Weight", field: "actualWeight", suppressMenu: true, minWidth : 350, cellEditorFramework: numericRequiredEditorComponent, editable : true, valueFormatter: function (params) {
          var avrg = params.data.claimsCondition;
		  var allowableMoisture = params.data.allowableMoisturePercentage;
		  if(avrg > allowableMoisture){
			var result = params.value - (params.value * (avrg-allowableMoisture)/100);
		  }else{
			var result = parseFloat(parseFloat(params.value).toFixed(2));
		  }
		  return (result).toFixed(2);
        }},
		{headerName: "Deviation", field: "", suppressMenu: true, minWidth : 350, cellRendererFramework : gridDaviationComponent, valueFormatter: function (params) {
          return parseFloat(parseFloat(params.value).toFixed(2));
        }},
		{headerName: "Conversion Type", field: "unitConversionType", suppressMenu: true, minWidth : 150},
		{headerName: "Advised Conversion Quantity", field: "conversionQuantity", suppressMenu: true, minWidth : 350, valueFormatter: function (params) {
          return parseFloat(parseFloat(params.value).toFixed(2));
        }},
		{headerName: "Actual Conversion Quantity", field: "actualWeight", suppressMenu: true, minWidth : 350, valueFormatter: function (params) {
          var avrg = params.data.claimsCondition;
		  var allowableMoisture = params.data.allowableMoisturePercentage;
		  if(avrg > allowableMoisture){
			var result = (params.data.unitConversionType == 'LOOSE')?(params.value - (params.value * (avrg-allowableMoisture)/100)).toFixed(2):(params.data.conversionActualQuantity);
		  }else{
			var result = (params.data.unitConversionType == 'LOOSE')?parseFloat(params.value).toFixed(2):(params.data.conversionActualQuantity);
		  }
		  return result;
        }},
		{headerName: "Allowable Moisture (%)", field: "allowableMoisturePercentage", suppressMenu: true, minWidth : 250, valueFormatter: function (params) {
          return parseFloat(parseFloat(params.value).toFixed(2));
        }},
		{headerName: "Rate", field: "rate", suppressMenu: true, minWidth : 350, cellEditorFramework: numericRequiredEditorComponent, editable : true, valueFormatter: function (params) {
          return (params.value - params.data.claimsQuality).toFixed(2);
        }},
		{headerName: "Claims for Quality", field: "claimsQuality", suppressMenu: true, minWidth : 350, editable : true, cellEditorFramework: numericRequiredEditorComponent, valueFormatter: function (params) {
          if(params.value == ''){ parseFloat(parseFloat(params.value).toFixed(2));}
        }},
		{headerName: "Claims for Condition(%)", field: "claimsCondition", suppressMenu: true, minWidth : 350, cellRendererFramework : claimforconditioncomponent, valueFormatter: function (params) {
           if(params.value == ''){ parseFloat(parseFloat(params.value).toFixed(2));}
        }},
		{headerName: "Warehouse No.", field: "warehouseNo", suppressMenu: true, minWidth : 350, cellRendererFramework: gridWaEdirehousetTriggerComponent},
		{headerName: "Remarks", field: "remarks", suppressMenu: true, minWidth : 350, editable : true, cellEditor : 'largeText'},
		{headerName: "Receive/Reject", field: "status", suppressMenu: true, minWidth : 350, cellRendererFramework : gridReceiveRejectComponent} 
	];
	
	
	public onQuickFilterChanged($event) {
        this.gridOptions.api.setQuickFilter($event.target.value);
    }
	
	
	
	
	public grnPostData : any = {
	"materialGoodReceiveHeader": {
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
		this.company = AppSettings.COMPANY_NAME;
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
			 if(clickedItem == "addcondition"){self.openClaimCondition(params);}
			if(clickedItem == "actualqualitytrigger"){self.openQualityEdit(params);}
			if(clickedItem == "actualitemtrigger"){self.openItemEdit(params);}
			if(clickedItem == "warehouseEditTrigger"){self.openWarehouseEdit(params);}
		 };
		  this.gridOptions.onCellEditingStopped = function(params) {
			 if(self.addedItems != 'undefined'){
				// console.log(params.node.id);
				self.addedItems[params.node.id].deviation = self.addedItems[params.node.id].advisedWeight - self.addedItems[params.node.id].actualWeight;
				if(self.addedItems[params.node.id].claimsQuality != ''){
					if(parseFloat(self.addedItems[params.node.id].claimsQuality) > parseFloat(self.addedItems[params.node.id].rate)){
						self.addedItems[params.node.id].claimsQuality = self.addedItems[params.node.id].rate;
					}
					//self.addedItems[params.node.id].rate = self.addedItems[params.node.id].rate - self.addedItems[params.node.id].claimsQuality;
				}
				
				
				if(params.colDef.field == 'conversionActualQuantity'){
					if(parseFloat(self.addedItems[params.node.id].conversionActualQuantity) < 0){
						self.addedItems[params.node.id].conversionActualQuantity = 0;
					}
					
					if(parseFloat(self.addedItems[params.node.id].conversionActualQuantity) > parseFloat(self.addedItems[params.node.id].conversionQuantity)){
						self.addedItems[params.node.id].conversionActualQuantity = parseFloat(self.addedItems[params.node.id].conversionQuantity);
					}
					
				}
				params.api.setRowData(self.addedItems);
			}
			 };
	}
		
	ngOnInit() {
		this.getSession();
		this.loadVendorDetrails();
		this.getAllJuteTypes();
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
					}else if(self.vendorAllData[i].type == 'O'){
						var createObjagent = {
							value : self.vendorAllData[i].id+"^$$^"+self.vendorAllData[i].name,
							label : self.vendorAllData[i].name+"("+self.vendorAllData[i].id+")"
						};
						self.myAgents.push(createObjagent);
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
		self.errorMsg = "";
		self.successMsg = "";
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
					}else{
						self.procced = true;
						self.addedItems = data.materialGrnItemList;
						for(var i = 0; i<self.addedItems.length; i++){
							if(self.addedItems[i].status == "16"){
								self.addedItems[i].status = "1";
							}
						}
					}
					
				},
				(error) => {
					//this.errorMsg = error,
					this.GRNDtllData = "";
					self.procced = false;
					self.successMsg = "No reading is saved against this chalan.";
					//this.createAddedItemList();
					
				},
				() => {
				}
			);
}
	
	

	
	createAddedItemList = function(){
		var self = this;
		self.errorMsg = "";
		self.successMsg = "";
		self.totJuteQuantity = 0;
		for(var i=0; i < self.chalanDtls.poItemList.length; i++){
		 var createdObj:any = {
					"item"				: self.chalanDtls.poItemList[i].item,
					"quantityUnit"		: self.chalanDtls.poItemList[i].quantityUnit,
					"quantity"			: parseFloat(self.chalanDtls.poItemList[i].poActualQuantity).toFixed(2),
					"marka"				: self.chalanDtls.poItemList[i].marka,
					"advisedQuality"	: self.chalanDtls.poItemList[i].quality,
					"actualQuality"		: self.chalanDtls.poItemList[i].quality,
					"advisedWeight"		: parseFloat(self.chalanDtls.poItemList[i].poActualQuantity).toFixed(2),
					"actualWeight"		: parseFloat(self.chalanDtls.poItemList[i].poActualQuantity).toFixed(2),
					"deviation"			: 0,
					"rate"				: parseFloat(self.chalanDtls.poItemList[i].rate).toFixed(2),
					"claimsQuality"		: 0,
					"claimsCondition"	: "",
					"status"			: "1",
					"warehouseNo"		: "",
					"remarks"			: "",
					"totalPrice"		: parseFloat(self.chalanDtls.poItemList[i].valueWithoutTax).toFixed(2),
					"debitNotesFlag"	: "N",
					"approverFirst"		: null,
					"approverSecond"	: null,
					"approveFirstDate"	: null,
					"approveSecondDate"	: null,
					"allowableMoisturePercentage" : parseFloat(self.chalanDtls.poItemList[i].allowableMoisturePercentage).toFixed(2),
					"unitConversionType" : self.chalanDtls.poItemList[i].unitConversionType,
					"conversionQuantity" : self.chalanDtls.poItemList[i].conversionQuantity,
					"conversionActualQuantity " : self.chalanDtls.poItemList[i].conversionQuantity
					
				};
				self.addedItems.push(createdObj);
				self.totJuteQuantity = self.totJuteQuantity + parseInt(self.chalanDtls.poItemList[i].poActualQuantity);
		}
	}
	
	addNewItem = function(){
		var self = this;
		self.errorMsg = "";
		self.successMsg = "";
		var weight : any = (self.grnReceiveModel.conversiontype == 'LOOSE')?self.grnReceiveModel.receivedQuantity:self.grnReceiveModel.receivedQuantity*1.5;
		var totPrice:any = self.grnReceiveModel.receivedRate*weight;
		var actualWeight = (self.grnReceiveModel.cfcon>18)?(weight-(weight*(self.grnReceiveModel.cfcon-18)/100)):weight;
		 var addedItemObj:any = {
					"item"				: self.AllJuteTypes[self.grnReceiveModel.selectedAddItem],
					"advisedItem"		: self.AllJuteTypes[self.grnReceiveModel.selectedAddItem],
					"quantityUnit"		: self.AllJuteTypes[self.grnReceiveModel.selectedAddItem].quantityUnit,
					"quantity"			: parseFloat(self.grnReceiveModel.receivedQuantity).toFixed(2),
					"marka"				: null,
					"advisedQuality"	: self.AllQualityAddItem[self.grnReceiveModel.selectedAddQuality],
					"actualQuality"		: self.AllQualityAddItem[self.grnReceiveModel.selectedAddQuality],
					"advisedWeight"		: parseFloat(weight).toFixed(2),					
					"actualWeight"		: parseFloat(weight).toFixed(2),
					"deviation"			: 0,
					"rate"				: parseFloat(self.grnReceiveModel.receivedRate).toFixed(2),
					"claimsQuality"		: 0,
					"claimsCondition"	: self.grnReceiveModel.cfcon,
					"status"			: "1",
					"warehouseNo"		: "",
					"remarks"			: "",
					"totalPrice"		: parseFloat(totPrice).toFixed(2),
					"debitNotesFlag"	: "N",
					"approverFirst"		: null,
					"approverSecond"	: null,
					"approveFirstDate"	: null,
					"approveSecondDate"	: null,
					"allowableMoisturePercentage" : 18,
					"unitConversionType" : self.grnReceiveModel.conversiontype,
					"conversionQuantity" : self.grnReceiveModel.receivedQuantity,
					"conversionActualQuantity" : self.grnReceiveModel.receivedQuantity
					
				};
				self.addItemMode = false;
				self.addedItems.push(addedItemObj);
				self.gridOptions.api.setRowData(self.addedItems);
				self.grnReceiveModel.selectedAddQuality = "";
				self.grnReceiveModel.selectedAddItem = "";
				self.grnReceiveModel.conversiontype = "LOOSE";
				self.grnReceiveModel.receivedQuantity = "";
		
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
	
	
	openItemEdit = function(params){
		var self = this;
		self.actualItemEdit  = params.node.id;
		self.http.getItemDescByGrpId(999)
			.subscribe(
			(data) => {
				self.jutetypes = data.items;
			},
			(error) => self.errorMsg = error,
			() => {
				for(var i = 0; i<self.jutetypes.length; i++){
					if(self.jutetypes[i].id == params.data.item.id){
						self.grnReceiveModel.selectedactualitem = i;
					}
				}
			}
		);
	}
	
	getAllJuteTypes = function(){
		var self = this;
		self.http.getItemDescByGrpId(999)
			.subscribe(
			(data) => {
				self.AllJuteTypes = data.items;
			},
			(error) => self.errorMsg = error,
			() => {}
		);
	}

	openQualityEdit = function(params){
		var self = this;
		self.itemQuality.length = 0;
		self.actualQualityEdit  = params.node.id;
		self.http.getAllQuality(params.data.item.id)
			.subscribe(
			(data) => {
				self.itemQuality = data;
			},
			(error) => self.errorMsg = error,
			() => {
				for(var i = 0; i<self.itemQuality.length; i++){
					if(self.itemQuality[i].id == params.data.actualQuality.id){
						self.grnReceiveModel.selectedQuality = i;
					}
				}
			}
		);
	}
	
	
	getQuality = function(e){
		var self = this;
		self.AllQualityAddItem.length = 0;
		self.grnReceiveModel.selectedAddQuality = "";
		self.http.getAllQuality(self.AllJuteTypes[e.target.value].id)
			.subscribe(
			(data) => {
				self.AllQualityAddItem = data;
			},
			(error) => self.errorMsg = error,
			() => {}
		);
	}


	updateActualQuantity = function(){
		var self = this;
		self.addedItems[self.actualQualityEdit].actualQuality = self.itemQuality[self.grnReceiveModel.selectedQuality];
		self.closeQuzlityDialog();
	}
	
	updateActualItem = function(){
		var self = this;
		self.addedItems[self.actualItemEdit].item = self.jutetypes[self.grnReceiveModel.selectedactualitem];
		self.addedItems[self.actualItemEdit].actualQuality = null;
		self.closeItemDialog();
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
						self.conditionReadingData = [];
					}
				},
				(error) => {
					this.errorMsg = error;
					self.conditionReadingData = [];
				},
				() => {
					}
			);
	}
	
	closeConditionDialog = function(){
		var self = this;
		self.conditionClicked = "";
	}

	closeQuzlityDialog = function(){
		var self = this;
		self.actualQualityEdit = "";
		self.gridOptions.api.setRowData(self.addedItems);
	}
	
	closeItemDialog = function(){
		var self = this;
		self.actualItemEdit = "";
		self.gridOptions.api.setRowData(self.addedItems);
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
		
		self.GRNDtllData.materialGoodReceiveHeader.goodReceiptDate = new Date(self.grnReceiveModel.mrdate.date.year, self.grnReceiveModel.mrdate.date.month-1, self.grnReceiveModel.mrdate.date.day).getTime();
		self.GRNDtllData.materialGoodReceiveHeader.contractNo = self.grnReceiveModel.contractNo;
		self.GRNDtllData.materialGoodReceiveHeader.contractDate = new Date(self.grnReceiveModel.contractDate.date.year, self.grnReceiveModel.contractDate.date.month-1, self.grnReceiveModel.contractDate.date.day).getTime();;
		self.GRNDtllData.materialGoodReceiveHeader.exSTN = self.MRDtls[0].mukam;
		self.GRNDtllData.materialGoodReceiveHeader.vehicleNo = self.MRDtls[0].vehicleNo;
		self.GRNDtllData.materialGoodReceiveHeader.status = "1";
		self.GRNDtllData.materialGoodReceiveHeader.submitter = self.sessionData.sessionUserName;
		self.GRNDtllData.materialGoodReceiveHeader.createDate = new Date(self.grnReceiveModel.mrdate.date.year, self.grnReceiveModel.mrdate.date.month-1, self.grnReceiveModel.mrdate.date.day).getTime();
		self.GRNDtllData.materialGoodReceiveHeader.agentId = (self.grnReceiveModel.agentId == "")?null:(self.grnReceiveModel.agentId).split("^$$^")[0];
		self.GRNDtllData.materialGoodReceiveHeader.agentName = (self.grnReceiveModel.agentId == "")?self.company:(self.grnReceiveModel.agentId).split("^$$^")[1];
		for(var i = 0; i<self.addedItems.length; i++){
				var avrg = self.addedItems[i].claimsCondition;
				var allowableMoisture = self.addedItems[i].allowableMoisturePercentage;
				if(avrg > allowableMoisture){
					self.addedItems[i].actualWeight = (self.addedItems[i].actualWeight - (self.addedItems[i].actualWeight * (avrg-allowableMoisture)/100)).toFixed(2);
					self.addedItems[i].deviation = (self.addedItems[i].advisedWeight - self.addedItems[i].actualWeight).toFixed(2);
					self.addedItems[i].conversionActualQuantity = (self.addedItems[i].unitConversionType=='LOOSE')?self.addedItems[i].actualWeight:self.addedItems[i].conversionActualQuantity;
				}
				self.addedItems[i].totalPrice = (self.addedItems[i].rate - self.addedItems[i].claimsQuality)*self.addedItems[i].actualWeight;
		}
		self.GRNDtllData.materialGrnItemList = self.addedItems;
		
		
		this.http.updateMR(self.GRNDtllData)
			.subscribe(
			(data) => {
				self.createGrnResponsedata = data;
			},
			(error) => self.errorMsg = error,
			() => {
				
				self.successMsg = "MR created successfully.",
				self.grnReceiveModel.mrdate = { date: { year: new Date().getFullYear(), month: new Date().getMonth()+1, day: new Date().getDate() } },
				self.chalanDtls = "",
				self.grnReceiveModel.chalanNo = "",
				self.grnReceiveModel.contractNo = "",
				self.grnReceiveModel.poId = "",
				self.grnReceiveModel.contractDate = { date: { year: new Date().getFullYear(), month: new Date().getMonth()+1, day: new Date().getDate() } },
				self.grnReceiveModel.exstn = "",
				self.addedItems = [],
				self.GRNDtllData = "",
				self.MRDtls = "",
				self.proceed = true,
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

		for(var i = 0; i < self.addedItems; i++){
			
			self.totJuteQuantity = self.totJuteQuantity + parseInt(self.addedItems[i].actualQuality);
		}
	}
	
	
	startAddAnItem = function(){
		var self = this;
		self.addItemMode = true;
		self.grnReceiveModel.selectedAddQuality = "";
		self.grnReceiveModel.selectedAddItem = "";
		self.grnReceiveModel.conversiontype = "LOOSE";
		self.grnReceiveModel.receivedQuantity = "";
	}
	
	cancelAddItem = function(){
		var self = this;
		self.addItemMode = false;
		self.grnReceiveModel.selectedAddQuality = "";
		self.grnReceiveModel.selectedAddItem = "";
		self.grnReceiveModel.conversiontype = "LOOSE";
		self.grnReceiveModel.receivedQuantity = "";
	}
	
	
	openWarehouseEdit = function(params){
		var self = this;
		self.warehouseedit  = params.node.id;
		self.grnReceiveModel.SRStoreSelect = "";
		self.http.getAllWarehouse()
			.subscribe(
			(data) => {
				self.allWarehouse = data;
			},
			(error) => self.errorMsg = error,
			() => {
				for(var i = 0; i<self.allWarehouse.length; i++){
					if(self.allWarehouse[i].id == params.data.warehouseNo){
						self.grnReceiveModel.SRStoreSelect = i;
					}
				}
			}
		);
	}
	
	closeWareDialog = function(){
		var self = this;
		self.warehouseedit = "";
		self.gridOptions.api.setRowData(self.addedItems);
	}
	
	updateWarehouseNumber = function(){
		var self = this;
		self.addedItems[self.warehouseedit].warehouseNo = self.allWarehouse[self.grnReceiveModel.SRStoreSelect].id;
		self.closeWareDialog();
	}
}