import { Component, OnInit, AfterViewInit } from '@angular/core';
import * as $ from 'jquery';

import { HttpTestService } from '../../../services/http.service';
import { sessionServices } from '../../../services/session.services';
import { Router,ActivatedRoute} from '@angular/router';
import {Observable} from 'rxjs/Rx';
import {GridOptions} from "ag-grid/main";
import {IMyDpOptions} from 'mydatepicker';
import {finishingsaleCreateModel,finishingsaledetailsCreateModel} from '../../../models/finishingsaleentryregister/finishingsaleCreate.model';
import { error } from 'selenium-webdriver';




@Component({
  selector: 'app-payroll',
  templateUrl: './finishingsaleRegisterEdit.component.html'
})
export class finishingsaleRegisterEditComponent implements OnInit {
	public myDatePickerOptions: IMyDpOptions = {
        // other options...
		dateFormat: 'yyyy-mm-dd'
	};
	public disable:boolean=false;
	public dateofChallan: any[];
	public date: Object = { date: { year: new Date().getFullYear(), month: new Date().getMonth()+1, day: new Date().getDate() },formatted : new Date().getFullYear() + "-" + (new Date().getMonth()+1) + "-" + new Date().getDate() };
	public allchallanNo : any=[];
	public allSlectionQulity: any=[];
	public challanNoUrl: any;
	public ChallanNoLink:any;

	public finishingsaleCreateModel: finishingsaleCreateModel = new finishingsaleCreateModel();
	public finishingsaledetails: finishingsaledetailsCreateModel = new finishingsaledetailsCreateModel();
	public finishingsaledetailsCreateModel:finishingsaledetailsCreateModel[] = [];
	public finishingsaleResponsedata : any;


	public settings = {};
	public successMsg: string ;
	public errorMsg: string ;
	public requestedURL : any;
	public userGroupData : any = '';
	public userMenuData : any = '';
	public userSelectionMenuData : any = [];
	public sessionData: any;
	constructor(public http: HttpTestService, public router: Router,public activatedRoute: ActivatedRoute , public session: sessionServices,) {}
ngOnInit() {
		this.getSession();
		this.challanNoUrl = this.activatedRoute.params.subscribe(params => {
		this.ChallanNoLink = params['challanNo'];
		});
		this.loadChallanNo();
		this.loadSelectionQuality();

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
	this.http.getFinishingSaleChallanno(this.ChallanNoLink)
		.subscribe(
			(data) =>{
				this.finishingsaleCreateModel = data;
				this.allchallanNo = data;
				this.dateofChallan = this.allchallanNo.challanDate.split("-");
				this.date = { date: { year: parseInt(this.dateofChallan[0]), month: parseInt(this.dateofChallan[1]),
				 day: parseInt(this.dateofChallan[2]) },formatted : parseInt(this.dateofChallan[0]) + "-" + parseInt(this.dateofChallan[1]) + "-" + parseInt(this.dateofChallan[2]) };
				console.log(data);
			},
			(error) => this.errorMsg = error,
			() => console.log("complete")
	
		);
	}

//selectionquality/getAllSelectionQuality
loadSelectionQuality = function(){
	this.http.getAllselectionqulity()
		.subscribe(
			(data) =>{
				this.allSlectionQulity = data;
				console.log(data);
			},
			(error) => this.errorMsg = error,
			() => console.log("complete")
	
		);
	}






//update function

updateFinishingSale =function(){
	this.errorMsg="";
	this.successMsg="";
	this.finishingsaledetailsCreateModel.push(this.finishingsaledetails);
	this.finishingsaledetails = new finishingsaledetailsCreateModel();
	this.finishingsaleCreateModel.challanDate = this.date.formatted;
	this.finishingsaledetailsCreateModel.forEach(element => {
		this.finishingsaleCreateModel.finishdtls.push(element);
			console.log(this.finishingsaleCreateModel);
		});

	this.http.updateFinishingSale(this.finishingsaleCreateModel)
	.subscribe(
		(data) =>{
			this.finishingsaleResponsedata = data;
			this.loadChallanNo();
		},
		(error) => this.errorMsg = error,
		() =>{
			this.successMsg = "Update Successfully";
			this.date = "";
			this.disable = false;
			this.loadChallanNo();
		
			this.finishingsaleCreateModel = new finishingsaleCreateModel();
			
	
		}
	);

}

//out function

outFinishingSale =function(){
	this.errorMsg="";
	this.successMsg="";
	this.finishingsaledetailsCreateModel.push(this.finishingsaledetails);
	this.finishingsaledetails = new finishingsaledetailsCreateModel();
	this.finishingsaleCreateModel.challanDate = this.date.formatted;
	this.finishingsaledetailsCreateModel.forEach(element => {
		this.finishingsaleCreateModel.finishdtls.push(element);
			console.log(this.finishingsaleCreateModel);
		});
	this.http.outFinishingSale(this.finishingsaleCreateModel)
	.subscribe(
		(data) =>{
			this.finishingsaleResponsedata = data;
			this.loadChallanNo();
		},
		(error) => this.errorMsg = error,
		() =>{
			this.date = "";
			this.disable = false;
			this.loadChallanNo();
			this.finishingsaleCreateModel = new finishingsaleCreateModel();
		}
	);
	
}



	
}
