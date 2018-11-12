import { Component, OnInit, AfterViewInit } from '@angular/core';
import * as $ from 'jquery';

import { HttpTestService } from '../../../services/http.service';
import { sessionServices } from '../../../services/session.services';
import { AppSettings } from '../../../config/settings/app-settings';
import { Router, ActivatedRoute } from '@angular/router';
import {Observable} from 'rxjs/Rx';
import {GridOptions} from "ag-grid/main";
import {legacyCodeItemNameComponent} from "../../common/legacy_item.component";

@Component({
  selector: 'app-POcanceldtl',
  templateUrl: './indentSearchDtl.component.html'
})
export class indentSearchDtlComponent implements OnInit {
	
	public sub: any;
	public requestedId: string;
	public indentDetailData : any;
	public indentDetailDataOld : any;
	public statusChangeResponsedata : any;
	
	public errorMsg : string = "";
	public successMsg : string = "";
	
	public requestedURL : any;
	public loggedInUserID : string = "";
	public userGroupData : any = '';
	public userMenuData : any = '';
	public userSelectionMenuData : any = [];
	public sessionData: any;
	public hideCol: boolean = true;
	public printResponsedata : any = "";
	
	public gridOptions: GridOptions;
	public startingNumber : any;
	public prefix : string = "";
	public company : string = "";
	public company_add_1 : string = "";
	public company_add_2 : string = "";
	public company_contact : string = "";
	
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
		{headerName: "Unit", field: "quantityUnit.name", suppressMenu: true, minWidth : 250}
	];
	
	
	constructor(public http: HttpTestService, public router: Router, public activatedRoute: ActivatedRoute , public session: sessionServices) { 
		var self = this;
		this.company = AppSettings.COMPANY_NAME;
		this.company_add_1 = AppSettings.COMPANY_ADDRESS_ONE;
		this.company_add_2 = AppSettings.COMPANY_ADDRESS_TWO;
		this.company_contact = AppSettings.COMPANY_CONTACT;
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
		this.sub = this.activatedRoute.params.subscribe(params => {
			this.requestedId = params['id'];
		});
		
		this.getSession();
		this.loadIndentDetrails();
		this.getUserGroup();
		this.getPrintCounter();
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
						if(this.userMenuData[i].menuItem.menuName == 'Store'){
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
	
	

	
	
	
	statusChange = function(changedstatus){
		$("#page_loader_service").fadeIn();
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
				self.successMsg = "Indent Status Changed Successfully.",
				self.router.navigate(['store/indent/list']),
				$("#page_loader_service").fadeOut();
			}
		);
		$('.closeDialog').click();
	}
	
	
	cancelIt = function(){
		var confirmation = confirm("Are you sure you want to permanently delete the data.");
		if(confirmation){
			this.statusChange('6');
		}
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
  
  getPrintCounter = function(){
		var self = this;
		this.http.getPrintCount("nd^"+self.requestedId)
			.subscribe(
			(data) => {
				self.printResponsedata = data;
			},
			//(error) => self.errorMsg = error,
			() => {
			}
		);
	}
	
	print = function(){
		var self = this;
		if(self.printResponsedata == ""){
			self.printResponsedata = {
				"type" : "nd",
				"id" : self.requestedId,
				"counter" : 1
			};
		}else{
			self.printResponsedata.counter = self.printResponsedata.counter + 1;
		}
		this.http.addCounter(self.printResponsedata)
			.subscribe(
			(data) => {
				//self.supplierDtlData = data;
			},
			(error) => self.errorMsg = error,
			() => {
				window.print();
			}
		);
		
	}
}
