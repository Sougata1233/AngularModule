import { Component, OnInit } from '@angular/core';
import * as $ from 'jquery';

import { HttpTestService } from '../../../../services/http.service';
import { Router} from '@angular/router';
import {Observable} from 'rxjs/Rx';
import { userProffesionalModel } from '../../../../models/user/userProffesional.model';
import { sessionServices } from '../../../../services/session.services';
import {IMyDpOptions, IMyDateModel} from 'mydatepicker';
import {GridOptions} from "ag-grid/main";

@Component({
  selector: 'app-user-profile-detail',
  templateUrl: './user-profile-professional.component.html'
 })


export class userProfileProfessionalComponent implements OnInit {
	
	public editable : boolean = false;
	public updateResponseData : any;
	public errorMsg : string = "";
	public successMsg : string = "";
	public addmodeOn : boolean = false;
	public editModeOn : any = '';
	public exp : any = null;
	public sessionData: any;
	
	public requestedURL : any;
	public loggedInUserID : string = "";
	public userGroupData : any = '';
	public userMenuData : any = '';
	public userProfessionData : any = [];
	public gridOptions: GridOptions;
	public dateToday : string = "";
	public userProffesionalModel: userProffesionalModel = new userProffesionalModel();
	
	public myDatePickerOptions: IMyDpOptions = {
        dateFormat: 'yyyy-mm-dd',
		disableSince : { year: new Date().getFullYear(), month: new Date().getMonth()+1, day: new Date().getDate()+1 }
    };
	
	public columnDef : any = [
		{headerName: "Organization", field: "organization", suppressMenu: true, width : 150},
		{headerName: "Project", field: "projectName", suppressMenu: true, width : 150},
		{headerName: "Description", field: "projectDesc", suppressMenu: true, width : 250},
		{headerName: "Role", field: "projectRole", suppressMenu: true, minWidth : 100},
		{headerName: "Primary Skill", field: "primarySkill", suppressMenu: true, width : 100},
		{headerName: "Other Skills", field: "otherSkill", suppressMenu: true, width : 250},
		{headerName: "Start Date", field: "projectStartDate", suppressMenu: true, width : 100},
		{headerName: "End Date", field: "projectEndDate", suppressMenu: true, width : 100},
		{headerName: "Experience", field: "totalExp", suppressMenu: true, width : 50}
	];
	
	
	constructor(public http: HttpTestService, public router: Router, public session: sessionServices) { 
		 var self = this;
		 this.gridOptions = <GridOptions>{};
		 this.gridOptions.columnDefs = this.columnDef;
		 this.gridOptions.paginationPageSize = 5;
		 this.gridOptions.domLayout = 'autoHeight';
		 this.gridOptions.pagination = true;
		 this.gridOptions.enableFilter = true;
		 this.gridOptions.enableSorting = true;
		 this.gridOptions.enableColResize = true;
		 this.gridOptions.floatingFilter = true;
		 this.gridOptions.suppressMovableColumns = true;
		 this.gridOptions.rowHeight = 30;
		 this.gridOptions.floatingFiltersHeight = 40;
		 this.gridOptions.rowSelection = 'single';
		 this.gridOptions.showToolPanel = false;
		 this.gridOptions.onRowClicked = function(params) {
			 self.errorMsg = "";
			 self.successMsg = "";
			 self.editModeOn = params.node.id;
			 self.userProffesionalModel.organization = self.userProfessionData[params.node.id].organization;	
			 self.userProffesionalModel.otherskills = self.userProfessionData[params.node.id].otherSkill;
		     self.userProffesionalModel.primaryskills = self.userProfessionData[params.node.id].primarySkill;
		     self.userProffesionalModel.projectdesc = self.userProfessionData[params.node.id].projectDesc;
		     self.exp = self.userProfessionData[params.node.id].projectDuration;
		     self.userProffesionalModel.enddate = { date: { year: new Date(self.userProfessionData[params.node.id].projectEndDate).getFullYear(), month: new Date(self.userProfessionData[params.node.id].projectEndDate).getMonth()+1, day: new Date(self.userProfessionData[params.node.id].projectEndDate).getDate() }, formatted : self.userProfessionData[params.node.id].projectEndDate};
		     self.userProffesionalModel.project = self.userProfessionData[params.node.id].projectName;
		     self.userProffesionalModel.role = self.userProfessionData[params.node.id].projectRole;
		     self.userProffesionalModel.startdate = { date: { year: new Date(self.userProfessionData[params.node.id].projectStartDate).getFullYear(), month: new Date(self.userProfessionData[params.node.id].projectStartDate).getMonth()+1, day: new Date(self.userProfessionData[params.node.id].projectStartDate).getDate() }, formatted : self.userProfessionData[params.node.id].projectStartDate};
		 };
	}
		
	ngOnInit() {
		this.getSession();
		this.loggedInUserID = window.sessionStorage.getItem('id');
		this.getUserProfessionalDetails();
	}
	
	//get session details
	getSession = function(){
		this.sessionData = this.session.getSessionDetails();
	}
	
	//fetch user professional data
	getUserProfessionalDetails = function(){
		var self = this;
		this.errorMsg = "";
		this.successMsg = "";
		this.http.getUserProfessionById(this.loggedInUserID)
		  .subscribe(
			(data) => {
			  //self.items = data.person;
				if(data){
					this.userProfessionData = data;
				}
			},
			(error) => {
				this.errorMsg = error;
			},
			() => {
				if(typeof self.gridOptions.api != 'undefined'){
					self.gridOptions.api.setRowData(self.userProfessionData);
				}
			}
		  );
	}
	
	addRecordOpen = function(){
		this.errorMsg = "";
		this.successMsg = "";
		this.addmodeOn = true;
	}
	
	//edit all fields
	editDetails = function(){
		this.errorMsg = "";
		this.successMsg = "";
		this.editable = true;
	}
	
	//save personal details
	saveDetails = function(){
		this.errorMsg = "";
		this.successMsg = "";
		var self = this;
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
			"id": self.userProfessionData[self.editModeOn].id,
		  "modBy": self.sessionData.sessionUserName,
		  "modOn": todayPrint,
		  "organization": self.userProffesionalModel.organization,
		  "otherSkill": self.userProffesionalModel.otherskills,
		  "primarySkill": self.userProffesionalModel.primaryskills,
		  "projectDesc": self.userProffesionalModel.projectdesc,
		  "projectDuration": (self.exp).toString(),
		  "projectEndDate": self.userProffesionalModel.enddate.formatted,
		  "projectName": self.userProffesionalModel.project,
		  "projectRole": self.userProffesionalModel.role,
		  "projectStartDate": self.userProffesionalModel.startdate.formatted,
		  "totalExp":  self.userProfessionData[self.editModeOn].totalExp,
		  "user":  self.userProfessionData[self.editModeOn].user
		};
		
		
		this.http.updateUserProfession(postdata)
		  .subscribe(
			(data) => {
			  this.updateResponseData = data;
			},
			(error) => {
				this.errorMsg = error;
			},
			() => {
				self.editModeOn = "";
				this.getUserProfessionalDetails();
				this.successMsg = "Profile Updated Successfully.";
				self.userProffesionalModel.organization = "";
				self.userProffesionalModel.otherskills = "";
				self.userProffesionalModel.primaryskills = "";
				self.userProffesionalModel.projectdesc = "";
				self.userProffesionalModel.enddate = "";
				self.userProffesionalModel.project = "";
				self.userProffesionalModel.role = "";
				self.userProffesionalModel.startdate = "";
				self.exp = null;
			}
		  );
	}
	
	
	addrecord = function(){
		this.errorMsg = "";
		this.successMsg = "";
		var self = this;
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
		  "modBy": self.sessionData.sessionUserName,
		  "modOn": todayPrint,
		  "organization": self.userProffesionalModel.organization,
		  "otherSkill": self.userProffesionalModel.otherskills,
		  "primarySkill": self.userProffesionalModel.primaryskills,
		  "projectDesc": self.userProffesionalModel.projectdesc,
		  "projectDuration": (self.exp).toString(),
		  "projectEndDate": self.userProffesionalModel.enddate.formatted,
		  "projectName": self.userProffesionalModel.project,
		  "projectRole": self.userProffesionalModel.role,
		  "projectStartDate": self.userProffesionalModel.startdate.formatted,
		  "totalExp": (self.exp).toString(),
		  "user": parseInt(self.sessionData.sessionId)
		};
		this.http.addproffession(postdata)
		  .subscribe(
			(data) => {
			  //self.items = data.person;
				if(data){
					
				}
			},
			(error) => {
				this.errorMsg = error;
			},
			() => {
				self.addmodeOn = false;
				this.getUserProfessionalDetails();
				this.successMsg = "New Professional Record added successfully.";
				self.userProffesionalModel.organization = "";
				self.userProffesionalModel.otherskills = "";
				self.userProffesionalModel.primaryskills = "";
				self.userProffesionalModel.projectdesc = "";
				self.userProffesionalModel.enddate = "";
				self.userProffesionalModel.project = "";
				self.userProffesionalModel.role = "";
				self.userProffesionalModel.startdate = "";
				self.exp = null;
			}
		  );
	}
	
	gotoback = function(){
		this.errorMsg = "";
		this.successMsg = "";
		var self = this;
		self.addmodeOn = false;
		self.editModeOn = "";
		self.userProffesionalModel.organization = "";
				self.userProffesionalModel.otherskills = "";
				self.userProffesionalModel.primaryskills = "";
				self.userProffesionalModel.projectdesc = "";
				self.userProffesionalModel.enddate = "";
				self.userProffesionalModel.project = "";
				self.userProffesionalModel.role = "";
				self.userProffesionalModel.startdate = "";
				self.exp = null;
	}
	
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
  
  onDateChanged = function(event: IMyDateModel, purpose){
	  this.errorMsg = "";
		this.successMsg = "";
	  var self = this;
	   if(purpose == "endDate" && (event.formatted == '' || self.userProffesionalModel.startdate == '' || !self.userProffesionalModel.startdate) ){
		  self.exp = null;
	}else if(purpose == "startdate" && (event.formatted == '' || self.userProffesionalModel.enddate == '' || !self.userProffesionalModel.enddate) ){
		  self.exp = null;
	}else{
		  if(purpose == "endDate"){
				var strtDt = new Date(self.userProffesionalModel.startdate.formatted);
				var endDt = new Date(event.formatted);
		  }else{
			  var strtDt = new Date(event.formatted);
			  var endDt = new Date(self.userProffesionalModel.enddate.formatted);
		  }
		  self.exp = (endDt.getFullYear() - strtDt.getFullYear())*12 + (endDt.getMonth() - strtDt.getMonth());
	}
 }
	
}
	
	
	
	
	