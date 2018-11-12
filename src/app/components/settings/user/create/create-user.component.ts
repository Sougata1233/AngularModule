import { Component, OnInit, AfterViewInit } from '@angular/core';
import * as $ from 'jquery';
import {IMyDpOptions} from 'mydatepicker';
import { sessionServices } from '../../../../services/session.services';
import { Router } from '@angular/router';
import {Observable} from 'rxjs/Rx';

import { HttpTestService } from '../../../../services/http.service';
import { userCreateModel } from '../../../../models/user/userCreate.model';


@Component({
  selector: 'app-create-user',
  templateUrl: './create-user.component.html'
})


export class createUserComponent implements OnInit {
	
	public allOrganizationData : any = [];
	public allDesignationData : any = [];
	public allUserRoleData : any = [];
	public departmentData : any = [];
	public responsePostData : any = [];
	
	public sessionData: any;
	public errorMsg : string = "";
	public successMsg : string = "";
	
	public requestedURL : any;
	public userGroupData : any = '';
	public userMenuData : any = '';
	public userSelectionMenuData : any = [];
	
	public uniqueId : any;

	public userCreateModel: userCreateModel = new userCreateModel();


	public myDatePickerOptions: IMyDpOptions = {
        // other options...
        dateFormat: 'yyyy-mm-dd',
    };
	
	public dateToday : string = "";
	public clock = Observable
        .interval(1000)
	.map(()=> new Date());
	
	public userPostData : any = {
				"id" : null,
				"userName" : null,
				"firstName" : "",
				"fromDate" : null,
				"lastName" : "",
				"password" : "",
				"gender" : "",
				"dateOfBirth" : "",
				"email" : "",
				"alternateEmail" : "",
				"mobile" : null,
				"endDate" : null,
				"organization" : {},
				"department" : {},
				"designation" : {},
				"typeOfEmployment" : "Permanent",
				"isEnabled" : 1,
				"permAddr" : null,
				"userImg" : null,
				"modifiedBy" : null,
				"modifiedOn" : null,
				"state" : null,
				"city" : null,
				"country" : null,
				"zip" : null,
				"fatherName" : null,
				"spouseName" : null,
				"passport" : null,
				"locationArea" : null,
				"locationCity" : null,
				"locationState" : null,
				"locationCountry" : null,
				"locationPin" : null,
				"createdBy" : null,
				"createdOn" : null,
			};
	
	constructor(public http: HttpTestService, public router: Router, public session: sessionServices) { }
		
	ngOnInit() {
		this.getSession();
		this.getUserGroup();
		this.loadDropdowns();
		this.uniqueId = this.randomFixedInteger(5);
	}
	
	randomFixedInteger(length){
	return Math.floor(Math.pow(10, length-1) + Math.random() * (Math.pow(10, length) - Math.pow(10, length-1) - 1));
  }
	
	//get session details
	getSession = function(){
		this.sessionData = this.session.getSessionDetails();
	}

	//get all organization list

	loadDropdowns = function() {
		var self = this;
		
		this.http.getOrganizations()
			.subscribe(
			(data) => {
				self.allOrganizationData = data;
			},
			(error) => self.errorMsg = error,
			() => console.log("completed")
		);

		this.http.getDesignations()
			.subscribe(
			(data) => {
				self.allDesignationData = data;
			},
			(error) => self.errorMsg = error,
			() => console.log("completed")
		);

		this.http.getUserRoles()
			.subscribe(
			(data) => {
				self.allUserRoleData = data;
			},
			(error) => self.errorMsg = error,
			() => console.log("completed")
		);
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
						if(this.userMenuData[i].menuItem.menuName == 'User'){
							self.userSelectionMenuData.push(this.userMenuData[i]);
						}
						
					}
				}
			);
			
	}
	
	//get user group details
	
	getUserGroup = function(){
		this.http.getUserGroupById(this.sessionData.sessionId)
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

	//getDepartments by organization Id

	loadDepartments = function(e){
		var self = this;
		var selectedOrg = e.target.value;
		
		if(selectedOrg == ""){
			self.departmentData = [];
		}else{
			this.http.getDepartmentByOrg(self.allOrganizationData[selectedOrg].id)
			.subscribe(
			(data) => {
				self.departmentData = data;
			},
			(error) => {self.errorMsg = error, self.departmentData = []},
			() => console.log("completed")
		);
		}
	}
	
	//create user
	createUser = function(){
		var self = this;
		
		
		//this.userPostData.userName  		= (this.userCreateModel.userFirstName).substr(0,1).toLowerCase() + (this.userCreateModel.userLastName).toLowerCase() + this.uniqueId;
		this.userPostData.firstName 		= this.userCreateModel.userFirstName;
		this.userPostData.lastName  		= this.userCreateModel.userLastName;
		this.userPostData.dateOfBirth  		= this.userCreateModel.userDOB.formatted;
		this.userPostData.password  		= this.userCreateModel.userPassword;
		this.userPostData.gender    		= this.userCreateModel.userGender;
		this.userPostData.email    			= null;
		this.userPostData.alternateEmail	= this.userCreateModel.userAltEmail;
		this.userPostData.mobile    		= this.userCreateModel.userMobile;
		this.userPostData.organization    	= self.allOrganizationData[this.userCreateModel.userOrg];
		this.userPostData.department		= self.departmentData[this.userCreateModel.userDept];
		this.userPostData.designation    	= self.allDesignationData[this.userCreateModel.userDesig];
		this.userPostData.typeOfEmployment  = this.userCreateModel.userType;
		
		console.log(this.userPostData);
		
		this.http.createUser(this.userPostData)
			.subscribe(
			(data) => {
				self.responsePostData = data;
			},
			(error) => {
				this.errorMsg = error;
			},
			() => {
				this.successMsg = "You have successfully created an user for " + this.userCreateModel.userFirstName + " " + this.userCreateModel.userLastName + " with user name " + this.responsePostData.userName + "and Email Id " + this.responsePostData.userName + "@slscomptech.com",
				this.userCreateModel.userName = "",
				this.userCreateModel.userFirstName = "",
				this.userCreateModel.userLastName = "",
				this.userCreateModel.userDOB = {},
				this.userCreateModel.userPassword = "",
				this.userCreateModel.userGender = "",
				this.userCreateModel.userEmail = "",
				this.userCreateModel.userAltEmail = "",
				this.userCreateModel.userMobile = "",
				this.userCreateModel.userOrg = "",
				this.userCreateModel.userDept = "",
				this.userCreateModel.userDesig = "",
				this.userCreateModel.userType = "",
				this.userCreateModel.userRole = "",
				this.userCreateModel.userImgName = ""
				
			}
		);
	}
	
	//browse images
	onBrowseClick(event){
	 $(event.target).parents(".uploadContainer").find("input[type=file]").trigger("click");
  }
  
  //upload image data url to public var
  
  onUploadFileChange(event) {
    var self = this, 
    reader = new FileReader();
    reader.readAsDataURL(event.target.files[0]);
    reader.onload = function($event:any) {
		
		
		
		var base64Image = $event.target.result;
		self.userPostData.userImg = base64Image;

		
	  //self.userCreateModel.userImgName = event.target.files[0].name;
      //self.userPostData.userImg = ($event.target.result).toString();
	 };
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
