import { Component, OnInit, AfterViewInit } from '@angular/core';
import * as $ from 'jquery';

import { HttpTestService } from '../../../services/http.service';
import { sessionServices } from '../../../services/session.services';


import { userGroupSelectionModel } from '../../../models/user/userGroupSelection.model';

@Component({
  selector: 'app-map-user',
  templateUrl: './map-userGroup.component.html'
  })


export class MapUserGroupComponent implements OnInit {
	
	public errorMsg : string = "";
	public successMsg : string = "";
	public sessionData : any = "";
	public allUserGroupData : any = [];
	public allUserData : any = [];
	public selectedCategory : string = "USER";
	public selectedallUserData : any = [];
	public selectedUserIds : any = [];
	public SelectFromAll : any = [];
	public SelectFromSelected : any = [];
	public allMenuData : any = [];
	public selectedallMenuData : any = [];
	public selectedMenuIds : any = [];
	public mappedmainmenuids : any = [];
	public serviceon : boolean = false;
	
	public userGroupSelectionModel: userGroupSelectionModel = new userGroupSelectionModel();
	
	constructor(public http: HttpTestService, public session: sessionServices) { }
		
	ngOnInit() {
		this.getSession();
		this.loadAllUserGroup();
		this.loadAllUsers();
		this.loadAllMenus();
	}
	
	
	//get session details
	getSession = function(){
		this.sessionData = this.session.getSessionDetails();
	}
	
	//load All User Groups
	loadAllUserGroup = function(){
		var self = this;
		self.http.getUserGroupAll()
		  .subscribe(
			(data) => {
			  self.allUserGroupData = data;
			},
			(error) => {
				this.errorMsg = error;
				self.allUserGroupData = [];
			},
			() => {}
		  );
	}
	
	
	//load All Menus
	loadAllMenus = function(){
		this.http.getMenuAll()
		  .subscribe(
			(data) => {
			  if(data){
					this.allMenuData = data;
				}
			},
			(error) => {
				this.errorMsg = error;
				this.allMenuData = [];
			},
			() => {}
		  );
	}
	
	
	//load All User
	loadAllUsers = function(){
		var self = this;
		self.http.getUserAll()
		  .subscribe(
			(data) => {
			  self.allUserData = data;
			},
			(error) => {
				self.errorMsg = error;
				self.allUserData = [];
			},
			() => {}
		  );
	}
	
	
	//refresh view
	refreshView = function(e){
		var self = this;
		self.successMsg = "";
		self.errorMsg = "";
		self.SelectFromAll.length = 0;
		self.SelectFromSelected.length = 0;
		$(".list-menu").find("li").removeClass("active");
		if(self.selectedCategory == 'USER'){
			self.loadAllUsersByGrp(this.allUserGroupData[e.target.value].id);
		}else{
			self.loadAllMenusByGrp(this.allUserGroupData[e.target.value].id);
		}
		
	}
	
	
	loadAllUsersByGrp = function(id){
		var self = this;
		self.selectedallUserData.length = 0;
		self.selectedUserIds.length = 0;
		self.selectedallMenuData.length = 0;
		self.selectedMenuIds.length = 0;
		self.mappedmainmenuids.length = 0;
		self.http.getAllUsersOfGroupwithMapId(id)
		  .subscribe(
			(data) => {
			  if(data){
					self.selectedallUserData = data;
				}
			},
			(error) => {
				self.errorMsg = error;
				self.selectedallUserData = [];
			},
			() => {
				for(var i=0; i<self.selectedallUserData.length; i++){
					self.selectedUserIds.push(self.selectedallUserData[i].user.id);
				}
				}
		  );
	}
	
	
	loadAllMenusByGrp = function(id){
		var self = this;
		self.selectedallUserData.length = 0;
		self.selectedUserIds.length = 0;
		self.selectedallMenuData.length = 0;
		self.selectedMenuIds.length = 0;
		self.mappedmainmenuids.length = 0;
		this.http.getSubMenuByUserGroup(id)
		  .subscribe(
			(data) => {
			  if(data){
					this.selectedallMenuData = data;
				}
			},
			(error) => {
				this.errorMsg = error;
				this.selectedallMenuData = [];
			},
			() => {
				for(var i = 0; i < this.selectedallMenuData.length; i++){
						self.selectedMenuIds.push(self.selectedallMenuData[i].subMenuItem.id);
						if(self.mappedmainmenuids.indexOf(self.selectedallMenuData[i].menuItem.id)==-1){
							self.mappedmainmenuids.push(self.selectedallMenuData[i].menuItem.id);
						}
					}
			}
		  );
		  
	}
	
	
	
	selectFromAll = function(e, index){
		var self = this;
		var isSelected = e.target.className;
		
		if(isSelected == 'active'){
			e.target.className = "";
			var indexOfSelection = self.SelectFromAll.indexOf(index);
			self.SelectFromAll.splice(indexOfSelection, 1);
			
		}else{
			e.target.className = "active";
			self.SelectFromAll.push(index);
		}
		
	}
	
	selectFromSelected = function(e, index){
		var self = this;
		var isSelected = e.target.className;
		
		if(isSelected == 'active'){
			e.target.className = "";
			var indexOfSelection = self.SelectFromSelected.indexOf(index);
			self.SelectFromSelected.splice(indexOfSelection, 1);
			
		}else{
			e.target.className = "active";
			self.SelectFromSelected.push(index);
		}
		
	}
	
	
	
	
	
	
	mapUserToGroupByLeftToRight = function(){
		var self= this;
		self.successMsg = "";
		self.errorMsg = "";
		self.serviceon = true;
		self.originalUserMapFunction(0);
		
	}
	
	
	deleteUserGroupMapping = function(){
		var self= this;
		self.successMsg = "";
		self.errorMsg = "";
		self.serviceon = true;
		self.originalUserMapDeleteFunction(0);
		
	}
	
	deleteUserGroupMenuMapping  = function(){
		var self= this;
		self.successMsg = "";
		self.errorMsg = "";
		self.serviceon = true;
		self.originalUserMenuMapDeleteFunction(0);
		
	}
	
	
	mapMenuToUserGroup = function(){
		var self= this;
		self.successMsg = "";
		self.errorMsg = "";
		self.serviceon = true;
		self.originalMenuMapFunction(0);
		
	}
	
	
	
	originalUserMapFunction = function(count){
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
		
		
		var postdata = {
			"id" : null,
			"userGroup" : self.allUserGroupData[self.userGroupSelectionModel.selectedUserGroup],
			"user" : self.allUserData[self.SelectFromAll[count]],
			"isEnable" : 1,
			"fromDate" : todayPrint,
			"toDate" : null,
			"modifiedBy" : self.sessionData.sessionUserName,
			"modifiedOn" : todayPrint
		};
		
		
		this.http.usertoUsergroupMapping(postdata)
				  .subscribe(
					(data) => {
					 
					},
					(error) => {
						this.errorMsg = error,
						self.serviceon = false
					},
					() => {
						if(count == self.SelectFromAll.length-1){
							self.SelectFromAll.length = 0;
							self.SelectFromSelected.length = 0;
							$(".list-menu").find("li").removeClass("active");
							self.loadAllUsersByGrp(this.allUserGroupData[self.userGroupSelectionModel.selectedUserGroup].id);
							self.successMsg = "Selected Users mapped to "+self.allUserGroupData[self.userGroupSelectionModel.selectedUserGroup].userGroupName+" User Group Successfully";
							self.serviceon = false;
						}else{
							count = count + 1;
							self.originalUserMapFunction(count);
						}
					}
				  );
	}
	
	
	originalMenuMapFunction = function(count){
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
		
		if(self.mappedmainmenuids.indexOf(self.allMenuData[self.SelectFromAll[count]].menu.id) == -1){
			var menupostdata = {
			  "id" : null,
			  "menuItem" : self.allMenuData[self.SelectFromAll[count]].menu,
			  "userGroup" : self.allUserGroupData[self.userGroupSelectionModel.selectedUserGroup],
			  "isEnable" : 1,
			  "fromDate" : todayPrint,
			  "toDate" : null,
			  "modifiedBy" : self.sessionData.sessionUserName,
			  "modifiedOn" : todayPrint
			};
			
			self.http.mainMenutoUsergroupMapping(menupostdata)
				  .subscribe(
					(data) => {
					 
					},
					(error) => {
						this.errorMsg = error,
						self.serviceon = false
					},
					() => {
						var submenupostdata = {
							"id": null,
							"menuItem": self.allMenuData[self.SelectFromAll[count]].menu,
							"subMenuItem": self.allMenuData[self.SelectFromAll[count]],
							"userGroup": self.allUserGroupData[self.userGroupSelectionModel.selectedUserGroup],
							"isEnable": 1,
							"fromDate": todayPrint,
							"toDate": null,
							"modifiedBy": self.sessionData.sessionUserName,
							"modifiedOn": todayPrint
						};
						
						self.http.menutoUsergroupMapping(submenupostdata)
						  .subscribe(
							(data) => {
							 
							},
							(error) => {
								this.errorMsg = error;
							},
							() => {
								if(count == self.SelectFromAll.length-1){
									self.SelectFromAll.length = 0;
									self.SelectFromSelected.length = 0;
									$(".list-menu").find("li").removeClass("active");
									self.loadAllMenusByGrp(this.allUserGroupData[self.userGroupSelectionModel.selectedUserGroup].id);
									self.successMsg = "Selected Menus mapped to "+self.allUserGroupData[self.userGroupSelectionModel.selectedUserGroup].userGroupName+" User Group Successfully";
									self.serviceon = false;
								}else{
									count = count + 1;
									self.originalMenuMapFunction(count);
								}
									//this.successMsg = "Selected Menus mapped to User Group Successfully";
							}
						  );
					}
			);
		}else{
			var submenupostdata = {
							"id": null,
							"menuItem": self.allMenuData[self.SelectFromAll[count]].menu,
							"subMenuItem": self.allMenuData[self.SelectFromAll[count]],
							"userGroup": self.allUserGroupData[self.userGroupSelectionModel.selectedUserGroup],
							"isEnable": 1,
							"fromDate": todayPrint,
							"toDate": null,
							"modifiedBy": self.sessionData.sessionUserName,
							"modifiedOn": todayPrint
						};
						
						self.http.menutoUsergroupMapping(submenupostdata)
						  .subscribe(
							(data) => {
							 
							},
							(error) => {
								this.errorMsg = error,
								self.serviceon = false
							},
							() => {
								if(count == self.SelectFromAll.length-1){
									self.SelectFromAll.length = 0;
									self.SelectFromSelected.length = 0;
									$(".list-menu").find("li").removeClass("active");
									self.loadAllMenusByGrp(this.allUserGroupData[self.userGroupSelectionModel.selectedUserGroup].id);
									self.successMsg = "Selected Menus mapped to "+self.allUserGroupData[self.userGroupSelectionModel.selectedUserGroup].userGroupName+" User Group Successfully";
									self.serviceon = false;
								}else{
									count = count + 1;
									self.originalMenuMapFunction(count);
								}
									//this.successMsg = "Selected Menus mapped to User Group Successfully";
							}
						  );
		}
		
		
	}
	
	
	
	originalUserMapDeleteFunction = function(count){
		var self= this;
		this.http.deleteUserFromUserGrp(self.selectedallUserData[self.SelectFromSelected[count]].id)
				  .subscribe(
					(data) => {
					 
					},
					(error) => {
						this.errorMsg = error,
						self.serviceon = false
					},
					() => {
						if(count == self.SelectFromSelected.length-1){
							self.SelectFromAll.length = 0;
							self.SelectFromSelected.length = 0;
							$(".list-menu").find("li").removeClass("active");
							self.loadAllUsersByGrp(this.allUserGroupData[self.userGroupSelectionModel.selectedUserGroup].id);
							self.successMsg = "Selected Users deleted from "+self.allUserGroupData[self.userGroupSelectionModel.selectedUserGroup].userGroupName+" User Group Successfully";
							self.serviceon = false;
						}else{
							count = count + 1;
							self.originalUserMapDeleteFunction(count);
						}
					}
				  );
	}
	
	
	originalUserMenuMapDeleteFunction = function(count){
		var self= this;
		console.log(self.selectedallMenuData);
		this.http.deleteSubmenuFromUserGrp(self.selectedallMenuData[self.SelectFromSelected[count]].id)
				  .subscribe(
					(data) => {
					 
					},
					(error) => {
						this.errorMsg = error,
						self.serviceon = false
					},
					() => {
						if(count == self.SelectFromSelected.length-1){
							self.SelectFromAll.length = 0;
							self.SelectFromSelected.length = 0;
							$(".list-menu").find("li").removeClass("active");
							self.loadAllMenusByGrp(this.allUserGroupData[self.userGroupSelectionModel.selectedUserGroup].id);
							self.successMsg = "Selected Menus deleted from "+self.allUserGroupData[self.userGroupSelectionModel.selectedUserGroup].userGroupName+" User Group Successfully";
							self.serviceon = false;
						}else{
							count = count + 1;
							self.originalUserMenuMapDeleteFunction(count);
						}
					}
				  );
	}
	
	
	disableUserGroup = function(e){
		var self= this;
		self.successMsg = "";
		self.errorMsg = "";
		var selection = $(e.target).is(":checked");
		console.log(selection);
		if(selection){
			self.allUserGroupData[self.userGroupSelectionModel.selectedUserGroup].isEnable = 1;
		}else{
			self.allUserGroupData[self.userGroupSelectionModel.selectedUserGroup].isEnable = 0;
		}
		self.updateUserGroup(this.allUserGroupData[self.userGroupSelectionModel.selectedUserGroup]);
	}
	
	
	
	updateUserGroup = function(data){
		var self= this;
		
		self.http.updateUserGroup(data)
				  .subscribe(
					(data) => {
					 
					},
					(error) => {
						this.errorMsg = error;
					},
					() => {
						this.loadAllUserGroup(),
						self.SelectFromAll.length = 0,
							self.SelectFromSelected.length = 0,
							$(".list-menu").find("li").removeClass("active")
					}
				  );
		
	}
	
	
	//switch between menu and user
	categorySwitching = function(e){
		var self = this;
		self.successMsg = "";
		self.errorMsg = "";
		self.SelectFromAll.length = 0;
		self.SelectFromSelected.length = 0;
		$(".list-menu").find("li").removeClass("active");
		var selection = $(e.target).is(":checked");
		if(selection){
			if(self.userGroupSelectionModel.selectedUserGroup != ""){
			this.loadAllUsersByGrp(this.allUserGroupData[self.userGroupSelectionModel.selectedUserGroup].id);
			}
			self.selectedCategory = "USER";
			self.SelectedItem = "Users";
		}else{
			if(self.userGroupSelectionModel.selectedUserGroup != ""){
			this.loadAllMenusByGrp(this.allUserGroupData[self.userGroupSelectionModel.selectedUserGroup].id);
			self.allData = self.allMenuData;
			}
			self.selectedCategory = "MENU";
			self.SelectedItem = "Menus";
		}
	}
	
}
