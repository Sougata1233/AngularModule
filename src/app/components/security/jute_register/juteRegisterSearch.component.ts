import { Component, OnInit, AfterViewInit } from '@angular/core';
import * as $ from 'jquery';

import { HttpTestService } from '../../../services/http.service';
import { sessionServices } from '../../../services/session.services';
import { Router,ActivatedRoute} from '@angular/router';
import {Observable} from 'rxjs/Rx';
import {GridOptions} from "ag-grid/main";
import {gridjuteeditLinkComponent} from "../../common/juteEditLink";
import {IMyDpOptions} from 'mydatepicker';
import { error } from 'selenium-webdriver';




@Component({
  selector: 'app-payroll',
  templateUrl: './juteRegisterSearch.component.html'
})
export class juteRegisterSearchComponent implements OnInit {
	public searchList: any =[];
	
	
		public settings = {};
		public successMsg: string ;
		public errorMsg: string ;
		public requestedURL : any;
		public userGroupData : any = '';
		public userMenuData : any = '';
		public userSelectionMenuData : any = [];
		public sessionData: any;
		public gridOptions: GridOptions;
		public columnDef : any = [
			
			{headerName: "ID", field: "id",minWidth : 150,cellRendererFramework: gridjuteeditLinkComponent},
			{headerName: "CHALLAN NO", field: "chalanNo",minWidth : 150},
			{headerName: "CHALLAN DATE", field: "chalanDate",minWidth : 150},
			{headerName: "VEHICLE NO", field: "vehicleNo",minWidth : 150},
			{headerName: "DRIVER NAME", field: "driverName",minWidth : 150},
			{headerName: "BROKER NAME", field: "supplierName",minWidth : 150},
			{headerName: "PO NO", field: "poNo",minWidth : 150},
			{headerName: "TRANSPORTER", field: "transporter", minWidth : 150},
		
			];
	public onQuickFilterChanged($event) {
		this.gridOptions.api.setQuickFilter($event.target.value);
	}
		constructor(private http: HttpTestService, private router: Router,public activatedRoute: ActivatedRoute , private session: sessionServices,) {
	
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
				self.router.navigate(['Security/juteregisteredit',params.data.id]);
				
			};
		}
	ngOnInit() {
			this.getSession();
			this.getUserGroup();
			this.search();
	
	}
	
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
	
	search = function(){
		this.http.getSearchDate.subscribe(res=> {
			this.searchList=res;
			
			});
			
		
		}
	



	
}
