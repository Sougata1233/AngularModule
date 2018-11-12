import { Component, OnInit, AfterViewInit } from '@angular/core';
import * as $ from 'jquery';

import { HttpTestService } from '../../../../services/http.service';
import { sessionServices } from '../../../../services/session.services';
import { Router, ActivatedRoute } from '@angular/router';

import { userSearchModel } from '../../../../models/user/userSearch.model';

@Component({
  selector: 'app-disable-user',
  templateUrl: './disableEnableUser.component.html'
  })


export class disableEnableUserComponent implements OnInit {
	
	public sub: any;
	public requestedId: string;
	public userData : any = '';
	
	
	public errorMsg : string = "";
	public successMsg : string = "";
	
	public sessionData : any;
	public updateResponseData : any;
	
	public userSearchModel: userSearchModel = new userSearchModel();
	
	
	
	constructor(public http: HttpTestService, public router: Router, public activatedRoute: ActivatedRoute , public session: sessionServices) { }
		
	ngOnInit() {
		this.sub = this.activatedRoute.params.subscribe(params => {
			this.requestedId = params['id'];
		});
		
		this.getSession();
		this.getUserDataByUserId();
	}
	
	//get session details
	getSession = function(){
		this.sessionData = this.session.getSessionDetails();
	}
	
	
	
	
  
  
 
	
	//fetch user details by user id
	getUserDataByUserId = function(){
		
		this.http.getUserDetailsById(this.requestedId)
		  .subscribe(
			(data) => {
			  this.userData = data;
			},
			(error) => {
				this.errorMsg = error,
				this.userData = ''
			},
			() => console.log('completed')
		  );
	}
	
	
	
	
	//save personal details
	userStatus = function(changedStat){
		
		this.userData.isEnabled = changedStat;
		
		this.http.updateUserDetails(this.userData)
		  .subscribe(
			(data) => {
			  this.updateResponseData = data;
			},
			(error) => {
				this.errorMsg = error;
			},
			() => {
				if(changedStat == 1){
					this.successMsg = "User Enabled Successfully.";
				}else{
					this.successMsg = "User Disabled Successfully.";
				}
			}
		  );
	}
	
	
}
