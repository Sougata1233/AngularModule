import { Component, OnInit, AfterViewInit } from '@angular/core';
import * as $ from 'jquery';

import { HttpTestService } from '../../../services/http.service';
import { sessionServices } from '../../../services/session.services';
import { Router,ActivatedRoute} from '@angular/router';
import {Observable} from 'rxjs/Rx';
import {GridOptions} from "ag-grid/main";
import {IMyDpOptions} from 'mydatepicker';
import {juteCreateModel,polineitemsCreateModel,suppliermasterCreateModel} from '../../../models/juteentryregister/juteCreate.model';
import { error } from 'selenium-webdriver';
import { element } from 'protractor';




@Component({
  selector: 'app-payroll',
  templateUrl: './juteRegisterEdit.component.html'
})
export class juteRegisterEditComponent implements OnInit {
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

	public disabled:boolean;
	public juteCreateModel: juteCreateModel = new juteCreateModel();
	public polineitemsdetails: polineitemsCreateModel[] = [];
	// public polineitemsCreateModel:polineitemsCreateModel[] = [];
	public juteResponsedata : any;


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
		this.ChallanNoLink = params['id'];
		// this.suppCodeLink = params['suppName'];
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
	this.http.getJuteentryById(this.ChallanNoLink)
		.subscribe(
			(data) =>{
				this.juteCreateModel = data;
				
				this.allchallanNo = data;
				this.disabled = this.allchallanNo.grossWeight != 0;
				// console.log(this.allchallanNo.chalanDate);
				this.polineitemsdetails = this.allchallanNo.polineitem;
			
				this.dateofChallan = this.allchallanNo.chalanDate.split("-");
				this.date = { date: { year: parseInt(this.dateofChallan[0]), month: parseInt(this.dateofChallan[1]),
				 day: parseInt(this.dateofChallan[2]) },formatted : parseInt(this.dateofChallan[0]) + "-" + parseInt(this.dateofChallan[1]) + "-" + parseInt(this.dateofChallan[2]) };
				console.log(data);
			},
			(error) => this.errorMsg = error,
			() => console.log("complete")
	
		);
	}


	checkboxChange = function(poval,num){
		this.polineitemsdetails.forEach(element=>{
			if(element.polineitemnum=num){
				element.isPOAmment=poval;
			}
		}
		)

	}




//update function

update =function(){
	this.errorMsg="";
	this.successMsg="";
	// this.polineitemsCreateModel.push(this.polineitemsdetails);
	// this.polineitemsdetails = new polineitemsCreateModel();
	
	// this.polineitemsdetails.forEach(element => {
	// 	this.storeCreateModel.polineitems.push(element);
	// 		console.log(this.storeCreateModel);
	// 	});
		this.juteCreateModel.challanDate = this.date.formatted;
		// this.polineitemsdetails.forEach(element =>{
		// 	element.isPOAmment= element.isPOAmment ? 1 : 0;
		// });

	this.http.updateJuteEntry(this.juteCreateModel)
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
		// 	this.juteResponsedata = data;
		// 	this.loadChallanNo();
		// },
		(error) => this.errorMsg = error,
		() =>{
			// this.successMsg = "Update Successfully";
			// this.date = "";
			
			// this.loadChallanNo();
		
			// this.storeCreateModel = new storeCreateModel();
			
	
		}
	);

}

actulWeight =function(){
	this.errorMsg="";
	console.log(this.juteCreateModel.grossWeight);
	console.log(this.juteCreateModel.netWeight);

	if(this.juteCreateModel.grossWeight >this.juteCreateModel.netWeight){
		this.juteCreateModel.actualWeight = this.juteCreateModel.grossWeight - this.juteCreateModel.netWeight;
		console.log('hello')
	}else{
		this.juteCreateModel.actualWeight = 0;
		this.errorMsg = "Tare weight can not be grater than Gross weight.";
	
	}
	
}

// actulWeighttwo =function(){
// 	// this.juteCreateModel.grossWeight >this.juteCreateModel.netWeight;

// 	this.errorMsg="";
// 	// this.juteCreateModel.actualWeight="";
// 	if(this.juteCreateModel.grossWeight >this.juteCreateModel.netWeight){
// 		this.juteCreateModel.actualWeight = this.juteCreateModel.grossWeight - this.juteCreateModel.netWeight;
// 		console.log(this.juteCreateModel.actualWeight)
// 	}else{
// 		this.errorMsg = "Tare weight can not be grater than Gross weight.";
// 		this.juteCreateModel.actualWeight=0;
// 	}
	
// }

// out function


out =function(){
	this.errorMsg="";
	this.successMsg="";
	// this.storeCreateModel.challanDate = this.date.formatted;
	this.http.outJuteEntry(this.juteCreateModel)
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
		// 	this.juteResponsedata = data;
		// 	// this.loadChallanNo();
		// },
		(error) => this.errorMsg = error,
		() =>{
			this.successMsg = "Out Successfully";
			// this.date = "";
		}
	);
}




// out =function(){
	
// 	this.errorMsg="";
// 	this.successMsg="";
// 	// this.polineitemsCreateModel.push(this.polineitemsdetails);
// 	// this.polineitemsdetails = new polineitemsCreateModel();
	
// 	// this.polineitemsdetails.forEach(element => {
// 	// 	this.storeCreateModel.polineitems.push(element);
// 	// 		console.log(this.storeCreateModel);
// 	// 	});
// 		this.juteCreateModel.challanDate = this.date.formatted;
// 		// this.polineitemsdetails.forEach(element =>{
// 		// 	element.isPOAmment= element.isPOAmment ? 1 : 0;
// 		// });


// 	this.http.outJuteEntry(this.juteCreateModel)
// 	.subscribe(
// 		(data) =>{
// 			this.juteResponsedata = data;
// 			this.loadChallanNo();
// 		},
// 		(error) => this.errorMsg = error,
// 		() =>{
// 			this.successMsg = "Update Successfully";
// 			this.date = "";
			
// 			// this.loadChallanNo();
		
// 			// this.storeCreateModel = new storeCreateModel();
			
	
// 		}
// 	);

// }


	
}
