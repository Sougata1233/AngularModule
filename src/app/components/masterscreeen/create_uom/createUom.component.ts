import { Component, OnInit, AfterViewInit } from '@angular/core';
import * as $ from 'jquery';

import { HttpTestService } from '../../../services/http.service';
import { sessionServices } from '../../../services/session.services';
import { Router } from '@angular/router';
import {Observable} from 'rxjs/Rx';
import {GridOptions} from "ag-grid/main";

import {gridDeleteMasterComponent} from "../../common/gridRowDeleteMaster.component";
import { uomCreateModel } from '../../../models/uom/uomCreate.model';


@Component({
  selector: 'app-payroll',
  templateUrl: './createUom.component.html'
})
export class createUomComponent implements OnInit {

	public uomList : any = [];
	public uomCreateModel: uomCreateModel = new uomCreateModel();
	public createUomResponsedata: any;
	public gridOptions: GridOptions;
	public successMsg: string ;
	public errorMsg: string ;
	public requestedURL : any;
	public userGroupData : any = '';
	public userMenuData : any = '';
	public userSelectionMenuData : any = [];
	public sessionData: any;
	public columnDef : any = [
		{headerName: "CODE", field: "id", minWidth : 150},
		{headerName: "DESCRIPTION", field: "uomDsc", minWidth : 250, editable : true, cellEditor : 'text'},
		{headerName: "ACTIVE FLAG", field: "activityFlag", minWidth : 250},
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
				if(self.uomList != 'undefined'){
				   self.updateDeviation(params.node.id);
				   params.api.setRowData(self.uomList);
				}
			};
			
}
ngOnInit() {
			this.getSession();
			this.getUserGroup();
			this.loaduomList();
			
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
	
//create function
createUom = function(){
			var self = this;
			self.errorMsg = "";
			self.successMsg = ""; 
			this.http.createUom(self.uomCreateModel)
				.subscribe(
				(res) => {
					self.createUomResponsedata = res.json();
					self.loaduomList();
					if(res.status===208){
						self.errorMsg = "Already Exists.";
					}else{
						self.successMsg = "Created Successfully."; 
					}
				},
				(error) => self.errorMsg = error,
				() => {
					self.uomCreateModel.id="";
					self.uomCreateModel.uomDsc="";
					self.uomCreateModel.activityFlag="";
					self.loaduomList();
					
				}
			);
			var newItem =self.uomCreateModel;
			this.gridOptions.api.updateRowData({add: [newItem]});
			console.log("completed")
			
}

//load data
loaduomList = function(){
		this.http.getUom()
		.subscribe(
			(data) =>{
				this.uomList = data;
				console.log(data);
			},
			(error) => this.errorMsg = error,
			() => console.log("complete")

		);
}
//load delete data
deleteItem = function(indexdId){
			var self = this;
			self.errorMsg = "";
			self.successMsg = ""; 
			this.gridOptions.api.setRowData(self.uomList);
			var id = self.uomList[indexdId].id
				this.http.deleteUom(id)
				.subscribe(
				() => {
					
					self.loaduomList()
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
			self.errorMsg = "";
			self.successMsg = ""; 
			self.uomList[index].deviation = (self.uomList[index].uomDsc - self.uomList[index].uomDsc);
			self.http.editUom( self.uomList[index] )
			.subscribe(
				(data) => {
					
					self.loaduomList()
				},
				(error) => self.errorMsg = error,
				() => {
					self.successMsg = "Updated Successfully.";
					
			
						
				}
			);
			var newItem =self.uomCreateModel;
			this.gridOptions.api.updateRowData({add: [newItem]});
}
	
	
}
