import { Component, OnInit, AfterViewInit } from '@angular/core';
import * as $ from 'jquery';
import {IMyDpOptions} from 'mydatepicker';
import { storeCreateModel} from '../../../models/storeentryregister/storeCreate.model';
import {numericRequiredEditorComponent} from "../../editor/numericRequiredEditor.component";

import {gridstoreeditLinkComponent} from "../../common/storeEditLink";
import { HttpTestService } from '../../../services/http.service';
import { sessionServices } from '../../../services/session.services';
import { Router,ActivatedRoute} from '@angular/router';
import {GridOptions} from "ag-grid/main";
import {gridDateComponent} from "../../common/gridDateFormat.component";
import {gridDeleteComponent} from "../../common/gridRowDelete.component";

@Component({
  selector: 'app-worklist',
  templateUrl: './storeEntryRegisterEdit.component.html'
})
export class storeEntryRegisterEditComponent implements OnInit {
	
	
	public myDatePickerOptions: IMyDpOptions = {
        // other options...
        dateFormat: 'yyyy-mm-dd',
		disableSince : { year: new Date().getFullYear(), month: new Date().getMonth()+1, day: new Date().getDate()+1 }
    };
	public storeCreateModel: storeCreateModel = new storeCreateModel();
	public successMsg: string ;
	public errorMsg: string ;
	public sessionData: any;
	public challanData : any = "";
	public sub: any;
	public requestedId: string;
	public allPOLineItems : any = [];
	public storeResponsedata : any = "";
	
	
	
	public AllEntryData : any;
	public gridOptions: GridOptions;
	
	
	
	
	
	
	public columnDef : any = [
		{headerName: "Item Description", field: "itemDesc",minWidth : 150},
		{headerName: "Quantity", field: "quantity",minWidth : 150},
		{headerName: "Received Quantity", field: "reqQuantity", minWidth : 250, cellEditorFramework: numericRequiredEditorComponent, editable : true, valueFormatter: function (params) {
          return parseFloat(parseFloat(params.value).toFixed(2));
        }},
		{headerName: "UOM", field: "unitId", minWidth : 150},
		{headerName: "Department", field: "dept", minWidth : 150}
	];
	
	
	public onQuickFilterChanged($event) {
        this.gridOptions.api.setQuickFilter($event.target.value);
    }
	
	
	
	constructor(public http: HttpTestService, public session: sessionServices, public router: Router, public activatedRoute: ActivatedRoute) {
		var self = this;
		 this.gridOptions = <GridOptions>{};
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
	}
	
	
		
	ngOnInit() {
		this.sub = this.activatedRoute.params.subscribe(params => {
			this.requestedId = params['id'];
		});
		this.getSession();
		this.loadChallanDetails();
	}
	
	//get session details
	getSession = function(){
		this.sessionData = this.session.getSessionDetails();
	}
	
	
	
	loadChallanDetails = function() {
		$("#page_loader_service").fadeIn();
		var self = this;
		self.errorMsg = "";
		
		this.http.getStoreentryById(self.requestedId)
			.subscribe(
			(data) => {
				self.challanData = data;
			},
			(error) => self.errorMsg = error,
			() => {
				self.allPOLineItems = self.challanData.polineitems;
				var fetchedDate = self.challanData.challanDate;
					fetchedDate = fetchedDate.split("-");
					var dateObj = { 
									date: { year: parseInt(fetchedDate[0]), month: parseInt(fetchedDate[1]), day: parseInt(fetchedDate[2]) },
									formatted : self.challanData.challanDate
								};
				self.storeCreateModel.challandate = dateObj;
				$("#page_loader_service").fadeOut();
			}
		);
	}
	
	
	
	
	updateEntry = function(){
		var self= this;
		self.errorMsg = "";
		self.successMsg = "";
		self.challanData.challanDate = self.storeCreateModel.challandate.formatted;
		self.challanData.updateBy = self.sessionData.sessionUserName;
		self.challanData.polineitems = self.allPOLineItems;
		this.http.updateStoreEntry(self.challanData)
		.subscribe(
			(res) =>{
				this.storeResponsedata = res.json();
				if(res.status===208){
					this.errorMsg = "Same record already exist.";
				}else{
					this.successMsg = "Store Entry Created successfully."; 
				}
			},
			(error) => this.errorMsg = error,
			() =>{
				self.successMsg = "Store Entry Updated Successfully";
				self.loadChallanDetails();
				
			}
		);
	}
	
	outEntry = function(){
		var self= this;
		self.errorMsg = "";
		self.successMsg = "";
		self.challanData.challanDate = self.storeCreateModel.challandate.formatted;
		self.challanData.updateBy = self.sessionData.sessionUserName;
		self.challanData.polineitems = self.allPOLineItems;
		this.http.outStoreEntry(self.challanData)
		.subscribe(
			(res) =>{
				this.storeResponsedata = res.json();
				if(res.status===208){
					this.errorMsg = "Same record already exist.";
				}else{
					this.successMsg = "Store Entry Out successfully."; 
				}
			},
			(error) => this.errorMsg = error,
			() =>{
				self.successMsg = "Store Entry Out Successfully";
				self.loadChallanDetails();
				
			}
		);
	}
	
}
	
	
	

