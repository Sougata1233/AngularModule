import { Component, OnInit, AfterViewInit } from '@angular/core';
import * as $ from 'jquery';

import { HttpTestService } from '../../../services/http.service';
import { sessionServices } from '../../../services/session.services';
import { Router } from '@angular/router';
import {Observable} from 'rxjs/Rx';
import {GridOptions} from "ag-grid/main";
import {IMyDpOptions} from 'mydatepicker';
import {gridDeleteMasterComponent} from "../../common/gridRowDeleteMaster.component";
import { bankCreateModel } from '../../../models/bank/bankCreate.model';


@Component({
  selector: 'app-payroll',
  templateUrl: './CreateBank.component.html'
})
export class CreateBankComponent implements OnInit {
	public myDatePickerOptions: IMyDpOptions = {
        // other options...
        dateFormat: 'mm/dd/yyyy'
	};
	
	public bankList : any = [];
	public bankCreateModel: bankCreateModel = new bankCreateModel();
	public createBankresponsedata: any;
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
			{headerName: "NAME", field: "bname", minWidth : 250, editable : true, cellEditor : 'text'},
			{headerName: "LOCATION", field: "location", minWidth : 250, editable : true, cellEditor : 'text'},
			{headerName: "ADDRESS", field: "add", minWidth : 250, editable : true, cellEditor : 'text'},
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
				if(self.bankList != 'undefined'){
				   self.updateDeviation(params.node.id);
				   params.api.setRowData(self.bankList);
				}
				};
			
		}

		ngOnInit() {
			this.getSession();
			this.getUserGroup();
			this.loadbankList();
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
	createBankmaster = function(){
			var self = this;
			this.http.createBankmaster(self.bankCreateModel)
				.subscribe(
				(data) => {
					self.createBankresponsedata = data;
					self.loadbankList()
				},
				(error) => self.errorMsg = error,
				() => {
					self.successMsg = "Created Successfully.";
					self.bankCreateModel.id= "";
					self.bankCreateModel.bname= "";
					self.bankCreateModel.location= "";
					self.bankCreateModel.add= "";
					
				}
			);
			var newItem =self.bankCreateModel;
			this.gridOptions.api.updateRowData({add: [newItem]});
			console.log("completed")
			
}
	
	
//load table data
			
loadbankList = function() {
			var self = this;
			
			this.http.getBankmaster()
				.subscribe(
				(data) => {
					self.bankList = data;
				},
				(error) => self.errorMsg = error,
				() => console.log("completed")
			);
}

//edit data
	
updateDeviation = function(index){
			var self = this;
			self.bankList[index].deviation = (self.bankList[index].bname - self.bankList[index].bname);
			self.bankList[index].deviation = (self.bankList[index].location - self.bankList[index].location);
			self.bankList[index].deviation = (self.bankList[index].add - self.bankList[index].add);
			self.http.editBankmaster( self.bankList[index] )
			.subscribe(
				(data) => {
					
					self.loadbankList()
				},
				(error) => self.errorMsg = error,
				() => {
					self.successMsg = "Updated Successfully.";
					
			
						
				}
			);
			var newItem =self.bankCreateModel;
			this.gridOptions.api.updateRowData({add: [newItem]});
}
//delete data

deleteItem = function(indexdId){
			var self = this;
			this.gridOptions.api.setRowData(self.bankList);
			var id = self.bankList[indexdId].id
				this.http.deleteBankmaster(id)
				.subscribe(
				() => {
					
					self.loadbankList()
				},
				(error) => self.errorMsg = error,
				() => {
					self.successMsg = "Deleted Successfully."
					
				}
			);
			
			
	
}
	


}
