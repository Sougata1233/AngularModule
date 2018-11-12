import { Component, OnInit, AfterViewInit } from '@angular/core';
import * as $ from 'jquery';

import { HttpTestService } from '../../../services/http.service';
import { sessionServices } from '../../../services/session.services';
import { Router } from '@angular/router';
import {Observable} from 'rxjs/Rx';
import { purchaseCreateModel } from '../../../models/purchase/purchaseCreate.model';
import {GridOptions} from "ag-grid/main";
import {gridDateComponent} from "../../common/gridDateFormat.component";
import {gridPOPrintLinkComponent} from "../../common/gridPOPrintLink.Component";
import {gridtatusComponent} from "../../common/gridDtatus.component";



@Component({
  selector: 'app-worklist',
  templateUrl: './poCancel_PrintDetails.component.html'
})
export class purchaseCancelPrintComponent implements OnInit {

	public AllPOData : any;
	public successMsg: string ;
	public errorMsg: string ;
	public requestedURL : any;
	public userGroupData : any = '';
	public userMenuData : any = '';
	public userSelectionMenuData : any = [];
	public sessionData: any;
	public gridOptions: GridOptions;
	public AllPODatafiltered : any =[];
	
	public columnDef : any = [
		{headerName: "PO NUMBER", field: "id", suppressMenu: true, cellRendererFramework: gridPOPrintLinkComponent, minWidth : 350},
		{headerName: "PO TYPE", field: "type", suppressMenu: true, minWidth : 250},
		{headerName: "RAISED BY", field: "submitter", suppressMenu: true, minWidth : 350},
		{headerName: "RAISED ON", field: "createDate", suppressMenu: true, cellRendererFramework: gridDateComponent, minWidth : 350},
		{headerName: "PO STATUS", field: "status", suppressMenu: true, cellRendererFramework: gridtatusComponent, minWidth : 100}
	];
	
	public onQuickFilterChanged($event) {
        this.gridOptions.api.setQuickFilter($event.target.value);
    }
	
	
	
	
	
	
	public purchaseCreateModel: purchaseCreateModel = new purchaseCreateModel();

	
	constructor(public http: HttpTestService, public router: Router, public session: sessionServices) {
		var self = this;
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
		 this.gridOptions.onGridReady = function(params) {params.api.sizeColumnsToFit();};
		this.gridOptions.onRowClicked = function(params) {
			 self.router.navigate(['purchase/list',params.data.id]);
		 };
	}
		
	ngOnInit() {
		this.getSession();
		this.getUserGroup();
		//this.loadAllPO();
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
			() => this.loadAllPO()
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


	//load all PO Data
	
	loadAllPO = function(){
		var self = this;
		
		this.http.getAllPO()
			.subscribe(
			(data) => {
				self.AllPOData = data;
			},
			(error) => self.errorMsg = error,
			() => {
				if(self.router.url == '/jute/purchase'){
				for(var i =0; i < self.AllPOData.length; i++){
					if(self.AllPOData[i].type == 'J'){
						self.AllPODatafiltered.push(self.AllPOData[i]);
					}
				}
				}else{
					for(var i =0; i < self.AllPOData.length; i++){
					if(self.AllPOData[i].type != 'J'){
						self.AllPODatafiltered.push(self.AllPOData[i]);
					}
				}
				}
				this.gridOptions.api.setRowData(self.AllPODatafiltered);
			}
		);
	}




}
	
	
	

