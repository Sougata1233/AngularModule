import { Component, OnInit, AfterViewInit } from '@angular/core';
import * as $ from 'jquery';

import { HttpTestService } from '../../../services/http.service';
import { sessionServices } from '../../../services/session.services';
import { Router, ActivatedRoute } from '@angular/router';
import { issueModel } from '../../../models/goodissue/issue.model';
import {GridOptions} from "ag-grid/main";
import {gridDeleteComponent} from "../../common/gridRowDelete.component";
import {issuedtlselectcomponent} from "../../common/gridIssueDtlSelect.component";
import {gridDateComponent} from "../../common/gridDateFormat.component";
import {legacyCodeItemNameComponent} from "../../common/legacy_item.component";
import {numericRequiredEditorComponent} from "../../editor/numericRequiredEditor.component";
import {batchcellrenderer} from "../../common/batchcellrenderer.component";

@Component({
  selector: 'app-good-issue',
  templateUrl: './grnMaterialIssue.component.html'
})
export class grnMrIssueComponent implements OnInit {
	
	public issueModel: issueModel = new issueModel();
	
	public errorMsg : string = "";
	public successMsg : string = "";
	
	public sessionData: any;
	
	public indentDetailData : any;
	public gridOptions: GridOptions;
	public gridOptionsStck: GridOptions;
	public gridOptionaddeditem: GridOptions;
	public gridOptionsWarehouse: GridOptions;
	
	public items: any ;
	public itemQuality: any ;
	public departments:any;
	public searchResult :any = [];
	public searchSelection :any = [];
	public stockSelection :any = [];
	
	public addedItems: any  = [];
	public stckDtl :any = [];
	public stckDtlMR : any = [];
	
	public searchMode : boolean = true;
	public myOptions:any = [];
	public itemstackbystoredata : any =  "";
	public allBatchTypes:any = [];
	public batchedit : any = "";
	
	
	public columnDefwarehousestock : any = [
		{headerName: "Warehouse No.", field: "wareHouseNo", suppressMenu: true, minWidth : 250, checkboxSelection : true},
		{headerName: "Actual Quantity", field: "totalStock", suppressMenu: true, minWidth : 250, valueFormatter: function (params) {
			return parseFloat(parseFloat(params.value).toFixed(2));
		}},
		{headerName: "Loose Stock", field: "totalStock", suppressMenu: true, minWidth : 250, 
		valueFormatter: function (params) {
			if(params.node.data.conversionUnit == "LOOSE"){
				 return parseFloat(parseFloat(params.value).toFixed(2));
			}else{
				return "";
			}
         
        }},
		{headerName: "Bale Stock", field: "totalBaleStock", suppressMenu: true, minWidth : 250, 
		valueFormatter: function (params) {
          if(params.node.data.conversionUnit == "BALE"){
				 return parseFloat(parseFloat(params.value).toFixed(2)) + " BALE";
			}else{
				return "";
			}
        }}
		//{headerName: "Unit", field: "quantityUnit.name", suppressMenu: true, minWidth : 250},
		//{headerName: "Entry Date", field: "entrydate", suppressMenu: true, minWidth : 250, maxWidth : 250, width : 250, cellRendererFramework: gridDateComponent}
	];
	
	public columnDef : any = [
		{headerName: "Warehouse No.", field: "wareHouseNo", suppressMenu: true, minWidth : 250, checkboxSelection : true},
		{headerName: "Loose Stock", field: "stock", suppressMenu: true, minWidth : 250, 
		valueFormatter: function (params) {
			if(params.node.data.conversionUnit == "LOOSE"){
				 return parseFloat(parseFloat(params.value).toFixed(2));
			}else{
				return "";
			}
         
        }},
		{headerName: "Bale Stock", field: "totalBaleStock", suppressMenu: true, minWidth : 250, 
		valueFormatter: function (params) {
          if(params.node.data.conversionUnit == "BALE"){
				 return parseFloat(parseFloat(params.value).toFixed(2)) + " BALE";
			}else{
				return "";
			}
        }}
		//{headerName: "Unit", field: "quantityUnit.name", suppressMenu: true, minWidth : 250},
		//{headerName: "Entry Date", field: "entrydate", suppressMenu: true, minWidth : 250, maxWidth : 250, width : 250, cellRendererFramework: gridDateComponent}
	];
	
	public columnDefaddeditem : any = [
		{headerName: "Item Descrption", field: "item.name", suppressMenu: true, minWidth : 250, cellRendererFramework: legacyCodeItemNameComponent},
		{headerName: "Quality", field: "quality.name", suppressMenu: true, minWidth : 250},
		{headerName: "Warehouse No.", field: "warehouse", suppressMenu: true, minWidth : 250},
		//{headerName: "Marka", field: "marka", suppressMenu: true, minWidth : 250, editable : true, cellEditor : 'text'},
		{headerName: "Physical Stock", field: "stock", suppressMenu: true, minWidth : 250, valueFormatter: function (params) {
			return parseFloat(parseFloat(params.value).toFixed(2));
		}},
		{headerName: "Issue Quantity", field: "issueQuantity", suppressMenu: true, minWidth : 250, cellEditorFramework: numericRequiredEditorComponent, editable : true, valueFormatter: function (params) {
			return parseFloat(parseFloat(params.value).toFixed(2));
		}},
		{headerName: "Stock in Hand", field: "", suppressMenu: true, minWidth : 250, 
		valueFormatter: function (params) {
          return parseFloat((params.data.stock - params.data.issueQuantity).toFixed(2));
        }
		},
		{headerName: "Batch Type", field: "serviceBatchType", suppressMenu: true, minWidth : 250, cellRendererFramework: batchcellrenderer},
		{headerName: "Remark", field: "", suppressMenu: true, minWidth : 250, editable : true, cellEditor : 'largeText'},
		{headerName: "Delete", field: "batchno", suppressMenu: true, minWidth : 250, cellRendererFramework: gridDeleteComponent},
	];
	
	
	
	
	public createIndentPostData = {
	"issueHeader": {

		"type": "O",
		"status": null,
		"submitter": "dhriti",
		"finnacialYear": "2017",
		"createDate": 1503987015000,
		"issueDate": 1503987015000,
		"unitId": 1503987015000,
		"deptId": 1503987015000,
		"lastModifiedUser": null,
		"lastModifiedDate": null
	},
	"issuItemList": [],
	"department"  : {"id" : 3, "name" : "JUTE"}
};
	
	constructor(public http: HttpTestService, public router: Router, public activatedRoute: ActivatedRoute , public session: sessionServices) { 
		var self = this;
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
		 this.gridOptions.onGridReady = function(params) {params.api.sizeColumnsToFit();};
		 this.gridOptions.onRowSelected = function(params) {
			 self.searchSelection.length = 0;
			 self.searchSelection = params.api.getSelectedRows();
		 };
		 
		 
		 this.gridOptionsWarehouse = <GridOptions>{};
		 //this.gridOptions.columnDefs = this.columnDef;
		 this.gridOptionsWarehouse.paginationPageSize = 5;
		 this.gridOptionsWarehouse.domLayout = 'autoHeight';
		 this.gridOptionsWarehouse.pagination = true;
		 this.gridOptionsWarehouse.enableFilter = true;
		 this.gridOptionsWarehouse.enableSorting = true;
		 this.gridOptionsWarehouse.enableColResize = true;
		 this.gridOptionsWarehouse.floatingFilter = true;
		 this.gridOptionsWarehouse.suppressMovableColumns = true;
		 this.gridOptionsWarehouse.rowHeight = 30;
		 this.gridOptionsWarehouse.floatingFiltersHeight = 40;
		 this.gridOptionsWarehouse.rowSelection = 'multiple';
		 this.gridOptionsWarehouse.showToolPanel = false;
		 this.gridOptionsWarehouse.onGridReady = function(params) {params.api.sizeColumnsToFit();};
		 this.gridOptionsWarehouse.onRowSelected = function(params) {
			 self.stockSelection.length = 0;
			 self.stockSelection = params.api.getSelectedRows();
		 };
		 
			 
			 
			 
			this.gridOptionaddeditem = <GridOptions>{};
		 //this.gridOptions.columnDefs = this.columnDef;
		 this.gridOptionaddeditem.paginationPageSize = 5;
		 this.gridOptionaddeditem.domLayout = 'autoHeight';
		 this.gridOptionaddeditem.pagination = true;
		 this.gridOptionaddeditem.enableFilter = true;
		 this.gridOptionaddeditem.enableSorting = true;
		 this.gridOptionaddeditem.enableColResize = true;
		 this.gridOptionaddeditem.floatingFilter = true;
		 this.gridOptionaddeditem.suppressMovableColumns = true;
		 this.gridOptionaddeditem.rowHeight = 30;
		 this.gridOptionaddeditem.floatingFiltersHeight = 40;
		 this.gridOptionaddeditem.rowSelection = 'single';
		 this.gridOptionaddeditem.showToolPanel = false;
		  this.gridOptionaddeditem.onRowClicked = function(params) {
			 var clickedItem = $(params.event.target).attr("data-action-type");
			 //var typeofTarget = $(clickedItem.getAttribute("data-action-type");
			 if(clickedItem == "remove"){self.deleteItem(params.node.id)}
			 if(clickedItem == "batchselector"){self.batchselection(params)}
		 };
		 this.gridOptionaddeditem.onCellEditingStopped = function(params) {
			 if(self.addedItems != 'undefined'){
				// console.log(params.node.id);
				self.addedItems[params.node.id].issueQuantity = parseFloat(parseFloat(self.addedItems[params.node.id].issueQuantity).toFixed(2));
				if(self.addedItems[params.node.id].issueQuantity < 0){
					self.addedItems[params.node.id].issueQuantity = 0;
				}
				if(self.addedItems[params.node.id].issueQuantity > self.addedItems[params.node.id].stock){
					self.addedItems[params.node.id].issueQuantity = self.addedItems[params.node.id].stock;
				}
				
				var prevAdditional:any = self.addedItems[params.node.id].additionalRequirement;
				prevAdditional = prevAdditional.split("^");
				self.addedItems[params.node.id].additionalRequirement = prevAdditional[0]+"^"+parseFloat(parseFloat(self.addedItems[params.node.id].issueQuantity).toFixed(2));
				params.api.setRowData(self.addedItems);
			}
			 };
			 
	}
		
	ngOnInit() {
		this.getSession();
		this.loadItemDesc();
		this.loadDepartments();
		this.getAllBatch();
	}
	
	
	
	batchselection = function(params){
		var self = this;
		self.batchedit  = params.node.id;
		if(self.addedItems[self.batchedit].serviceBatchType != null){
			for(var i = 0; i<self.allBatchTypes.length; i++){
				if(self.addedItems[self.batchedit].serviceBatchType.serviceType == self.allBatchTypes[i].serviceType){
					self.issueModel.selectedBatchType = i;
				}
			}
		}else{
			self.issueModel.selectedBatchType = "";
		}
	}
	
	updateBatchItem = function(){
		var self = this;
		self.addedItems[self.batchedit].serviceBatchType = self.allBatchTypes[self.issueModel.selectedBatchType];
		self.closeBatchDialog();
	}
	
	closeBatchDialog = function(){
		var self = this;
		self.batchedit = "";
		self.gridOptionaddeditem.api.setRowData(self.addedItems);
	}
	
	tranTypeChange = function(){
		var self = this;
		self.issueModel.selectedLoanUnit = "";
		self.issueModel.selectedItem = "";
		self.searchMode = true;
		self.issueModel.searchitemstring = "";
		self.issueModel.selectedQuality = "";
		self.itemQuality = [];
		self.searchResult = [];
		self.addedItems = [];
		self.itemstackbystoredata.length == 0;
	}
	
	getAllBatch = function(){
		var self = this;
		this.http.getAllBatchTypes()
			.subscribe(
			(data) => {
				self.allBatchTypes = data;
			},
			(error) => {self.errorMsg = error, self.items = []},
			() => {}
		);
	}
	
	
	//load item description based on group selection
	loadItemDesc = function(){
		var self = this;
		self.stckDtl = [];
	  self.stckDtlMR = [];
	  self.myOptions = [];
		//self.StockUnit = "";
		var selectedGroup = "999";
		this.http.getItemDescByGrpId(selectedGroup)
			.subscribe(
			(data) => {
				self.items = data.items;
			},
			(error) => {self.errorMsg = error, self.items = []},
			() => {
				
				for(var i = 0; i<self.items.length; i++){
					var createObj = {
						value : i.toString(),
						label : self.items[i].legacyItemCode + "_" + self.items[i].name
					};
					self.myOptions.push(createObj);
				}
			}
		);
	}
	
	
	generateStock = function(item){
		var self = this;
		self.Stock = "";
		self.issueModel.selectedQuality = "";
		self.itemQuality = [];
		self.searchResult = [];
		self.itemstackbystoredata.length == 0;
		if(item.value != ''){
		self.Stock = self.items[item.value].stock;
		self.loadItemQuality(self.items[item.value].id);
		}
	}
	
	qualityChange = function(){
		var self = this;
		self.searchResult = [];
		self.itemstackbystoredata.length == 0;
	}
	
	loadItemQuality = function(id){
	  var self = this;
		
		this.http.getAllQuality(id)
			.subscribe(
			(data) => {
				self.itemQuality = data;
			},
			(error) => self.errorMsg = error,
			() => console.log("completed")
		);
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
			() => console.log("completed")
		);
	}
	
	searchStock = function(){
		var self = this;
		self.http.getMrWarehouseStckDtl(self.items[self.issueModel.selectedItem].id+"^"+self.itemQuality[self.issueModel.selectedQuality].id)
			.subscribe(
			(data) => {
				self.searchResult = data;
			},
			(error) => {self.errorMsg = error, self.searchResult = []},
			() => console.log("completed")
		);
	}
	
	
	addItem = function(){
		var self = this;
		var i = 0;
		self.addItemLoop(i);
	}
	
	
	searchWarehouseStock = function(){
		var self = this;
		self.itemstackbystoredata = "";
		console.log(self.searchSelection);
		self.http.getStackbyItemWare(self.items[self.issueModel.selectedItem].id+"^"+self.itemQuality[self.issueModel.selectedQuality].id+'^'+self.searchSelection[0].wareHouseNo)
			.subscribe(
			(data) => {
				self.itemstackbystoredata = data;
			},
			(error) => {self.errorMsg = error, self.itemstackbystoredata = ""},
			() => {
				
				var stockgridData = [];
				for(var i=0; i<self.itemstackbystoredata.length; i++){
						if(self.itemstackbystoredata[i].conversionUnit == self.searchSelection[0].conversionUnit){
							stockgridData.push(self.itemstackbystoredata[i]);
						}
				}
				self.itemstackbystoredata = stockgridData;
			}
		);
	}
	
	addItemLoop = function(index){
		var self = this;
		var createdObj = {
					"itemGroup" 	: {"id" : "999", "name" : "JUTE"},
					"item" 			: self.items[self.issueModel.selectedItem],
					"quantityUnit" 	: self.items[self.issueModel.selectedItem].quantityUnit,
					"stock" 		: (self.stockSelection[index].conversionUnit == "LOOSE")?parseFloat(parseFloat(self.stockSelection[index].totalStock).toFixed(2)):parseFloat(parseFloat(self.stockSelection[index].totalBaleStock).toFixed(2)),
					"issueQuantity"	: 0,
					"additionalRequirement" 	: self.stockSelection[index].id+"^0",
					"remark" 		: "",
					"marka" 		: "",
					"warehouse" 		: self.stockSelection[index].wareHouseNo,
					"quality" 		: self.itemQuality[self.issueModel.selectedQuality],
					"conversionUnit" : self.stockSelection[index].conversionUnit,
					"serviceBatchType" : null
			};
				
			self.addedItems.push(createdObj);
				
			if(index == self.stockSelection.length - 1){
					self.issueModel.selectedItem = "";
					self.searchMode = true;
					self.issueModel.searchitemstring = "";
					self.issueModel.selectedQuality = "";
					self.itemQuality = [];
					self.searchResult = [];
					self.itemstackbystoredata = [];
					if(typeof self.gridOptionaddeditem.api != 'undefined'){
					self.gridOptionaddeditem.api.setRowData(self.addedItems);
					}
				}
				
				if(index < self.stockSelection.length-1){
					self.addItemLoop(index + 1)
				}
				
	}
	
	
	deleteItem = function(indexdId){
		var self = this;
		
		
		self.addedItems.splice(indexdId, 1);
		self.gridOptionaddeditem.api.setRowData(self.addedItems);
	}
	
	
	
	//get session details
	getSession = function(){
		this.sessionData = this.session.getSessionDetails();
	}
	
	
	createIssue = function(){
		var self = this;
		var today = new Date();
		self.createIndentPostData.issueHeader.type = self.issueModel.tranType;
		self.createIndentPostData.issueHeader.status = "1";
		self.createIndentPostData.issueHeader.submitter = self.sessionData.sessionId;
		self.createIndentPostData.issueHeader.finnacialYear = today.getFullYear();
		self.createIndentPostData.issueHeader.createDate = today.getTime();
		self.createIndentPostData.issueHeader.issueDate = today.getTime();
		self.createIndentPostData.issueHeader.unitId = self.issueModel.selectedLoanUnit;
		self.createIndentPostData.issueHeader.deptId = 3;
		self.createIndentPostData.issueHeader.goodType = "MR";
		self.createIndentPostData.issuItemList = self.addedItems;
		
		this.http.createIssue(self.createIndentPostData)
			.subscribe(
			(data) => {
				self.createIndentResponseData = data;
			},
			(error) => self.errorMsg = error,
			() => {
				self.successMsg = "Issue Created Successfully.",
				self.issueModel.tranType = "",
				self.issueModel.selectedLoanUnit = "",
				self.issueModel.selectedItem = "",
				self.searchMode = true,
				self.issueModel.searchitemstring = "",
				self.issueModel.selectedQuality = "",
				self.itemQuality.length = 0,
				self.searchResult.length = 0,
				self.addedItems.length = 0,
				self.stockSelection.length = 0,
				self.itemstackbystoredata.length = 0
				
				
			}
		);
	}
	
	
	selectItem = function(id){
		var self = this;
		var selectedLegacy = id; 
		for(var i = 0; i < self.items.length; i++){
			if(self.items[i].legacyItemCode == selectedLegacy){
				self.issueModel.selectedItem = i.toString();
				self.searchMode = false;
				self.issueModel.searchitemstring = self.items[i].legacyItemCode+"_"+self.items[i].name;
				self.generateStock(i);
				}
		}
	}
	
	refreshSearchOptions = function(){
		var self = this;
		self.searchMode = true;
		self.issueModel.selectedItem = "";
	}
	


}