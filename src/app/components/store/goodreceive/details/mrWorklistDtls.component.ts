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
import {gridReceiveRejectComponent} from "../../../common/gridReceiveRejectComponent";
import {numericRequiredEditorComponent} from "../../../editor/numericRequiredEditor.component";
import {claimforconditioncomponent} from "../../../common/claimForCondition.Component";
import {legacyCodeItemNameComponent} from "../../../common/legacy_item.component";
import {gridActualQuantityTriggerComponent} from "../../../common/gridActualQuantityTrigger.component";
import { grnReceiveModel } from '../../../../models/grn/grnReceive.model';
import {gridActualItemTriggerComponent} from "../../../common/gridActualItemTrigger.component";
import {gridWaEdirehousetTriggerComponent} from "../../../common/gridWaEdirehousetTriggerComponent";

@Component({
  selector: 'app-mr-work-dtls',
  templateUrl: './mrWorklistDtls.component.html'
})
export class mrDtlsWorklistComponent implements OnInit {
	
	public sub: any;
	public requestedId: string;
	public GRNDtllData : any;
	public errorMsg : string = "";
	public successMsg : string = "";
	public prefix : string = "";
	public gridOptions: GridOptions;
	public statusChangeResponsedata : any;
	public conditionClicked : any = "";
	public MRDtls : any;
	public approvalData : any = [];
	public stat : string = "";
	public actualQualityEdit : any = "";
	public actualItemEdit : any = "";
	public approverlevel : number = 0;
public grnReceiveModel: grnReceiveModel = new grnReceiveModel();
	public itemQuality : any = [];
	public jutetypes : any = [];
	public warehouseedit : any = "";
	public allWarehouse : any = [];
	public chalanDtls : any = [];
	public conditionReadingData : any = [{"val": null},{"val": null},{"val": null},{"val": null},{"val": null},{"val": null},{"val": null},{"val": null},{"val": null},{"val": null}];
	
	public columnDef : any = [
		{headerName: "Advised Jute Type", field: "advisedItem.name", suppressMenu: true, minWidth : 250, function (params) {
          return params.data.advisedItem.legacyItemCode+"_"+params.value;
        }},
		{headerName: "Actual Jute Type", field: "item.name", suppressMenu: true, minWidth : 250, cellRendererFramework : gridActualItemTriggerComponent},
		//{headerName: "Coverted Quantity", field: "advisedWeight", suppressMenu: true, minWidth : 200},
		{headerName: "Marka", field: "marka", suppressMenu: true, minWidth : 250, editable : true, cellEditor : 'text'},
		{headerName: "Advised Quality", field: "advisedQuality.name", suppressMenu: true, minWidth : 250},
		{headerName: "Actual Quality", field: "actualQuality.name", suppressMenu: true, minWidth : 250, cellRendererFramework : gridActualQuantityTriggerComponent},
		{headerName: "Advised Weight", field: "advisedWeight", suppressMenu: true, minWidth : 350, valueFormatter: function (params) {
          return parseFloat(parseFloat(params.value).toFixed(2));
        }},
		{headerName: "Actual Weight", field: "actualWeight", suppressMenu: true, minWidth : 350, cellEditorFramework: numericRequiredEditorComponent, editable : true, valueFormatter: function (params) {
          return parseFloat(parseFloat(params.value).toFixed(2));
        }},
		{headerName: "Deviation", field: "deviation", suppressMenu: true, minWidth : 350, valueFormatter: function (params) {
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
			var result = (params.data.unitConversionType == 'LOOSE')?parseFloat(params.value).toFixed(2):(params.data.conversionActualQuantity);
		  }else{
			var result = (params.data.unitConversionType == 'LOOSE')?parseFloat(params.value).toFixed(2):(params.data.conversionActualQuantity);
		  }
		  return result;
        }},
		{headerName: "Rate", field: "rate", suppressMenu: true, minWidth : 200, valueFormatter: function (params) {
			return (params.value - params.data.claimsQuality).toFixed(2);
		}},
		{headerName: "Allowable Moisture (%)", field: "allowableMoisturePercentage", suppressMenu: true, minWidth : 250},
		{headerName: "Claims for Quality", field: "claimsQuality", suppressMenu: true, minWidth : 200, editable : true, cellEditor : 'text'},
		{headerName: "Claims for Condition (%)", field: "claimsCondition", suppressMenu: true, minWidth : 200, cellRendererFramework : claimforconditioncomponent},
		{headerName: "Warehouse No.", field: "warehouseNo", suppressMenu: true, minWidth : 200, cellRendererFramework: gridWaEdirehousetTriggerComponent},
		{headerName: "Remarks", field: "remarks", suppressMenu: true, minWidth : 200, editable : true, cellEditor : 'largeText'},
		{headerName: "Receive/Reject", field: "status", suppressMenu: true, minWidth : 350, cellRendererFramework : gridReceiveRejectComponent} 
	];
	
	public onQuickFilterChanged($event) {
        this.gridOptions.api.setQuickFilter($event.target.value);
    }
	
	constructor(public http: HttpTestService, public router: Router, public activatedRoute: ActivatedRoute , public session: sessionServices) {
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
			 if(self.GRNDtllData.materialGrnItemList != 'undefined'){
				 
				 var avrg = self.GRNDtllData.materialGrnItemList[params.node.id].claimsCondition;
				 var allowableMoisture = self.GRNDtllData.materialGrnItemList[params.node.id].allowableMoisturePercentage;
				 var allowableactual = self.GRNDtllData.materialGrnItemList[params.node.id].advisedWeight;
				 if(avrg > allowableMoisture){
					  allowableactual =  allowableactual - (allowableactual * (avrg-allowableMoisture)/100);
				}
				 if(self.GRNDtllData.materialGrnItemList[params.node.id].actualWeight>allowableactual){
					 self.GRNDtllData.materialGrnItemList[params.node.id].actualWeight = allowableactual;
				}
				
				self.GRNDtllData.materialGrnItemList[params.node.id].conversionActualQuantity = (self.GRNDtllData.materialGrnItemList[params.node.id].unitConversionType == 'LOOSE')?self.GRNDtllData.materialGrnItemList[params.node.id].actualWeight:self.GRNDtllData.materialGrnItemList[params.node.id].conversionActualQuantity;
				 
				
				// console.log(params.node.id);
				self.GRNDtllData.materialGrnItemList[params.node.id].deviation = self.GRNDtllData.materialGrnItemList[params.node.id].advisedWeight - self.GRNDtllData.materialGrnItemList[params.node.id].actualWeight;
				if(self.GRNDtllData.materialGrnItemList[params.node.id].claimsQuality != ''){
					if(parseFloat(self.GRNDtllData.materialGrnItemList[params.node.id].claimsQuality) > parseFloat(self.GRNDtllData.materialGrnItemList[params.node.id].rate)){
						self.GRNDtllData.materialGrnItemList[params.node.id].claimsQuality = self.GRNDtllData.materialGrnItemList[params.node.id].rate;
					}
					//self.GRNDtllData.materialGrnItemList[params.node.id].rate = self.GRNDtllData.materialGrnItemList[params.node.id].rate - self.GRNDtllData.materialGrnItemList[params.node.id].claimsQuality;
				}
				
				
				if(params.colDef.field == 'conversionActualQuantity'){
					if(parseFloat(self.GRNDtllData.materialGrnItemList[params.node.id].conversionActualQuantity) < 0){
						self.GRNDtllData.materialGrnItemList[params.node.id].conversionActualQuantity = 0;
					}
					
					if(parseFloat(self.GRNDtllData.materialGrnItemList[params.node.id].conversionActualQuantity) > parseFloat(self.GRNDtllData.materialGrnItemList[params.node.id].conversionQuantity)){
						self.GRNDtllData.materialGrnItemList[params.node.id].conversionActualQuantity = parseFloat(self.GRNDtllData.materialGrnItemList[params.node.id].conversionQuantity);
					}
					
				}params.api.setRowData(self.GRNDtllData.materialGrnItemList);
			 }
		};
		 
		 
	}
		
	ngOnInit() {
			this.getSession();
			
			this.sub = this.activatedRoute.params.subscribe(params => {
				this.requestedId = params['id'];
			});
			
			this.loadApprovalData();
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
				() => {
						//self.loadGRNdetails();
					}
			);
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
				if(self.approvalData.length == 0){
					self.allOpenMrList = "notauth";
				}else{
				for(var i = 0; i<self.approvalData.length; i++){
					if(self.approvalData[i].taskDesc == "MR"){
						if(self.approvalData[i].user1 && self.approvalData[i].user1.id == self.sessionData.sessionId){
							self.approverlevel = 1;
							this.loadGRNdetails();
							if(!self.approvalData[i].user2){
								self.stat = "3";
							}else{
								self.stat = "17";
							}
						}else if(self.approvalData[i].user2 && self.approvalData[i].user2.id == self.sessionData.sessionId){
							self.approverlevel = 2;
							this.loadGRNdetails();
							if(!self.approvalData[i].user3){
								self.stat = "3";
							}else{
								self.stat = "18";
							}
						}else if(self.approvalData[i].user3 && self.approvalData[i].user3.id == self.sessionData.sessionId){
							self.approverlevel = 3;
							this.loadGRNdetails();
							if(!self.approvalData[i].user4){
								self.stat = "3";
							}else{
								self.stat = "19";
							}
						}else if(self.approvalData[i].user4 && self.approvalData[i].user4.id == self.sessionData.sessionId){
							self.approverlevel = 4;
							this.loadGRNdetails();
							if(!self.approvalData[i].user5){
								self.stat = "3";
							}else{
								self.stat = "20";
							}
						}else if(self.approvalData[i].user5 && self.approvalData[i].user5.id == self.sessionData.sessionId){
							self.approverlevel = 5;
							this.loadGRNdetails();
							self.stat = "3";
						}else{
							self.GRNDtllData = "notauth";
						}
						
					}
				}
				}
			}
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
					//self.getMRdetailsfrmChalan(self.GRNDtllData.materialGoodReceiveHeader.chalanNo);
					self.fetchChalanDetails();
					for(var i=0; i<self.GRNDtllData.materialGrnItemList.length; i++){
					if(self.approverlevel == 1){
						self.GRNDtllData.materialGrnItemList[i].approverFirst = self.sessionData.sessionId;
						self.GRNDtllData.materialGrnItemList[i].approveFirstDate = new Date().getTime();
					}else if(self.approverlevel == 2){
						self.GRNDtllData.materialGrnItemList[i].approverSecond = self.sessionData.sessionId;
						self.GRNDtllData.materialGrnItemList[i].approveSecondDate = new Date().getTime();
					}
				}
				}
			);
	}
	
	
	fetchChalanDetails = function(){
		
		var self = this;
		self.errorMsg = "";
		self.successMsg = "";
		
		self.http.getChallanDtlsMr(self.GRNDtllData.materialGoodReceiveHeader.chalanNo+"^"+self.GRNDtllData.materialGoodReceiveHeader.supplierId+"^"+self.GRNDtllData.materialGoodReceiveHeader.poId)
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
					//this.getMRdetailsfrmChalan(self.grnReceiveModel.chalanNo,self.grnReceiveModel.supplierId,enteredpo)
					}
			);
		
	}
	
	changeMRItmStat = function(params){
		var self = this;
		var selected = params.event.target.checked;
		if(selected){
			self.GRNDtllData.materialGrnItemList[params.node.id].status = "1";
		}else{
			self.GRNDtllData.materialGrnItemList[params.node.id].status = "4";
		}
		
		
		
		this.gridOptions.api.setRowData(self.GRNDtllData.materialGrnItemList);
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
		self.conditionReadingData = [{"val": null},{"val": null},{"val": null},{"val": null},{"val": null},{"val": null},{"val": null},{"val": null},{"val": null},{"val": null}];
	}
	
	updateCondition = function(){
		var self = this;
		var sumVal = 0;
		for(var i=0; i<self.conditionReadingData.length; i++){
			sumVal = sumVal + parseFloat(self.conditionReadingData[i].val);
		}
		var avrg = sumVal/self.conditionReadingData.length;
		self.GRNDtllData.materialGrnItemList[self.conditionClicked].claimsCondition = avrg;
		self.GRNDtllData.materialGrnItemList[self.conditionClicked].actualWeight = self.GRNDtllData.materialGrnItemList[self.conditionClicked].actualWeight - (self.GRNDtllData.materialGrnItemList[self.conditionClicked].actualWeight * avrg/100);
		self.GRNDtllData.materialGrnItemList[self.conditionClicked].deviation = self.GRNDtllData.materialGrnItemList[self.conditionClicked].deviation + (self.GRNDtllData.materialGrnItemList[self.conditionClicked].actualWeight * avrg/100);
		self.conditionClicked = "";
		self.conditionReadingData = [{"val": null},{"val": null},{"val": null},{"val": null},{"val": null},{"val": null},{"val": null},{"val": null},{"val": null},{"val": null}];
		this.gridOptions.api.setRowData(self.GRNDtllData.materialGrnItemList);
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


	updateActualQuantity = function(){
		var self = this;
		self.GRNDtllData.materialGrnItemList[self.actualQualityEdit].actualQuality = self.itemQuality[self.grnReceiveModel.selectedQuality];
		self.closeQuzlityDialog();
	}

closeQuzlityDialog = function(){
		var self = this;
		self.actualQualityEdit = "";
		self.gridOptions.api.setRowData(self.GRNDtllData.materialGrnItemList);
	}


	addRowCondition = function(){
		var self = this;
		var addedObj = {"val": null};
		self.conditionReadingData.push(addedObj);
	}
	
	deleteRowCondition = function(index){
		var self = this;
		
		
		self.conditionReadingData.splice(index, 1);
	}
	
	statusChange = function(changedstatus){
		var self = this;
		self.GRNDtllData.materialGoodReceiveHeader.status = changedstatus;
		for(var i =0; i<self.GRNDtllData.materialGrnItemList.length; i++){
			if(self.GRNDtllData.materialGrnItemList[i].status != "4" && changedstatus == '3'){
				self.GRNDtllData.materialGrnItemList[i].status = "3";
			}else if(self.GRNDtllData.materialGrnItemList[i].status != "4" && changedstatus != '3'){
				self.GRNDtllData.materialGrnItemList[i].status = changedstatus;
			}
			self.GRNDtllData.materialGrnItemList[i].totalPrice = (self.GRNDtllData.materialGrnItemList[i].rate - self.GRNDtllData.materialGrnItemList[i].claimsQuality) * self.GRNDtllData.materialGrnItemList[i].actualWeight;
		}
		
		//self.indentDetailData.reason = self.indentCreateModel.rejectionReason;
		this.http.updateMR(self.GRNDtllData)
			.subscribe(
			(data) => {
				self.statusChangeResponsedata = data;
			},
			(error) => self.errorMsg = error,
			() => {
				self.successMsg = "GRN Status Changed Successfully.",
				self.router.navigate(['jute/mrworklist'])
			}
		);
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
	
	updateActualItem = function(){
		var self = this;
		self.GRNDtllData.materialGrnItemList[self.actualItemEdit].item = self.jutetypes[self.grnReceiveModel.selectedactualitem];
		self.GRNDtllData.materialGrnItemList[self.actualItemEdit].actualQuality = null;
		self.closeItemDialog();
	}
	
	closeItemDialog = function(){
		var self = this;
		self.actualItemEdit = "";
		self.gridOptions.api.setRowData(self.GRNDtllData.materialGrnItemList);
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
		self.gridOptions.api.setRowData(self.GRNDtllData.materialGrnItemList);
	}
	
	updateWarehouseNumber = function(){
		var self = this;
		self.GRNDtllData.materialGrnItemList[self.warehouseedit].warehouseNo = self.allWarehouse[self.grnReceiveModel.SRStoreSelect].id;
		self.closeWareDialog();
	}
}
