import { Component, OnInit, AfterViewInit } from '@angular/core';
import * as $ from 'jquery';


import {IMyDpOptions} from 'mydatepicker';

import { reportModel } from '../../../../models/reports/reports.model';
import { HttpTestService } from '../../../../services/http.service';
import { AppSettings } from '../../../../config/settings/app-settings';

@Component({
  selector: 'app-worklist',
  templateUrl: './ReceiptRegister.component.html'
})
export class ReceiptRegisterComponent implements OnInit {
	
	public myDatePickerOptions: IMyDpOptions = {
        // other options...
        dateFormat: 'yyyy-mm-dd',
		disableSince : { year: new Date().getFullYear(), month: new Date().getMonth()+1, day: new Date().getDate()+1 }
    };
	
	public reportModel: reportModel = new reportModel();
	public reportdata : any = "";
	public company : string = "";
	public totrate : number = 0;
	public totActualrate : number = 0;
	public totalcfq : number = 0;
	public totalbale : number = 0;
	public totalweight : number = 0;
	
	
	constructor(public http: HttpTestService) {
		this.company = AppSettings.COMPANY_NAME;
	}
		
	ngOnInit() {
		
		
	}
	
	print = function(){
		window.print();
	}
	
	searchReport = function(){
		var self = this;
		self.reportdata = "";
		self.http.getReceiptRegister(self.reportModel.reportdate.formatted)
			.subscribe(
			(data) => {
				self.reportdata = data;
			},
			(error) => self.errorMsg = error,
			() => {
				for(var i=0; i<self.reportdata.length; i++){
					for(var m=0; m<self.reportdata[i].juteEntryDtls.length; m++){
						self.totrate = self.totrate + self.reportdata[i].juteEntryDtls[m].rate;
						self.totActualrate = self.totActualrate + (self.reportdata[i].juteEntryDtls[m].rate - self.reportdata[i].juteEntryDtls[m].claimsQuality);
						self.totalcfq = self.totalcfq + ((self.reportdata[i].juteEntryDtls[m].claimsQuality)?self.reportdata[i].juteEntryDtls[m].claimsQuality*1:0);
						self.totalbale = self.totalbale + ((self.reportdata[i].juteEntryDtls[m].baleQuantity)?self.reportdata[i].juteEntryDtls[m].baleQuantity:0);
						self.totalweight = self.totalweight + ((self.reportdata[i].juteEntryDtls[m].packingType=='LOOSE')?self.reportdata[i].juteEntryDtls[m].looseQuantity:self.reportdata[i].juteEntryDtls[m].actualWeight);
					}
				}
			}
		);
	}
	
	
}
