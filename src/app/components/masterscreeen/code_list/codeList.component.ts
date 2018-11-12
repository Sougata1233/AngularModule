import { Component, OnInit, AfterViewInit } from '@angular/core';
import * as $ from 'jquery';

import { HttpTestService } from '../../../services/http.service';
import { sessionServices } from '../../../services/session.services';
import { Router } from '@angular/router';
import {Observable} from 'rxjs/Rx';
import {GridOptions} from "ag-grid/main";

import {gridDeleteMasterComponent} from "../../common/gridRowDeleteMaster.component";
import { codeCreateModel } from '../../../models/code/codeCreate.model';


@Component({
  selector: 'app-payroll',
  templateUrl: './codeList.component.html'
})
export class codeListComponent implements OnInit {

	public codeList : any = [];
	public codeCreateModel: codeCreateModel = new codeCreateModel();
	public createcodeResponsedata: any;
	public gridOptions: GridOptions;
	public successMsg: string ;
	public errorMsg: string ;
	public requestedURL : any;
	public userGroupData : any = '';
	public userMenuData : any = '';
	public userSelectionMenuData : any = [];
	public sessionData: any;
	public columnDef : any = [
		{headerName: "CODE", field: "code", minWidth : 150, editable : true, cellEditor : 'text'},
		{headerName: "TYPE", field: "codeType", minWidth : 250, editable : true, cellEditor : 'text'},
		{headerName: "DESCRIPTION", field: "codeDsc", minWidth : 250, editable : true, cellEditor : 'text'},
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
				if(self.codeList != 'undefined'){
				   self.updateDeviation(params.node.id);
				   params.api.setRowData(self.codeList);
				}
			};
			
}
ngOnInit() {
			this.getSession();
			this.getUserGroup();
			this.loadcodeList();
			
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
createCodemaster = function(){
			var self = this;
			this.http.createCodemaster(self.codeCreateModel)
				.subscribe(
				(data) => {
					self.createcodeResponsedata = data;
					self.loadcodeList()
				},
				(error) => self.errorMsg = error,
				() => {
					self.successMsg = "Created Successfully.",
					self.codeCreateModel.code="";
					self.codeCreateModel.codeType="";
					self.codeCreateModel.codeDsc="";
					self.loadcodeList();
					
				}
			);
			var newItem =self.codeCreateModel;
			this.gridOptions.api.updateRowData({add: [newItem]});
			console.log("completed")
			
}

//load data
loadcodeList = function(){
		this.http.getCodemaster()
		.subscribe(
			(data) =>{
				this.codeList = data;
				console.log(data);
			},
			(error) => this.errorMsg = error,
			() => console.log("complete")

		);
}
//load delete data
deleteItem = function(indexdId){
			var self = this;
			this.gridOptions.api.setRowData(self.codeList);
			var id = self.codeList[indexdId].code
				this.http.deleteCodemaster(id)
				.subscribe(
				() => {
					
					self.loadcodeList()
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
			self.codeList[index].deviation = (self.codeList[index].code - self.codeList[index].code);
			self.codeList[index].deviation = (self.codeList[index].codeType - self.codeList[index].codeType);
			self.codeList[index].deviation = (self.codeList[index].codeDsc - self.codeList[index].codeDsc);
			self.http.editCodemaster( self.codeList[index] )
			.subscribe(
				(data) => {
					
					self.loadcodeList()
				},
				(error) => self.errorMsg = error,
				() => {
					self.successMsg = "Updated Successfully.";
					
			
						
				}
			);
			var newItem =self.codeCreateModel;
			this.gridOptions.api.updateRowData({add: [newItem]});
}
}
