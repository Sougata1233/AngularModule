import { Component, OnInit, AfterViewInit } from '@angular/core';
import * as $ from 'jquery';

import { HttpTestService } from '../../../services/http.service';
import { sessionServices } from '../../../services/session.services';
import { Router } from '@angular/router';
import {Observable} from 'rxjs/Rx';
import {GridOptions} from "ag-grid/main";
import {IMyDpOptions} from 'mydatepicker';
import {gridDeleteMasterComponent} from "../../common/gridRowDeleteMaster.component";
import { cityCreateModel } from '../../../models/city/cityCreate.model';


@Component({
  selector: 'app-payroll',
  templateUrl: './CityList.component.html'
})
export class CityListComponent implements OnInit {
	public myDatePickerOptions: IMyDpOptions = {
        // other options...
        dateFormat: 'mm/dd/yyyy'
	};

	public countryList : any = [];
	public selectedCountryList: any = [];

	public cityList: any=[];
	public createcityresponsedata: any;
	public cityCreateModel: cityCreateModel = new cityCreateModel();
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
			{headerName: "STATE NAME", field: "state.stateName", minWidth : 250},
			{headerName: "CITY NAME", field: "cityName", minWidth : 250, editable : true, cellEditor : 'text'},
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
				if(self.cityList != 'undefined'){
				   self.updateDeviation(params.node.id);
				   params.api.setRowData(self.cityList);
				}
			};
			
}
ngOnInit() {
			this.getSession();
			this.getUserGroup();
			// this.loadstateList();
			this.loadcountryList();
			this.loadcityList()
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
createCity = function(){
			var self = this;
			this.http.createCity(self.cityCreateModel)
				.subscribe(
				(data) => {
					self.createcityresponsedata = data;
					self.loadcityList()
				},
				(error) => self.errorMsg = error,
				() => {
					self.successMsg = "Created Successfully.",
					self.cityCreateModel= ""
					
				}
			);
			var newItem =self.cityCreateModel;
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
//load state data
loadstateList = function(value) {
			
				this.stateList = [];
				console.log(this.stateList);
				this.selectedCountryList = this.countryList.filter(country => country.id == value);
				console.log(this.selectedCountryList[0]);
				this.selectedCountryList[0].state.forEach(state => this.stateList.push(state));
}
//load city data
loadcityList = function(){
		this.http.getcityList()
		.subscribe(
			(data) =>{
				this.cityList = data;
				console.log(data);
			},
			(error) => this.errorMsg = error,
			() => console.log("complete")

		);
}
//load delete data
deleteItem = function(indexdId){
			var self = this;
			this.gridOptions.api.setRowData(self.cityList);
			var id = self.cityList[indexdId].id
				this.http.deleteCity(id)
				.subscribe(
				() => {
					
					self.loadcityList()
				},
				(error) => self.errorMsg = error,
				() => {
					self.successMsg = "Deleted Successfully."
					
				}
			);
			
			
}
//edit data
	
updateDeviation = function(index){
	var self = this;
	self.cityList[index].deviation = (self.cityList[index].cityName - self.cityList[index].cityName);
	self.http.editCitymaster( self.cityList[index] )
	.subscribe(
		(data) => {
			
			self.loadcityList()
		},
		(error) => self.errorMsg = error,
		() => {
			self.successMsg = "Updated Successfully.";
			
	
				
		}
	);
	var newItem =self.cityCreateModel;
	this.gridOptions.api.updateRowData({add: [newItem]});
}

	
}
