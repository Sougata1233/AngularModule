import { Component, OnInit, AfterViewInit } from '@angular/core';
import * as $ from 'jquery';

import { HttpTestService } from '../../../services/http.service';
import { sessionServices } from '../../../services/session.services';
import { Router } from '@angular/router';
import {Observable} from 'rxjs/Rx';
import { indentCreateModel } from '../../../models/indent/indentCreate.model';
import {GridOptions} from "ag-grid/main";
import {gridDateComponent} from "../../common/gridDateFormat.component";
import {gridIndentSearchLinkComponent} from "../../common/gridIndentSearchLink.Component";
import {gridtatusComponent} from "../../common/gridDtatus.component";

@Component({
  selector: 'app-worklist',
  templateUrl: './indentSearch.component.html'
})
export class indentSearchComponent implements OnInit {
	
	public gridOptions: GridOptions;

	public AllPOData : any;
	public successMsg: string ;
	public errorMsg: string ;
	public requestedURL : any;
	public userGroupData : any = '';
	public userMenuData : any = '';
	public userSelectionMenuData : any = [];
	public AllPODatafiltered : any = [];
	public sessionData: any;
	public indentCreateModel: indentCreateModel = new indentCreateModel();
	
	
	public columnDef : any = [
		{headerName: "INDENT NUMBER", field: "id", suppressMenu: true, cellRendererFramework: gridIndentSearchLinkComponent, minWidth : 350},
		{headerName: "INDENT TYPE", field: "type", suppressMenu: true, minWidth : 250},
		{headerName: "INDENT STATUS", field: "status", suppressMenu: true, cellRendererFramework: gridtatusComponent, minWidth : 100, maxWidth:150, width:140},
		{headerName: "RAISED BY", field: "submitter", suppressMenu: true, minWidth : 350},
		{headerName: "RAISED ON", field: "createDate", cellRendererFramework: gridDateComponent, suppressMenu: true, minWidth : 350}
		
	];
	
	
	public onQuickFilterChanged($event) {
        this.gridOptions.api.setQuickFilter($event.target.value);
    }
	
	
	
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
			if(params.data.status == '21'){
				if(params.data.type != 'J'){
					self.router.navigate(['store/indentedit',params.data.id]);
				}else{
					self.router.navigate(['jute/mrindentedit',params.data.id]);
				}
			}else{
				self.router.navigate(['store/list',params.data.id]);
			}
			 
		 };

	}
	
	
		
	ngOnInit() {
		this.getSession();
		this.getUserGroup();
		
	}
	
	//get session details
	getSession = function(){
		this.sessionData = this.session.getSessionDetails();
	}
	
	
	
	


	//load all PO Data
	
	loadAllIndent = function(){
		var self = this;
		
		this.http.getAllIndent()
			.subscribe(
			(data) => {
				self.AllPOData = data;
			},
			(error) => self.errorMsg = error,
			() => {
				if(self.router.url  == '/jute'){
				for(var i =0; i < self.AllPOData.length; i++){
					if(self.AllPOData[i].type == 'J'){
						self.AllPODatafiltered.push(self.AllPOData[i]);
					}
				}
				}else{
					for(var i =0; i < self.AllPOData.length; i++){
					if(self.AllPOData[i].type != 'J' && self.AllPOData[i].type != 'W'){
						self.AllPODatafiltered.push(self.AllPOData[i]);
					}
				}
				}
				this.gridOptions.api.setRowData(self.AllPODatafiltered);
			}
		);
	}
	
	
	getUserGroup = function(){
		var self = this;
		this.http.getUserGroupById(this.sessionData.sessionId)
		  .subscribe(
			(data) => {
			  this.userGroupData = data;
			  },
			(error) => {
				this.errorMsg = error;
				this.userGroupData = "";
			},
			() => {
				
    			this.loadAllIndent();
			}
		  );
	}




}
	
	
	

