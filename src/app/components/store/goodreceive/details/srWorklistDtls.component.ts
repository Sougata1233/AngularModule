import { Component, OnInit, AfterViewInit } from '@angular/core';
import * as $ from 'jquery';

import { HttpTestService } from '../../../../services/http.service';
import { sessionServices } from '../../../../services/session.services';
import { AppSettings } from '../../../../config/settings/app-settings';
import { Router, ActivatedRoute } from '@angular/router';
import { grnReceiveModel } from '../../../../models/grn/grnReceive.model';
import {IMyDpOptions} from 'mydatepicker';

import {GridOptions} from "ag-grid/main";
import {gridDateComponent} from "../../../common/gridDateFormat.component";
import {numericRequiredEditorComponent} from "../../../editor/numericRequiredEditor.component";
import {gridDaviationSRComponent} from "../../../common/gridDaviationSR.component";
import {gridReceiveRejectComponent} from "../../../common/gridReceiveRejectComponent";
import {griddateSRcomponent} from "../../../common/gridDatepickerSR.component";
import {legacyCodeItemNameComponent} from "../../../common/legacy_item.component";
import {gridStoreEditTriggerComponent} from "../../../common/gridStoreEditTriggerComponent";

@Component({
  selector: 'app-mr-work-dtls',
  templateUrl: './srWorklistDtls.component.html'
})
export class srDtlsWorklistComponent implements OnInit {
	
	public sub: any;
	public requestedId: string;
	public GRNDtllData : any;
	public statusChangeResponsedata : any;
	public errorMsg : string = "";
	public successMsg : string = "";
	public approvalData : any = [];
	public gridOptions: GridOptions;
	public stat : string = "";
	public expOpn : boolean = false;
	public expOpnId : number = null;
	public prefix : string = "";
	public approverlevel : number = 0;
	public expiryDateOptions: IMyDpOptions = {
        // other options...
        dateFormat: 'yyyy-mm-dd'
	};
	public storeedit : any = "";
	public allStores : any = [];
	
	public grnReceiveModel: grnReceiveModel = new grnReceiveModel();
	
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

	
	constructor(public http: HttpTestService, public router: Router, public activatedRoute: ActivatedRoute , public session: sessionServices) {
		var self = this;
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
			 if(clickedItem == "receive"){self.changeMRItmStat(params);}
			 if(clickedItem == "expdtpckr"){self.changeExprDate(params);}
			 if(clickedItem == "storeEditTrigger"){self.openStoreEdit(params);}
		 };
		  this.gridOptions.onCellEditingStopped = function(params) {
			 if(self.GRNDtllData.storeGrnItemList != 'undefined'){
				self.updateDeviation(params.node.id,params);
				params.api.setRowData(self.GRNDtllData.storeGrnItemList);
			 }
			 };
	}
		
	ngOnInit() {
			this.getSession();
			
			this.sub = this.activatedRoute.params.subscribe(params => {
				this.requestedId = params['id'];
			});
			this.loadApprovalData();
			//this.loadGRNdetails();
		}
	
	//get session details
	getSession = function(){
		this.sessionData = this.session.getSessionDetails();
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
		self.gridOptions.api.setRowData(self.GRNDtllData.storeGrnItemList);
	}
	
	updateStoreNumber = function(){
		var self = this;
		self.GRNDtllData.storeGrnItemList[self.storeedit].storeId = self.allStores[self.grnReceiveModel.SRStoreSelect].storeId;
		self.closeStoreDialog();
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
					if(self.approvalData[i].taskDesc == "SR"){
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
					
					for(var i=0; i<self.GRNDtllData.storeGrnItemList.length; i++){
					if(self.approverlevel == 1){
						self.GRNDtllData.storeGrnItemList[i].approverFirst = self.sessionData.sessionId;
						self.GRNDtllData.storeGrnItemList[i].approveFirstDate = new Date().getTime();
					}else if(self.approverlevel == 2){
						self.GRNDtllData.storeGrnItemList[i].approverSecond = self.sessionData.sessionId;
						self.GRNDtllData.storeGrnItemList[i].approveSecondDate = new Date().getTime();
					}
				}
				}
			);
	}
	
	
	changeExprDate = function(params){
		var self = this;
		self.expOpn = true;
		self.expOpnId = params.node.id;
	}
	
	setExpVal = function(index){
		var self = this;
		self.GRNDtllData.storeGrnItemList[index].expiryDate = new Date(self.grnReceiveModel.exdate.date.year, self.grnReceiveModel.exdate.date.month-1, self.grnReceiveModel.exdate.date.day).getTime();
		self.expOpn = false;
		self.expOpnId = null;
		self.grnReceiveModel.exdate = { date: { year: new Date().getFullYear(), month: new Date().getMonth()+1, day: new Date().getDate() } };
		this.gridOptions.api.setRowData(self.GRNDtllData.storeGrnItemList);
	}
	
	
		updateDeviation = function(index,params){
		var self = this;
		if(params.colDef.field == 'actualQuantity'){
			if(parseFloat(self.GRNDtllData.storeGrnItemList[index].actualQuantity) < 0){
				self.GRNDtllData.storeGrnItemList[index].actualQuantity = 0;
			}
			
			if(parseFloat(self.GRNDtllData.storeGrnItemList[index].actualQuantity) > (parseFloat(self.GRNDtllData.storeGrnItemList[index].advisedQuantity) - parseFloat(self.GRNDtllData.storeGrnItemList[index].orderedPrice))){
				self.GRNDtllData.storeGrnItemList[index].actualQuantity = (parseFloat(self.GRNDtllData.storeGrnItemList[index].advisedQuantity) - parseFloat(self.GRNDtllData.storeGrnItemList[index].orderedPrice));
			}
			
		}
		
		if(params.colDef.field == 'orderedPrice'){
			if(parseFloat(self.GRNDtllData.storeGrnItemList[index].orderedPrice) < 0){
				self.GRNDtllData.storeGrnItemList[index].orderedPrice = 0;
			}
			
			if(parseFloat(self.GRNDtllData.storeGrnItemList[index].orderedPrice) > (parseFloat(self.GRNDtllData.storeGrnItemList[index].advisedQuantity) - parseFloat(self.GRNDtllData.storeGrnItemList[index].deviation))){
				self.GRNDtllData.storeGrnItemList[index].orderedPrice = (parseFloat(self.GRNDtllData.storeGrnItemList[index].advisedQuantity) - parseFloat(self.GRNDtllData.storeGrnItemList[index].deviation));
			}
			
			self.GRNDtllData.storeGrnItemList[index].actualQuantity = parseFloat(self.GRNDtllData.storeGrnItemList[index].advisedQuantity) - (parseFloat(self.GRNDtllData.storeGrnItemList[index].orderedPrice) + parseFloat(self.GRNDtllData.storeGrnItemList[index].deviation));
			
		}
		self.GRNDtllData.storeGrnItemList[index].deviation = (parseFloat(self.GRNDtllData.storeGrnItemList[index].advisedQuantity) - (parseFloat(self.GRNDtllData.storeGrnItemList[index].actualQuantity) + parseFloat(self.GRNDtllData.storeGrnItemList[index].orderedPrice)));
	}
	
	
	changeMRItmStat = function(params){
		var self = this;
		var selected = params.event.target.checked;
		if(selected){
			self.GRNDtllData.storeGrnItemList[params.node.id].status = "1";
		}else{
			self.GRNDtllData.storeGrnItemList[params.node.id].status = "4";
		}
		
		this.gridOptions.api.setRowData(self.GRNDtllData.storeGrnItemList);
	}
	
	
	statusChange = function(changedstatus){
		var self = this;
		self.GRNDtllData.storeGoodReceiveHeader.status = changedstatus;
		for(var i =0; i<self.GRNDtllData.storeGrnItemList.length; i++){
			if(self.GRNDtllData.storeGrnItemList[i].status != "4" && changedstatus == '3'){
				self.GRNDtllData.storeGrnItemList[i].status = "3";
			}else if(self.GRNDtllData.storeGrnItemList[i].status != "4" && changedstatus != '3'){
				self.GRNDtllData.storeGrnItemList[i].status = changedstatus;
			}
		}
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
	
}
