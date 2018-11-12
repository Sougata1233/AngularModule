import { Component, OnInit, AfterViewInit } from '@angular/core';
import * as $ from 'jquery';

import { HttpTestService } from '../../../services/http.service';
import { sessionServices } from '../../../services/session.services';
import { Router } from '@angular/router';
import {Observable} from 'rxjs/Rx';
import {GridOptions} from "ag-grid/main";
import {IMyDpOptions} from 'mydatepicker';
import {gridDeleteMasterComponent} from "../../common/gridRowDeleteMaster.component";
import { locationCreateModel } from '../../../models/location/locationCreate.model';


@Component({
  selector: 'app-payroll',
  templateUrl: './LocationList.component.html'
})
export class LocationListComponent implements OnInit {
		

	public locationCreateModel: locationCreateModel = new locationCreateModel();
	public locationList : any =[];
	public countryList : any = [];
	public selectedCountryList: any = [];
	public selectedStateList: any = [];
	public stateList: any=[];
	public cityList: any=[];
	public createLocationresponsedata: any;
	public gridOptions: GridOptions;
	public successMsg: string ;
	public errorMsg: string ;
	public requestedURL : any;
	public userGroupData : any = '';
	public userMenuData : any = '';
	public userSelectionMenuData : any = [];
	public sessionData: any;
	public columnDef : any = [
			{headerName: "S NO.", field: "id", minWidth : 150},
			{headerName: "LOCATION AREA", field: "locationArea", minWidth : 250, editable : true, cellEditor : 'text'},
			{headerName: "LOCATION PIN", field: "locationPin", minWidth : 250, editable : true, cellEditor : 'text'},
			{headerName: "Delete", field: "", minWidth : 80, maxWidth : 80, width : 80, cellRendererFramework: gridDeleteMasterComponent}
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
				var clickedItem = $(params.event.target).attr("data-action-type");
				//var typeofTarget = $(clickedItem.getAttribute("data-action-type");
				if(clickedItem == "remove"){self.deleteItem(params.node.id);
					console.log('hi')
				}
			};
			this.gridOptions.onCellEditingStopped = function(params) {
				if(self.locationList != 'undefined'){
				   self.updateDeviation(params.node.id);
				   params.api.setRowData(self.locationList);
				}
			};
			
}
ngOnInit() {
			this.getSession();
			this.getUserGroup();
			// this.loadstateList();
			this.loadcountryList();
			this.loadlocationList()
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
	
//createcity function
createLocationmaster = function(){
			var self = this;
			self.errorMsg = "";
			self.successMsg = ""; 
			
			this.http.createLocationmaster(self.locationCreateModel)
				.subscribe(
				(data) => {
					self.createLocationresponsedata = data;
					self.loadlocationList()
				},
				(error) => self.errorMsg = error,
				() => {
					self.successMsg = "Created Successfully.",
					self.locationCreateModel.locationArea="",
					self.locationCreateModel.locationCity="",
					self.locationCreateModel.locationState="",
					self.locationCreateModel.locationCountry="",
					self.locationCreateModel.locationPin="",
					self.loadlocationList()
				}
			);
			var newItem =self.createLocationresponsedata;
			this.gridOptions.api.updateRowData({add: [newItem]});
			console.log("completed")
			
}
//load country data
loadcountryList = function() {
			var self = this;
			
			this.http.getCountry()
				.subscribe(
				(data) => {
					self.countryList = data;
				},
				(error) => self.errorMsg = error,
				() => console.log("completed")
			);
}

loadlocationList = function() {
	var self = this;
	
	this.http.getLocationmaster()
		.subscribe(
		(data) => {
			self.locationList = data;
		},
		(error) => self.errorMsg = error,
		() => console.log("completed")
	);
}
//load state data
loadstateList = function(value) {
			
				this.stateList = [];
				console.log(this.stateList);
				this.selectedCountryList = this.countryList.filter(country => country.id == value);
				console.log(this.selectedCountryList[0]);
				this.selectedCountryList[0].state.forEach(state => this.stateList.push(state));
}
//load city data
loadcityList = function(value){
	this.cityList = [];
	console.log(this.cityList);
	this.selectedStateList = this.stateList.filter(state => state.id == value);
	console.log(this.selectedStateList[0]);
	this.selectedStateList[0].city.forEach(city => this.cityList.push(city));
		
}

//load delete data
deleteItem = function(indexdId){
			var self = this;
			self.errorMsg = "";
			self.successMsg = ""; 
			this.gridOptions.api.setRowData(self.locationList);
			var id = self.locationList[indexdId].id
				this.http.deleteLocationmaster(id)
				.subscribe(
				() => {
					
					self.loadlocationList()
				},
				(error) => self.errorMsg = error,
				() => {
					self.successMsg = "Deleted Successfully."
					
				}
			);
			
			
}

updateDeviation = function(index){
	var self = this;
	self.errorMsg = "";
	self.successMsg = ""; 
	self.locationList[index].deviation = (self.locationList[index].locationArea - self.locationList[index].locationArea);
	self.locationList[index].deviation = (self.locationList[index].locationPin - self.locationList[index].locationPin);
	

	self.http.editLocationmaster( self.locationList[index] )
	.subscribe(
		(data) => {
			
			self.loadlocationList()
		},
		(error) => self.errorMsg = error,
		() => {
			self.successMsg = "Updated Successfully.";
			
	
				
		}
	);
	var newItem =self.locationCreateModel;
	this.gridOptions.api.updateRowData({add: [newItem]});
}
	
}
