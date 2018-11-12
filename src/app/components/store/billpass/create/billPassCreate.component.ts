import { Component, OnInit, AfterViewInit } from '@angular/core';
import * as $ from 'jquery';

import { HttpTestService } from '../../../../services/http.service';
import { sessionServices } from '../../../../services/session.services';
import { AppSettings } from '../../../../config/settings/app-settings';
import { Router, ActivatedRoute } from '@angular/router';
import {Observable} from 'rxjs/Rx';

import { billPassModel } from '../../../../models/billpass/billPass.model';
import {IMyDpOptions} from 'mydatepicker';

@Component({
  selector: 'app-POcanceldtl',
  templateUrl: './billPassCreate.component.html'
})
export class billPassCreateComponent implements OnInit {
	
	public billPassModel: billPassModel = new billPassModel();
	public createBillpassResponsedata:any;
	public GRNDtllData : any;
	public successMsg: string ;
	public errorMsg: string ;
	public totSRMRvalue: any = 0 ;
	public prefix : string = "";
	
	public myDatePickerOptions: IMyDpOptions = {
        // other options...
        dateFormat: 'yyyy-mm-dd',
		disableSince : { year: new Date().getFullYear(), month: new Date().getMonth()+1, day: new Date().getDate()+1 }
    };
	
	public drcrPostData : any =  {
  "supplierCode": "S268",
  "grnNo": 72,
  "poId": "193",
  "billDate": 1509416358000,
  "billAmount": 198,
  "docType": null,
  "docNo": null,
  "adjustmentType": "DR",
  "financialYear": "2017"
};
	
	constructor(public http: HttpTestService, public router: Router, public activatedRoute: ActivatedRoute , public session: sessionServices) { 
	this.prefix = AppSettings.PREFIX;
	}
		
	ngOnInit() {
		
		}
	
	getGRNDetails = function(e, type){
		this.GRNDtllData = "";
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
					self.fetchGRNTotVal();
				},
				(error) => {
					this.errorMsg = "No data found against entered GRN.",
					this.GRNDtllData = ""
				},
				() => {}
			);
	}
	
	
	//fetch GRN details
	loadMRdetails = function(requestedId){
		var self = this;
		
		self.http.getMrbyId(requestedId)
			.subscribe(
				(data) => {
					this.GRNDtllData = data;
					self.fetchGRNTotVal();
				},
				(error) => {
					this.errorMsg = "No data found against entered GRN.",
					this.GRNDtllData = ""
				},
				() => {}
			);
	}
	
	//fetch GRN details
	fetchGRNTotVal = function(){
		var self = this;
		self.http.getTotGrnVal(self.billPassModel.SRNo,self.billPassModel.GRNType)
			.subscribe(
				(data) => {
					this.totSRMRvalue = data.totalValue;
				},
				(error) => {
					this.errorMsg = "No data found against entered GRN.",
					this.totSRMRvalue = ""
				},
				() => {}
			);
	}
	
	
	
	createBillpass = function(){
		var self = this;
		self.errorMsg = "";
		self.successMsg = "";
		
		
		self.drcrPostData.grnNo = self.billPassModel.SRNo;
		
		self.drcrPostData.billDate = new Date(self.billPassModel.createDate.date.year, self.billPassModel.createDate.date.month-1, self.billPassModel.createDate.date.day).getTime();
		self.drcrPostData.billAmount = self.billPassModel.billammount;
		self.drcrPostData.financialYear = new Date(self.billPassModel.createDate.date.year, self.billPassModel.createDate.date.month-1, self.billPassModel.createDate.date.day).getFullYear();
		self.drcrPostData.adjustmentType = self.billPassModel.DRCRType;
		self.drcrPostData.uiBillNo = self.billPassModel.billpassno;
	
		if(self.billPassModel.GRNType == 'SR'){
			self.drcrPostData.supplierCode = self.GRNDtllData.storeGoodReceiveHeader.supplierId;
			self.drcrPostData.poId = self.GRNDtllData.storeGoodReceiveHeader.poId;
		}else{
			self.drcrPostData.supplierCode = self.GRNDtllData.materialGoodReceiveHeader.supplierId;
			self.drcrPostData.poId = self.GRNDtllData.materialGoodReceiveHeader.poId;
		}
	
		
		this.http.createBillpass(self.drcrPostData)
			.subscribe(
			(data) => {
				self.createDRCRResponsedata = data;
			},
			(error) => self.errorMsg = error,
			() => {
				
				self.successMsg = "Bill Pass created successfully.",
				self.billPassModel.createDate = { date: { year: new Date().getFullYear(), month: new Date().getMonth()+1, day: new Date().getDate() } },
				self.billPassModel.DRCRType = "",
				self.billPassModel.GRNType = "",
				self.billPassModel.SRNo = "",
				self.GRNDtllData = "",
				self.billPassModel.billammount = 0
			}
		);
	}
	
}
