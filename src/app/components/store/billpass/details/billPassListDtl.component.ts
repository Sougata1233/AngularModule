import { Component, OnInit, AfterViewInit } from '@angular/core';
import * as $ from 'jquery';

import { HttpTestService } from '../../../../services/http.service';
import { AppSettings } from '../../../../config/settings/app-settings';
import { sessionServices } from '../../../../services/session.services';
import { Router, ActivatedRoute } from '@angular/router';
import {Observable} from 'rxjs/Rx';

@Component({
  selector: 'app-POcanceldtl',
  templateUrl: './billPassListDtl.component.html'
})
export class billPassListDtlComponent implements OnInit {
	
	public sub: any;
	public requestedId: string;
	public billpassDtlData : any;
	public errorMsg : string = "";
	public successMsg : string = "";
	public prefix : string = "";
	constructor(public http: HttpTestService, public router: Router, public activatedRoute: ActivatedRoute , public session: sessionServices) {
		this.prefix = AppSettings.PREFIX;
	}
		
	ngOnInit() {
		this.sub = this.activatedRoute.params.subscribe(params => {
			this.requestedId = params['id'];
		});
		
		this.getSession();
		this.loadBillDetails();
		}
	
	//get session details
	getSession = function(){
		this.sessionData = this.session.getSessionDetails();
	}
	
	
	loadBillDetails = function() {
		var self = this;
		
		this.http.getBillbyId(this.requestedId)
			.subscribe(
			(data) => {
				self.billpassDtlData = data;
			},
			(error) => self.errorMsg = error,
			() => {}
		);
	}
	
}
