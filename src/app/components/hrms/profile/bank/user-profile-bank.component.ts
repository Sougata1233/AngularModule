import { Component, OnInit } from '@angular/core';

import { HttpTestService } from '../../../../services/http.service';
import { sessionServices } from '../../../../services/session.services';
import { userAcademicModel } from '../../../../models/user/userAcademic.model';
import { userBankModel } from '../../../../models/user/userBank.model';
import { Router} from '@angular/router';
import {Observable} from 'rxjs/Rx';

@Component({
  selector: 'app-user-profile-detail',
  templateUrl: './user-profile-bank.component.html'
 })


export class userProfileBankComponent implements OnInit {
	
	public editable : boolean = false;
	public updateResponseData : any;
	public errorMsg : string = "";
	public successMsg : string = "";
	
	public requestedURL : any;
	public userGroupData : any = '';
	public userMenuData : any = '';
	public userSelectionMenuData : any = [];
	public allbankdataWithBranch : any = [];
	public allbankdata : any = [];
	public allBranchData : any = [];
	public allBankUniqNames : any = [];
	public userBankModel : userBankModel = new userBankModel();
	public userBankDetails : any = "";
	public isNew : Boolean = true;
	public selectedBankIndex : any;
	public selectedBranchIndex : any;
	public sessionData: any;
	
	public clock = Observable
        .interval(1000)
	.map(()=> new Date());
	
	public userAcademicModel: userAcademicModel = new userAcademicModel();
	
	
	constructor(public http: HttpTestService, public router: Router, public session: sessionServices) { }
		
	ngOnInit() {
		this.getAllBanks();
		this.getSession();
		//this.getUserGroup();
		
	}
	
	//get session details
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
						if(this.userMenuData[i].menuItem.menuName == 'HRMS'){
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
				this.userBankDetails = data[0].user;
				this.userBankModel.user = this.userBankDetails;
				console.log("user");
				console.log(this.userBankDetails);
			  },
			(error) => {
				this.errorMsg = error;
				this.userGroupData = "";
			},
			() => this.getMenuItemsByUserGroup()
		  );
	}
	
	//get all bank data
	getAllBanks = function(){
		this.http.getBankAll()
		  .subscribe(
			(data) => {
			  //self.items = data.person;
				if(data){
					this.allbankdataWithBranch = data;
				}else{
					this.allbankdataWithBranch = [];
				}
			},
			(error) => {
				this.errorMsg = error,
				this.allbankdataWithBranch = []
			},
			() => {
				for(var i=0; i < this.allbankdataWithBranch.length; i++){
					
					if(this.allBankUniqNames.indexOf(this.allbankdataWithBranch[i].bank.bankName) < 0){
						this.allBankUniqNames.push(this.allbankdataWithBranch[i].bank.bankName);
						this.allbankdata.push(this.allbankdataWithBranch[i]);
					}
				}

				this.getUserBankDetails();
			}
		  );
	
	}
	//get all branches
	
	getAllBranch = function(e){
		var selectedBank = e.target.value;
		this.userBankModel.branch = '';
		this.allBranchData = [];
		if(selectedBank != ""){
			this.http.getBranchByBank(this.allbankdata[selectedBank].bank.id)
		  .subscribe(
			(data) => {
			  //self.items = data.person;
				if(data){
					this.allBranchData = data;
				}
			},
			(error) => {
				this.errorMsg = error,
				this.allBranchData = []
			},
			() => console.log('completed')
		  );
		}
	}

	getAllBranchByBankId = function(id){
		var selectedBank = id;
		this.allBranchData = [];
		if(selectedBank != ""){
			
			this.http.getBranchByBank(selectedBank)
		  .subscribe(
			(data) => {
			  //self.items = data.person;
				if(data){
					this.allBranchData = data;
					for(var i=0; i < this.allBranchData.length; i++){
						// console.error(this.allBranchData[i]);
						// console.error(this.userBankDetails.branch);

						if(this.allBranchData[i].id == this.userBankDetails.branch.id){
							this.selectedBranchIndex = i;
						}
					}
				}
			},
			(error) => {
				this.errorMsg = error,
				this.allBranchData = []
			},
			() => {
					console.log('completed');
					
				}
		  );
		}
	}
	
	//fetch user Academic data
	getUserBankDetails = function(){
		var self = this;
		this.http.getUserBankById(this.sessionData.sessionId)
		  .subscribe(
			(data) => {
			  //self.items = data.person;
			  this.userBankDetails = data;
			},
			(error) => {
				this.errorMsg = error;
				this.userBankDetails = "";
			},
			() => {
				
				this.isNew = (this.userBankDetails.length==0 || this.userBankDetails == '')?true:false;
				for(var i=0; i<this.allbankdata.length; i++){
					if(this.allbankdata[i].id == this.userBankDetails[0].bank.id){
						self.userBankModel.bank = i;
					}
				}
				this.allBranchData = [];
				this.http.getBranchByBank(this.allbankdata[self.userBankModel.bank].bank.id)
				  .subscribe(
					(data) => {
					  //self.items = data.person;
						if(data){
							this.allBranchData = data;
						}
					},
					(error) => {
						this.errorMsg = error,
						this.allBranchData = []
					},
					() => {
						for(var i=0; i<this.allBranchData.length; i++){
							if(this.allBranchData[i].id == this.userBankDetails[0].branch.id){
								self.userBankModel.branch = i;
							}
						}
						
						self.userBankModel.accountType = self.userBankDetails[0].accountType;
						self.userBankModel.accountNum = self.userBankDetails[0].accountNum;
					}
				  );
			}
		  );
	}
	
	//edit all fields
	editDetails = function(){
		this.editable = true;
	}
	
	//save personal details
	saveDetails = function(){
		var self = this;
		this.errorMsg = "";
		this.successMsg = "";
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
						  "accountNum": self.userBankModel.accountNum,
						  "accountType": self.userBankModel.accountType,
						  "bank": self.allbankdata[self.userBankModel.bank],
						  "branch": self.allBranchData[self.userBankModel.branch],
						  "id": self.userBankDetails[0].id,
						  "ifscCode": self.allBranchData[self.userBankModel.branch].ifscCode,
						  "modifiedBy": self.sessionData.sessionUserName,
						  "modifiedOn": todayPrint,
						  "user": self.userBankDetails[0].user
						};
						
						
		this.http.updateUserBank(postData)
		  .subscribe(
			(data) => {
			  this.updateResponseData = data;
			},
			(error) => {
				this.errorMsg = error;
			},
			() => {
				this.successMsg = "Bank Details Updated Successfully.";
				self.isNew = false;
				self.editable = false;
			}
		  );
	}
	
	addBankDetails = function(){
		var self = this;
		this.errorMsg = "";
		this.successMsg = "";
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
						  "accountNum": self.userBankModel.accountNum,
						  "accountType": self.userBankModel.accountType,
						  "bank": self.allbankdata[self.userBankModel.bank],
						  "branch": self.allBranchData[self.userBankModel.branch],
						  "id": null,
						  "ifscCode": self.allBranchData[self.userBankModel.branch].ifscCode,
						  "modifiedBy": self.sessionData.sessionUserName,
						  "modifiedOn": todayPrint,
						  "user": parseInt(self.sessionData.sessionId)
						};
						
						
		this.http.updateUserBank(postData)
		  .subscribe(
			(data) => {
			  this.updateResponseData = data;
			},
			(error) => {
				this.errorMsg = error;
			},
			() => {
				this.successMsg = "Bank Details Added Successfully.";
				self.isNew = false;
				self.editable = false;
			}
		  );
	}
	

}
	
	
	
	
	