import { Component, OnInit, AfterViewInit } from '@angular/core';
import * as $ from 'jquery';

import { HttpTestService } from '../../../services/http.service';
import { sessionServices } from '../../../services/session.services';
import { Router,ActivatedRoute} from '@angular/router';
import {Observable} from 'rxjs/Rx';
import {GridOptions} from "ag-grid/main";
import {IMyDpOptions} from 'mydatepicker';
import { storeCreateModel,polineitemsCreateModel,suppliermasterCreateModel,searchCreateModel} from '../../../models/storeentryregister/storeCreate.model';
import { error } from 'selenium-webdriver';


@Component({
  selector: 'app-payroll',
  templateUrl: './storeRegisterEdit.component.html'
})
export class storeRegisterEditComponent implements OnInit {
	public ponodata = {};
	public ponoIds = [];
	public myDatePickerOptions: IMyDpOptions = {
        // other options...
		dateFormat: 'yyyy-mm-dd'
	};
	public disable:boolean=false;
	public dateofChallan: any[];
	public date: Object = { date: { year: new Date().getFullYear(), month: new Date().getMonth()+1, day: new Date().getDate() },formatted : new Date().getFullYear() + "-" + (new Date().getMonth()+1) + "-" + new Date().getDate() };
	public allchallanNo : any=[];

	public challanNoUrl: any;
	public ChallanNoLink:any;
	public suppCodeLink:any;

	public storeCreateModel: storeCreateModel = new storeCreateModel();
	public polineitemsdetails:polineitemsCreateModel[] = [];
	// public polineitemsCreateModel:polineitemsCreateModel[] = [];
	public storeResponsedata : any;


	public settings = {};
	public successMsg: string ;
	public errorMsg: string ;
	public requestedURL : any;
	public userGroupData : any = '';
	public userMenuData : any = '';
	public userSelectionMenuData : any = [];
	public sessionData: any;
	constructor(private http: HttpTestService, private router: Router,public activatedRoute: ActivatedRoute , private session: sessionServices,) {}
ngOnInit() {
		this.getSession();
		this.challanNoUrl = this.activatedRoute.params.subscribe(params => {
		this.ChallanNoLink = params['hdrId'];
		// this.suppCodeLink = params['suppCode'];
		});
		this.loadChallanNo();


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

//getallfinishingdispatchhdrbychallanno/{challanNo}
loadChallanNo = function(){
	this.http.getStoreentryById(this.ChallanNoLink)
		.subscribe(
			(data) =>{
				this.storeCreateModel = data;
				
				this.allchallanNo = data;
			
				this.polineitemsdetails = this.allchallanNo.polineitems;
				console.log(this.polineitemsdetails);
				this.dateofChallan = this.allchallanNo.challanDate.split("-");
				this.date = { date: { year: parseInt(this.dateofChallan[0]), month: parseInt(this.dateofChallan[1]),
				 day: parseInt(this.dateofChallan[2]) },formatted : parseInt(this.dateofChallan[0]) + "-" + parseInt(this.dateofChallan[1]) + "-" + parseInt(this.dateofChallan[2]) };
				console.log(data);
			},
			(error) => this.errorMsg = error,
			() => console.log("complete")
	
		);
	}







//update function

update =function(){
	this.errorMsg="";
	this.successMsg="";
	this.storeCreateModel.challanDate = this.date.formatted;
	this.http.updateStoreEntry(this.storeCreateModel)
	.subscribe(
		(res) =>{
			this.juteResponsedata = res.json();
			if(res.status===208){
				this.errorMsg = "Already Out";
			}else{
				this.successMsg = "Update Successfully."; 
			}
		},
		// (data) =>{
		// 	this.storeResponsedata = data;
		// 	// this.loadChallanNo();
		// },
		(error) => this.errorMsg = error,
		() =>{
			// this.successMsg = "Update Successfully";
			// this.date = "";
		}
	);
}



// out function

out =function(){
	this.errorMsg="";
	this.successMsg="";
	// this.storeCreateModel.challanDate = this.date.formatted;
	this.http.outStoreEntry(this.storeCreateModel)
	.subscribe(
		(res) =>{
			this.juteResponsedata = res.json();
			if(res.status===208){
				this.errorMsg = "Already Out";
			}else{
				this.successMsg = "Out Successfully."; 
			}
		},
		// (data) =>{
		// 	this.storeResponsedata = data;
		// 	// this.loadChallanNo();
		// },
		(error) => this.errorMsg = error,
		() =>{
			// this.successMsg = "Out Successfully";
			// this.date = "";
		}
	);
}

	
}
