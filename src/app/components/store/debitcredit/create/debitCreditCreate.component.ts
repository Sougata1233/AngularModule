import { Component, OnInit, AfterViewInit } from '@angular/core';
import * as $ from 'jquery';

import { HttpTestService } from '../../../../services/http.service';
import { AppSettings } from '../../../../config/settings/app-settings';
import { sessionServices } from '../../../../services/session.services';
import { Router, ActivatedRoute } from '@angular/router';
import {Observable} from 'rxjs/Rx';

import { debitCreditModel } from '../../../../models/debitcredit/debitCredit.model';
import {IMyDpOptions} from 'mydatepicker';

@Component({
  selector: 'app-POcanceldtl',
  templateUrl: './debitCreditCreate.component.html'
})
export class debitCreditCreateComponent implements OnInit {
	
	public myDatePickerOptions: IMyDpOptions = {
        // other options...
        dateFormat: 'yyyy-mm-dd',
		disableSince : { year: new Date().getFullYear(), month: new Date().getMonth()+1, day: new Date().getDate()+1 }
    };
	
	public debitCreditModel: debitCreditModel = new debitCreditModel();
	public createDRCRResponsedata:any;
	public statusChangeResponsedata : any;
	public GRNDtllData : any;
	public successMsg: string ;
	public errorMsg: string ;
	public prefix : string = "";
	public drcritemoption : any = [];
	public debitorcreditoption : any = [{
							value : 'DR',
							label : 'DR'
						},
						{
							value : 'CR',
							label : 'CR'
						}];
	public drcrtypeoption : any = [{
							value : 'MR',
							label : 'MR'
						},
						{
							value : 'SR',
							label : 'SR'
						}];
	public drcrPostData : any = {
	"adjustmentType": "CR",
 	"adjustmentDate": 1509415464000,
 	"financialYear": "2017",
 	"supplierCode": "S268",
 	"grnNo": 72,
 	"grnYear": "2017",
 	"grnDate": 1509415487000,
 	"item": {},
 	"adjustmentQunatity": 20,
 	"adjustmentValue": 1234.6,
 	"quantityUnit": {},
 	"reason": "Sample test"
 };
	
	constructor(public http: HttpTestService, public router: Router, public activatedRoute: ActivatedRoute , public session: sessionServices) {
		this.prefix = AppSettings.PREFIX;
	}
		
	ngOnInit() {
		
		}
		
	resetParams = function(){
		var self = this;
		self.GRNDtllData = "";
		self.drcritemoption.length = 0;
		self.debitCreditModel.itemCode = "";
		self.debitCreditModel.drcrremarks = "";
		self.debitCreditModel.GRNType ="";
		self.debitCreditModel.SRNo = "";
		self.debitCreditModel.DRCRQuan = 0;
		self.debitCreditModel.DRCRType = null;
	}
	
	grnTypeChange = function(){
		var self = this;
		self.GRNDtllData = "";
		self.drcritemoption.length = 0;
		self.debitCreditModel.itemCode = "";
		self.debitCreditModel.drcrremarks = "";
		self.debitCreditModel.SRNo = "";
		self.debitCreditModel.DRCRQuan = 0;
		self.debitCreditModel.DRCRType = null;
	}
	
	itemChange = function(e){
		var self = this;
		if(self.debitCreditModel.GRNType == 'SR'){
			self.debitCreditModel.DRCRQuan = self.GRNDtllData.storeGrnItemList[e.value].deviation;
		}else{
			self.debitCreditModel.DRCRQuan = self.GRNDtllData.materialGrnItemList[e.value].deviation;
		}
		self.debitCreditModel.DRCRType = (self.debitCreditModel.DRCRQuan>-1)?'DR':'CR';
		self.debitCreditModel.drcrremarks = "";
	}
	
	getGRNDetails = function(e, type){
		var self=this;
		this.GRNDtllData = "";
		self.drcritemoption.length = 0;
		this.debitCreditModel.DRCRQuan = null;
		this.debitCreditModel.itemCode = "";
		this.debitCreditModel.drcrremarks = "";
		var enteredVal = e.target.value.trim();
		if(type == "SR"){
			this.loadSRdetails(enteredVal);
		}else{
			this.loadMRdetails(enteredVal);
		}
	}
	
	
	
	//fetch GRN details
	loadSRdetails = function(requestedId){
		var self = this;
		
		self.http.getSrbyId(requestedId)
			.subscribe(
				(data) => {
					this.GRNDtllData = data;
				},
				(error) => {
					this.errorMsg = "No data found against entered GRN.",
					this.GRNDtllData = ""
				},
				() => {
					for(var i = 0; i<self.GRNDtllData.storeGrnItemList.length; i++){
						if(self.GRNDtllData.storeGrnItemList[i].debitNotesFlag != 'Y' && self.GRNDtllData.storeGrnItemList[i].status != '4'){
						var createObj = {
							value :  i.toString(),
							label : self.GRNDtllData.storeGrnItemList[i].item.legacyItemCode+"_"+self.GRNDtllData.storeGrnItemList[i].item.name
						};
						self.drcritemoption.push(createObj);
						}
				}
				}
			);
	
	
	}
	
	//fetch GRN details
	loadMRdetails = function(requestedId){
		var self = this;
		
		self.http.getMrbyId(requestedId)
			.subscribe(
				(data) => {
					this.GRNDtllData = data;
				},
				(error) => {
					this.errorMsg = "No data found against entered GRN.",
					this.GRNDtllData = ""
				},
				() => {
					for(var i = 0; i<self.GRNDtllData.materialGrnItemList.length; i++){
						if(self.GRNDtllData.materialGrnItemList[i].debitNotesFlag != 'Y' && self.GRNDtllData.materialGrnItemList[i].status != '4'){
						var createObj = {
							value : i.toString(),
							label : self.GRNDtllData.materialGrnItemList[i].item.legacyItemCode+"_"+self.GRNDtllData.materialGrnItemList[i].item.name+"_"+self.GRNDtllData.materialGrnItemList[i].actualQuality.name
						};
						self.drcritemoption.push(createObj);
						}
				}
				}
			);
	}
	
	
	
	createDRCR = function(){
		var self = this;
		self.errorMsg = "";
		self.successMsg = "";
		
		
		self.drcrPostData.adjustmentDate = new Date(self.debitCreditModel.createDate.date.year, self.debitCreditModel.createDate.date.month-1, self.debitCreditModel.createDate.date.day).getTime();
		self.drcrPostData.financialYear = self.debitCreditModel.createDate.date.year;
		self.drcrPostData.grnNo = self.debitCreditModel.SRNo;
		self.drcrPostData.reason = self.debitCreditModel.drcrremarks;
		
		if(self.debitCreditModel.GRNType == 'SR'){
		
			self.drcrPostData.adjustmentType =  self.debitCreditModel.DRCRType;
			self.drcrPostData.supplierCode = self.GRNDtllData.storeGoodReceiveHeader.supplierId;
			self.drcrPostData.grnYear = new Date(self.GRNDtllData.storeGoodReceiveHeader.goodReceiptDate).getFullYear();
			self.drcrPostData.grnDate = self.GRNDtllData.storeGoodReceiveHeader.goodReceiptDate;
			self.drcrPostData.item = self.GRNDtllData.storeGrnItemList[self.debitCreditModel.itemCode].item;
			self.drcrPostData.adjustmentQunatity = self.debitCreditModel.DRCRQuan*1;
			self.drcrPostData.adjustmentValue = (self.GRNDtllData.storeGrnItemList[self.debitCreditModel.itemCode].receivedPrice * self.debitCreditModel.DRCRQuan);
			self.drcrPostData.quantityUnit = self.GRNDtllData.storeGrnItemList[self.debitCreditModel.itemCode].uomCode;
			self.updateSR();
		}else{
			self.drcrPostData.adjustmentType =  self.debitCreditModel.DRCRType;
			self.drcrPostData.supplierCode = self.GRNDtllData.materialGoodReceiveHeader.supplierId;
			self.drcrPostData.grnYear = new Date(self.GRNDtllData.materialGoodReceiveHeader.goodReceiptDate).getFullYear();
			self.drcrPostData.grnDate = self.GRNDtllData.materialGoodReceiveHeader.goodReceiptDate;
			self.drcrPostData.item = self.GRNDtllData.materialGrnItemList[self.debitCreditModel.itemCode].item;
			self.drcrPostData.adjustmentQunatity = self.debitCreditModel.DRCRQuan*1;
			self.drcrPostData.adjustmentValue = (self.GRNDtllData.materialGrnItemList[self.debitCreditModel.itemCode].rate * self.debitCreditModel.DRCRQuan);
			self.drcrPostData.quantityUnit = self.GRNDtllData.materialGrnItemList[self.debitCreditModel.itemCode].quantityUnit;
			self.updateMR();
		}
}
	
	
	updateSR = function(){
		var self = this;
		self.GRNDtllData.storeGrnItemList[self.debitCreditModel.itemCode].debitNotesFlag = "Y";
		
		this.http.updateSR(self.GRNDtllData)
			.subscribe(
			(data) => {
				self.statusChangeResponsedata = data;
			},
			(error) => self.errorMsg = error,
			() => {
				self.createDRSRAfterUpdate();
			}
		);
	}
	
	
	updateMR = function(){
		var self = this;
		self.GRNDtllData.materialGrnItemList[self.debitCreditModel.itemCode].debitNotesFlag = "Y";
		
		this.http.updateMR(self.GRNDtllData)
			.subscribe(
			(data) => {
				self.statusChangeResponsedata = data;
			},
			(error) => self.errorMsg = error,
			() => {
				self.createDRSRAfterUpdate();
			}
		);
	}
	
	createDRSRAfterUpdate = function(){
		var self = this;
		this.http.createDRCR(self.drcrPostData)
			.subscribe(
			(data) => {
				self.createDRCRResponsedata = data;
			},
			(error) => self.errorMsg = error,
			() => {
				
				self.successMsg = "DR/CR created successfully.",
				self.debitCreditModel.createDate = { date: { year: new Date().getFullYear(), month: new Date().getMonth()+1, day: new Date().getDate() } },
				self.debitCreditModel.DRCRType = "",
				self.debitCreditModel.SRNo = "",
				self.debitCreditModel.GRNType = "",
				self.GRNDtllData = "",
				self.drcritemoption.length = 0,
				self.debitCreditModel.DRCRType = null,
				self.debitCreditModel.itemCode = "",
				self.debitCreditModel.adjustmentQunatity = 1,
				self.debitCreditModel.drcrremarks = "",
				this.resetParams()
			}
		);
	}
	
	
}
