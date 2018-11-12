import { Component, OnInit, AfterViewInit } from '@angular/core';
import * as $ from 'jquery';

import { HttpTestService } from '../../../services/http.service';
import { sessionServices } from '../../../services/session.services';
import { Router } from '@angular/router';
import {Observable} from 'rxjs/Rx';
import {GridOptions} from "ag-grid/main";
import {IMyDpOptions} from 'mydatepicker';
import {gridDeleteMasterComponent} from "../../common/gridRowDeleteMaster.component";
import { projectCreateModel } from '../../../models/project/projectCreate.model';


@Component({
  selector: 'app-payroll',
  templateUrl: './projectList.component.html'
})
export class projectListComponent implements OnInit {

	public myDatePickerOptions: IMyDpOptions = {
        // other options...
        dateFormat: 'yyyy-mm-dd'
	};
	
	public projectList : any = [];
	public projectCreateModel: projectCreateModel = new projectCreateModel();
	public createprojectResponsedata: any;
	public dateo:any;
	public datet:any;
	public dateth:any;
	public datef:any;
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
		{headerName: "NAME", field: "prjName", minWidth : 250, editable : true, cellEditor : 'text'},
		{headerName: "DESCRIPTION", field: "prjDsc", minWidth : 250, editable : true, cellEditor : 'text'},
		{headerName: "START DATE", field: "prjStartDt", minWidth : 150, editable : true, cellEditor : 'text'},
		{headerName: "END DATE", field: "prjEndDt", minWidth : 250, editable : true, cellEditor : 'text'},
		{headerName: "ACTUAL START DATE", field: "prjActualStartDt", minWidth : 150, editable : true, cellEditor : 'text'},
		{headerName: "ACTUAL END DATE", field: "prjActualEndDt", minWidth : 250, editable : true, cellEditor : 'text'},
		{headerName: "PLANNED DURATION", field: "plannedDuration", minWidth : 250, editable : true, cellEditor : 'text'},
		{headerName: "ACTUAL DURATION", field: "actualDuration", minWidth : 150, editable : true, cellEditor : 'text'},
		{headerName: "ALLOC BUDGET", field: "prjAllocBudget", minWidth : 250, editable : true, cellEditor : 'text'},
		{headerName: "STATUS", field: "prjStatus", minWidth : 150, editable : true, cellEditor : 'text'},
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
				if(self.projectList != 'undefined'){
				   self.updateDeviation(params.node.id);
				   params.api.setRowData(self.projectList);
				}
			};
			
}
ngOnInit() {
			this.getSession();
			this.getUserGroup();
			this.loadprojectList();
			
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
createProjectmaster = function(){
			var self = this;
			self.projectCreateModel.prjStartDt = self.dateo.formatted;
			self.projectCreateModel.prjEndDt = self.datet.formatted;
			self.projectCreateModel.prjActualStartDt = self.dateth.formatted;
			self.projectCreateModel.prjActualEndDt = self.datef.formatted;
	
			this.http.createProjectmaster(self.projectCreateModel)
				.subscribe(
				(data) => {
					self.createprojectResponsedata = data;
					self.loadprojectList()
				},
				(error) => self.errorMsg = error,
				() => {
					self.successMsg = "Created Successfully.";
					self.dateo="";
					self.datet="";
					self.dateth="";
					self.datef="";
					self.projectCreateModel.prjName="";
					self.projectCreateModel.prjDsc="";
					self.projectCreateModel.plannedDuration="";
					self.projectCreateModel.actualDuration="";
					self.projectCreateModel.prjAllocBudget="";
					self.projectCreateModel.prjAvlBudget="";
					self.projectCreateModel.prjStatus="";
					self.loadprojectList();
					
				}
			);
			var newItem =self.projectCreateModel;
			this.gridOptions.api.updateRowData({add: [newItem]});
			console.log("completed")
			
}

//load data
loadprojectList = function(){
		this.http.getProjectmaster()
		.subscribe(
			(data) =>{
				this.projectList = data;
				console.log(data);
			},
			(error) => this.errorMsg = error,
			() => console.log("complete")

		);
}
//load delete data
deleteItem = function(indexdId){
			var self = this;
			this.gridOptions.api.setRowData(self.projectList);
			var id = self.projectList[indexdId].id
				this.http.deleteProjectmaster(id)
				.subscribe(
				() => {
					
					self.loadprojectList()
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
			self.projectList[index].deviation = (self.projectList[index].prjName - self.projectList[index].prjName);
			self.projectList[index].deviation = (self.projectList[index].prjDsc - self.projectList[index].prjDsc);
			self.projectList[index].deviation = (self.projectList[index].prjStartDt - self.projectList[index].prjStartDt);
			self.projectList[index].deviation = (self.projectList[index].prjEndDt - self.projectList[index].prjEndDt);
			self.projectList[index].deviation = (self.projectList[index].prjActualStartDt - self.projectList[index].prjActualStartDt);
			self.projectList[index].deviation = (self.projectList[index].prjActualEndDt - self.projectList[index].prjActualEndDt);
			self.projectList[index].deviation = (self.projectList[index].plannedDuration - self.projectList[index].plannedDuration);
			self.projectList[index].deviation = (self.projectList[index].actualDuration - self.projectList[index].actualDuration);
			self.projectList[index].deviation = (self.projectList[index].prjAllocBudget - self.projectList[index].prjAllocBudget);
			self.projectList[index].deviation = (self.projectList[index].prjStatus - self.projectList[index].prjStatus);



			self.http.editProjectmaster( self.projectList[index] )
			.subscribe(
				(data) => {
					
					self.loadprojectList()
				},
				(error) => self.errorMsg = error,
				() => {
					self.successMsg = "Updated Successfully.";
					
			
						
				}
			);
			var newItem =self.projectCreateModel;
			this.gridOptions.api.updateRowData({add: [newItem]});
}
	
	
}
