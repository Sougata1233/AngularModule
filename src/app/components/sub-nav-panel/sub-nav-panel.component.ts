import { Component, OnInit, AfterViewInit } from '@angular/core';
import { Router, ActivatedRoute, ActivatedRouteSnapshot } from '@angular/router';
import {trigger, state, style, animate, transition} from '@angular/animations';
import * as $ from 'jquery';

import { HttpTestService } from '../../services/http.service';
import { sessionServices } from '../../services/session.services';
import { AppSettings } from '../../config/settings/app-settings';

@Component({
  selector: 'app-sub-nav-panel',
  templateUrl: './sub-nav-panel.component.html',
  animations: [
    trigger('navtogglestate', [
      state('close', style({
        left: '-204px'
       })),
      state('open',   style({
        left: '0px'
      })),
      transition('close => open', animate('100ms ease-in')),
      transition('open => close', animate('100ms ease-out'))
    ])
  ]
})
export class subNavComponent implements OnInit {
	
	public sessionData: any;
	public userGroupData : any = '';
	public userMenuData : any = [];
	public inUrl : any = "";
	public sub : any;
	public mainNav : any;
	public togglestate : string = 'open';
	public productionlink : string = "";
	public secuiritylink : string = "";
	public redirection :any;
	
	
	constructor(public http: HttpTestService, public session: sessionServices, public router: Router, public activatedRoute : ActivatedRoute) { 
		this.productionlink = AppSettings.PRODUCTION_LINK;
		this.secuiritylink = AppSettings.SECUIRITY_LINK;
	}
		
	ngOnInit() {
		var self = this;
		this.getSession();
		this.redirection = location.hostname;
		this.router.events
    .subscribe((event) => {
     self.inUrl = event;
	 });
		
	}
	
	
	toggleNav() {
		var self = this;
	self.togglestate = self.togglestate === 'open' ? 'close' : 'open';
	var mainContentPos = self.togglestate === 'open' ? '204px' : '0px';
	$(".main-content-area").animate({"left":mainContentPos}, 500);
}
	
	//get session details
	getSession = function(){
		this.sessionData = this.session.getSessionDetails();
	}
	
	
	
}
