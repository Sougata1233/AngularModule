import { Component, OnInit, AfterViewInit } from '@angular/core';
import * as $ from 'jquery';

import { HttpTestService } from '../../../services/http.service';
import { sessionServices } from '../../../services/session.services';
import { Router } from '@angular/router';
import {Observable} from 'rxjs/Rx';
import {GridOptions} from "ag-grid/main";
import {IMyDpOptions} from 'mydatepicker';
import {gridDeleteMasterComponent} from "../../common/gridRowDeleteMaster.component";
import { frameCreateModel } from '../../../models/frame/frameCreate.model';


@Component({
  selector: 'app-payroll',
  templateUrl: './frameList.component.html'
})
export class frameListComponent implements OnInit {

	public myDatePickerOptions: IMyDpOptions = {
        // other options...
        dateFormat: 'mm/dd/yyyy'
	};

	public frameList : any = [];
	public frameCreateModel: frameCreateModel = new frameCreateModel();
	public createframeResponsedata: any;
	public gridOptions: GridOptions;
	public successMsg: string ;
	public errorMsg: string ;
	public requestedURL : any;
	public userGroupData : any = '';
	public userMenuData : any = '';
	public userSelectionMenuData : any = [];
	public sessionData: any;
	public columnDef : any = [
		{headerName: "ID", field: "id", minWidth : 150},
		{headerName: "NO", field: "frameNo", minWidth : 250, editable : true, cellEditor : 'text'},
		{headerName: "SIDE", field: "side", minWidth : 250, editable : true, cellEditor : 'text'},
		{headerName: "TROLLY NO", field: "trollyNo", minWidth : 150, editable : true, cellEditor : 'text'},
		{headerName: "TYPE", field: "frameType", minWidth : 250, editable : true, cellEditor : 'text'},
		{headerName: "SPINDLE QTY TYPE", field: "spindleQtyTyp", minWidth : 250, editable : true, cellEditor : 'text'},
		{headerName: "BOBBIN WEIGHT", field: "bobbinWeight", minWidth : 150, editable : true, cellEditor : 'text'},
		{headerName: "MC NUM", field: "mcNum", minWidth : 250, editable : true, cellEditor : 'text'},
		{headerName: "FRAME VVFD", field: "frameVvfd", minWidth : 250, editable : true, cellEditor : 'text'},
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
				if(self.frameList != 'undefined'){
				   self.updateDeviation(params.node.id);
				   params.api.setRowData(self.frameList);
				}
			};
			
}
ngOnInit() {
			this.getSession();
			this.getUserGroup();
			this.loadframeList();
			
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
createFramemaster = function(){
			var self = this;
			this.http.createFramemaster(self.frameCreateModel)
				.subscribe(
				(data) => {
					self.createframeResponsedata = data;
					self.loadframeList()
				},
				(error) => self.errorMsg = error,
				() => {
					self.successMsg = "Created Successfully.";
					self.frameCreateModel.id="";
					self.frameCreateModel.frameNo="";
					self.frameCreateModel.side="";
					self.frameCreateModel.trollyNo="";
					self.frameCreateModel.frameType="";
					self.frameCreateModel.spindleQtyTyp="";
					self.frameCreateModel.bobbinWeight="";
					self.frameCreateModel.mcNum="";
					self.frameCreateModel.frameVvfd="";
					self.loadframeList();
					
				}
			);
			var newItem =self.frameCreateModel;
			this.gridOptions.api.updateRowData({add: [newItem]});
			console.log("completed")
			
}

//load data
loadframeList = function(){
		this.http.getFramemaster()
		.subscribe(
			(data) =>{
				this.frameList = data;
				console.log(data);
			},
			(error) => this.errorMsg = error,
			() => console.log("complete")

		);
}
//load delete data
deleteItem = function(indexdId){
			var self = this;
			this.gridOptions.api.setRowData(self.frameList);
			var id = self.frameList[indexdId].id
				this.http.deleteFramemaster(id)
				.subscribe(
				() => {
					
					self.loadframeList()
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
			self.frameList[index].deviation = (self.frameList[index].id - self.frameList[index].id);
			self.frameList[index].deviation = (self.frameList[index].frameNo - self.frameList[index].frameNo);
			self.frameList[index].deviation = (self.frameList[index].side - self.frameList[index].side);
			self.frameList[index].deviation = (self.frameList[index].trollyNo - self.frameList[index].trollyNo);
			self.frameList[index].deviation = (self.frameList[index].frameType - self.frameList[index].frameType);
			self.frameList[index].deviation = (self.frameList[index].spindleQtyTyp - self.frameList[index].spindleQtyTyp);
			self.frameList[index].deviation = (self.frameList[index].bobbinWeight - self.frameList[index].bobbinWeight);
			self.frameList[index].deviation = (self.frameList[index].mcNum - self.frameList[index].mcNum);
			self.frameList[index].deviation = (self.frameList[index].frameVvfd - self.frameList[index].frameVvfd);

			self.http.editFramemaster( self.frameList[index] )
			.subscribe(
				(data) => {
					
					self.loadframeList()
				},
				(error) => self.errorMsg = error,
				() => {
					self.successMsg = "Updated Successfully.";
					
			
						
				}
			);
			var newItem =self.frameCreateModel;
			this.gridOptions.api.updateRowData({add: [newItem]});
}
	
	
}
