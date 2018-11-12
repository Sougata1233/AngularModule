import { Component, OnInit, AfterViewInit } from '@angular/core';
import * as $ from 'jquery';

import { HttpTestService } from '../../../../services/http.service';
import { Router, ActivatedRoute} from '@angular/router';
import {Observable} from 'rxjs/Rx';

@Component({
  selector: 'app-user-profile-detail',
  templateUrl: './user-profile-summery.component.html'
 })


export class userProfileSummeryComponent implements OnInit {
	
	public loggedInUserName : string = "";
	public userData : any;
	
	public errorMsg : string = "";
	public successMsg : string = "";
	
	public requestedURL : any;
	public loggedInUserID : string = "";
	public userGroupData : any = '';
	public userMenuData : any = '';
	public userSelectionMenuData : any = [];
	
	public dateToday : string = "";
	public clock = Observable
        .interval(1000)
	.map(()=> new Date());
	
	constructor(public http: HttpTestService, public router: Router) { }
		
	ngOnInit() {
		this.loggedInUserName = window.sessionStorage.getItem('userName');
		this.getUserDetails();
		
		this.loggedInUserID = window.sessionStorage.getItem('id');
		//this.getUserGroup();
		
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
		this.dateToday  = yyyy+'-'+mm+'-'+dd;
		
	}
	
	//get menu items by user group
	getMenuItemsByUserGroup = function(){ 
		var self = this;
		
		
		self.http.getSubMenuByUserGroup(self.userGroupData[0].userGroup.id)
			.subscribe(
				(data) => {
					this.userMenuData = data;
				},
				(error) => {
					this.errorMsg = error
				},
				() => {
					for(var i = 0; i < this.userMenuData.length; i++){
						if(this.userMenuData[i].menuItem.menuName == 'HRMS'){
							self.userSelectionMenuData.push(this.userMenuData[i]);
						}
						
					}
				}
			);
		
	}
	
	//get user group details
	
	getUserGroup = function(){
		this.http.getUserGroupById(this.loggedInUserID)
		  .subscribe(
			(data) => {
			  this.userGroupData = data;
			  },
			(error) => {
				this.errorMsg = error;
				this.userGroupData = "";
			},
			() => this.getMenuItemsByUserGroup()
		  );
	}
	
	getUserDetails = function(){
		this.http.getUserDetailsByName(this.loggedInUserName)
		  .subscribe(
			(data) => {
			  //self.items = data.person;
				if(data){
					this.userData = data;
				}else{
					this.userData = "";
				}
			},
			(error) => {
				this.errorMsg = error;
			},
			() => console.log('completed')
		  );
	}
	
	//routing based on 
  routeSelection(e){
	  var self = this;
	  var requestedId = e.target.value;
	  
	  this.http.getRouteURL(requestedId)
			.subscribe(
			(data) => {
				self.requestedURL = data;
			},
			(error) => {self.errorMsg = error},
			() => {
				self.router.navigate([self.requestedURL.url]);
			}
		);
  }
	
	
	
}
