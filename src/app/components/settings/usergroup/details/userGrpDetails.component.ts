import { Component, OnInit, AfterViewInit } from '@angular/core';
import $ from 'jquery';

import { HttpTestService } from '../../../../services/http.service';
import { sessionServices } from '../../../../services/session.services';
import { Router, ActivatedRoute } from '@angular/router';
import {GridOptions} from "ag-grid/main";
import {userNameComponent} from "../../../common/userName.component";

import { userSearchModel } from '../../../../models/user/userSearch.model';

@Component({
  selector: 'app-usergrp-dtl',
  templateUrl: './userGrpDetails.component.html'
  })


export class userGroupDtlComponent implements OnInit {
	
	public sub: any;
	public requestedId: string;
	public userData : any = '';
	
	
	public errorMsg : string = "";
	public successMsg : string = "";
	
	public sessionData : any;
	public updateResponseData : any;
	
	
	public userMenuData : any = [];
	public selectedallUserData : any = [];
	
	public userSearchModel: userSearchModel = new userSearchModel();
	
	public MenuGridOptions: GridOptions;
	public UserGridOptions: GridOptions;
	
	
	public onMenuQuickFilterChanged($event) {
        this.MenuGridOptions.api.setQuickFilter($event.target.value);
    }
	
	public onUserQuickFilterChanged($event) {
        this.UserGridOptions.api.setQuickFilter($event.target.value);
    }
	
	
	public MenucolumnDef : any = [
		{headerName: "Parent Menu", field: "menuItem.menuName", suppressMenu: true, minWidth : 250},
		{headerName: "Menu Item", field: "subMenuItem.subMenu", suppressMenu: true, minWidth : 250}
	];
	
	public UsercolumnDef : any = [
		{headerName: "User Id", field: "id", suppressMenu: true, minWidth : 250},
		{headerName: "User Name", field: "userName", suppressMenu: true, minWidth : 250},
		{headerName: "Name", field: "", suppressMenu: true, minWidth : 250, cellRendererFramework: userNameComponent},
		{headerName: "Email", field: "email", suppressMenu: true, minWidth : 250},
		{headerName: "Contact No.", field: "mobile", suppressMenu: true, minWidth : 250}
	];
	
	
	constructor(public http: HttpTestService, public router: Router, public activatedRoute: ActivatedRoute , public session: sessionServices) { 
		var self = this;
		this.MenuGridOptions = <GridOptions>{};
		 //this.gridOptions.columnDefs = this.columnDef;
		 this.MenuGridOptions.paginationPageSize = 5;
		 this.MenuGridOptions.domLayout = 'autoHeight';
		 this.MenuGridOptions.pagination = true;
		 this.MenuGridOptions.enableFilter = true;
		 this.MenuGridOptions.enableSorting = true;
		 this.MenuGridOptions.enableColResize = false;
		 this.MenuGridOptions.floatingFilter = true;
		 this.MenuGridOptions.suppressMovableColumns = true;
		 this.MenuGridOptions.rowHeight = 30;
		 this.MenuGridOptions.floatingFiltersHeight = 40;
		 this.MenuGridOptions.rowSelection = 'single';
		 this.MenuGridOptions.showToolPanel = false;
		 this.MenuGridOptions.onGridReady = function(params){
			 params.api.sizeColumnsToFit();
		 }
		 
		 
		 this.UserGridOptions = <GridOptions>{};
		 //this.gridOptions.columnDefs = this.columnDef;
		 this.UserGridOptions.paginationPageSize = 5;
		 this.UserGridOptions.domLayout = 'autoHeight';
		 this.UserGridOptions.pagination = true;
		 this.UserGridOptions.enableFilter = true;
		 this.UserGridOptions.enableSorting = true;
		 this.UserGridOptions.enableColResize = false;
		 this.UserGridOptions.floatingFilter = true;
		 this.UserGridOptions.suppressMovableColumns = true;
		 this.UserGridOptions.rowHeight = 30;
		 this.UserGridOptions.floatingFiltersHeight = 40;
		 this.UserGridOptions.rowSelection = 'single';
		 this.UserGridOptions.showToolPanel = false;
		 this.UserGridOptions.onGridReady = function(params){
			 params.api.sizeColumnsToFit();
		 }
		 
	}
		
	ngOnInit() {
		this.sub = this.activatedRoute.params.subscribe(params => {
			this.requestedId = params['id'];
		});
		
		this.getSession();
		this.getMenuItemsByUserGroup();
		this.loadAllUsersByGrp();
		
	}
	
	//get session details
	getSession = function(){
		this.sessionData = this.session.getSessionDetails();
	}
	
	
	
	
	//get menu items by user group
	getMenuItemsByUserGroup = function(){ 
		var self = this;
		
		
		self.http.getSubMenuByUserGroup(self.requestedId)
			.subscribe(
				(data) => {
					this.userMenuData = data;
				},
				(error) => {
					this.errorMsg = error
				},
				() => {
					
				}
			);
			
	}
	
	
	
	loadAllUsersByGrp = function(){
		this.http.getAllUsersOfGroup(this.requestedId)
		  .subscribe(
			(data) => {
			  if(data){
					this.selectedallUserData = data;
				}
			},
			(error) => {
				this.errorMsg = error;
				this.selectedallUserData = [];
			},
			() => {}
		  );
	}
  
 
	
	
	
	
	
	
	//save personal details
	userStatus = function(changedStat){
		
		this.userData.isEnabled = changedStat;
		
		this.http.updateUserDetails(this.userData)
		  .subscribe(
			(data) => {
			  this.updateResponseData = data;
			},
			(error) => {
				this.errorMsg = error;
			},
			() => {
				if(changedStat == 1){
					this.successMsg = "User Enabled Successfully.";
				}else{
					this.successMsg = "User Disabled Successfully.";
				}
			}
		  );
	}
	
	
}
