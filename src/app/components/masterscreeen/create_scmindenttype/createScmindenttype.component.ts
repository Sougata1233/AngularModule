import { Component, OnInit, AfterViewInit } from '@angular/core';
import * as $ from 'jquery';

import { HttpTestService } from '../../../services/http.service';
import { sessionServices } from '../../../services/session.services';
import { Router } from '@angular/router';
import {Observable} from 'rxjs/Rx';
import {GridOptions} from "ag-grid/main";

import {gridDeleteMasterComponent} from "../../common/gridRowDeleteMaster.component";
import { scmindenttypeCreateModel } from '../../../models/scmindenttype/scmindenttypeCreate.model';


@Component({
  selector: 'app-payroll',
  templateUrl: './createScmindenttype.component.html'
})
export class createScmindenttypeComponent implements OnInit {

	public scmindenttypeList : any = [];
	public scmindenttypeCreateModel: scmindenttypeCreateModel = new scmindenttypeCreateModel();
	public createscmindenttypeResponsedata: any;
	public gridOptions: GridOptions;
	public successMsg: string ;
	public errorMsg: string ;
	public requestedURL : any;
	public userGroupData : any = '';
	public userMenuData : any = '';
	public userSelectionMenuData : any = [];
	public sessionData: any;
	public columnDef : any = [
		{headerName: "S NO", field: "id", minWidth : 150, editable : true, cellEditor : 'text'},
		{headerName: "CODE", field: "indentTypeCode", minWidth : 250, editable : true, cellEditor : 'text'},
		{headerName: "DESCRIPTION", field: "indentTypeDsc", minWidth : 250, editable : true, cellEditor : 'text'},
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
				if(self.scmindenttypeList != 'undefined'){
				   self.updateDeviation(params.node.id);
				   params.api.setRowData(self.scmindenttypeList);
				}
			};
			
}
ngOnInit() {
			this.getSession();
			this.getUserGroup();
			this.loadscmindenttypeList();
			
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
createScmindenttype = function(){
			var self = this;
			this.http.createScmindenttype(self.scmindenttypeCreateModel)
				.subscribe(
				(data) => {
					self.createscmindenttypeResponsedata = data;
					self.loadscmindenttypeList()
				},
				(error) => self.errorMsg = error,
				() => {
					self.successMsg = "Created Successfully.";
					self.scmindenttypeCreateModel.id="";
					self.scmindenttypeCreateModel.indentTypeCode="";
					self.scmindenttypeCreateModel.indentTypeDsc="";
					self.loadscmindenttypeList();
					
				}
			);
			var newItem =self.scmindenttypeCreateModel;
			this.gridOptions.api.updateRowData({add: [newItem]});
			console.log("completed")
			
}

//load data
loadscmindenttypeList = function(){
		this.http.getScmindenttype()
		.subscribe(
			(data) =>{
				this.scmindenttypeList = data;
				console.log(data);
			},
			(error) => this.errorMsg = error,
			() => console.log("complete")

		);
}
//load delete data
deleteItem = function(indexdId){
			var self = this;
			this.gridOptions.api.setRowData(self.scmindenttypeList);
			var id = self.scmindenttypeList[indexdId].id
				this.http.deleteScmindenttype(id)
				.subscribe(
				() => {
					
					self.loadscmindenttypeList()
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
			self.scmindenttypeList[index].deviation = (self.scmindenttypeList[index].id - self.scmindenttypeList[index].id);
			self.scmindenttypeList[index].deviation = (self.scmindenttypeList[index].indentTypeCode - self.scmindenttypeList[index].indentTypeCode);
			self.scmindenttypeList[index].deviation = (self.scmindenttypeList[index].indentTypeDsc - self.scmindenttypeList[index].indentTypeDsc);
			self.http.editScmindenttype( self.scmindenttypeList[index] )
			.subscribe(
				(data) => {
					
					self.loadscmindenttypeList()
				},
				(error) => self.errorMsg = error,
				() => {
					self.successMsg = "Updated Successfully.";
					
			
						
				}
			);
			var newItem =self.scmindenttypeCreateModel;
			this.gridOptions.api.updateRowData({add: [newItem]});
}
	
}
