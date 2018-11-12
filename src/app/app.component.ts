import { Component, OnInit } from '@angular/core';
import { Router , ActivatedRoute , Params, ActivatedRouteSnapshot} from '@angular/router';
import { HttpTestService } from './services/http.service';
import {URLSearchParams} from "@angular/http";
import * as $ from 'jquery';

import { troubleshootmodel } from './models/troubleshoot/troubleshoot.model';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html'
})
export class AppComponent implements OnInit {
	public errorMsg: string;
	public isLogged : string = "false";
	public loggedInUserName : string = "";
	public loggedInUserRole : string = "";
	public loggedInUserId : string = "";
	public loggedInUserFirstName : string = "";
	public loggedInUserLastName : string = "";
	public userImage : string = "";
	public mainMenu : any = "";
	public higherchydata : any = "";
	public higherchyView : boolean = false;
	
	public userGroupData : any;
	public userMenuData : any;
	public userSubMenuData : any;
	public userId : any;
	public tokkendata : any;
	public userData : any;
	public getTokkendata : any;
	public getRequestedUrl : any;
	public troubleOpen : boolean = false;
	public troubleactivateclass : string = "closepop";
	public troubleshootmodel: troubleshootmodel = new troubleshootmodel();
  
	public tokkenPostData : any = {
  
    "userId": null,
    "loginId": null,
    "firstName": null,
    "lastName": null,
    "isActive": null,
    "counter": 0,
    "createDate": null,
    "lastModifiedDate": null
};
	
	
	
	constructor(public router: Router, public http: HttpTestService, public activatedRoute: ActivatedRoute) {
		
	}

	ngOnInit() {
		var self = this;
		self.fetchauthKeyFromUrl();
		
		if(self.getTokkendata != null && self.getTokkendata != "" && self.getTokkendata != 'undefined' && self.getTokkendata != 'logout'){
					this.http.getTokkenData(self.getTokkendata)
						.subscribe(
							(subdata) => {
							//self.items = data.person;
							if(subdata.userId != "" && subdata.userId != null && subdata.userId != "undefined"){
								this.goToHome(subdata.userId);
							}else{
								this.getSessions();
							}
					},
					(error) => {
						this.errorMsg = error;
						this.getSessions();
					},
					() => {}
			);
				}else if(self.getTokkendata == 'logout'){
					this.logout();
				}else{
					this.getSessions();
				}
	}
	
	openHigherchy = function(){
		var self = this;
		self.higherchyView = true;
	}
	
	closeHigherchy = function(){
		var self = this;
		self.higherchyView = false;
	}
	
	
	sendEmail = function(){
		var self = this;
		self.troubleOpen = false;
		self.troubleactivateclass = "closepop";
		self.troubleshootmodel.senderemail = "";
		self.troubleshootmodel.sendercontact = "";
		self.troubleshootmodel.sendersubject = "";
		self.troubleshootmodel.sendermsg = "";
	}
	
	toggleTrouble = function(){
		var self = this;
		self.troubleOpen = (self.troubleOpen)?false:true;
		self.troubleactivateclass = (self.troubleOpen)?"openpop":"closepop";
	}
	
	
	fetchauthKeyFromUrl = function(){
		var tokken:any = window.location.href;
		tokken = tokken.split("?");
		var requestedUrl = window.location.pathname;
		var hashUnit:any = window.location.hash;
		hashUnit = hashUnit.split("?");
		hashUnit = hashUnit[0];
		this.getRequestedUrl = requestedUrl+hashUnit;
		if(tokken.length>1){
		tokken = tokken[1].split("=");
		}
		if(tokken.length>1){
		this.getTokkendata = tokken[1];
		}
	}
	
	goToHome(requestId) {
    var self = this;
	this.http.getUserDetailsById(requestId)
      .subscribe(
        (data) => {
          if(data.isEnabled == 1){
			  this.userData = data;
			  this.userId = data.id;
				this.userImage = data.userImg;
				window.sessionStorage.setItem('logged-in', 'true');
				window.sessionStorage.setItem('firstName', data.firstName);
				window.sessionStorage.setItem('lastName', data.lastName);
				window.sessionStorage.setItem('id', data.id);
				window.sessionStorage.setItem('userName', data.userName);
				window.sessionStorage.setItem('userImg', data.userImg);
				
				self.getUserGroup();
				}else{
					this.errorMsg = "Your account is in disable status. Please contact administrator.";
				}
		},
        (error) => {
			this.errorMsg = error;
		},
        () => {}
      );
  }
  
  
  
  
  
  
  
  
  getUserGroup = function(){
		this.http.getUserGroupById(this.userId)
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
	
	getMenuItemsByUserGroup = function(){ 
		var self = this;
		
		
		self.http.getMenuByUserGroup(self.userGroupData[0].userGroup.id)
			.subscribe(
				(data) => {
					this.userMenuData = data;
				},
				(error) => {
					this.errorMsg = error
				},
				() => {
				var mappedMainMenu = [];
				for(var i = 0; i<this.userMenuData.length; i++){
					mappedMainMenu.push(this.userMenuData[i].menuItem.menuName);
				}
				window.sessionStorage.setItem('mainMenu', mappedMainMenu.toString());
				this.getSubMenuItemsByUserGroup();
				}
			);
		
	}
	
	getSubMenuItemsByUserGroup = function(){ 
		var self = this;
		
		
		self.http.getSubMenuByUserGroup(self.userGroupData[0].userGroup.id)
			.subscribe(
				(data) => {
					this.userSubMenuData = data;
				},
				(error) => {
					this.errorMsg = error
				},
				() => {
				var mappedSubMenu = [];
				for(var i = 0; i<this.userSubMenuData.length; i++){
					mappedSubMenu.push(this.userSubMenuData[i].subMenuItem.subMenu);
				}
				window.sessionStorage.setItem('subMenu', mappedSubMenu.toString());
				this.addTokken();
				}
			);
		
	}
	
	
	addTokken = function(){
		var self = this;
		var today = new Date();
		self.tokkenPostData.userId = self.userData.id;
		self.tokkenPostData.loginId = self.userData.id;
		self.tokkenPostData.firstName = self.userData.firstName;
		self.tokkenPostData.lastName = self.userData.lastName;
		self.tokkenPostData.isActive = "Y";
		self.tokkenPostData.counter = 0;
		self.tokkenPostData.createDate = today.getTime();
		self.tokkenPostData.lastModifiedDate = today.getTime();
		
		
		self.http.addTokken(self.tokkenPostData)
			.subscribe(
				(data) => {
					this.tokkendata = data;
				},
				(error) => {
					this.errorMsg = error
				},
				() => {
					window.sessionStorage.setItem('authkey', this.tokkendata.tokenId);
					console.log("addtokken success");
					this.getSessions();
				}
				
			);
	}
	
	getSessions = function(){
		var self = this;
		this.isLogged = window.sessionStorage.getItem('logged-in');
		if (this.isLogged == "false") {
			self.router.navigate(['/login']);
		}else{
			this.loggedInUserName = window.sessionStorage.getItem('loggedInUserName');
			this.loggedInUserRole = window.sessionStorage.getItem('loggedInUserRole');
			this.loggedInUserId = window.sessionStorage.getItem('id');
			this.loggedInUserFirstName = window.sessionStorage.getItem('firstName');
			this.loggedInUserLastName = window.sessionStorage.getItem('lastName');
			this.mainMenu = window.sessionStorage.getItem('mainMenu');
			this.userImage = window.sessionStorage.getItem('userImg');
			self.troubleshootmodel.sendername = self.loggedInUserFirstName +' '+self.loggedInUserLastName;
			//self.router.navigate(['/store']);
			if(self.getTokkendata != null && self.getTokkendata != "" && self.getTokkendata != 'undefined'){
			window.location.replace(self.getRequestedUrl);
			
			}
			
			self.getHigherchy();
			//window.location.href=this.getRequestedUrl;
		}
	}
	
	
	getHigherchy = function(){
		var self=this;
		console.log(self.loggedInUserId);
		self.http.getHigherchy(self.loggedInUserId)
			.subscribe(
				(data) => {
					this.higherchydata = data[0];
				},
				(error) => {
					this.errorMsg = error
				},
				() => {}
				
			);
	}
	
	toggle = function(e){
		$(e.target).next('.userinfohov').slideToggle();
	}
	
	
	//logout function
	logout() {
		window.sessionStorage.setItem('logged-in', 'false');
		window.sessionStorage.setItem('firstName', "");
		window.sessionStorage.setItem('lastName', "");
		window.sessionStorage.setItem('id', "");
		window.sessionStorage.setItem('userName', "");
		self.location.hash = '#/login';
		location.reload();
	}
}
