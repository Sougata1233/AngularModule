import { Component, OnInit, AfterViewInit } from '@angular/core';
import * as $ from 'jquery';

import { HttpTestService } from '../../../services/http.service';
import { sessionServices } from '../../../services/session.services';
import { Router } from '@angular/router';
import {Observable} from 'rxjs/Rx';
import {GridOptions} from "ag-grid/main";
import {IMyDpOptions} from 'mydatepicker';
import {gridDeleteMasterComponent} from "../../common/gridRowDeleteMaster.component";
import { machineCreateModel } from '../../../models/machine/machineCreate.model';

@Component({
  selector: 'app-payroll',
  templateUrl: './createMachine.component.html'
})
export class createMachineComponent implements OnInit {
	
	public myDatePickerOptions: IMyDpOptions = {
        // other options...
        dateFormat: 'mm/dd/yyyy'
	};
	
	public machineList : any = [];
	public machineCreateModel:machineCreateModel = new machineCreateModel;
	public createmachineResponsedata: any;
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
		{headerName: "DESCRIPITION", field: "machineDsc", minWidth : 250, editable : true, cellEditor : 'text'},
		{headerName: "MILL FACT", field: "millFact", minWidth : 250, editable : true, cellEditor : 'text'},
		{headerName: "ACTIVE FLAG", field: "activeFlag", minWidth : 250, editable : true, cellEditor : 'text'},
		{headerName: "DEPT", field: "dept", minWidth : 150, editable : true, cellEditor : 'text'},
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
				if(self.machineList != 'undefined'){
				   self.updateDeviation(params.node.id);
				   params.api.setRowData(self.machineList);
				}
			};
			
}
ngOnInit() {
			this.getSession();
			this.getUserGroup();
			this.loadmachineList();
			
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
createMachinemaster = function(){
			var self = this;
				this.http.createMachinemaster(self.machineCreateModel)
				.subscribe(
				(data) => {
					self.createmachineResponsedata = data;
					self.loadmachineList()
				},
				(error) => self.errorMsg = error,
				() => {
					self.successMsg = "Created Successfully.";
					self.machineCreateModel.id="";
					self.machineCreateModel.machineDsc="";
					self.machineCreateModel.millFact="";
					self.machineCreateModel.activeFlag="";
					self.machineCreateModel.dept="";
					self.loadmachineList();
				}
			);
			var newItem =self.machineCreateModel;
			this.gridOptions.api.updateRowData({add: [newItem]});
			console.log("completed")
			
}

//load data
loadmachineList = function(){
		this.http.getMachinemaster()
		.subscribe(
			(data) =>{
				this.machineList = data;
				console.log(data);
			},
			(error) => this.errorMsg = error,
			() => console.log("complete")

		);
}
//load delete data
deleteItem = function(indexdId){
			var self = this;
			this.gridOptions.api.setRowData(self.machineList);
			var id = self.machineList[indexdId].id
				this.http.deleteMachinemaster(id)
				.subscribe(
				() => {
					
					self.loadmachineList()
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

			self.machineList[index].deviation = (self.machineList[index].machineDsc - self.machineList[index].machineDsc);
			self.machineList[index].deviation = (self.machineList[index].millFact - self.machineList[index].millFact);
			self.machineList[index].deviation = (self.machineList[index].activeFlag - self.machineList[index].activeFlag);
			self.machineList[index].deviation = (self.machineList[index].dept - self.machineList[index].dept);
			self.http.editMachinemaster( self.machineList[index] )
			.subscribe(
				(data) => {
					
					self.loadmachineList()
				},
				(error) => self.errorMsg = error,
				() => {
					self.successMsg = "Updated Successfully.";
					
			
						
				}
			);
			var newItem =self.machineCreateModel;
			this.gridOptions.api.updateRowData({add: [newItem]});
}


}
