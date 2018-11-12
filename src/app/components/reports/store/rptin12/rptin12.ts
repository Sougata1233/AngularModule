import { Component, OnInit, AfterViewInit } from '@angular/core';
import * as $ from 'jquery';


import {IMyDpOptions} from 'mydatepicker';

import { reportModel } from '../../../../models/reports/reports.model';
import { HttpTestService } from '../../../../services/http.service';
import { AppSettings } from '../../../../config/settings/app-settings';

@Component({
  selector: 'app-worklist',
  templateUrl: './rptin12.html'
})
export class rptin12Component implements OnInit {
	
	public myDatePickerOptions: IMyDpOptions = {
        // other options...
        dateFormat: 'yyyy-mm-dd',
		disableSince : { year: new Date().getFullYear(), month: new Date().getMonth()+1, day: new Date().getDate()+1 }
    };
	
	public reportModel: reportModel = new reportModel();
	public reportdata : any = "";
	public company : string = "";
	public companyaddress : string = "";

	
	constructor(public http: HttpTestService) {
		this.company = AppSettings.COMPANY_NAME;
		this.companyaddress = AppSettings.COMPANY_ADDRESS_ONE+" "+AppSettings.COMPANY_ADDRESS_TWO;
	}
		
	ngOnInit() {
		
		
	}
	
	print = function(){
		window.print();
	}
	
	searchReport = function(){
		var self = this;
		self.reportdata = "";
		self.http.getRptinReport(self.reportModel.reportdate.formatted)
			.subscribe(
			(data) => {
				self.reportdata = data;
			},
			(error) => self.errorMsg = error,
			() => {
			}
		);
	}
	
	
}
