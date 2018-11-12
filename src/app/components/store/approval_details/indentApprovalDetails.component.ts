import { Component, OnInit, AfterViewInit } from '@angular/core';
import * as $ from 'jquery';

import { HttpTestService } from '../../../services/http.service';
import { AppSettings } from '../../../config/settings/app-settings';
import { sessionServices } from '../../../services/session.services';
import { Router, ActivatedRoute } from '@angular/router';
import { indentCreateModel } from '../../../models/indent/indentCreate.model';
import {GridOptions} from "ag-grid/main";
import {gridDeleteComponent} from "../../common/gridRowDelete.component";
import {legacyCodeItemNameComponent} from "../../common/legacy_item.component";
import {numericRequiredEditorComponent} from "../../editor/numericRequiredEditor.component";

@Component({
  selector: 'app-worklist',
  templateUrl: './indentApprovalDetails.component.html'
})
export class indentApprovalDetailsComponent implements OnInit {
	
	public sub: any;
	public requestedId: string;
	public indentDetailData : any;
	public indentDetailDataOld : any;
	public statusChangeResponsedata : any;
	public approverlevel : number = 0;
	
	public errorMsg : string = "";
	public successMsg : string = "";
	
	public requestedURL : any;
	public loggedInUserID : string = "";
	public userGroupData : any = '';
	public userMenuData : any = '';
	public userSelectionMenuData : any = [];
	public edited : boolean = false;
	public approvalData : any = [];
	public stat : string = "";
	public sessionData: any;
	public gridOptions: GridOptions;
	public hideCol: boolean = true;
	public startingNumber : any;
	public prefix : string = "";
	
	public columnDef : any = [
		{headerName: "status", field: "status", hide:true, filter:"text"},
		{headerName: "Item Group", field: "itemGroup.name", suppressMenu: true, minWidth : 350},
		{headerName: "Item Descrption", field: "item.name", suppressMenu: true, minWidth : 350, cellRendererFramework: legacyCodeItemNameComponent},
		{headerName: "Quality", field: "quality.name", suppressMenu: true, hide : this.hideCol, minWidth : 250},
		{headerName: "Department", field: "department.name", suppressMenu: true, minWidth : 350},
		{headerName: "Stock", field: "item.stock", suppressMenu: true, minWidth : 250, valueFormatter: function (params) {
			return parseFloat(parseFloat(params.value).toFixed(2));
		}},
		{headerName: "Quantity", field: "indentQuantity", suppressMenu: true, minWidth : 250, cellEditorFramework: numericRequiredEditorComponent, editable : true, valueFormatter: function (params) {
			return parseFloat(parseFloat(params.value).toFixed(2));
		}},
		{headerName: "Unit", field: "quantityUnit.name", suppressMenu: true, minWidth : 250},
		{headerName: "Additional Requirement", field: "additionalRequirement", suppressMenu: true, minWidth : 350},
		{headerName: "Delete", field: "", suppressMenu: true, minWidth : 80, maxWidth : 80, width : 80, cellRendererFramework: gridDeleteComponent}
	];

	
	public indentCreateModel: indentCreateModel = new indentCreateModel();
	
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
		this.loadApprovalData();
		
		
		this.loggedInUserID = window.sessionStorage.getItem('id');
		this.getUserGroup();
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
				self.indentDetailDataOld = data;
			},
			(error) => self.errorMsg = error,
			() => {
				
				for(var i=0; i<self.indentDetailData.indentList.length; i++){
					if(self.approverlevel == 1){
						self.indentDetailData.indentList[i].approverFirst = self.sessionData.sessionId;
						self.indentDetailData.indentList[i].approveFirstDate = new Date().getTime();
					}else if(self.approverlevel == 2){
						self.indentDetailData.indentList[i].approverSecond = self.sessionData.sessionId;
						self.indentDetailData.indentList[i].approveSecondDate = new Date().getTime();
					}
				}
				
				if(self.indentDetailData.indentHeader.type == 'J'){
					self.hideCol = false;
					self.columnDef = [
		{headerName: "status", field: "status", hide:true},
		{headerName: "Item Group", field: "itemGroup.name", suppressMenu: true, minWidth : 350},
		{headerName: "Item Descrption", field: "item.name", suppressMenu: true, minWidth : 350,cellRendererFramework: legacyCodeItemNameComponent},
		{headerName: "Quality", field: "quality.name", suppressMenu: true, hide : this.hideCol, minWidth : 250},
		{headerName: "Department", field: "department.name", suppressMenu: true, minWidth : 350},
		{headerName: "Stock", field: "item.stock", suppressMenu: true, minWidth : 250, valueFormatter: function (params) {
			return parseFloat(parseFloat(params.value).toFixed(2));
		}},
		{headerName: "Quantity", field: "indentQuantity", suppressMenu: true, minWidth : 250, valueFormatter: function (params) {
			return parseFloat(parseFloat(params.value).toFixed(2));
		}},
		{headerName: "Unit", field: "quantityUnit.name", suppressMenu: true, minWidth : 250},
		{headerName: "Additional Requirement", field: "additionalRequirement", suppressMenu: true, minWidth : 350},
		{headerName: "Delete", field: "", suppressMenu: true, minWidth : 80, maxWidth : 80, width : 80, cellRendererFramework: gridDeleteComponent}
	];
				}
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
					self.indentDetailData = "notauth";
				}else{
				for(var i = 0; i<self.approvalData.length; i++){
					if(self.approvalData[i].taskDesc == "Indent" && !self.requestedId.startsWith("J_") ){
						if(self.approvalData[i].user1 && self.approvalData[i].user1.id == self.sessionData.sessionId){
							self.approverlevel = 1;
							this.loadIndentDetrails();
							if(!self.approvalData[i].user2){
								self.stat = "3";
							}else{
								self.stat = "17";
							}
						}else if(self.approvalData[i].user2 && self.approvalData[i].user2.id == self.sessionData.sessionId){
							self.approverlevel = 2;
							this.loadIndentDetrails();
							if(!self.approvalData[i].user3){
								self.stat = "3";
							}else{
								self.stat = "18";
							}
						}else if(self.approvalData[i].user3 && self.approvalData[i].user3.id == self.sessionData.sessionId){
							self.approverlevel = 3;
							this.loadIndentDetrails();
							if(!self.approvalData[i].user4){
								self.stat = "3";
							}else{
								self.stat = "19";
							}
						}else if(self.approvalData[i].user4 && self.approvalData[i].user4.id == self.sessionData.sessionId){
							self.approverlevel = 4;
							this.loadIndentDetrails();
							if(!self.approvalData[i].user5){
								self.stat = "3";
							}else{
								self.stat = "20";
							}
						}else if(self.approvalData[i].user5 && self.approvalData[i].user5.id == self.sessionData.sessionId){
							self.approverlevel = 5;
							this.loadIndentDetrails();
							self.stat = "3";
						}else{
							self.indentDetailData = "notauth";
						}
						
					}else if(self.approvalData[i].taskDesc == "Jute Indent" && self.requestedId.startsWith("J_") ){
						if(self.approvalData[i].user1 && self.approvalData[i].user1.id == self.sessionData.sessionId){
							self.approverlevel = 1;
							this.loadIndentDetrails();
							if(!self.approvalData[i].user2){
								self.stat = "3";
							}else{
								self.stat = "17";
							}
						}else if(self.approvalData[i].user2 && self.approvalData[i].user2.id == self.sessionData.sessionId){
							self.approverlevel = 2;
							this.loadIndentDetrails();
							if(!self.approvalData[i].user3){
								self.stat = "3";
							}else{
								self.stat = "18";
							}
						}else if(self.approvalData[i].user3 && self.approvalData[i].user3.id == self.sessionData.sessionId){
							self.approverlevel = 3;
							this.loadIndentDetrails();
							if(!self.approvalData[i].user4){
								self.stat = "3";
							}else{
								self.stat = "19";
							}
						}else if(self.approvalData[i].user4 && self.approvalData[i].user4.id == self.sessionData.sessionId){
							self.approverlevel = 4;
							this.loadIndentDetrails();
							if(!self.approvalData[i].user5){
								self.stat = "3";
							}else{
								self.stat = "20";
							}
						}else if(self.approvalData[i].user5 && self.approvalData[i].user5.id == self.sessionData.sessionId){
							self.approverlevel = 5;
							this.loadIndentDetrails();
							self.stat = "3";
						}else{
							self.indentDetailData = "notauth";
						}
						
					}
				}
				}
			}
		);
	}
	
	updateQuantity = function(e, indexId){
		var self = this;
		var elementObjVal = e.target.value;
		self.indentDetailData.indentList[indexId].indentQuantity = elementObjVal;
		
		if(JSON.stringify(self.indentDetailDataOld.indentList) === JSON.stringify(self.indentDetailData.indentList)){
			self.edited = false; 
		}else{
			self.edited = true;
		}
		console.log(self.indentDetailDataOld.indentList);
		console.log(self.indentDetailData.indentList);
		console.log(self.edited);
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
				self.successMsg = "Indent Status Changed Successfully.";
				if(self.indentDetailData.indentHeader.type == 'J'){
					self.router.navigate(['jute/juteworklist'])
				}else{
					self.router.navigate(['store/worklist'])
				}
				$("#page_loader_service").fadeOut()
			}
		);
		$('.closeDialog').click();
	}
	
	deleteItem = function(indexdId){
		var self = this;
		self.indentDetailData.indentList[indexdId].status='4';
		this.gridOptions.api.setRowData(self.indentDetailData.indentList);
		var athleteFilterComponent = this.gridOptions.api.getFilterInstance("status");
		athleteFilterComponent.setModel({
						type:'equals',
						filter:'1'
						});
			this.gridOptions.api.onFilterChanged();
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
}
