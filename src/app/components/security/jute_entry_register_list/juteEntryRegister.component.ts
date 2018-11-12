import { Component, OnInit, AfterViewInit } from '@angular/core';
import * as $ from 'jquery';



import {IMyDpOptions} from 'mydatepicker';
import { storeCreateModel} from '../../../models/storeentryregister/storeCreate.model';
import {gridjuteeditLinkComponent} from "../../common/juteEditLink";
import { HttpTestService } from '../../../services/http.service';
import { sessionServices } from '../../../services/session.services';
import { Router,ActivatedRoute} from '@angular/router';
import {GridOptions} from "ag-grid/main";
import {gridDateComponent} from "../../common/gridDateFormat.component";

@Component({
  selector: 'app-worklist',
  templateUrl: './juteEntryRegister.component.html'
})
export class juteEntryRegisterComponent implements OnInit {
	
	
	public myDatePickerOptions: IMyDpOptions = {
        // other options...
        dateFormat: 'yyyy-mm-dd',
		disableSince : { year: new Date().getFullYear(), month: new Date().getMonth()+1, day: new Date().getDate()+1 }
    };
	public storeCreateModel: storeCreateModel = new storeCreateModel();
	public successMsg: string ;
	public errorMsg: string ;
	public sessionData: any;
	public AllEntryData : any;
	public gridOptions: GridOptions;
	public columnDef : any = [
		// {headerName: "Id", field: "id",cellRendererFramework: gridjuteeditLinkComponent, minWidth : 150},
		{headerName: "CHALLAN NO", field: "chalanNo",minWidth : 150},
		{headerName: "CHALLAN DATE", field: "chalanDate", minWidth : 250},
		{headerName: "VECHICLE NO", field: "vehicleNo", minWidth : 150},
		{headerName: "DRIVER NAME", field: "driverName", minWidth : 150},
		{headerName: "SUPPLIER NAME", field: "supplierName", minWidth : 150},
		{headerName: "ENTRY DATE", field: "inDate", minWidth : 150},
		{headerName: "ENTRY TIME", field: "inTime", minWidth : 150},
		{headerName: "EXIT DATE", field: "outDate", minWidth : 150},
		{headerName: "EXIT TIME", field: "outTime", minWidth : 150}
	
	];
	
	
	public onQuickFilterChanged($event) {
        this.gridOptions.api.setQuickFilter($event.target.value);
    }
	
	
	
	constructor(public http: HttpTestService, public session: sessionServices, public router: Router) {
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
			self.router.navigate(['security/juteentryregister',params.data.id]);
		};

	}
	
	
		
	ngOnInit() {
		this.getSession();
		this.searchEntry();
	}
	
	//get session details
	getSession = function(){
		this.sessionData = this.session.getSessionDetails();
	}
	
	searchEntry = function(){
		$("#page_loader_service").fadeIn();
		var self = this;
		var startRangeDate:any = (self.storeCreateModel.fromDaterange.date.year).toString()+"-"+(self.storeCreateModel.fromDaterange.date.month).toString()+"-"+(self.storeCreateModel.fromDaterange.date.day).toString();
		var toRangeDate:any = (self.storeCreateModel.toDaterange.date.year).toString()+"-"+(self.storeCreateModel.toDaterange.date.month).toString()+"-"+(self.storeCreateModel.toDaterange.date.day).toString();
		self.http.getJuteEntryByRange(startRangeDate,toRangeDate)
			.subscribe(
			(data) => {
				self.AllEntryData = data;
			},
			(error) => self.errorMsg = error,
			() => {
				if(self.gridOptions.api != undefined){
				self.gridOptions.api.setRowData(self.AllEntryData);
				}
				$("#page_loader_service").fadeOut();
			}
		);
	}
	
	
	
}
	
	
	

