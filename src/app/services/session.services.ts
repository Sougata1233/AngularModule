import { Injectable } from '@angular/core';

@Injectable()
export class sessionServices{
  
	public sessionObject : any = {
		'sessionStarted'  : "false",
		'sessionFirstName'  : "",
		'sessionLastName'  : "",
		'sessionId'  : "",
		'sessionUserName': "",
		'authkey': "",
		'mainMenu': "",
		'subMenu': ""
	};
	
	constructor() {}
	
	
	
	getSessionDetails = function(){
		
		var mappedMainMenu = window.sessionStorage.getItem('mainMenu');
		var mappedSubMenu = window.sessionStorage.getItem('subMenu');
		this.sessionObject.sessionStarted = window.sessionStorage.getItem('logged-in');
		this.sessionObject.sessionFirstName = window.sessionStorage.getItem('firstName');
		this.sessionObject.sessionLastName = window.sessionStorage.getItem('lastName');
		this.sessionObject.sessionId = window.sessionStorage.getItem('id');
		this.sessionObject.sessionUserName = window.sessionStorage.getItem('userName');
		this.sessionObject.mainMenu = mappedMainMenu.split(",");
		this.sessionObject.subMenu = mappedSubMenu.split(",");
		this.sessionObject.authkey = window.sessionStorage.getItem('authkey');
		
		return this.sessionObject;
	}
	
	isLoggedIn = function(){
		if(this.sessionObject.sessionStarted == 'true'){
			return true;
		}else{
			return false;
		}
	}
 
}
