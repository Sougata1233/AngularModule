import { Component, OnInit, AfterViewInit } from '@angular/core';
import $ from 'jquery';

import { HttpTestService } from '../../../../services/http.service';
import { sessionServices } from '../../../../services/session.services';
import { Router } from '@angular/router';
import {Observable} from 'rxjs/Rx';

import { userGroupSelectionModel } from '../../../../models/user/userGroupSelection.model';

@Component({
  selector: 'app-map-user',
  templateUrl: './usergroupcreate.component.html'
  })


export class createUserGroupComponent implements OnInit {
	
	
	public errorMsg : string = "";
	public successMsg : string = "";
	
	public requestedURL : any;
	public sessionData : any;
	public userGroupData : any = '';
	public userMenuData : any = '';
	public userSelectionMenuData : any = [];
	public SelectedItem : string = "Users";
	
	
	
	public userGroupSelectionModel: userGroupSelectionModel = new userGroupSelectionModel();
	
	
	
	
	constructor(public http: HttpTestService, public router: Router, public session: sessionServices) { }
		
	ngOnInit() {
		this.getSession();
	}
	
	//get session details
	getSession = function(){
		this.sessionData = this.session.getSessionDetails();
	}
	
	
	
	
	
	
	
	//create user group
	
	createUserGroup = function(){
		this.successMsg = "";
		this.errorMsg = "";
		var self= this;
		
		var today = new Date();
		var dd : any = today.getDate();
		var mm : any = today.getMonth()+1;
		var yyyy : any = today.getFullYear();
		if(dd<10){
			dd='0'+dd;
		} 
		if(mm<10){
			mm='0'+mm;
		} 
		var todayPrint : string  = yyyy+'-'+mm+'-'+dd;
		
		var createGrpPostData = {
			"id"			:	null,
			"userGroupName"	:	self.userGroupSelectionModel.selectedUserGroup,
			"isEnable"		:	1,
			"fromDate"		:	todayPrint,	
			"toDate"		:	null,		
			"modifiedBy"	:	self.sessionData.sessionUserName,	
			"modifiedOn"	:	todayPrint
		};
		
		this.http.createUserGroup(createGrpPostData)
				  .subscribe(
					(data) => {
					 
					},
					(error) => {
						this.errorMsg = error;
					},
					() => {
						this.successMsg = "User Group Created Successfully",
						self.userGroupSelectionModel.selectedUserGroup = ""
					}
		);
	}
	
	
	
	

	
}
