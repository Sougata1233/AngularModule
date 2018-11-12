import { Component, OnInit, AfterViewInit } from '@angular/core';
import * as $ from 'jquery';

import { sessionServices } from '../../services/session.services';

@Component({
  selector: 'app-main-nav-panel',
  templateUrl: './main-nav-panel.component.html'
})
export class mainNavComponent implements OnInit {
	
	public loggedInUserName : string = "";
	public userGroupData : any = '';
	public userMenuData : any = '';
	public purchaseMenuData : any = [];
	public sessionData: any;
	public redirection :any;
	
	
	constructor(public session: sessionServices) { }
		
	ngOnInit() {
		this.getSession();
		this.redirection = location.hostname;
	}
	
	
	//get session details
	getSession = function(){
		this.sessionData = this.session.getSessionDetails();
		console.log(this.sessionData);
	}
	
}
