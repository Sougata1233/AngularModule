import { Component, OnInit, AfterViewInit } from '@angular/core';
import * as $ from "jquery";

import { HttpTestService } from '../../../../services/http.service';
import { sessionServices } from '../../../../services/session.services';
import { Router, ActivatedRoute} from '@angular/router';
import {IMyDpOptions} from 'mydatepicker';
import { userPersonalModel } from '../../../../models/user/userPersonal.model';

@Component({
  selector: 'app-user-profile-detail',
  templateUrl: './user-profile-personal.component.html'
 })


export class userProfilePersonalComponent implements OnInit {
	
	public editable : boolean = false;
	public updateResponseData : any;
	public errorMsg : string = "";
	public successMsg : string = "";
	public sessionData: any;
	public userdata : any;
	public userPersonalModel: userPersonalModel = new userPersonalModel();
	public serviceOn : boolean = false;
	public allCountry : any = [];
	public allState : any = [];
	public allCity : any = [];
	
	public myDatePickerOptions: IMyDpOptions = {
        // other options...
        dateFormat: 'yyyy-mm-dd',
		disableSince : { year: new Date().getFullYear(), month: new Date().getMonth()+1, day: new Date().getDate()+1 }
    };
	constructor(public http: HttpTestService, public router: Router, public session: sessionServices) { }
		
	ngOnInit() {
		this.getSession();
		
	};
	
	
	//get session details
	getSession = function(){
		this.sessionData = this.session.getSessionDetails();
		this.getUserDetails();
	}
	
	getAllCountry = function(){
		this.http.getCountry()
		  .subscribe(
			(data) => {
			  //self.items = data.person;
				if(data){
					this.allCountry = data;
				}
			},
			(error) => {
				this.errorMsg = error;
			},
			() => {
				if(this.userdata.country && this.userdata.country != '' && this.userdata.country != undefined){
				this.getStatebyCountry(this.userdata.country);
				}
				}
		  );
	}
	
	
	getStatebyCountry = function(country){
		this.allState.length = 0;
		if(country != ''){
			this.http.getStateByCountry(country)
			  .subscribe(
				(data) => {
				  //self.items = data.person;
					if(data){
						this.allState = data;
					}
				},
				(error) => {
					this.errorMsg = error;
				},
				() => {
					
					if(this.userdata.state && this.userdata.state != '' && this.userdata.state != undefined){
						this.getCityByState(this.userdata.state);
					}
				}
			  );
		}
	}
	
	
	getCityByState = function(state){
		this.allCity.length = 0;
		if(state != ''){
			this.http.getCityByState(state)
			  .subscribe(
				(data) => {
				  //self.items = data.person;
					if(data){
						this.allCity = data;
					}
				},
				(error) => {
					this.errorMsg = error;
				},
				() => {}
			  );
		}
	}
	
	
	//fetch user data
	getUserDetails = function(){
		this.http.getUserDetailsByName(this.sessionData.sessionUserName)
		  .subscribe(
			(data) => {
			  //self.items = data.person;
				if(data){
					this.userdata = data;
				}
			},
			(error) => {
				this.errorMsg = error;
			},
			() => {
				this.getAllCountry();
				if(this.userdata.dateOfBirth && this.userdata.dateOfBirth != '' && this.userdata.dateOfBirth != undefined){
					var fetchedDate = this.userdata.dateOfBirth;
					fetchedDate = fetchedDate.split("-");
					var dateObj = { 
									date: { year: parseInt(fetchedDate[0]), month: parseInt(fetchedDate[1]), day: parseInt(fetchedDate[2]) },
									formatted : this.userdata.dateOfBirth
								};
					this.userPersonalModel.dateOfBirth = dateObj;
				}
			}
		  );
	}
	
	//edit all fields
	editDetails = function(){
		this.editable = true;
	}
	
	//save personal details
	saveDetails = function(){
		this.serviceOn = true;
		this.userdata.dateOfBirth = this.userPersonalModel.dateOfBirth.formatted;
		this.http.updateUserDetails(this.userdata)
		  .subscribe(
			(data) => {
			  this.updateResponseData = data;
			},
			(error) => {
				this.serviceOn = false;
				this.errorMsg = error;
			},
			() => {
				this.serviceOn = false;
				this.successMsg = "Profile Updated Successfully.",
				this.editable = false
			}
		  );
	}
	
	//image browse
	onBrowseClick(event){
		if(this.editable){
			$(event.target).parents(".profile-image").find("input[type=file]").trigger("click");
		}
	}
	
	
	//update Image Data URL
	onUploadImageChange(event){
		
		var self = this, 
		reader = new FileReader();
		reader.readAsDataURL(event.target.files[0]);
		reader.onload = function($event:any) {
			$(event.target).parents(".profile-image").find(".user-prof-pics").attr("src", $event.target.result); 
			self.userdata.userImg = ($event.target.result.split(',')[1]).toString();		
		};
	}
	

	
}
