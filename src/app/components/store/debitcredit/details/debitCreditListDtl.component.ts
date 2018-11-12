import { Component, OnInit, AfterViewInit } from '@angular/core';
import * as $ from 'jquery';

import { HttpTestService } from '../../../../services/http.service';
import { sessionServices } from '../../../../services/session.services';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-POcanceldtl',
  templateUrl: './debitCreditListDtl.component.html'
})
export class debitCreditListDtlComponent implements OnInit {
	
	public sub: any;
	public requestedId: string;
	public drcrdetaildata : any;
	public errorMsg : string = "";
	public successMsg : string = "";
	
	constructor(public http: HttpTestService, public router: Router, public activatedRoute: ActivatedRoute , public session: sessionServices) { }
		
	ngOnInit() {
		
		this.sub = this.activatedRoute.params.subscribe(params => {
			this.requestedId = params['id'];
		});
		
		this.getSession();
		this.loadDRCRDetails();
		
		}
		
		
		//get session details
	getSession = function(){
		this.sessionData = this.session.getSessionDetails();
	}
	
	
	loadDRCRDetails = function() {
		var self = this;
		
		this.http.getDRCRbyId(this.requestedId)
			.subscribe(
			(data) => {
				self.drcrdetaildata = data;
			},
			(error) => self.errorMsg = error,
			() => {}
		);
	}
	
	
	
}
