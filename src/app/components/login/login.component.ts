import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { loginModel } from '../../models/login/login.model';
import { HttpTestService } from '../../services/http.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html'
})
export class loginComponent implements OnInit {
  public user: loginModel = new loginModel();
  public errorMsg: string;
  public userGroupData : any;
  public userMenuData : any;
  public userSubMenuData : any;
  public userId : any;
   public tokkendata : any;
   public userData : any;
  
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
 
  constructor(public route: ActivatedRoute, public router: Router, public http: HttpTestService) { }

  ngOnInit() {
	  
  }
  
  
  authenticate = function(){
	  var self = this;
	  
	  this.http.logedIn(this.user.userName+"^"+this.user.password)
      .subscribe(
        (data) => {
          //self.items = data.person;
			if(data){
				self.goToHome();
			}else{
			  this.errorMsg = "Invalid Credentials";
			}
        },
        (error) => {
			this.errorMsg = error;
		},
        () => console.log('completed')
      );
  }

  goToHome() {
    var self = this;
	
	this.http.getUserDetailsByName(this.user.userName)
      .subscribe(
        (data) => {
          if(data.isEnabled == 1){
			  this.userData = data;
			  this.userId = data.id;
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
        () => console.log('completed')
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
					this.redirection();
				}
				
			);
	}
  
  
  redirection = function(){
	  self.location.hash = '#/home/dashboard';
	  location.reload();
  }
  

}
