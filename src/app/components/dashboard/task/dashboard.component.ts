import { Component, OnInit, AfterViewInit } from '@angular/core';
import * as jQuery from 'jquery';

import { HttpTestService } from '../../../services/http.service';
import { sessionServices } from '../../../services/session.services';
import { Router} from '@angular/router';

@Component({
  selector: 'app-dashboard-view',
  templateUrl: './dashboard.component.html'
  })


export class DashboardComponent implements OnInit {
  
  public approvalData : any = [];
  public sessionData: any;
  public indentApprovalListAll : any =[];
  public poApprovalListAll : any =[];
  public mrApprovalLidstAll : any = [];
  public srApprovalLidstAll : any = [];
  public indentApprovalListAllfiltered : any = [];
  public poApprovalListAllfiltered : any = [];
  
  
  constructor(public http: HttpTestService, public session: sessionServices) { }
    
  ngOnInit() {
	this.getSession();
	this.getUserGroup();
   // this.loadApprovalData();
  }
  
  
  //get session details
	getSession = function(){
		this.sessionData = this.session.getSessionDetails();
	}
	
	
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
			() => this.loadApprovalData()
		  );
	}
  
  loadApprovalData = function(){
		var self = this;
		
		this.http.getApprovalData(this.sessionData.sessionId)
			.subscribe(
			(data) => {
				self.approvalData = data;
			},
			(error) => {
				self.approvalData = [], 
				self.errorMsg = "Service Error."
				},
			() => {
				for(var i = 0; i<self.approvalData.length; i++){
					if(self.approvalData[i].taskDesc == "Indent"){
						if(self.approvalData[i].user1.id == self.sessionData.sessionId){
							self.stat = "1";
						}else if(self.approvalData[i].user2.id == self.sessionData.sessionId){
							self.stat = "2";
						}
						self.loadApprovalRequest(self.stat);
					}else if(self.approvalData[i].taskDesc == "PO"){
						if(self.approvalData[i].user1.id == self.sessionData.sessionId){
							self.stat = "1";
						}else if(self.approvalData[i].user2.id == self.sessionData.sessionId){
							self.stat = "2";
						}
						self.loadApprovalRequestPo(self.stat);
					}else if(self.approvalData[i].taskDesc == "MR"){
						if(self.approvalData[i].user1.id == self.sessionData.sessionId){
							self.stat = "1";
						}else if(self.approvalData[i].user2.id == self.sessionData.sessionId){
							self.stat = "2";
						}
						self.fetchOpenMr(self.stat);
					}else if(self.approvalData[i].taskDesc == "SR"){
						if(self.approvalData[i].user1.id == self.sessionData.sessionId){
							self.stat = "1";
						}else if(self.approvalData[i].user2.id == self.sessionData.sessionId){
							self.stat = "2";
						}
						self.fetchOpenSr(self.stat);
					}
				}
			}
		);
	}
  
  
  
  loadApprovalRequest = function(stat) {
		var self = this;
		
		this.http.getIndenApprovalList(stat)
			.subscribe(
			(data) => {
				self.indentApprovalListAll = data;
			},
			(error) => {},
			() => {
				if(self.userGroupData[0].userGroup.userGroupName == 'Jute User'){
				for(var i =0; i < self.indentApprovalListAll.length; i++){
					if(self.indentApprovalListAll[i].type == 'J'){
						self.indentApprovalListAllfiltered.push(self.indentApprovalListAll[i]);
					}
				}
				}else{
					for(var i =0; i < self.indentApprovalListAll.length; i++){
					if(self.indentApprovalListAll[i].type != 'J'){
						self.indentApprovalListAllfiltered.push(self.indentApprovalListAll[i]);
					}
				}
				}
			}
		);
	}
	
	
	
	//load availabe indents
	loadApprovalRequestPo = function(stat) {
		var self = this;
		
		this.http.getPOApprovalList(stat)
			.subscribe(
			(data) => {
				self.poApprovalListAll = data;
			},
			(error) => {},
			() => {
				if(self.userGroupData[0].userGroup.userGroupName == 'Jute User'){
				for(var i =0; i < self.poApprovalListAll.length; i++){
					if(self.poApprovalListAll[i].type == 'J'){
						self.poApprovalListAllfiltered.push(self.poApprovalListAll[i]);
					}
				}
				}else{
					for(var i =0; i < self.poApprovalListAll.length; i++){
					if(self.poApprovalListAll[i].type != 'J'){
						self.poApprovalListAllfiltered.push(self.poApprovalListAll[i]);
					}
				}
				}
			}
		);
	}
	
	
	//etch all open mr-worklist
	fetchOpenMr = function(){
		var self = this;
		
		self.http.getMrbyStatus(1)
			.subscribe(
				(data) => {
					self.mrApprovalLidstAll = data;
				},
				(error) => {},
				() => {}
			);
	}
	
	
	//etch all open mr-worklist
	fetchOpenSr = function(){
		var self = this;
		
		self.http.getSrbyStatus('1')
			.subscribe(
				(data) => {
					this.srApprovalLidstAll = data;
				},
				(error) => {},
				() => {}
			);
	}
  
}
