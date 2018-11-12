import { Component, OnInit, AfterViewInit } from '@angular/core';
import * as $ from 'jquery';

import { HttpTestService } from '../../../services/http.service';
import { sessionServices } from '../../../services/session.services';
import { Router } from '@angular/router';
import {Observable} from 'rxjs/Rx';
import {GridOptions} from "ag-grid/main";
import {IMyDpOptions} from 'mydatepicker';
import {gridDeleteMasterComponent} from "../../common/gridRowDeleteMaster.component";
import { usergroupCreateModel } from '../../../models/usergroup/usergroupCreate.model';


@Component({
  selector: 'app-payroll',
  templateUrl: './createUsergroup.component.html'
})
export class createUsergroupmasterComponent implements OnInit {
	public myDatePickerOptions: IMyDpOptions = {
        // other options...
        dateFormat: 'yyyy-mm-dd'
	};

	public usergroupList : any = [];
	public usergroupCreateModel: usergroupCreateModel = new usergroupCreateModel();
	public createusergroupResponsedata: any;
	public gridOptions: GridOptions;
	public successMsg: string ;
	public errorMsg: string ;
	public requestedURL : any;
	public userGroupData : any = '';
	public userMenuData : any = '';
	public userSelectionMenuData : any = [];
	public sessionData: any;
	public columnDef : any = [
		{headerName: "S NO", field: "id", minWidth : 150},
		{headerName: "NAME", field: "usrgrpName", minWidth : 250, editable : true, cellEditor : 'text'},
		{headerName: "ISENABLE", field: "isenable", minWidth : 250},
		{headerName: "FROM DATE", field: "fromDate", minWidth : 150, editable : true, cellEditor : 'text'},
		{headerName: "TO DATE", field: "toDate", minWidth : 250, editable : true, cellEditor : 'text'},
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
				if(self.usergroupList != 'undefined'){
				   self.updateDeviation(params.node.id);
				   params.api.setRowData(self.usergroupList);
				}
			};
			
}
ngOnInit() {
			this.getSession();
			this.getUserGroup();
			this.loadusergroupList();
			
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
createUsergroupmaster = function(){
			var self = this;
			self.usergroupCreateModel.fromDate = new Date(self.usergroupCreateModel.fromDate.formatted);
			self.usergroupCreateModel.toDate = new Date(self.usergroupCreateModel.toDate.formatted);
			this.http.createUsergroupmaster(self.usergroupCreateModel)
				.subscribe(
				(data) => {
					self.createusergroupResponsedata = data;
					self.loadusergroupList()
				},
				(error) => self.errorMsg = error,
				() => {
					self.successMsg = "Created Successfully.";
					self.usergroupCreateModel.fromDate="";
					self.usergroupCreateModel.toDate ="";
					self.usergroupCreateModel.usrgrpName="";
					self.usergroupCreateModel.isenable="";
					this.loadusergroupList();
					
				}
			);
			var newItem =self.usergroupCreateModel;
			this.gridOptions.api.updateRowData({add: [newItem]});
			console.log("completed")
			
}

//load data
loadusergroupList = function(){
		this.http.getUsergroupmaster()
		.subscribe(
			(data) =>{
				this.usergroupList = data;
				console.log(data);
			},
			(error) => this.errorMsg = error,
			() => console.log("complete")

		);
}
//load delete data
deleteItem = function(indexdId){
			var self = this;
			this.gridOptions.api.setRowData(self.usergroupList);
			var id = self.usergroupList[indexdId].id
				this.http.deleteUsergroupmaster(id)
				.subscribe(
				() => {
					
					self.loadusergroupList()
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
			self.usergroupList[index].deviation = (self.usergroupList[index].usrgrpName - self.usergroupList[index].usrgrpName);
			self.usergroupList[index].deviation = (self.usergroupList[index].fromDate - self.usergroupList[index].fromDate);
			self.usergroupList[index].deviation = (self.usergroupList[index].toDate - self.usergroupList[index].toDate);

			self.http.editUsergroupmaster( self.usergroupList[index] )
			.subscribe(
				(data) => {
					
					self.loadusergroupList()
				},
				(error) => self.errorMsg = error,
				() => {
					self.successMsg = "Updated Successfully.";
					
			
						
				}
			);
			var newItem =self.usergroupCreateModel;
			this.gridOptions.api.updateRowData({add: [newItem]});
}


	
}
