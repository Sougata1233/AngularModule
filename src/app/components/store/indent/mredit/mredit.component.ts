import { Component, OnInit, AfterViewInit } from '@angular/core';
import * as $ from 'jquery';

import { HttpTestService } from '../../../../services/http.service';
import { sessionServices } from '../../../../services/session.services';
import { Router, ActivatedRoute } from '@angular/router';
import {Observable} from 'rxjs/Rx';
import {GridOptions} from "ag-grid/main";
import {gridDeleteComponent} from "../../../common/gridRowDelete.component";
import {legacyCodeItemNameComponent} from "../../../common/legacy_item.component";

import { indentCreateModel } from '../../../../models/indent/indentCreate.model';

@Component({
  selector: 'app-create-mr-indent',
  templateUrl: './mredit.component.html'
})


export class mreditComponent implements OnInit {
	
	public sub: any;
	public requestedId: string;
	public mukams: any ;
	public sessionData: any;
	public itemData : any = [];
	public allVehicles : any = [];
	public itemQuality: any ;
	public looseMaxVal : number = 100; 
	public baleMaxVal : number = 0;
	public departments: any ;
	public juteDept: any ;
	public itemGroup: any ;
	public juteItemGrp: any ;
	public units: any ;
	public Qunits: any ;
	public gridOptions: GridOptions;
	public indentCreateModel: indentCreateModel = new indentCreateModel();
	public addedItems: any  = [];
	public Math : any;
	public indentDetailData : any = "";
	
	
	
	
	
	
	public subItems:any = [];
	public createIndentResponseData: any;
	public Stock : number = 0;
	public StockUnit : string;
	
	public totalPercentile : number = 0;
	public errorMsg : string = "";
	public successMsg : string = "";
	
	public requestedURL : any;
	public userGroupData : any = '';
	public userMenuData : any = '';
	public userSelectionMenuData : any = [];
	
	
	public columnDef : any = [
		{headerName: "status", field: "status", hide:true, filter:"text"},
		{headerName: "Item Group", field: "itemGroup.name", suppressMenu: true, minWidth : 250},
		{headerName: "Jute Type", field: "item.name", suppressMenu: true, minWidth : 250, cellRendererFramework: legacyCodeItemNameComponent},
		{headerName: "Quality", field: "quality.name", suppressMenu: true, minWidth : 250},
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
	
	
	
	constructor(public http: HttpTestService, public router: Router, public activatedRoute: ActivatedRoute, public session: sessionServices) { 
		var self = this;
		self.Math = Math;
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
			athleteFilterComponent.setModel({
						type:'equals',
						filter:'1'
						});
			params.api.onFilterChanged()
    };
		 this.gridOptions.onRowClicked = function(params) {
			 var clickedItem = $(params.event.target).attr("data-action-type");
			 //var typeofTarget = $(clickedItem.getAttribute("data-action-type");
			 if(clickedItem == "remove"){self.deleteItem(params.node.id)}
		 };
		 this.gridOptions.rowClassRules = {
			'rag-green-outer': function(params){ if(params.data.indentQuantity > 0){return true}else{return false}},
			'rag-red-outer': function(params){ if(params.data.indentQuantity <= 0){return true}else{return false}}
		};
	}
		
	ngOnInit() {
		this.sub = this.activatedRoute.params.subscribe(params => {
			this.requestedId = params['id'];
		});
		this.getSession();
		this.getAllMukams();
		this.getAllVehicles();
		this.loadDepartments();
		this.loadUnits();
		this.loadItemGroups();
		
		this.getUserGroup();
		
	}
	
	//get session details
	getSession = function(){
		this.sessionData = this.session.getSessionDetails();
	}
	
	
	validatePOQuantity = function(e){
		var self = this;
		self.errorMsg = "";
		self.successMsg = "";
		self.indentCreateModel.conversiontype = "LOOSE";
		self.indentCreateModel.selectedQuality = "";
		self.indentCreateModel.selectedQuantity = "";
		self.indentCreateModel.selectedItem = "";
		self.looseMaxVal = 100;
		self.baleMaxVal = 0;
		self.addedItems = [];
		self.itemQuality = [];
		var selectedVal = e.target.value;
		var maxNumber = (self.indentCreateModel.vehicleQuantity * self.allVehicles[self.indentCreateModel.vehicleType].weight);
		var minNumber = 1;
		if(self.allVehicles[self.indentCreateModel.vehicleType].vehicleType == "LARGE"){
			var index;
			for(var i = 0; i < self.allVehicles.length; i++){
				if(self.allVehicles[i].vehicleType == "BIG"){index = i}
			}
			
			minNumber = (self.indentCreateModel.vehicleQuantity * self.allVehicles[index].weight) + 1;
		}
		if(self.allVehicles[self.indentCreateModel.vehicleType].vehicleType == "BIG"){
			var index;
			for(var i = 0; i < self.allVehicles.length; i++){
				if(self.allVehicles[i].vehicleType == "MEDIUM"){index = i}
			}
			
			minNumber = (self.indentCreateModel.vehicleQuantity * self.allVehicles[index].weight) + 1;
		}
		if(self.allVehicles[self.indentCreateModel.vehicleType].vehicleType == "MEDIUM"){
			var index;
			for(var i = 0; i < self.allVehicles.length; i++){
				if(self.allVehicles[i].vehicleType == "SMALL"){index = i}
			}
			
			minNumber = (self.indentCreateModel.vehicleQuantity * self.allVehicles[index].weight) + 1;
		}
		
		if(selectedVal > maxNumber){
			self.indentCreateModel.poQuantity = maxNumber;
		}
		
		if(selectedVal < minNumber){
			self.indentCreateModel.poQuantity = minNumber;
		}
	}
	
	
	
	//get all mukams
	
	getAllMukams = function(){
		this.http.getAllMukams()
		  .subscribe(
			(data) => {
			  this.mukams = data;
			  },
			(error) => {
				this.errorMsg = error;
				this.mukams = "";
			},
			() => {}
		  );
	}
	
	//get items by mukam
	getItems = function(val,e){
		$("#page_loader_service").fadeIn();
		var self = this;
		self.errorMsg = "";
	  self.successMsg = "";
		self.addedItems.length = 0;
		self.indentCreateModel.vehicleType = "";
		self.indentCreateModel.conversiontype = "LOOSE";
		self.indentCreateModel.selectedItem = "";
		self.indentCreateModel.vehicleQuantity= 1;
		self.indentCreateModel.selectedQuality = "";
		self.indentCreateModel.selectedQuantity = "";
		self.itemData = [];
		self.indentCreateModel.selectedItem = "";
		self.itemQuality = [];
		self.looseMaxVal = 100; 
		self.baleMaxVal = 0;
		self.indentCreateModel.poQuantity = 0;
		if(val != undefined || !val){
			var selectedMukam = val;
		}else{
			var selectedMukam = e.target.value;
		}
		
		this.itemData.length = 0;
		this.http.getAllItemsByMukams(self.mukams[selectedMukam].mukamId)
		  .subscribe(
			(data) => {
			  this.itemData = data;
			  },
			(error) => {
				this.errorMsg = error;
				this.itemData.length = 0;
				$("#page_loader_service").fadeOut();
			},
			() => {$("#page_loader_service").fadeOut();}
		  );
	}
	
	//get all vehicles
	getAllVehicles = function(){
		this.errorMsg = "";
	    this.successMsg = "";
		this.http.getAllVehicles()
		  .subscribe(
			(data) => {
			  this.allVehicles = data;
			  },
			(error) => {
				this.errorMsg = error;
				this.allVehicles = "";
			},
			() => {}
		  );
	}
	
	//get quality by item
	getQuality = function(e){
		var self = this;
		self.errorMsg = "";
	  self.successMsg = "";
		//self.addedItems.length = 0;
		//self.indentCreateModel.vehicleType = "";
		//self.indentCreateModel.conversiontype = "LOOSE";
		//self.indentCreateModel.vehicleQuantity= 1;
		self.indentCreateModel.selectedQuality = "";
		self.indentCreateModel.selectedQuantity = "";
		self.itemQuality = [];
		//self.looseMaxVal = 100; 
		//self.baleMaxVal = 0;
		//self.indentCreateModel.poQuantity = 0;
		var selectedItem = e.target.value;
		this.http.getAllQuality(self.itemData.items[selectedItem].id)
			.subscribe(
			(data) => {
				self.itemQuality = data;
			},
			(error) => self.errorMsg = error,
			() => console.log("completed")
		);
	}
	
	vehicletypechange = function(){
		var self = this;
		self.errorMsg = "";
	  self.successMsg = "";
		self.addedItems.length = 0;
		self.indentCreateModel.conversiontype = "LOOSE";
		self.indentCreateModel.selectedItem = "";
		self.indentCreateModel.vehicleQuantity= 1;
		self.indentCreateModel.selectedQuality = "";
		self.indentCreateModel.selectedQuantity = "";
		self.indentCreateModel.selectedItem = "";
		self.itemQuality = [];
		self.looseMaxVal = 100; 
		self.baleMaxVal = 0;
		self.indentCreateModel.poQuantity = 0;
		self.updateBale();
	}
	
	changecontype = function(){
		var self = this;
		self.errorMsg = "";
	  self.successMsg = "";
		self.addedItems.length = 0;
		self.indentCreateModel.selectedItem = "";
		self.indentCreateModel.selectedQuality = "";
		self.indentCreateModel.selectedQuantity = "";
		self.itemQuality = [];
		self.looseMaxVal = 100; 
		this.baleMaxVal = Math.round((self.indentCreateModel.poQuantity)/1.5);
	}
	
	vehicleQuanchange = function(){
		var self = this;
		self.errorMsg = "";
	  self.successMsg = "";
		self.addedItems.length = 0;
		self.indentCreateModel.conversiontype = "LOOSE";
		self.indentCreateModel.selectedItem = "";
		self.indentCreateModel.selectedQuality = "";
		self.indentCreateModel.selectedQuantity = "";
		self.indentCreateModel.selectedItem = "";
		self.itemQuality = [];
		self.looseMaxVal = 100; 
		self.indentCreateModel.poQuantity = 0;
		self.updateBale();
	}
	
	updateBale = function(){
		var self = this;
		if(this.indentCreateModel.vehicleType != ''){
		this.indentCreateModel.poQuantity = this.indentCreateModel.vehicleQuantity * this.allVehicles[this.indentCreateModel.vehicleType].weight;
		this.baleMaxVal = Math.round((self.indentCreateModel.poQuantity)/1.5);
		}
	}
	
	addItems = function(){
		var self = this;
		var duplicate = false;
		self.errorMsg = "";
	  self.successMsg = "";
		
		if(self.indentCreateModel.mrMukam == '' || self.indentCreateModel.vehicleType == '' || self.indentCreateModel.conversiontype == '' || self.indentCreateModel.selectedItem == '' ||  self.indentCreateModel.selectedQuality == ''){
				self.errorMsg = "All Fields are Mandatory.";
			}else{
				
				var itemQuantity = 0;
				if(self.indentCreateModel.conversiontype =='LOOSE'){
					itemQuantity = (self.indentCreateModel.poQuantity) * self.indentCreateModel.selectedQuantity/100;
					self.looseMaxVal = self.looseMaxVal - self.indentCreateModel.selectedQuantity;
				}else{
					itemQuantity = self.indentCreateModel.selectedQuantity * 1.5;
					self.baleMaxVal = self.baleMaxVal - self.indentCreateModel.selectedQuantity;
				}
				
				
				var createdObj = {
					"department" 	: self.juteDept,
					"itemGroup" 	: self.juteItemGrp,
					"item" 			: self.itemData.items[self.indentCreateModel.selectedItem],
					"quantityUnit" 	: self.Qunits,
					"stock" 		: self.itemData.items[self.indentCreateModel.selectedItem].stock,
					"indentQuantity": parseFloat(itemQuantity.toFixed(2)),
					"indentCancelledQuantity" 	: 0,
					"status" 		: "1",
					"submitter" 	: self.sessionData.sessionId,
					"quality" 		: self.itemQuality[self.indentCreateModel.selectedQuality],
					// "unitConversionType" : self.indentCreateModel.conversiontype,
					// "conversionQuantity" : self.indentCreateModel.selectedQuantity,
					"additionalRequirement":null
				};
				for(var i = 0; i < self.addedItems.length; i++){
					if(self.addedItems[i].item.id == createdObj.item.id && self.addedItems[i].quality.id == createdObj.quality.id && self.addedItems[i].status != "4"){duplicate = true;}
				}
				
				if(duplicate){
					self.errorMsg = "Duplicate Entry is not allowed.";
					if(self.indentCreateModel.conversiontype =='LOOSE'){
						self.looseMaxVal = self.looseMaxVal + self.indentCreateModel.selectedQuantity;
					}else{
						self.baleMaxVal = self.baleMaxVal + self.indentCreateModel.selectedQuantity;
					}
				}else{self.addedItems.push(createdObj);}
				self.indentCreateModel.selectedQuality= "";
				self.indentCreateModel.selectedQuantity = null;
				self.indentCreateModel.selectedItem = "";
				self.itemQuality = [];
			}
		if(typeof self.gridOptions.api != 'undefined'){
			self.gridOptions.api.setRowData(self.addedItems);
			var athleteFilterComponent = self.gridOptions.api.getFilterInstance("status");
		athleteFilterComponent.setModel({
						type:'equals',
						filter:'1'
						});
			self.gridOptions.api.onFilterChanged();
		}
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
				for (var i = 0; i < self.departments.length; i++ ){
					if(self.departments[i].name == "JUTE"){
						self.juteDept = self.departments[i];
					}
				}
			}
		);
	}
	
	
	
	loadIndentDetrails = function() {
		$("#page_loader_service").fadeIn();
		var self = this;
		this.http.getIndentData(this.requestedId)
			.subscribe(
			(data) => {
				self.indentDetailData = data;
				//self.indentDetailDataOld = data;
			},
			(error) => self.errorMsg = error,
			() => {
				
				for(var i = 0; i<self.mukams.length; i++){
					if(self.mukams[i].mukamId == self.indentDetailData.indentHeader.mukam){self.indentCreateModel.mrMukam = i.toString()}
				}
				self.getItems(self.indentCreateModel.mrMukam);
				for(var i = 0; i<self.allVehicles.length; i++){
					if(self.allVehicles[i].id == self.indentDetailData.indentHeader.vehicleTypeId){self.indentCreateModel.vehicleType = i.toString()}
				}
				self.vehicletypechange();
				self.indentCreateModel.vehicleQuantity = self.indentDetailData.indentHeader.vehicleQuantity;
				self.addedItems = self.indentDetailData.indentList;
				self.indentCreateModel.poQuantity = self.indentCreateModel.vehicleQuantity * self.allVehicles[self.indentCreateModel.vehicleType].weight;
				self.looseMaxVal = 100;
				for(var i = 0; i<self.addedItems.length; i++){
					if(self.addedItems[i].status != "4"){
					self.looseMaxVal = self.looseMaxVal - ((self.addedItems[i].indentQuantity/self.indentCreateModel.poQuantity)*100);
					}
				}
				
				$("#page_loader_service").fadeOut();
			}
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
				for (var i = 0; i < self.itemGroup.length; i++ ){
					if(self.itemGroup[i].name == "JUTE"){
						self.juteItemGrp = self.itemGroup[i];
					}
				}
				self.loadIndentDetrails();
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
			() => {
				for (var i = 0; i < self.units.length; i++ ){
					if(self.units[i].id == "QNT"){
						self.Qunits = self.units[i];
					}
				}
			}
		);
	}
	
	createIndent = function(){
		$("#page_loader_service").fadeIn();
		var self = this;
		var today = new Date();
		self.indentDetailData.indentHeader.type = "J";
		self.indentDetailData.indentHeader.status = "1";
		self.indentDetailData.indentHeader.mukam = self.mukams[self.indentCreateModel.mrMukam].mukamId;
		self.indentDetailData.indentHeader.vehicleTypeId = self.allVehicles[self.indentCreateModel.vehicleType].id;
		self.indentDetailData.indentHeader.vehicleQuantity = self.indentCreateModel.vehicleQuantity;
		self.indentDetailData.indentHeader.submitter = self.sessionData.sessionId;
		self.indentDetailData.indentHeader.finnacialYear = today.getFullYear();
		self.indentDetailData.indentHeader.createDate = today.getTime();
		self.indentDetailData.indentHeader.indentDate = today.getTime();
		self.indentDetailData.indentList = self.addedItems;
		
		this.http.updateIndent(self.indentDetailData)
			.subscribe(
			(data) => {
				self.createIndentResponseData = data;
			},
			(error) => self.errorMsg = error,
			() => {
				self.successMsg = "Indent Created Successfully.",
				self.router.navigate(['jute']),
				$("#page_loader_service").fadeOut()
				
				
			}
		);
	}
	
	
	
	
	
	saveIndent = function(){
		var self = this;
		$("#page_loader_service").fadeIn();
		var today = new Date();
		self.indentDetailData.indentHeader.type = "J";
		self.indentDetailData.indentHeader.status = "21";
		self.indentDetailData.indentHeader.mukam = self.mukams[self.indentCreateModel.mrMukam].mukamId;
		self.indentDetailData.indentHeader.vehicleTypeId = self.allVehicles[self.indentCreateModel.vehicleType].id;
		self.indentDetailData.indentHeader.vehicleQuantity = self.indentCreateModel.vehicleQuantity;
		self.indentDetailData.indentHeader.submitter = self.sessionData.sessionId;
		self.indentDetailData.indentHeader.finnacialYear = today.getFullYear();
		self.indentDetailData.indentHeader.createDate = today.getTime();
		self.indentDetailData.indentHeader.indentDate = today.getTime();
		self.indentDetailData.indentList = self.addedItems;
		
		this.http.updateIndent(self.indentDetailData)
			.subscribe(
			(data) => {
				self.createIndentResponseData = data;
			},
			(error) => self.errorMsg = error,
			() => {
				self.successMsg = "Indent Saved Successfully.",
				self.router.navigate(['jute']),
				$("#page_loader_service").fadeOut()
				
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
			() => {}
		  );
	}
	
	deleteItem = function(indexdId){
		var self = this;
		self.errorMsg = "";
	  self.successMsg = "";
		if(self.indentCreateModel.conversiontype =='LOOSE'){
			self.looseMaxVal = self.looseMaxVal + (self.addedItems[indexdId].indentQuantity*100)/(self.indentCreateModel.poQuantity);
		}else{
			self.baleMaxVal = self.baleMaxVal + (self.addedItems[indexdId].indentQuantity/1.5);
		}
		self.addedItems[indexdId].status='4';
		this.gridOptions.api.setRowData(self.addedItems);
		var athleteFilterComponent = this.gridOptions.api.getFilterInstance("status");
		athleteFilterComponent.setModel({
						type:'equals',
						filter:'1'
						});
			this.gridOptions.api.onFilterChanged();
	}
	
}
