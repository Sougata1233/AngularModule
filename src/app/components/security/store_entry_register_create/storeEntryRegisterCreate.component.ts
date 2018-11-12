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
  templateUrl: './storeEntryRegisterCreate.component.html'
})
export class storeEntryRegisterCreateComponent implements OnInit {
	
	
	public myDatePickerOptions: IMyDpOptions = {
        // other options...
        dateFormat: 'yyyy-mm-dd',
		disableSince : { year: new Date().getFullYear(), month: new Date().getMonth()+1, day: new Date().getDate()+1 }
    };
	public storeCreateModel: storeCreateModel = new storeCreateModel();
	public successMsg: string ;
	public errorMsg: string ;
	public sessionData: any;
	public time : string ;
	public myOptions:any = [];
	public vendorAllData : any = [];
	public myPOOptions:any = [];
	public allPoData : any = [];
	public deptOptions:any = [];
	public allDeptData : any = [];
	public itemgrpoptions:any = [];
	public allitemgroup : any = [];
	public itemOtions:any = [];
	public allitemData : any = [];
	
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
	
	
	
	constructor(public http: HttpTestService, public session: sessionServices, public router: Router) {
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
		 this.gridOptions.onRowClicked = function(params) {
			 var clickedItem = $(params.event.target).attr("data-action-type");
			 //var typeofTarget = $(clickedItem.getAttribute("data-action-type");
			 if(clickedItem == "remove"){self.deleteItem(params.node.id)}
		 };
	}
	
	
		
	ngOnInit() {
		this.getSession();
		this.loadVendorDetrails();
		this.startTime();
		this.loadDepartments();
	}
	
	//get session details
	getSession = function(){
		this.sessionData = this.session.getSessionDetails();
	}
	
	startTime = function(){
	var today = new Date();
	let h = today.getHours();
	let m = today.getMinutes();
	let s = today.getSeconds();
	m = this.checkTime(m);
	s = this.checkTime(s);
	this.time = h + ':' + m + ':' + s
	setTimeout(() => {
	  this.startTime();
	}, 500);
	}
 
	 checkTime = function(i) {
		if (i < 10) {i = "0" + i};  
		return i;
	}
	
	
	loadDepartments = function() {
		var self = this;
		self.errorMsg = "";
		self.successMsg = "";
		this.http.getAllDepartments()
			.subscribe(
			(data) => {
				self.allDeptData = data;
			},
			(error) => self.errorMsg = error,
			() => {
				for(var i = 0; i<self.allDeptData.length; i++){
					if(self.allDeptData[i].name != 'JUTE'){
						var createObj = {
							value : self.allDeptData[i].name+"$&^"+self.allDeptData[i].id,
							label : self.allDeptData[i].name+"("+self.allDeptData[i].id+")"
						};
						self.deptOptions.push(createObj);
					}
				}
			}
		);
	}
	
	
	
	loadVendorDetrails = function() {
		$("#page_loader_service").fadeIn();
		var self = this;
		self.errorMsg = "";
		self.successMsg = "";
		this.http.getAllSuppliers()
			.subscribe(
			(data) => {
				self.vendorAllData = data;
			},
			(error) => self.errorMsg = error,
			() => {
				for(var i = 0; i<self.vendorAllData.length; i++){
					if(self.vendorAllData[i].type != 'J' && self.vendorAllData[i].type != 'O'){
						var createObj = {
							value : self.vendorAllData[i].name+"$&^"+self.vendorAllData[i].id,
							label : self.vendorAllData[i].name+"("+self.vendorAllData[i].id+")"
						};
						self.myOptions.push(createObj);
					}
				}
				$("#page_loader_service").fadeOut();
			}
		);
	}
	
	generatePO = function(e) {
		$("#page_loader_service").fadeIn();
		var self = this;
		self.errorMsg = "";
		self.successMsg = "";
		self.myPOOptions.length = 0;
		self.allPoData.length = 0;
		self.allPOLineItems.length = 0;
		self.storeCreateModel.selectrdGroup = "";
		self.storeCreateModel.reqquan = "";
		self.storeCreateModel.selectedDept = "";
		self.storeCreateModel.selectrdItem = "";
		self.storeCreateModel.po = null;
		//self.storeCreateModel.po = 0;
		var selectedSup = (e.value).split("$&^")[1];
		if(selectedSup != ''){
		this.http.grtApprovedBySuppcode(selectedSup)
			.subscribe(
			(data) => {
				self.allPoData = data;
			},
			(error) => self.errorMsg = error,
			() => {
				for(var i = 0; i<self.allPoData.length; i++){
					var createObj = {
							value : self.allPoData[i].id,
							label : self.allPoData[i].id
						};
						self.myPOOptions.push(createObj);
				}
				$("#page_loader_service").fadeOut();
			}
		);
		}
	}
	
	
	loadItemgroup = function(e) {
		$("#page_loader_service").fadeIn();
		var self = this;
		self.errorMsg = "";
		self.successMsg = "";
		self.itemgrpoptions.length = 0;
		self.allitemgroup.length = 0;
		self.itemOtions.length = 0;
		self.allitemData.length = 0;
		var selectedSup = (e.value).split("$&^")[1];
		if(selectedSup != ''){
		this.http.getItmgrpByDept(selectedSup)
			.subscribe(
			(data) => {
				self.allitemgroup = data;
			},
			(error) => self.errorMsg = error,
			() => {
				for(var i = 0; i<self.allitemgroup.length; i++){
					var createObj = {
							value : i,
							label : self.allitemgroup[i].name
						};
						self.itemgrpoptions.push(createObj);
				}
				$("#page_loader_service").fadeOut();
			}
		);
		}
	}
	
	
	loadItem = function(e) {
		$("#page_loader_service").fadeIn();
		var self = this;
		self.itemOtions.length = 0;
		self.allitemData.length = 0;
		self.errorMsg = "";
		self.successMsg = "";
		var selectedSup = self.allitemgroup[e.value].id;
		if(selectedSup != ''){
		this.http.getItemDescByGrpId(selectedSup)
			.subscribe(
			(data) => {
				self.allitemData = data.items;
			},
			(error) => self.errorMsg = error,
			() => {
				for(var i = 0; i<self.allitemData.length; i++){
					var createObj = {
							value : i,
							label : self.allitemData[i].legacyItemCode + "_" + self.allitemData[i].name
						};
						self.itemOtions.push(createObj);
				}
				$("#page_loader_service").fadeOut();
			}
		);
		}
	}
	

	
	loadPODetails = function(e) {
		var self = this;
		self.errorMsg = "";
		self.successMsg = "";
		self.allPOLineItems.length = 0;
		// self.allPoData.length = 0;
		if(self.storeCreateModel.po.length > 0){
			$("#page_loader_service").fadeIn();
			self.getPoDetailsOriginal(0);
		}
		
	}
	
	
	getPoDetailsOriginal = function(count) {
		var self = this;
		self.errorMsg = "";
		self.successMsg = "";
		var createObject = {
			"polineitems" : null
		};
		
		self.http.getPno(self.storeCreateModel.po[count])
					.subscribe(
					(data) => {
						createObject.polineitems = data;
					},
					(error) => self.errorMsg = error,
					() => {
						self.allPOLineItems.push(createObject);
						if(count == self.storeCreateModel.po.length-1){
							$("#page_loader_service").fadeOut();
						}else{
							count = count + 1;
							self.getPoDetailsOriginal(count);
						}
					}
		);
	}
	
	addItemToEntry = function(){
		var self=this;
		self.errorMsg = "";
		self.successMsg = "";
		if(self.allPOLineItems.length == 0){
		var createObjecta = {
			"polineitems" : [{
			"dept" : (self.storeCreateModel.selectedDept).split("$&^")[1],
			"deptName" : (self.storeCreateModel.selectedDept).split("$&^")[0],
			"itemDesc" : self.allitemData[self.storeCreateModel.selectrdItem].name,
			"reqQuantity" : self.storeCreateModel.reqquan,
			"unitId" : self.allitemData[self.storeCreateModel.selectrdItem].quantityUnit.id
			}]
		};
		self.allPOLineItems.push(createObjecta);
		}else{
			var createObjectb = {
			"dept" : (self.storeCreateModel.selectedDept).split("$&^")[1],
			"deptName" : (self.storeCreateModel.selectedDept).split("$&^")[0],
			"itemDesc" : self.allitemData[self.storeCreateModel.selectrdItem].name,
			"reqQuantity" : self.storeCreateModel.reqquan,
			"unitId" : self.allitemData[self.storeCreateModel.selectrdItem].quantityUnit.id
		};
		self.allPOLineItems[0].polineitems.push(createObjectb);
		}
		if(self.gridOptions.api != undefined){
			self.gridOptions.api.setRowData(self.allPOLineItems[0].polineitems);
		}
		
		self.storeCreateModel.selectedDept = "";
		self.storeCreateModel.selectrdItem = "";
		self.allitemData.length = 0;
		self.itemOtions.length = 0;
		self.storeCreateModel.selectrdGroup = "";
		self.allitemgroup.length = 0;
		self.itemgrpoptions.length = 0;
		self.storeCreateModel.reqquan = "";
		this.successMsg = "Item Added Successfully";
		
		
	}
	
	
	deleteItem = function(indexdId){
		var self = this;
		self.errorMsg = "";
		self.successMsg = "";
		
		self.allPOLineItems[0].polineitems.splice(indexdId, 1);
		self.gridOptions.api.setRowData(self.allPOLineItems[0].polineitems);
	}
	
	
	refreshVal = function(e){
		var self =this;
		self.errorMsg = "";
		self.successMsg = "";
		self.allPOLineItems.length = 0;
		self.itemgrpoptions.length = 0;
		self.allitemgroup.length = 0;
		self.itemOtions.length = 0;
		self.allitemData.length = 0;
		self.storeCreateModel.selectrdGroup = "";
		self.storeCreateModel.reqquan = "";
		self.storeCreateModel.selectedDept = "";
		self.storeCreateModel.selectrdItem = "";
		self.storeCreateModel.po = [];
		if(e.target.value == "PO"){
			self.columnDef = [
				{headerName: "Item Description", field: "itemDesc",minWidth : 150},
				{headerName: "Quantity", field: "quantity",minWidth : 150},
				{headerName: "Received Quantity", field: "reqQuantity", minWidth : 250, cellEditorFramework: numericRequiredEditorComponent, editable : true, valueFormatter: function (params) {
				  return parseFloat(parseFloat(params.value).toFixed(2));
				}},
				{headerName: "UOM", field: "unitId", minWidth : 150},
				{headerName: "Department", field: "dept", minWidth : 150}
			];
		}else{
			self.columnDef = [
				{headerName: "Item Description", field: "itemDesc",minWidth : 150},
				{headerName: "Received Quantity", field: "reqQuantity", minWidth : 250, cellEditorFramework: numericRequiredEditorComponent, editable : true, valueFormatter: function (params) {
				  return parseFloat(parseFloat(params.value).toFixed(2));
				}},
				{headerName: "UOM", field: "unitId", minWidth : 150},
				{headerName: "Department", field: "deptName", minWidth : 150},
				{headerName: "Delete", field: "", suppressMenu: true, minWidth : 80, maxWidth : 80, width : 80, cellRendererFramework: gridDeleteComponent}
			];
		}
	}
	
	createStoreEntry = function(){
		var self= this;
		self.errorMsg = "";
		self.successMsg = "";
		var createPostData = {
			"challanDate" : (self.storeCreateModel.challandate.date.year).toString()+"-"+(self.storeCreateModel.challandate.date.month).toString()+"-"+(self.storeCreateModel.challandate.date.day).toString(),
			"challanNo" : self.storeCreateModel.challanNo,
			"driverName" : self.storeCreateModel.driverName,
			"inDate" : (self.storeCreateModel.createDate.date.year).toString()+"-"+(self.storeCreateModel.createDate.date.month).toString()+"-"+(self.storeCreateModel.createDate.date.day).toString(),
			"inTime" : this.time,
			"polineitems" : self.allPOLineItems,
			"poNo" : self.storeCreateModel.po,
			"remarks" : self.storeCreateModel.remarks,
			"suppCode" : (self.storeCreateModel.supplier).split("$&^")[1],
			"supplierName" : (self.storeCreateModel.supplier).split("$&^")[0],
			"vehicleNo" : self.storeCreateModel.vehicleNo,
			"updateBy" : self.sessionData.sessionUserName
			
		}
		

		
		
		this.http.createStoreentry(createPostData)
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
				// this.successMsg = "Created Successfully";
				// this.date = "";
				self.myPOOptions.length = 0;
				self.allPoData.length = 0;
				self.allPOLineItems.length = 0;
				self.storeCreateModel.challanNo = "";
				self.storeCreateModel.driverName = "";
				self.storeCreateModel.po = null;
				self.storeCreateModel.remarks = "";
				self.storeCreateModel.supplier = null;
				self.storeCreateModel.vehicleNo = "";
				self.storeCreateModel.chaalantype = "";
				self.storeCreateModel.challandate = { date: { year: new Date().getFullYear(), month: new Date().getMonth()+1, day: new Date().getDate() } };
				self.storeCreateModel.createDate = { date: { year: new Date().getFullYear(), month: new Date().getMonth()+1, day: new Date().getDate() } };
				
			}
		);
	}
	
}
	
	
	

