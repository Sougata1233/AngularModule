import { Component, OnInit, AfterViewInit } from '@angular/core';
import * as $ from 'jquery';

import { HttpTestService } from '../../../../services/http.service';
import { sessionServices } from '../../../../services/session.services';
import { Router } from '@angular/router';
import {Observable} from 'rxjs/Rx';
import {GridOptions} from "ag-grid/main";
import {gridDeleteComponent} from "../../../common/gridRowDelete.component";
import {legacyCodeItemNameComponent} from "../../../common/legacy_item.component";
import {numericRequiredEditorComponent} from "../../../editor/numericRequiredEditor.component";

import { indentCreateModel } from '../../../../models/indent/indentCreate.model';

@Component({
  selector: 'app-create-indent',
  templateUrl: './create-indent.component.html'
})


export class createIndentComponent implements OnInit {
	
	public itemGroup: any = [];
	public departments: any ;
	public departmentoption : any = [];
	public items: any ;
	public units: any ;
	public indentType: any ;
	public indenttypeoption : any = [];
	public itemQuality: any ;
	public indentCreateModel: indentCreateModel = new indentCreateModel();
	public addedItems: any  = [];
	public subItems:any = [];
	public createIndentResponseData: any;
	public Stock : number = 0;
	public avgconsump : number = 0;
	public StockUnit : string;
	public sessionData: any;
	public totalPercentile : number = 0;
	public errorMsg : string = "";
	public successMsg : string = "";
	
	public requestedURL : any;
	public userGroupData : any = '';
	public userMenuData : any = '';
	public userSelectionMenuData : any = [];
	
	public gridOptions: GridOptions;
	public hideCol : boolean = true;
	public searchMode : boolean = true;
	public myOptions:any = []; 
	public itemgroupOptions:any = [];
	
	public columnDef : any = [
		{headerName: "Item Group", field: "itemGroup.name", suppressMenu: true, minWidth : 250},
		{headerName: "Item Descrption", field: "item.name", suppressMenu: true, minWidth : 250, cellRendererFramework: legacyCodeItemNameComponent},
		{headerName: "Quality", field: "quality.name", suppressMenu: true, minWidth : 250, hide : this.hideCol},
		{headerName: "Department", field: "department.name", suppressMenu: true, minWidth : 250},
		{headerName: "Stock", field: "stock", suppressMenu: true, minWidth : 250, valueFormatter: function (params) {
			return parseFloat(parseFloat(params.value).toFixed(2));
		}},
		{headerName: "Quantity", field: "indentQuantity", suppressMenu: true,  editable : true, minWidth : 200, cellEditorFramework : numericRequiredEditorComponent, valueFormatter: function (params) {
			return parseFloat(parseFloat(params.value).toFixed(2));
		}},
		{headerName: "Unit", field: "quantityUnit.name", suppressMenu: true, minWidth : 250},
		{headerName: "Raised By", field: "submitter", suppressMenu: true, minWidth : 250},
		{headerName: "Additional Requirement", field: "additionalRequirement", suppressMenu: true, minWidth : 350, editable : true, cellEditor : 'largeText'},
		{headerName: "Delete", field: "", suppressMenu: true, minWidth : 80, maxWidth : 80, width : 80, cellRendererFramework: gridDeleteComponent}
	];
	
	
	public onQuickFilterChanged($event) {
        this.gridOptions.api.setQuickFilter($event.target.value);
    }
	
	
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
			 if(clickedItem == "remove"){self.deleteItem(params.node.id)};
		 };
		 this.gridOptions.rowClassRules = {
			'rag-green-outer': function(params){ if(params.data.indentQuantity > 0){return true}else{return false}},
			'rag-red-outer': function(params){ if(params.data.indentQuantity <= 0){return true}else{return false}}
		};
	}
		
	ngOnInit() {
		this.getSession();
		this.getindentTypes();
		this.loadUnits();
		//this.loadItemGroups();
		this.loadDepartments();
		this.getUserGroup();
		
	}
	
	//get session details
	getSession = function(){
		this.sessionData = this.session.getSessionDetails();
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
			() => {}
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
				
			}
		);
	}
	
	//load All Departments
	loadDepartments = function() {
		var self = this;
		self.errorMsg = "";
	    self.successMsg = "";
		this.http.getAllDepartments()
			.subscribe(
			(data) => {
				self.departments = data;
			},
			(error) => self.errorMsg = error,
			() => {
				for(var i = 0; i<self.departments.length; i++){
					if(self.departments[i].name != 'JUTE'){
					var createObj = {
							value : i,
							label : self.departments[i].name
						};
						self.departmentoption.push(createObj);
					}
				}
			}
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
			() => console.log("completed")
		);
	}
	
	
	//load all indent types
	getindentTypes = function(){
		var self = this;
		
		this.http.getIndentTypes()
			.subscribe(
			(data) => {
				self.indentType = data;
			},
			(error) => self.errorMsg = error,
			() =>{
				for(var i = 0; i<self.indentType.length; i++){
					if(self.indentType[i].code != 'J'){
					var createObj = {
							value : self.indentType[i].code,
							label : self.indentType[i].name
						};
						self.indenttypeoption.push(createObj);
					}
				}
			}
		);
	}
	
	//load item description based on group selection
	loadItemDesc = function(e){
		var self = this;
		$("#page_loader_service").fadeIn();
		self.searchMode = true;
		self.indentCreateModel.searchitemstring = "";
		self.indentCreateModel.selectedItem = "";
		self.myOptions = [];
		 self.errorMsg = "";
	  self.successMsg = "";
		self.StockUnit = "";
		if(self.indentCreateModel.selectedItemGroup != ''){
		var selectedGroup = self.itemGroup[self.indentCreateModel.selectedItemGroup].id;
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
				$("#page_loader_service").fadeOut();
			}
		);
		}else{
			self.items = [];
			$("#page_loader_service").fadeOut();
		}
	}
	
	generateStock = function(item){
		var self = this;
		self.itemQuality = [];
		self.Stock = "";
		self.avgconsump = "";
		if(item.value != ''){
		self.Stock = self.items[item.value].stock;
		self.avgconsump = self.items[item.value].avgConsumption;
		}
		if(self.indentCreateModel.selectedIndentType == "J"){
		self.loadItemQuality(self.items[item.value].id);
		}
	
	}
	
	
	
	addItems = function(){
		var self = this;
		var duplicate = false;
		self.errorMsg = "";
	  self.successMsg = "";
		if(self.indentCreateModel.selectedIndentType == "J"){
			if(self.indentCreateModel.selectedItemGroup == '' || self.indentCreateModel.selectedItem == '' || self.indentCreateModel.selectedDepartment == '' || self.indentCreateModel.selectedQuantity == '' ||  self.indentCreateModel.selectedQuality == ''){
				self.errorMsg = "All Fields are Mandatory.";
			}else{
				
				
				
				var createdObj = {
					"department" 	: self.departments[self.indentCreateModel.selectedDepartment],
					"itemGroup" 	: self.itemGroup[self.indentCreateModel.selectedItemGroup],
					"item" 			: self.items[self.indentCreateModel.selectedItem],
					"quantityUnit" 	: self.items[self.indentCreateModel.selectedItem].quantityUnit,
					"stock" 		: self.items[self.indentCreateModel.selectedItem].stock,
					"indentQuantity": parseFloat(self.indentCreateModel.selectedQuantity),
					"indentCancelledQuantity" 	: 0,
					"status" 		: "1",
					"submitter" 	: self.sessionData.sessionId,
					"quality" 		: self.itemQuality[self.indentCreateModel.selectedQuality],
					"additionalRequirement" : ""
				};
				
				for(var i = 0; i < self.addedItems.length; i++){
					if(self.addedItems[i].item.id == createdObj.item.id){duplicate = true;}
				}
				
				if(duplicate){
					self.errorMsg = "Duplicate Entry is not allowed.";
				}else{self.addedItems.push(createdObj);}
				
				self.indentCreateModel.selectedItem = "";
				self.myOptions = [];
				self.indentCreateModel.selectedQuantity= "";
				self.indentCreateModel.selectedItemGroup = "111";
					self.indentCreateModel.selectedDepartment = "2";
					self.indentCreateModel.selectedUnit = "4";
					self.indentCreateModel.selectedQuality= "";
					self.itemQuality = [];
					self.searchMode = true;
	  self.indentCreateModel.searchitemstring = "";
	  self.indentCreateModel.selectedDepartment = "";
					
			}
		}else{
			if(self.indentCreateModel.selectedItemGroup == '' || self.indentCreateModel.selectedItem == '' || self.indentCreateModel.selectedDepartment == '' || self.indentCreateModel.selectedQuantity == ''){
				self.errorMsg = "All Fields are Mandatory.";
			}else{
				
				
				
				var createdObj = {
					"department" 	: self.departments[self.indentCreateModel.selectedDepartment],
					"itemGroup" 	: self.itemGroup[self.indentCreateModel.selectedItemGroup],
					"item" 			: self.items[self.indentCreateModel.selectedItem],
					"quantityUnit" 	: self.items[self.indentCreateModel.selectedItem].quantityUnit,
					"stock" 		: self.items[self.indentCreateModel.selectedItem].stock,
					"indentQuantity": parseFloat(self.indentCreateModel.selectedQuantity),
					"indentCancelledQuantity" 	: 0,
					"status" : "1",
					"submitter" : self.sessionData.sessionId,
					"quality" : null,
					"additionalRequirement" : ""
				};
				for(var i = 0; i < self.addedItems.length; i++){
					if(self.addedItems[i].item.id == createdObj.item.id){duplicate = true;}
				}
				
				if(duplicate){
					self.errorMsg = "Duplicate Entry is not allowed.";
				}else{self.addedItems.push(createdObj);}
				self.indentCreateModel.selectedItemGroup = "";
				self.indentCreateModel.selectedItem = "";
				self.myOptions = [];
				self.indentCreateModel.selectedUnit = "";
				self.indentCreateModel.selectedQuantity= "";
				self.indentCreateModel.selectedQuality = "";
				self.items = [];
				self.itemQuality = [];
				self.searchMode = true;
	  self.indentCreateModel.searchitemstring = "";
	  self.indentCreateModel.selectedDepartment = "";
			}
		}
		if(typeof self.gridOptions.api != 'undefined'){
			self.gridOptions.api.setRowData(self.addedItems);
		}
	}
	
	
	

	
	deleteItem = function(indexdId){
		var self = this;
		
		
		self.addedItems.splice(indexdId, 1);
		this.gridOptions.api.setRowData(self.addedItems);
	}
	
	createIndent = function(){
		$("#page_loader_service").fadeIn();
		var self = this;
		var today = new Date();
		self.createIndentPostData.indentHeader.type = self.indentCreateModel.selectedIndentType;
		self.createIndentPostData.indentHeader.status = "1";
		self.createIndentPostData.indentHeader.mukam = null;
		self.createIndentPostData.indentHeader.vehicleTypeId = -1;
		self.createIndentPostData.indentHeader.vehicleQuantity = -1;
		self.createIndentPostData.indentHeader.submitter = self.sessionData.sessionId;
		self.createIndentPostData.indentHeader.finnacialYear = today.getFullYear();
		self.createIndentPostData.indentHeader.createDate = today.getTime();
		self.createIndentPostData.indentHeader.indentDate = today.getTime();
		self.createIndentPostData.indentList = self.addedItems;
		
		this.http.createIndent(self.createIndentPostData)
			.subscribe(
			(data) => {
				self.createIndentResponseData = data;
			},
			(error) => self.errorMsg = error,
			() => {
				self.successMsg = "Indent No. "+self.createIndentResponseData.indentHeader.id+" Created Successfully.",
				self.addedItems.length = 0,
				self.indentCreateModel.selectedItemGroup = "",
				self.indentCreateModel.selectedItem = "",
				self.myOptions.length = 0,
				self.itemgroupOptions.length = 0,
				self.indentCreateModel.selectedDepartment = "",
				self.indentCreateModel.selectedUnit = "",
				self.indentCreateModel.selectedQuantity= "",
				self.indentCreateModel.selectedIndentType = "",
				self.indentCreateModel.selectedQuality = "",
				self.items.length = 0,
				self.itemQuality.length = 0,
				self.searchMode = true,
				self.indentCreateModel.searchitemstring = ""
				
				$("#page_loader_service").fadeOut();
			}
		);
	}
	
	

  
  //load item quality
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
  
  
  departmentChange = function(e){
	  var self = this;
	  $("#page_loader_service").fadeIn();
	 self.indentCreateModel.selectedItemGroup = "";
	self.itemgroupOptions = [];
	  var selectedVal = e.value;
	  self.itemGroup.length = 0;
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
						label : self.itemGroup[i].id + "_" + self.itemGroup[i].name
					};
					self.itemgroupOptions.push(createObj);
				}
				
				
				self.subItems.length = 0;
				self.itemQuality = [];
				self.indentCreateModel.selectedItemGroup = "";
				self.indentCreateModel.selectedItem = "";
				self.myOptions = [];
				self.indentCreateModel.selectedUnit = "";
				self.indentCreateModel.selectedQuantity= "";
				self.searchMode = true;
				self.indentCreateModel.searchitemstring = "";
				$("#page_loader_service").fadeOut();
			}
		);
	  
	  
	  
  }
    
  
  
  //change indent type
  
  indentTypeChange = function(e){
	  var self = this;
	  var selectedVal = e.value;
	  self.addedItems.length = 0;
	  self.subItems.length = 0;
	  self.itemQuality = [];
	  self.indentCreateModel.selectedItemGroup = "";
	  self.indentCreateModel.selectedItem = "";
	  self.myOptions = [];
	   self.indentCreateModel.selectedUnit = "";
	  self.indentCreateModel.selectedQuantity= "";
	  self.searchMode = true;
	  self.indentCreateModel.searchitemstring = "";
	  self.indentCreateModel.selectedDepartment = "";
	  self.itemgroupOptions = [];
	  self.errorMsg = "";
	  self.successMsg = "";
	  
	  if(selectedVal == 'J'){
		  //self.loadItemQuality();
		  self.hideCol = false;
			self.columnDef = [
		{headerName: "Item Group", field: "itemGroup.name", suppressMenu: true, minWidth : 250},
		{headerName: "Item Descrption", field: "item.name", suppressMenu: true, minWidth : 250, cellRendererFramework: legacyCodeItemNameComponent},
		{headerName: "Quality", field: "quality.name", suppressMenu: true, minWidth : 250, hide : this.hideCol},
		{headerName: "Department", field: "department.name", suppressMenu: true, minWidth : 250},
		{headerName: "Stock", field: "stock", suppressMenu: true, minWidth : 250, valueFormatter: function (params) {
			return parseFloat(parseFloat(params.value).toFixed(2));
		}},
		{headerName: "Quantity", field: "indentQuantity", suppressMenu: true, minWidth : 250, valueFormatter: function (params) {
			return parseFloat(parseFloat(params.value).toFixed(2));
		}},
		{headerName: "Unit", field: "quantityUnit.name", suppressMenu: true, minWidth : 250},
		{headerName: "Raised By", field: "submitter", suppressMenu: true, minWidth : 250},
		{headerName: "Additional Requirement", field: "additionalRequirement", suppressMenu: true, minWidth : 350, editable : true, cellEditor : 'largeText'},
		{headerName: "Delete", field: "", suppressMenu: true, minWidth : 80, maxWidth : 80, width : 80, cellRendererFramework: gridDeleteComponent}
	];
		  self.itemQuality = [];
		  self.indentCreateModel.selectedItemGroup = "111";
		  self.indentCreateModel.selectedDepartment = "2";
		  self.indentCreateModel.selectedUnit = "4";
		  this.http.getItemDescByGrpId(self.itemGroup[self.indentCreateModel.selectedItemGroup].id)
			.subscribe(
			(data) => {
				self.items = data.items;
			},
			(error) => {self.errorMsg = error, self.items = []},
			() => console.log("completed")
		);
		  
	  }
	}
	
	
	selectItem = function(id){
		var self = this;
		var selectedLegacy = id; 
		for(var i = 0; i < self.items.length; i++){
			if(self.items[i].legacyItemCode == selectedLegacy){
				self.indentCreateModel.selectedItem = i.toString();
				self.searchMode = false;
				self.indentCreateModel.searchitemstring = self.items[i].legacyItemCode+"_"+self.items[i].name;
				self.generateStock(i);
				}
		}
	}
	
	refreshSearchOptions = function(){
		var self = this;
		self.searchMode = true;
		self.indentCreateModel.selectedItem = "";
	}
	
	
	saveIndent=function(){
		$("#page_loader_service").fadeIn();
		var self = this;
		var today = new Date();
		self.createIndentPostData.indentHeader.type = self.indentCreateModel.selectedIndentType;
		self.createIndentPostData.indentHeader.status = "21";
		self.createIndentPostData.indentHeader.mukam = null;
		self.createIndentPostData.indentHeader.vehicleTypeId = -1;
		self.createIndentPostData.indentHeader.vehicleQuantity = -1;
		self.createIndentPostData.indentHeader.submitter = self.sessionData.sessionId;
		self.createIndentPostData.indentHeader.finnacialYear = today.getFullYear();
		self.createIndentPostData.indentHeader.createDate = today.getTime();
		self.createIndentPostData.indentHeader.indentDate = today.getTime();
		self.createIndentPostData.indentList = self.addedItems;
		
		this.http.createIndent(self.createIndentPostData)
			.subscribe(
			(data) => {
				self.createIndentResponseData = data;
			},
			(error) => self.errorMsg = error,
			() => {
				self.successMsg = "Indent No. "+self.createIndentResponseData.indentHeader.id+" Saved Successfully.",
				self.addedItems.length = 0,
				self.indentCreateModel.selectedItemGroup = "",
				self.indentCreateModel.selectedItem = "",
				self.myOptions.length = 0,
				self.itemgroupOptions.length = 0,
				self.indentCreateModel.selectedDepartment = "",
				self.indentCreateModel.selectedUnit = "",
				self.indentCreateModel.selectedQuantity= "",
				self.indentCreateModel.selectedIndentType = "",
				self.indentCreateModel.selectedQuality = "",
				self.items.length = 0,
				self.itemQuality.length = 0,
				self.searchMode = true,
				self.indentCreateModel.searchitemstring = "",
				$("#page_loader_service").fadeOut()
				
			}
		);
	}
  
  
  
}
