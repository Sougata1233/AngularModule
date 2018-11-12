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
import {gridActualQuantityTriggerComponent} from "../../common/gridActualQuantityTrigger.component";

@Component({
  selector: 'app-worklist',
  templateUrl: './juteEntryRegisterEdit.component.html'
})
export class juteEntryRegisterEditComponent implements OnInit {
	
	
	public myDatePickerOptions: IMyDpOptions = {
        // other options...
        dateFormat: 'yyyy-mm-dd',
		disableSince : { year: new Date().getFullYear(), month: new Date().getMonth()+1, day: new Date().getDate()+1 }
    };
	public storeCreateModel: storeCreateModel = new storeCreateModel();
	public itemQuality : any = [];
	public respecteditemQuality : any = [];
	public qualityoptions : any = [];
	public AllJuteTypes : any = [];
	public successMsg: string ;
	public errorMsg: string ;
	public sessionData: any;
	public time : string ;
	public myOptions:any = [];
	public vendorAllData : any = [];
	public myPOOptions:any = [];
	public allPoData : any = [];
	public deptOptions:any = [];
	public allMukamData : any = [];
	public mukamOptions:any = [];
	public allDeptData : any = [];
	public itemgrpoptions:any = [];
	public allitemgroup : any = [];
	public itemOtions:any = [];
	public allitemData : any = [];
	public actualQualityEdit : any = "";
	public allPOLineItems : any = [];
	public storeResponsedata : any = "";
	public totalPOQuantity : any = 0;
	public appendPoData : any = [];
	public appendModeOn : boolean = false;
	public AllEntryData : any;
	public gridOptions: GridOptions;
	public allVehicles : any = [];
	public allVehiclesoptions : any = [];
	
	
	public sub: any;
	public requestedId: string;
	public challanData : any = "";
	
	
	
	
	
	
	public columnDef : any = [
		{headerName: "Advised Jute Type", field: "advisedJuteTyp",minWidth : 150},
		{headerName: "Advised Quality", field: "advisedQuality",minWidth : 150},
		{headerName: "Actual Quality", field: "actualQuality",minWidth : 150, cellRendererFramework : gridActualQuantityTriggerComponent},
		{headerName: "Conversion Type", field: "receivedIn",minWidth : 150},
		{headerName: "Advised Quantity", field: "advisedQuantity",minWidth : 150},
		{headerName: "Actual Quantity", field: "actualQuantity", minWidth : 250, cellEditorFramework: numericRequiredEditorComponent, editable : true, valueFormatter: function (params) {
          return parseFloat(parseFloat(params.value).toFixed(2));
        }},
		{headerName: "Converted Quantity", field: "actualQuantity",minWidth : 150, valueFormatter: function (params) {
         if(params.data.receivedIn == 'BALE'){
			 return (params.value).toString() +" BALE";
		 }else{
			
		 }
        }},
		{headerName: "Weight", field: "quantity",minWidth : 150},
		{headerName: "UOM", field: "uom", minWidth : 150},
		{headerName: "Remarks", field: "remarks", minWidth : 150}
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
		 this.gridOptions.onRowClicked = function(params) {
			 var clickedItem = $(params.event.target).attr("data-action-type");
			 //var typeofTarget = $(clickedItem.getAttribute("data-action-type");
			 if(clickedItem == "remove"){self.deleteItem(params.node.id)}
			 if(clickedItem == "actualqualitytrigger"){self.openQualityEdit(params);}
		 };
		 this.gridOptions.onCellEditingStopped = function(params) {
			 if(self.allPOLineItems[0].polineitems != 'undefined'){
				 self.totalPOQuantity = 0;
				for(var i=0; i<self.allPOLineItems[0].polineitems.length; i++){
					self.allPOLineItems[0].polineitems[i].quantity = (self.allPOLineItems[0].polineitems[i].receivedIn == 'BALE')?(self.allPOLineItems[0].polineitems[i].actualQuantity*1.5):self.allPOLineItems[0].polineitems[i].actualQuantity;
					self.totalPOQuantity = self.totalPOQuantity + parseFloat(parseFloat(self.allPOLineItems[0].polineitems[i].quantity).toFixed(2));
				}
				params.api.setRowData(self.allPOLineItems[0].polineitems);
				}
			 };
	}
	
	
		
	ngOnInit() {
		this.getSession();
		this.loadVendorDetrails();
		this.startTime();
		this.getAllJuteTypes();
		this.getAllVehicles();
		
		this.sub = this.activatedRoute.params.subscribe(params => {
			this.requestedId = params['id'];
		});
		
		this.loadChallanDetails();
	}
	
	
	loadChallanDetails = function() {
		$("#page_loader_service").fadeIn();
		var self = this;
		self.errorMsg = "";
		
		this.http.getJuteentryById(self.requestedId)
			.subscribe(
			(data) => {
				self.challanData = data;
			},
			(error) => self.errorMsg = error,
			() => {
				self.allPOLineItems.length = 0;
				var chobj = {
					"polineitems" : null
				};
				self.allPOLineItems.push(chobj);
				self.allPOLineItems[0].polineitems = self.challanData.polineitem;
				var fetchedDate = self.challanData.chalanDate;
					fetchedDate = fetchedDate.split("-");
					var dateObj = { 
									date: { year: parseInt(fetchedDate[0]), month: parseInt(fetchedDate[1]), day: parseInt(fetchedDate[2]) },
									formatted : self.challanData.chalanDate
								};
				self.storeCreateModel.challandate = dateObj;
				
				self.totalPOQuantity = 0;
				for(var i=0; i<self.allPOLineItems[0].polineitems.length; i++){
					self.allPOLineItems[0].polineitems[i].quantity = (self.allPOLineItems[0].polineitems[i].receivedIn == 'BALE')?(self.allPOLineItems[0].polineitems[i].actualQuantity*1.5):self.allPOLineItems[0].polineitems[i].actualQuantity;
					self.totalPOQuantity = self.totalPOQuantity + parseFloat(parseFloat(self.allPOLineItems[0].polineitems[i].quantity).toFixed(2));
				}
				
				self.columnDef = [
					{headerName: "Advised Jute Type", field: "advisedJuteTyp",minWidth : 150},
					{headerName: "Advised Quality", field: "advisedQuality",minWidth : 150},
					{headerName: "Actual Quality", field: "actualQuality",minWidth : 150, cellRendererFramework : gridActualQuantityTriggerComponent},
					{headerName: "Conversion Type", field: "receivedIn",minWidth : 150},
					{headerName: "Advised Quantity", field: "advisedQuantity",minWidth : 150},
					{headerName: "Actual Quantity", field: "actualQuantity", minWidth : 250, cellEditorFramework: numericRequiredEditorComponent, editable : true, valueFormatter: function (params) {
					  return parseFloat(parseFloat(params.value).toFixed(2));
					}},
					{headerName: "Converted Quantity", field: "actualQuantity",minWidth : 150, valueFormatter: function (params) {
					 if(params.data.receivedIn == 'BALE'){
						 return (params.value).toString() +" BALE";
					 }else{
						 var fltweight = parseFloat(params.data.quantity);
						 var fltconv = ((fltweight/self.totalPOQuantity)*100).toFixed(2);
						 return fltconv.toString() +" %";
					 }
					}},
					{headerName: "Weight", field: "quantity",minWidth : 150},
					{headerName: "UOM", field: "uom", minWidth : 150},
					{headerName: "Remarks", field: "remarks", minWidth : 150}
				];
				
				
				
				$("#page_loader_service").fadeOut();
			}
		);
	}
	
	
	//get all vehicles
	getAllVehicles = function(){
		var self = this;
		this.http.getAllVehicles()
		  .subscribe(
			(data) => {
			  this.allVehicles = data;
			  },
			(error) => {
				this.errorMsg = error;
				this.allVehicles = "";
			},
			() => {
				
				for(var i = 0; i<self.allVehicles.length; i++){
					var createObj = {
							value : i,
							label : self.allVehicles[i].vehicleType
						};
						self.allVehiclesoptions.push(createObj);
				}
			}
		  );
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
					if(self.vendorAllData[i].type == 'J'){
						var createObj = {
							value : i,
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
		self.allMukamData.length = 0;
		self.mukamOptions.length = 0;
		//self.storeCreateModel.po = 0;
		var selectedSup = self.vendorAllData[e.value].id;
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
							value : i,
							label : self.allPoData[i].id
						};
						self.myPOOptions.push(createObj);
				}
				self.loadmukams(selectedSup);
				
			}
		);
		}
	}
	
	
	loadmukams = function(sup) {
		var self = this;
		self.errorMsg = "";
		self.successMsg = "";
		self.http.getAllMukamsbysup(sup)
			.subscribe(
			(data) => {
				self.allMukamData = data;
			},
			(error) => self.errorMsg = error,
			() => {
				for(var i = 0; i<self.allMukamData.length; i++){
					var createObj = {
							value : i,
							label : self.allMukamData[i].mukamName
						};
						self.mukamOptions.push(createObj);
				}
				$("#page_loader_service").fadeOut();
			}
		);
	}
	
	
	

	
	loadPODetails = function(e) {
		$("#page_loader_service").fadeIn();
		var self = this;
		self.errorMsg = "";
		self.successMsg = "";
		self.allPOLineItems.length = 0;
		self.appendPoData = "";
		
		self.poforchalandetls(self.allPoData[e.value].id);
		
		
	}
	
	poforchalandetls = function(po){
		var self = this;
		var createObject = {
			"polineitems" : null
		};
		self.errorMsg = "";
		self.successMsg = "";
		self.allPOLineItems.length = 0;
		self.appendPoData = "";
		
		self.http.getJutelineitemBypono(po)
					.subscribe(
					(data) => {
						createObject.polineitems = data;
					},
					(error) => self.errorMsg = error,
					() => {
						for(var i=0; i<createObject.polineitems.length; i++){
							self.totalPOQuantity = self.totalPOQuantity + createObject.polineitems[i].weight;
						}
						self.columnDef = [
							{headerName: "Advised Jute Type", field: "advisedJuteType",minWidth : 150},
							{headerName: "Advised Quality", field: "advisedQuality",minWidth : 150},
							{headerName: "Actual Quality", field: "actualQuality",minWidth : 150, cellRendererFramework : gridActualQuantityTriggerComponent},
							{headerName: "Conversion Type", field: "receivedIn",minWidth : 150},
							{headerName: "Advised Quantity", field: "advisedQuantity",minWidth : 150},
							{headerName: "Actual Quantity", field: "actualQuantity", minWidth : 250, cellEditorFramework: numericRequiredEditorComponent, editable : true, valueFormatter: function (params) {
							  return parseFloat(parseFloat(params.value).toFixed(2));
							}},
							{headerName: "Converted Quantity", field: "actualQuantity",minWidth : 150, valueFormatter: function (params) {
							 if(params.data.receivedIn == 'BALE'){
								 return params.value +" BALE";
							 }else{
								 var fltweight = parseFloat(params.data.weight);
								 var fltconv = ((fltweight/self.totalPOQuantity)*100).toFixed(2);
								 return fltconv.toString() +" %";
							 }
							}},
							{headerName: "Weight", field: "weight",minWidth : 150},
							{headerName: "UOM", field: "uom", minWidth : 150},
							{headerName: "Remarks", field: "remarks", minWidth : 150}
						];
						self.allPOLineItems.push(createObject);
						
						self.http.getPOData(po)
							.subscribe(
							(data) => {
								self.appendPoData = data;
							},
							(error) => self.errorMsg = error,
							() => {
								if(self.gridOptions.api != undefined){
									self.gridOptions.api.setRowData(self.allPOLineItems[0].polineitems);
								}
								$("#page_loader_service").fadeOut();
							}
						);
						
						
					}
		);
	}
	
	
	addItemToEntry = function(){
		var self=this;
		self.errorMsg = "";
		self.successMsg = "";
		var itemQuan = (self.storeCreateModel.cnvtp == "LOOSE")?(self.allVehicles[self.storeCreateModel.vehicletype].weight*(self.storeCreateModel.reqquan/100)):(self.storeCreateModel.reqquan*1.5);
		
		if(self.allPOLineItems.length == 0){
			self.totalPOQuantity = 0;
			self.totalPOQuantity = (self.totalPOQuantity*1) + (1*itemQuan);
		var createObjecta = {
			"polineitems" : [{
			"advisedJuteType" : self.AllJuteTypes[self.storeCreateModel.selectrdItem].name,
			"advisedQuality" : self.respecteditemQuality[self.storeCreateModel.selectedQuality].name,
			"advisedQuantity" : self.allVehicles[self.storeCreateModel.vehicletype].weight,
			"poConvertedQuantity" : (self.storeCreateModel.cnvtp == "LOOSE")?itemQuan:self.storeCreateModel.reqquan,
			"quantity" : itemQuan,
			"receivedIn" : self.storeCreateModel.cnvtp,
			"vehicleType" :  self.allVehicles[self.storeCreateModel.vehicletype].id
			}]
		};
		self.allPOLineItems.push(createObjecta);
		}else{
			self.totalPOQuantity = (self.totalPOQuantity*1) + (1*itemQuan);
			var createObjectb = {
			"advisedJuteType" : self.AllJuteTypes[self.storeCreateModel.selectrdItem].name,
			"advisedQuality" : self.respecteditemQuality[self.storeCreateModel.selectedQuality].name,
			"advisedQuantity" : self.allVehicles[self.storeCreateModel.vehicletype].weight,
			"poConvertedQuantity" : (self.storeCreateModel.cnvtp == "LOOSE")?itemQuan:self.storeCreateModel.reqquan,
			"quantity" : itemQuan,
			"receivedIn" : self.storeCreateModel.cnvtp,
			"vehicleType" :  self.allVehicles[self.storeCreateModel.vehicletype].id
		};
		self.allPOLineItems[0].polineitems.push(createObjectb);
		}
		if(self.gridOptions.api != undefined){
			self.gridOptions.api.setRowData(self.allPOLineItems[0].polineitems);
		}
		
		self.storeCreateModel.selectrdItem = "";
		self.storeCreateModel.cnvtp = "LOOSE";
		self.storeCreateModel.selectedQuality = "";
		self.storeCreateModel.vehicletype = "";
		self.qualityoptions.length = 0;
		self.respecteditemQuality.length = 0;
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
		self.allitemData.length = 0;
		self.storeCreateModel.selectrdGroup = "";
		self.storeCreateModel.reqquan = "";
		self.storeCreateModel.selectedDept = "";
		self.storeCreateModel.selectrdItem = "";
		self.storeCreateModel.po = [];
		
		if(e.target.value == "PO"){
			self.columnDef = [
				{headerName: "Advised Jute Type", field: "advisedJuteType",minWidth : 150},
				{headerName: "Advised Quality", field: "advisedQuality",minWidth : 150},
				{headerName: "Actual Quality", field: "actualQuality",minWidth : 150, cellRendererFramework : gridActualQuantityTriggerComponent},
				{headerName: "Conversion Type", field: "receivedIn",minWidth : 150},
				{headerName: "Advised Quantity", field: "advisedQuantity",minWidth : 150},
				{headerName: "Actual Quantity", field: "actualQuantity", minWidth : 250, cellEditorFramework: numericRequiredEditorComponent, editable : true, valueFormatter: function (params) {
				  return parseFloat(parseFloat(params.value).toFixed(2));
				}},
				{headerName: "Converted Quantity", field: "actualQuantity",minWidth : 150, valueFormatter: function (params) {
				 if(params.data.receivedIn == 'BALE'){
					 return params.value;
				 }else{
					 
				 }
				}},
				{headerName: "Weight", field: "weight",minWidth : 150},
				{headerName: "UOM", field: "uom", minWidth : 150},
				{headerName: "Remarks", field: "remarks", minWidth : 150}
			];
		}else{
			self.columnDef = [
				{headerName: "Advised Jute Type", field: "advisedJuteType",minWidth : 150},
				{headerName: "Quality", field: "advisedQuality",minWidth : 150},
				{headerName: "Conversion Type", field: "receivedIn",minWidth : 150},
				{headerName: "Quantity", field: "quantity",minWidth : 150},
				{headerName: "Converted Quantity", field: "poConvertedQuantity",minWidth : 150, valueFormatter: function (params) {
							 if(params.data.receivedIn == 'BALE'){
								 return params.value +" BALE";
							 }else{
								 return params.value +" %";
							 }
				}},
				{headerName: "Remarks", field: "remarks", minWidth : 150},
				{headerName: "Delete", field: "", suppressMenu: true, minWidth : 80, maxWidth : 80, width : 80, cellRendererFramework: gridDeleteComponent}
				
			];
		}
	}
	
	createStoreEntry = function(){
		var self= this;
		self.errorMsg = "";
		self.successMsg = "";
		var createPostData = {
			"brokerAddress" : ((self.vendorAllData[self.storeCreateModel.supplier].address1)?self.vendorAllData[self.storeCreateModel.supplier].address1:"")+" "+((self.vendorAllData[self.storeCreateModel.supplier].address2)?self.vendorAllData[self.storeCreateModel.supplier].address2:"")+" "+((self.vendorAllData[self.storeCreateModel.supplier].address3)?self.vendorAllData[self.storeCreateModel.supplier].address3:""),
			"chalanDate" : (self.storeCreateModel.challandate.date.year).toString()+"-"+(self.storeCreateModel.challandate.date.month).toString()+"-"+(self.storeCreateModel.challandate.date.day).toString(),
			"chalanNo" : self.storeCreateModel.challanNo,
			"challanWeight" : self.storeCreateModel.challanweight,
			"driverName" : self.storeCreateModel.driverName,
			"finYear" : self.storeCreateModel.challandate.date.year,
			"grossWeight" : self.storeCreateModel.grossweight,
			"inDate" : (self.storeCreateModel.createDate.date.year).toString()+"-"+(self.storeCreateModel.createDate.date.month).toString()+"-"+(self.storeCreateModel.createDate.date.day).toString(),
			"inTime" : this.time,
			"mukam" : (self.storeCreateModel.chaalantype == 'WPO')?self.allMukamData[self.storeCreateModel.mukam].mukamName:self.allPoData[self.storeCreateModel.po].mukam,
			"poNo" : (self.storeCreateModel.chaalantype == 'WPO')?null:self.allPoData[self.storeCreateModel.po].id,
			"suppCode" : self.vendorAllData[self.storeCreateModel.supplier].id,
			"supplierName" : self.vendorAllData[self.storeCreateModel.supplier].name,
			"suppName" : self.vendorAllData[self.storeCreateModel.supplier].name,
			"transporter" : self.storeCreateModel.transporter,
			"vehicleNo" : self.storeCreateModel.vehicleNo,
			"polineitem": self.allPOLineItems[0].polineitems,
			"updateBy" : self.sessionData.sessionUserName
			
		}
		

		
		
		this.http.createJuteentry(createPostData)
		.subscribe(
			(res) =>{
				this.storeResponsedata = res.json();
				if(res.status===208){
					this.errorMsg = "Same record already exist.";
				}else{
					this.successMsg = "Jute Entry Created successfully."; 
				}
			},
			(error) => this.errorMsg = error,
			() =>{
				// this.successMsg = "Created Successfully";
				// this.date = "";
				self.myPOOptions.length = 0;
				self.allPoData.length = 0;
				self.allPOLineItems.length = 0;
				self.storeCreateModel.tareweight = 0;
				self.storeCreateModel.grossweight = 0;
				self.storeCreateModel.challanweight = 0;
				self.storeCreateModel.challanNo = "";
				self.storeCreateModel.driverName = "";
				self.storeCreateModel.transporter = "";
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
	
	getAllJuteTypes = function(){
		var self = this;
		self.itemOtions.length = 0;
		self.http.getItemDescByGrpId(999)
			.subscribe(
			(data) => {
				self.AllJuteTypes = data.items;
			},
			(error) => self.errorMsg = error,
			() => {
				
				for(var i = 0; i<self.AllJuteTypes.length; i++){
					var createObj = {
							value : i,
							label : self.AllJuteTypes[i].legacyItemCode + "_" + self.AllJuteTypes[i].name
						};
						self.itemOtions.push(createObj);
				}
			}
		);
	}
	
	
	openQualityEdit = function(params){
		var self = this;
		self.itemQuality.length = 0;
		self.actualQualityEdit  = params.node.id;
		
		var itemId;
		for(var i = 0; i<self.AllJuteTypes.length; i++){
			if(self.AllJuteTypes[i].name == params.data.advisedJuteTyp){
				itemId = self.AllJuteTypes[i].id;
			}
		}
		
		
		self.http.getAllQuality(itemId)
			.subscribe(
			(data) => {
				self.itemQuality = data;
			},
			(error) => self.errorMsg = error,
			() => {
				for(var i = 0; i<self.itemQuality.length; i++){
					if(self.itemQuality[i].name == params.data.actualQuality){
						self.storeCreateModel.selectedActualQuality = i;
					}
				}
			}
		);
	}
	
	
	updateActualQuality = function(){
		var self = this;
		self.allPOLineItems[0].polineitems[self.actualQualityEdit].actualQuality = self.itemQuality[self.storeCreateModel.selectedActualQuality].name;
		self.closeQuzlityDialog();
	}
	
	
	closeQuzlityDialog = function(){
		var self = this;
		self.actualQualityEdit = "";
		self.gridOptions.api.setRowData(self.allPOLineItems[0].polineitems);
	}
	
	


	
	updateEntry = function(){
		var self= this;
		self.errorMsg = "";
		self.successMsg = "";
		self.challanData.chalanDate = self.storeCreateModel.challandate.formatted;
		self.challanData.updateBy = self.sessionData.sessionUserName;
		self.challanData.polineitem = self.allPOLineItems[0].polineitems;
		self.challanData.actualWeight = (1*self.challanData.grossWeight) - (1*self.challanData.tareWeight);
		this.http.updateJuteEntry(self.challanData)
		.subscribe(
			(res) =>{
				this.storeResponsedata = res.json();
				if(res.status===208){
					this.errorMsg = "Same record already exist.";
				}else{
					this.successMsg = "Jute Entry Updated Successfully."; 
				}
			},
			(error) => this.errorMsg = error,
			() =>{
				self.successMsg = "Jute Entry Updated Successfully";
				self.loadChallanDetails();
				
			}
		);
	}
	
	
	outEntry = function(){
		var self= this;
		self.errorMsg = "";
		self.successMsg = "";
		self.challanData.chalanDate = self.storeCreateModel.challandate.formatted;
		self.challanData.updateBy = self.sessionData.sessionUserName;
		self.challanData.polineitem = self.allPOLineItems[0].polineitems;
		self.challanData.actualWeight = (1*self.challanData.grossWeight) - (1*self.challanData.tareWeight);
		this.http.outJuteEntry(self.challanData)
		.subscribe(
			(res) =>{
				this.storeResponsedata = res.json();
				if(res.status===208){
					this.errorMsg = "Same record already exist.";
				}else{
					this.successMsg = "Jute Entry Out successfully."; 
				}
			},
			(error) => this.errorMsg = error,
			() =>{
				self.successMsg = "Jute Entry Out Successfully";
				self.loadChallanDetails();
				
			}
		);
	}
	
	
	validateTare = function(e){
		var self = this;
		self.errorMsg = "";
		self.successMsg = "";
		var changedval = e.target.value;
		if(changedval > self.challanData.grossWeight){
			self.challanData.tareWeight = self.challanData.grossWeight;
			self.errorMsg = "Tare Weight can not be greater than Gross Weight.";
		}
	}
	
}
	
	
	

