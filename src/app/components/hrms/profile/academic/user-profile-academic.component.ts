import { Component, OnInit } from '@angular/core';
import * as $ from 'jquery';

import { HttpTestService } from '../../../../services/http.service';
import { sessionServices } from '../../../../services/session.services';
import { Router} from '@angular/router';
import {Observable} from 'rxjs/Rx';
import { userAcademicModel } from '../../../../models/user/userAcademic.model';
import {IMyDpOptions} from 'mydatepicker';
import {GridOptions} from "ag-grid/main";

@Component({
  selector: 'app-user-profile-detail',
  templateUrl: './user-profile-academic.component.html'
 })


export class userProfileAcademicComponent implements OnInit {
	
	public editable : boolean = false;
	public updateResponseData : any;
	public errorMsg : string = "";
	public successMsg : string = "";
	public gridOptions: GridOptions;
	public requestedURL : any;
	public loggedInUserID : string = "";
	public userGroupData : any = '';
	public userMenuData : any = '';
	public userSelectionMenuData : any = [];
	public userAcademicData : any = [];
	
	public addmodeOn : boolean = false;
	public editModeOn : any = '';
	public sessionData: any;
	
	
	public userAcademicModel: userAcademicModel = new userAcademicModel();
	
	public myDatePickerOptions: IMyDpOptions = {
        dateFormat: 'yyyy-mm-dd',
    };
	
	public columnDef : any = [
		{headerName: "Degree Name", field: "highestDegree", suppressMenu: true, minWidth : 350},
		{headerName: "University", field: "university", suppressMenu: true, minWidth : 250},
		{headerName: "Passing Year", field: "passingYear", suppressMenu: true, minWidth : 100}
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
		 this.gridOptions.onGridReady = function(params) {params.api.sizeColumnsToFit();};
		 this.gridOptions.onRowClicked = function(params) {
			 self.errorMsg = "";
			 self.successMsg = "";
			 self.editModeOn = params.node.id;
			 self.userAcademicModel.university = self.userAcademicData[params.node.id].university;	
			 self.userAcademicModel.passOutYear = self.userAcademicData[params.node.id].passingYear;
		     self.userAcademicModel.highestDegree = self.userAcademicData[params.node.id].highestDegree;
		 };
	}
		
	ngOnInit() {
		this.getSession();
		this.loggedInUserID = window.sessionStorage.getItem('id');
		this.getUserAcademicDetails();
	}
	
	//get session details
	getSession = function(){
		this.sessionData = this.session.getSessionDetails();
	}
	
	//fetch user Academic data
	getUserAcademicDetails = function(){
		var self = this;
		this.http.getUserAcademyById(self.sessionData.sessionId)//this.loggedInUserID
		  .subscribe(
			(data) => {
			  //self.items = data.person;
				if(data){
					this.userAcademicData = data;
				}
			},
			(error) => {
				this.errorMsg = error;
			},
			() => {
				if(typeof self.gridOptions.api != 'undefined'){
					self.gridOptions.api.setRowData(self.userAcademicData);
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
	
	addAcademicData = function(callfor){
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
		var postData = {
			"user":parseInt(self.sessionData.sessionId),
			"highestDegree":self.userAcademicModel.highestDegree,
			"passingYear":self.userAcademicModel.passOutYear,
			"university":self.userAcademicModel.university,
			"isValid":"Y",
			"modBy":self.sessionData.sessionUserName,
			"modOn":todayPrint,
			"validity":null
			};
			
		self.http.addUserAcademics(postData)
		  .subscribe(
			(data) => {
			  this.updateResponseData = data;
			},
			(error) => {
				this.errorMsg = error;
			},
			() => {
				self.addmodeOn = false;
				this.getUserAcademicDetails();
				this.successMsg = "New Academic Record added successfully.";
				self.userAcademicModel.highestDegree = "";
				self.userAcademicModel.passOutYear = "";
				self.userAcademicModel.university = "";
				}
		  );
			
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
		var postData = {
			"id": self.userAcademicData[self.editModeOn].id,
			"user":self.userAcademicData[self.editModeOn].user,
			"highestDegree":self.userAcademicModel.highestDegree,
			"passingYear":self.userAcademicModel.passOutYear,
			"university":self.userAcademicModel.university,
			"isValid":"Y",
			"modBy":self.sessionData.sessionUserName,
			"modOn":todayPrint,
			"validity":null
			};
		this.http.updateUserAcademics(postData)
		  .subscribe(
			(data) => {
			  this.updateResponseData = data;
			},
			(error) => {
				this.errorMsg = error;
			},
			() => {
				self.editModeOn = "";
				this.getUserAcademicDetails();
				this.successMsg = "Profile Updated Successfully.";
				self.userAcademicModel.highestDegree = "";
				self.userAcademicModel.passOutYear = "";
				self.userAcademicModel.university = "";
				
				}
		  );
	}
	
	
	gotoback = function(){
		this.errorMsg = "";
		this.successMsg = "";
		var self = this;
		self.addmodeOn = false;
		self.editModeOn = "";
		self.userAcademicModel.highestDegree = "";
				self.userAcademicModel.passOutYear = "";
				self.userAcademicModel.university = "";
	}
	
	
	
}
	
	
	
	
	