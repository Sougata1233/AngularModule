import { Component, OnInit, AfterViewInit } from '@angular/core';
import * as $ from 'jquery';

import {IMyDpOptions} from 'mydatepicker';

import { reportModel } from '../../../../models/reports/reports.model';
import { HttpTestService } from '../../../../services/http.service';
import { AppSettings } from '../../../../config/settings/app-settings';


@Component({
  selector: 'app-worklist',
  templateUrl: './juteRateReport.component.html'
})
export class juteRateReportComponent implements OnInit {
	
	public myDatePickerOptions: IMyDpOptions = {
        // other options...
        dateFormat: 'yyyy-mm-dd',
		disableSince : { year: new Date().getFullYear(), month: new Date().getMonth()+1, day: new Date().getDate()+1 }
    };
	
	public reportModel: reportModel = new reportModel();
	public reportdata : any = "";
	public company : string = "";
	
	
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
		self.http.juteratereport(self.reportModel.reportdate.formatted)
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
