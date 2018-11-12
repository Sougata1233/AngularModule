import { Component, OnInit, AfterViewInit } from '@angular/core';
import * as $ from 'jquery';

import { HttpTestService } from '../../../../services/http.service';
import { sessionServices } from '../../../../services/session.services';
import { Router } from '@angular/router';
import {Observable} from 'rxjs/Rx';
import { indentCreateModel } from '../../../../models/indent/indentCreate.model';
import {GridOptions} from "ag-grid/main";
import {gridDateComponent} from "../../../common/gridDateFormat.component";
import {gridUserDetailsLinkComponent} from "../../../common/gridUserDetailsLink";
import {gridUserStatus} from "../../../common/gridUserStatus";


import { userSearchModel } from '../../../../models/user/userSearch.model';

@Component({
  selector: 'app-view-user',
  templateUrl: './view-user.component.html'
  })


export class ViewUserComponent implements OnInit {
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
	
	public userSearchModel: userSearchModel = new userSearchModel();
	
	public columnDef : any = [
		{headerName: "User Id", field: "id", suppressMenu: true, cellRendererFramework: gridUserDetailsLinkComponent, minWidth : 350},
		{headerName: "User Name", field: "userName", suppressMenu: true, minWidth : 250},
		{headerName: "User Status", field: "isEnabled", suppressMenu: true, cellRendererFramework: gridUserStatus, minWidth : 100, maxWidth:150, width:140},
		{headerName: "User Email", field: "email", suppressMenu: true, minWidth : 350},
		{headerName: "User Mobile", field: "mobile", suppressMenu: true, minWidth : 250}
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
			 self.router.navigate(['settings/user',params.data.id]);
		 };

	}
		
	ngOnInit() {
		this.getSession();
		this.loadAllIndent();
	}
	
	//get session details
	getSession = function(){
		this.sessionData = this.session.getSessionDetails();
	}
	
	
	
	


	//load all PO Data
	
	loadAllIndent = function(){
		var self = this;
		
		this.http.getUserAll()
			.subscribe(
			(data) => {
				self.AllPOData = data;
			},
			(error) => self.errorMsg = error,
			() => {}
		);
	}
}
