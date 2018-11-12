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


@Component({
  selector: 'app-good-issue',
  templateUrl: './grnStoreIssue.component.html'
})
export class grnSrIssueComponent implements OnInit {
	
	public issueModel: issueModel = new issueModel();
	
	public errorMsg : string = "";
	public successMsg : string = "";
	public costCenter : any;
	public costCenteroption : any = [];
	public sessionData: any;
	public allExpType : any = [];
	public expTypeOption : any = [];
	public indentDetailData : any;
	public gridOptions: GridOptions;
	public gridOptionsStck: GridOptions;
	public gridOptionaddeditem: GridOptions;
	
	public itemGroup: any = [];
	public itemGroupOption: any = [];
	public items: any ;
	public itemQuality: any ;
	public departments:any;
	public departmentsOptions:any = [];
	public searchResult :any = [];
	public searchSelection :any = [];
	
	public addedItems: any  = [];
	public stckDtl :any = [];
	public stckDtlMR : any = [];
	
	public searchMode : boolean = true;
	public myOptions:any = [];
	public itemstackbystoredata : any = "";
	public myTranTypeOption:any = [{
						value : "i",
						label : "Issue"
					},
					{
						value : "l",
						label : "Loan"
					}];
	
	public columnDef : any = [
		{headerName: "Store No.", field: "storeNo", suppressMenu: true, minWidth : 250, checkboxSelection : true},
		{headerName: "Stock", field: "stock", suppressMenu: true, minWidth : 250, valueFormatter: function (params) {
			return parseFloat(parseFloat(params.value).toFixed(2));
		}},
		{headerName: "Expiry Date", field: "expiryDate", suppressMenu: true, minWidth : 250, maxWidth : 250, width : 250, cellRendererFramework: gridDateComponent}
	];
	
	public columnDefaddeditem : any = [
		{headerName: "Item Group", field: "itemGroup.name", suppressMenu: true, minWidth : 250},
		{headerName: "Item Descrption", field: "item.name", suppressMenu: true, minWidth : 250, cellRendererFramework: legacyCodeItemNameComponent},
		//{headerName: "Department", field: "department.name", suppressMenu: true, minWidth : 250},
		{headerName: "Store No.", field: "store", suppressMenu: true, minWidth : 250},
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
		"lastModifiedDate": null,
		"deptCost": null,
		"expCode": null,
		"lotNo": 0
	},
	"issuItemList": [],
	"department" 	: null
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
		 this.gridOptions.rowSelection = 'multiple';
		 this.gridOptions.showToolPanel = false;
		 this.gridOptions.onGridReady = function(params) {params.api.sizeColumnsToFit();};
		 this.gridOptions.onRowSelected = function(params) {
			 self.searchSelection.length = 0;
			 self.searchSelection = params.api.getSelectedRows();
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
		 };
		 this.gridOptionaddeditem.onCellEditingStopped = function(params) {
			 if(self.addedItems != 'undefined'){
				// console.log(params.node.id);
				self.addedItems[params.node.id].issueQuantity = parseFloat(parseFloat(self.addedItems[params.node.id].issueQuantity).toFixed(2));
				var prevAdditional:any = self.addedItems[params.node.id].additionalRequirement;
				prevAdditional = prevAdditional.split("^");
				self.addedItems[params.node.id].additionalRequirement = prevAdditional[0]+"^"+parseFloat(parseFloat(self.addedItems[params.node.id].issueQuantity).toFixed(2));
				params.api.setRowData(self.addedItems);
				console.log(self.addedItems);
			}
			 };
	}
		
	ngOnInit() {
		this.getSession();
		//this.loadItemGroups();
		this.loadDepartments();
		this.loadExpType();
		this.loadcostCenter();
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
			() => console.log("completed")
		);
	}
	
	
	
	tranTypeChange = function(){
		var self = this;
		self.issueModel.selectedLoanUnit = "";
		self.issueModel.selectedItem = "";
		self.searchMode = true;
		self.issueModel.searchitemstring = "";
		self.issueModel.selectedItemGroup = "";
		self.items = [];
		self.myOptions = [];
		self.searchResult = [];
		self.addedItems = [];
	}
	
	
	departmentChange = function(e){
	  var self = this;
	  //self.addedItems.length = 0;
	  var selectedVal = e.value;
	  self.itemGroup.length = 0;
	  self.itemGroupOption.length = 0;
	  this.http.getItmgrpByDept(self.departments[selectedVal].id)
			.subscribe(
			(data) => {
				self.itemGroup = data;
			},
			(error) => self.errorMsg = error,
			() => {
				
				for(var i = 0; i<self.itemGroup.length; i++){
					var createObj = {
						value : i.toString(),
						label : self.itemGroup[i].id+"_"+self.itemGroup[i].name
					};
					self.itemGroupOption.push(createObj);
				}
				
				self.issueModel.selectedLoanUnit = "";
				self.issueModel.selectedItem = "";
				self.searchMode = true;
				self.issueModel.searchitemstring = "";
				self.issueModel.selectedItemGroup = "";
				self.items = [];
				self.myOptions = [];
				self.searchResult = [];
				self.addedItems = [];
			}
		);
	  
	  
	  
  }
	
	
	//load item description based on group selection
	loadItemDesc = function(e){
		var self = this;
		self.searchMode = true;
		self.issueModel.searchitemstring = "";
		self.issueModel.selectedItem = "";
		self.items = [];
		self.myOptions = [];
		self.searchResult = [];
		var selectedGroup = e.value;
		if(selectedGroup != ""){
		this.http.getItemDescByGrpId(self.itemGroup[selectedGroup].id)
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
		}else{
			self.items = [];
		}
	}
	
	
	generateStock = function(item){
		var self = this;
		self.Stock = "";
		self.searchResult = [];
		if(item.value != ''){
		self.Stock = self.items[item.value].stock;
		}
	}
	
	deptChange = function(){
		var self = this;
		self.searchResult = [];
	}
	
	loadcostCenter = function() {
		var self = this;
		
		this.http.getAllCostCenter()
			.subscribe(
			(data) => {
				self.costCenter = data;
			},
			(error) => self.errorMsg = error,
			() => {
				for(var i = 0; i<self.costCenter.length; i++){
					var createObj = {
						value : i.toString(),
						label : self.costCenter[i].costCode+"_"+self.costCenter[i].deptCode+"_"+self.costCenter[i].costDesc
					};
					self.costCenteroption.push(createObj);
				}
			}
		);
	}
	
	loadExpType = function() {
		var self = this;
		
		this.http.getAllExpType()
			.subscribe(
			(data) => {
				self.allExpType = data;
			},
			(error) => self.errorMsg = error,
			() => {
				for(var i = 0; i<self.allExpType.length; i++){
					var createObj = {
						value : i.toString(),
						label : self.allExpType[i].codeDsc+" ["+self.allExpType[i].codeType +"-"+ self.allExpType[i].code+"]"
					};
					self.expTypeOption.push(createObj);
				}
			}
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
			() => {
				for(var i = 0; i<self.departments.length; i++){
					var createObj = {
						value : i.toString(),
						label : self.departments[i].name
					};
					self.departmentsOptions.push(createObj);
				}
			}
		);
	}
	
	searchStock = function(){
		var self = this;
		self.http.getSrStckStckDtl(self.items[self.issueModel.selectedItem].id)
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
	
	
	addItemLoop = function(index){
		var self = this;
		self.itemstackbystoredata = "";
		console.log(self.searchSelection.length);
			self.http.getStackbyItemStore(self.searchSelection[index].itemId+'^'+self.searchSelection[index].storeNo)
			.subscribe(
			(data) => {
				self.itemstackbystoredata = data;
			},
			(error) => {self.errorMsg = error, self.itemstackbystoredata = ""},
			() => {
				var createdObj = {
					"itemGroup" 	: self.itemGroup[self.issueModel.selectedItemGroup],
					"item" 			: self.items[self.issueModel.selectedItem],
					"quantityUnit" 	: self.items[self.issueModel.selectedItem].quantityUnit,
					"stock" 		: parseFloat(parseFloat(self.searchSelection[index].stock).toFixed(2)),
					"issueQuantity"	: 0,
					"additionalRequirement" 	: self.itemstackbystoredata[0].id+"^0",
					"remark" 		: "",
					"marka" 		: "",
					"store" 		: self.searchSelection[index].storeNo,
					"quality" 		: null
				};
				
				self.addedItems.push(createdObj);
				
				if(index == self.searchSelection.length - 1){
					self.issueModel.selectedItem = "";
					self.myOptions = [];
					self.searchMode = true;
					self.issueModel.searchitemstring = "";
					self.issueModel.selectedItemGroup = "";
					self.items = [];
					self.searchResult = [];
					if(typeof self.gridOptionaddeditem.api != 'undefined'){
					self.gridOptionaddeditem.api.setRowData(self.addedItems);
					}
				}
				
				if(index < self.searchSelection.length-1){
					self.addItemLoop(index + 1)
				}
				
			}
		);
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
		self.createIndentPostData.issueHeader.goodType = "SR";
		self.createIndentPostData.issuItemList = self.addedItems;
		self.createIndentPostData.department = self.departments[self.issueModel.selectedDepartment];
		self.createIndentPostData.issueHeader.deptCost = self.costCenter[self.issueModel.costCenter].deptCode+"^"+self.costCenter[self.issueModel.costCenter].costCode;
		self.createIndentPostData.issueHeader.expCode = self.allExpType[self.issueModel.expType].codeDsc;
		self.createIndentPostData.issueHeader.lotNo =  self.issueModel.lotno;
		
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
				self.myOptions = [],
				self.searchMode = true,
				self.issueModel.searchitemstring = "",
				self.issueModel.selectedItemGroup = "",
				self.issueModel.selectedDepartment = "",
				self.issueModel.costCenter = "",
				self.issueModel.expType = "",
				self.issueModel.lotno = 0,
				self.items = [],
				self.searchResult = [],
				self.addedItems = []
				
				
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