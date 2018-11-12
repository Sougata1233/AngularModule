import { Component, OnInit, AfterViewInit } from '@angular/core';
import * as $ from 'jquery';

import { HttpTestService } from '../../../services/http.service';
import { AppSettings } from '../../../config/settings/app-settings';
import { sessionServices } from '../../../services/session.services';
import { Router, ActivatedRoute} from '@angular/router';
import {Observable} from 'rxjs/Rx';

import {GridOptions} from "ag-grid/main";
	import {gridConversionComponentBale} from "../../common/gridBaleConvertion.Component";
	import {gridConversionComponentPer} from "../../common/gridPerConvertion.Component";
	import {gridPOTotPriceComponent} from "../../common/PurchaseTotalPrice.Component";
	import {gridPOPyblPriceComponent} from "../../common/PurchasePayablePrice.Component";
	import {legacyCodeItemNameComponent} from "../../common/legacy_item.component";

import { indentCreateModel } from '../../../models/indent/indentCreate.model';

@Component({
  selector: 'app-create-indent',
  templateUrl: './inviteVendorDetailsComponent.component.html'
})


export class inviteVendorDetailsComponent implements OnInit {
	
	
	public sub: any;
	public requestedId: string;
	public indentDetailData : any;
	public vendorAllData : any = [];
	public vendornofilterdata : any = [];
	public vendorSelectedData : any = [];
	public allVendorSelection : any = [];
	public selectedVendorSelection : any = [];
	public statusChangeResponsedata : any;
	
	public successMsg: string ;
	public errorMsg: string ;
	public requestedURL : any;
	public userGroupData : any = '';
	public userMenuData : any = '';
	public userSelectionMenuData : any = [];
	public sessionData: any;
	public startingNumber : any;
	public prefix : string = '';
	
	public gridOptions: GridOptions;
	public hideCol: boolean = true;
	
	public columnDef : any = [
		{headerName: "status", field: "status", hide:true, filter:"text"},
		{headerName: "Item Group", field: "itemGroup.name", suppressMenu: true, minWidth : 350},
		{headerName: "Item Descrption", field: "item.name", suppressMenu: true, minWidth : 350, cellRendererFramework: legacyCodeItemNameComponent},
		{headerName: "Quality", field: "quality.name", suppressMenu: true, hide : this.hideCol, minWidth : 250},
		{headerName: "Department", field: "department.name", suppressMenu: true, minWidth : 350},
		{headerName: "Stock", field: "item.stock", suppressMenu: true, minWidth : 250, valueFormatter: function (params) {
			return parseFloat(parseFloat(params.value).toFixed(2));
		}},
		{headerName: "Quantity", field: "indentQuantity", suppressMenu: true, minWidth : 250, valueFormatter: function (params) {
			return parseFloat(parseFloat(params.value).toFixed(2));
		}},
		{headerName: "Unit", field: "quantityUnit.name", suppressMenu: true, minWidth : 250},
		{headerName: "Additional Requirement", field: "additionalRequirement", suppressMenu: true, minWidth : 350}
	];
	
	public onQuickFilterChanged($event) {
        this.gridOptions.api.setQuickFilter($event.target.value);
    }
	
	constructor(public http: HttpTestService, public activatedRoute: ActivatedRoute, public router: Router, public session: sessionServices) {
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
		 this.gridOptions.onGridReady = function(params){
			 var athleteFilterComponent = params.api.getFilterInstance("status");
			athleteFilterComponent.setModel({
						type:'equals',
						filter:'1'
						});
			params.api.onFilterChanged()
    };
	}
		
	ngOnInit() {
		this.getSession();
		//this.getUserGroup();
		this.sub = this.activatedRoute.params.subscribe(params => {
			this.requestedId = params['id'];
		});
		this.loadIndentDetrails();
		this.loadVendorDetrails();
	}
	
	//get session details
	getSession = function(){
		this.sessionData = this.session.getSessionDetails();
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
	
	loadIndentDetrails = function() {
		var self = this;
		
		this.http.getIndentData(this.requestedId)
			.subscribe(
			(data) => {
				self.indentDetailData = data;
			},
			(error) => self.errorMsg = error,
			() => {
				
				if(this.indentDetailData.indentHeader.type == "J"){
			this.startingNumber = 101;
		}else if(this.indentDetailData.indentHeader.type == "G"){
			this.startingNumber = 102;
		}else if(this.indentDetailData.indentHeader.type == "O"){
			this.startingNumber = 103;
		}else if(this.indentDetailData.indentHeader.type == "H"){
			this.startingNumber = 104;
		}else if(this.indentDetailData.indentHeader.type == "P"){
			this.startingNumber = 105;
		}else if(this.params.data.type == "M"){
			this.startingNumber = 106;
		}
				
				
				if(self.indentDetailData.indentHeader.type == 'J'){
					self.hideCol = false;
					self.columnDef = [
		{headerName: "status", field: "status", hide:true, filter:"text"},
		{headerName: "Item Group", field: "itemGroup.name", suppressMenu: true, minWidth : 350},
		{headerName: "Item Descrption", field: "item.name", suppressMenu: true, minWidth : 350, cellRendererFramework: legacyCodeItemNameComponent},
		{headerName: "Quality", field: "quality.name", suppressMenu: true, hide : this.hideCol, minWidth : 250},
		{headerName: "Department", field: "department.name", suppressMenu: true, minWidth : 350},
		{headerName: "Stock", field: "item.stock", suppressMenu: true, minWidth : 250, valueFormatter: function (params) {
			return parseFloat(parseFloat(params.value).toFixed(2));
		}},
		{headerName: "Quantity", field: "indentQuantity", suppressMenu: true, minWidth : 250, valueFormatter: function (params) {
			return parseFloat(parseFloat(params.value).toFixed(2));
		}},
		{headerName: "Unit", field: "quantityUnit.name", suppressMenu: true, minWidth : 250}
	];
				}
			}
		);
	}
	
	
	
	loadVendorDetrails = function() {
		var self = this;
		
		this.http.getAllSuppliers()
			.subscribe(
			(data) => {
				self.vendornofilterdata = data;
			},
			(error) => self.errorMsg = error,
			() =>{
				for(var i =0; i<self.vendornofilterdata.length; i++){
					if(self.vendornofilterdata[i].type == 'S'){self.vendorAllData.push(self.vendornofilterdata[i])}
				}
			}
		);
	}
	
	
	
	sendInvite = function(){
		var self = this;
		var today = new Date();
		self.errorMsg = "";
		self.successMsg = "";
		var createdPostData = [];
		if(self.vendorSelectedData.length > 0){
			for(var i=0; i < self.vendorSelectedData.length; i++){
				createdPostData[i] = {
					"supplierCode"	: self.vendorSelectedData[i].id,
					"indentNo"		: self.requestedId,
					"submitter"		: self.sessionData.sessionUserName,
					"createDate"	: today.getTime()
				}
			}
			
			
			this.http.inviteVendor(createdPostData)
			.subscribe(
			(data) => {
				if(data){
					self.successMsg = "Price Request sent Successfully to the selected Suppliers."
					}
			},
			(error) => {self.errorMsg = error},
			() => {
				self.statusChange(14)
			}
		);
			
			console.log(createdPostData);
		}else{
			self.errorMsg = "No vendor is selected to send invite.";
		}
		
		
	}
	
	
	
	
	statusChange = function(changedstatus){
		var self = this;
		self.indentDetailData.indentHeader.status = changedstatus;
		//self.indentDetailData.reason = self.indentCreateModel.rejectionReason;
		this.http.updateIndent(self.indentDetailData)
			.subscribe(
			(data) => {
				self.statusChangeResponsedata = data;
			},
			(error) => self.errorMsg = error,
			() => {
				self.router.navigate(['purchase/requestprice'])
			}
		);
	}
	
	
	
	selectFromAll = function(e, index){
		var self = this;
		var isSelected = e.target.className;
		
		if(isSelected == 'active'){
			e.target.className = "";
			var indexOfSelection = self.allVendorSelection.indexOf(index);
			self.allVendorSelection.splice(indexOfSelection, 1);
			
		}else{
			e.target.className = "active";
			self.allVendorSelection.push(index);
		}
		
	}
	
	selectFromSelected = function(e, index){
		var self = this;
		var isSelected = e.target.className;
		
		if(isSelected == 'active'){
			e.target.className = "";
			var indexOfSelection = self.selectedVendorSelection.indexOf(index);
			self.selectedVendorSelection.splice(indexOfSelection, 1);
			
		}else{
			e.target.className = "active";
			self.selectedVendorSelection.push(index);
		}
		
	}
	
	addToSelected = function(){
		var self = this;
		for (var i = 0; i < self.allVendorSelection.length;  i++){
			self.vendorSelectedData.push(self.vendorAllData[self.allVendorSelection[i]]);
		}
		
		for (var m = self.allVendorSelection.length -1; m >= 0; m--){
			self.vendorAllData.splice(self.allVendorSelection[m], 1);
		}
		
		self.allVendorSelection.length = 0;
		$(".list-menu").find("li").removeClass("active");
		
		
	}
	
	deleteFromSelected = function(){
		var self = this;
		for (var i = 0; i < self.selectedVendorSelection.length;  i++){
			self.vendorAllData.push(self.vendorSelectedData[self.selectedVendorSelection[i]]);
		}
		
		for (var m = self.selectedVendorSelection.length -1; m >= 0; m--){
			self.vendorSelectedData.splice(self.selectedVendorSelection[m], 1);
		}
		
		self.selectedVendorSelection.length = 0;
		$(".list-menu").find("li").removeClass("active");
		
	}
	
}
