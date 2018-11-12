import { Component, OnInit, AfterViewInit } from '@angular/core';
import * as $ from 'jquery';

import { HttpTestService } from '../../../services/http.service';
import { sessionServices } from '../../../services/session.services';
import { Router } from '@angular/router';
import {Observable} from 'rxjs/Rx';
import {GridOptions} from "ag-grid/main";
import {IMyDpOptions} from 'mydatepicker';
import {finishingsaleCreateModel} from '../../../models/finishingsaleentryregister/finishingsaleCreate.model';
import { error } from 'selenium-webdriver';




@Component({
  selector: 'app-payroll',
  templateUrl: './finishingsaleRegister.component.html'
})
export class finishingsaleRegisterComponent implements OnInit {

	public time : string ;
	public currentDate = new Date();
	public day = this.currentDate.getDate();
	public month = this.currentDate.getMonth() + 1;
	public year = this.currentDate.getFullYear();
	public myDatePickerOptions: IMyDpOptions = {
        // other options...
		dateFormat: 'yyyy-mm-dd'
	};
	public disable:boolean=false;
	public date: Object = { date: { year: new Date().getFullYear(), month: new Date().getMonth()+1, day: new Date().getDate() },formatted : new Date().getFullYear() + "-" + (new Date().getMonth()+1) + "-" + new Date().getDate() };
	public fromDate: Object = { date: { year: new Date().getFullYear(), month: new Date().getMonth()+1, day: new Date().getDate() },formatted : new Date().getFullYear() + "-" + (new Date().getMonth()+1) + "-" + new Date().getDate()};
	public toDate:Object = { date: { year: new Date().getFullYear(), month: new Date().getMonth()+1, day: new Date().getDate() },formatted : new Date().getFullYear() + "-" + (new Date().getMonth()+1) + "-" + new Date().getDate()};

	public finishingsaleCreateModel: finishingsaleCreateModel = new finishingsaleCreateModel();
	public finishingsaleResponsedata : any;


	public settings = {};
	public successMsg: string ;
	public errorMsg: string ;
	public requestedURL : any;
	public userGroupData : any = '';
	public userMenuData : any = '';
	public userSelectionMenuData : any = [];
	public sessionData: any;
	constructor(public http: HttpTestService, public router: Router, public session: sessionServices,) {}
ngOnInit() {
		this.getSession();
		this.getUserGroup();
		this.startTime();
		this.startDate();

}

getSession = function(){
	this.sessionData = this.session.getSessionDetails();
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
					if(this.userMenuData[i].menuItem.menuName == 'Purchase'){
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
//curent time
startTime = function(){
	var today = new Date();
	let h = today.getHours();
	let m = today.getMinutes();
	let s = today.getSeconds();
	m = this.checkTime(m);
	s = this.checkTime(s);
	this.time = h + ':' + m + ':' + s
	setTimeout(() => {
	  this.startTime();
	}, 500);
  }
 
 checkTime = function(i) {
    if (i < 10) {i = "0" + i};  
    return i;
}
//curent date
startDate = function(){
this.currentDate= this.day + "/" + this.month + "/" + this.year;
}


search = function(event,fromDate,toDate){
	console.log(fromDate);
	console.log(toDate);
		this.http.getSearchFinishingSale(fromDate.formatted,toDate.formatted)
		.subscribe(
			(data) =>{
				this.searchList = data;
				this.http.setSearchDate(this.searchList);
				console.log(data);
			},
			(error) => this.errorMsg = error,
			() => console.log("complete")
	
		);
		
		
	
	}




//create function

createFinishingSale =function(){
	this.errorMsg="";
	this.successMsg="";
	this.finishingsaleCreateModel.challanDate = this.date.formatted;
	this.http.createFinishingSale(this.finishingsaleCreateModel)
	.subscribe(
		(data) =>{
			this.finishingsaleResponsedata = data;
		},
		(error) => this.errorMsg = error,
		() =>{
			this.successMsg = "Created Successfully";
			this.date = "";
			this.disable = false;
			this.finishingsaleCreateModel = new finishingsaleCreateModel();
		}
	);
	var newItem =this.finishingsaleCreateModel;
}

	
}
