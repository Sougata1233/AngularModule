import { Component, OnInit, AfterViewInit } from '@angular/core';
import * as jQuery from 'jquery';

import { HttpTestService } from '../../../services/http.service';
import { sessionServices } from '../../../services/session.services';
import { Router} from '@angular/router';

@Component({
  selector: 'app-dashboard-summery-view',
  templateUrl: './dashboardSummery.component.html'
  })


export class DashboardSummeryComponent implements OnInit {
  
  public allIndent : any = [];
  public allPo : any = [];
  public allOpenSrList : any = [];
  public allOpenMrList : any = [];
  public allSrIssue : any = [];
  public serviceLoaded : boolean = false;
  public thisYear : any = (new Date().getFullYear()).toString();
    public lineChartData:Array<any> = [
    {data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], label: 'Indent', fill: false},
	{data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], label: 'Jute Indent', fill: false},
    {data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], label: 'PO', fill: false},
	{data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], label: 'Jute PO', fill: false},
	{data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], label: 'Store Receive', fill: false},
    {data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], label: 'Material Receive', fill: false},
	{data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], label: 'Store Issue', fill: false},
	{data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], label: 'Material Issue', fill: false}
	
  ];
  
  public lineChartLabels:Array<any> = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  
  
  public lineChartColors:Array<any> = [
    { // grey
      borderColor: '#84B618',
      pointBackgroundColor: '#6e9601',
      pointBorderColor: '#fff',
      pointHoverBackgroundColor: '#baef26',
      pointHoverBorderColor: 'rgba(148,186,51,0.8)'
    },
    { // dark grey
      borderColor: '#08184A',
      pointBackgroundColor: '#10bc72',
      pointBorderColor: '#fff',
      pointHoverBackgroundColor: '#3fffac',
      pointHoverBorderColor: 'rgba(102,217,168,0.8)'
    },
    { // grey
      borderColor: '#4AA2C6',
      pointBackgroundColor: '#007191',
      pointBorderColor: '#fff',
      pointHoverBackgroundColor: '#3dd5ff',
      pointHoverBorderColor: 'rgba(0,171,220,0.8)'
    },
	{ // grey
       borderColor: 'rgba(67,76,93,1)',
      pointBackgroundColor: '#243d6d',
      pointBorderColor: '#fff',
      pointHoverBackgroundColor: '#6083c4',
      pointHoverBorderColor: 'rgba(67,76,93,0.8)'
    },
	{ // grey
      borderColor: 'rgba(255,161,0,1)',
      pointBackgroundColor: '#b76400',
      pointBorderColor: '#fff',
      pointHoverBackgroundColor: '#ffa53f',
      pointHoverBorderColor: 'rgba(255,161,0,0.8)'
    },
	{ // grey
      borderColor: 'rgba(221,29,0,1)',
      pointBackgroundColor: '#ad0800',
      pointBorderColor: '#fff',
      pointHoverBackgroundColor: '#ff3d3d',
      pointHoverBorderColor: 'rgba(221,29,0,0.8)'
    },
	{ // grey
      borderColor: 'rgba(136,0,178,1)',
      pointBackgroundColor: '#5b007a',
      pointBorderColor: '#fff',
      pointHoverBackgroundColor: '#ed0484',
      pointHoverBorderColor: 'rgba(136,0,178,0.8)'
    },
	{ // grey
      borderColor: 'rgba(3,183,0,1)',
      pointBackgroundColor: '#028700',
      pointBorderColor: '#fff',
      pointHoverBackgroundColor: '#82ff3f',
      pointHoverBorderColor: 'rgba(3,183,0,0.8)'
    }
  ];
  public lineChartLegend:boolean = true;
  public lineChartType:string = 'line';
 
  
    public barChartOptions:any = {
    scaleShowVerticalLines: false,
    responsive: true
  };
  public barChartLabels:string[] = ['Open', 'General', 'Overhauling', 'Meintenance', 'Production', 'Jute'];
  public barChartType:string = 'bar';
  public barChartLegend:boolean = true;
 
  public barChartData:any[] = [
    {data: [0, 0, 0, 0, 0, 0], label: 'Created', backgroundColor: 'rgb(132,182,24)'},
    {data: [0, 0, 0, 0, 0, 0], label: 'Approved', backgroundColor: 'rgb(8,24,74)'},
	{data: [0, 0, 0, 0, 0, 0], label: 'Invited',backgroundColor: 'rgb(74,162,198)'},
	{data: [0, 0, 0, 0, 0, 0], label: 'Ready', backgroundColor: 'rgb(67,76,93)'},
	{data: [0, 0, 0, 0, 0, 0], label: 'Rejected', backgroundColor: 'rgb(255,161,0)'}
];
  public barChartDataPO:any[] = [
    {data: [0, 0, 0, 0, 0, 0], label: 'Created', fillColor: 'rgb(132,182,24)'},
    {data: [0, 0, 0, 0, 0, 0], label: 'Approved', fillColor: 'rgb(8,24,74)'},
	{data: [0, 0, 0, 0, 0, 0], label: 'Rejected', fillColor: 'rgb(74,162,198)'}
];

  public doughnutChartLabels:string[] = ['Created', 'Approved', 'Rejected'];
  public doughnutChartDataSR:number[] = [0,0,0];
  public doughnutChartType:string = 'doughnut';
  public doughnutChartLabelsMR:string[] = ['Readed', 'Created', 'Approved', 'Rejected'];
  public doughnutChartDataMR:number[] = [0,0,0,0];
  
  
  constructor(public http: HttpTestService, public session: sessionServices) { }
    
  ngOnInit() {
	this.getSession();
	 this.loadAllIndent();
	 
  }
  
  
  //get session details
	getSession = function(){
		this.sessionData = this.session.getSessionDetails();
	}
	
	
	loadAllIndent = function(){
		var self = this;
		
		this.http.getAllIndent()
			.subscribe(
			(data) => {
				self.allIndent = data;
			},
			(error) => self.errorMsg = error,
			() => {
				for(var i=0; i<self.allIndent.length; i++){
					if(parseInt(self.allIndent[i].finnacialYear) == parseInt(self.thisYear)){
						if(self.allIndent[i].type != 'J'){
							var index:any = new Date(self.allIndent[i].createDate).getMonth();
							self.lineChartData[0].data[index] = self.lineChartData[0].data[index] + 1;
							if(self.allIndent[i].type == "O"){
								self.barChartData[0].data[0] = self.barChartData[0].data[0] + 1;
								if(self.allIndent[i].status == '3'){
									self.barChartData[1].data[0] = self.barChartData[1].data[0] + 1;
								}else if(self.allIndent[i].status == '4'){
									self.barChartData[4].data[0] = self.barChartData[4].data[0] + 1;
								}else if(self.allIndent[i].status == '14'){
									self.barChartData[2].data[0] = self.barChartData[2].data[0] + 1;
								}else if(self.allIndent[i].status == '15'){
									self.barChartData[3].data[0] = self.barChartData[3].data[0] + 1;
								}
							}else if(self.allIndent[i].type == "G"){
								self.barChartData[0].data[0] = self.barChartData[0].data[1] + 1;
								if(self.allIndent[i].status == '3'){
									self.barChartData[1].data[1] = self.barChartData[1].data[1] + 1;
								}else if(self.allIndent[i].status == '4'){
									self.barChartData[4].data[1] = self.barChartData[4].data[1] + 1;
								}else if(self.allIndent[i].status == '14'){
									self.barChartData[2].data[1] = self.barChartData[2].data[1] + 1;
								}else if(self.allIndent[i].status == '15'){
									self.barChartData[3].data[1] = self.barChartData[3].data[1] + 1;
								}
							}else if(self.allIndent[i].type == "H"){
								self.barChartData[0].data[2] = self.barChartData[0].data[2] + 1;
								if(self.allIndent[i].status == '3'){
									self.barChartData[1].data[2] = self.barChartData[1].data[2] + 1;
								}else if(self.allIndent[i].status == '4'){
									self.barChartData[4].data[2] = self.barChartData[4].data[2] + 1;
								}else if(self.allIndent[i].status == '14'){
									self.barChartData[2].data[2] = self.barChartData[2].data[2] + 1;
								}else if(self.allIndent[i].status == '15'){
									self.barChartData[3].data[2] = self.barChartData[3].data[2] + 1;
								}
							}else if(self.allIndent[i].type == "M"){
								self.barChartData[0].data[3] = self.barChartData[0].data[3] + 1;
								if(self.allIndent[i].status == '3'){
									self.barChartData[1].data[3] = self.barChartData[1].data[3] + 1;
								}else if(self.allIndent[i].status == '4'){
									self.barChartData[4].data[3] = self.barChartData[4].data[3] + 1;
								}else if(self.allIndent[i].status == '14'){
									self.barChartData[2].data[3] = self.barChartData[2].data[3] + 1;
								}else if(self.allIndent[i].status == '15'){
									self.barChartData[3].data[3] = self.barChartData[3].data[3] + 1;
								}
							}else if(self.allIndent[i].type == "P"){
								self.barChartData[0].data[4] = self.barChartData[0].data[4] + 1;
								if(self.allIndent[i].status == '3'){
									self.barChartData[1].data[4] = self.barChartData[1].data[4] + 1;
								}else if(self.allIndent[i].status == '4'){
									self.barChartData[4].data[4] = self.barChartData[4].data[4] + 1;
								}else if(self.allIndent[i].status == '14'){
									self.barChartData[2].data[4] = self.barChartData[2].data[4] + 1;
								}else if(self.allIndent[i].status == '15'){
									self.barChartData[3].data[4] = self.barChartData[3].data[4] + 1;
								}
							}
							
							
							
							
							
						}else if(self.allIndent[i].type == 'J'){
							var index:any = new Date(self.allIndent[i].createDate).getMonth();
							self.lineChartData[1].data[index] = self.lineChartData[1].data[index] + 1;
							
							self.barChartData[0].data[5] = self.barChartData[0].data[5] + 1;
							if(self.allIndent[i].status == '3'){
								self.barChartData[1].data[5] = self.barChartData[1].data[5] + 1;
							}else if(self.allIndent[i].status == '4'){
								self.barChartData[4].data[5] = self.barChartData[4].data[5] + 1;
							}else if(self.allIndent[i].status == '14'){
								self.barChartData[2].data[5] = self.barChartData[2].data[5] + 1;
							}else if(self.allIndent[i].status == '15'){
								self.barChartData[3].data[5] = self.barChartData[3].data[5] + 1;
							}
							
						}
					}
				}
				self.loadAllPO();
			}
			
		);
	}
	
	
	loadAllPO = function(){
		var self = this;
		
		this.http.getAllPO()
			.subscribe(
			(data) => {
				self.allPo = data;
			},
			(error) => self.errorMsg = error,
			() => {
				for(var i=0; i<self.allPo.length; i++){
					if(parseInt(self.allPo[i].finnacialYear) == parseInt(self.thisYear)){
						if(self.allPo[i].type != 'J'){
							var index:any = new Date(self.allPo[i].createDate).getMonth();
							self.lineChartData[2].data[index] = self.lineChartData[2].data[index] + 1;
							
							if(self.allPo[i].type == "O"){
								self.barChartDataPO[0].data[0] = self.barChartDataPO[0].data[0] + 1;
								if(self.allPo[i].status == '3'){
									self.barChartDataPO[1].data[0] = self.barChartDataPO[1].data[0] + 1;
								}else if(self.allPo[i].status == '4'){
									self.barChartDataPO[2].data[0] = self.barChartDataPO[2].data[0] + 1;
								}
							}else if(self.allPo[i].type == "G"){
								self.barChartDataPO[0].data[0] = self.barChartDataPO[0].data[1] + 1;
								if(self.allPo[i].status == '3'){
									self.barChartDataPO[1].data[1] = self.barChartDataPO[1].data[1] + 1;
								}else if(self.allPo[i].status == '4'){
									self.barChartDataPO[2].data[1] = self.barChartDataPO[2].data[1] + 1;
								}
							}else if(self.allPo[i].type == "H"){
								self.barChartDataPO[0].data[2] = self.barChartDataPO[0].data[2] + 1;
								if(self.allPo[i].status == '3'){
									self.barChartDataPO[1].data[2] = self.barChartDataPO[1].data[2] + 1;
								}else if(self.allPo[i].status == '4'){
									self.barChartDataPO[2].data[2] = self.barChartDataPO[2].data[2] + 1;
								}
							}else if(self.allPo[i].type == "M"){
								self.barChartDataPO[0].data[3] = self.barChartDataPO[0].data[3] + 1;
								if(self.allPo[i].status == '3'){
									self.barChartDataPO[1].data[3] = self.barChartDataPO[1].data[3] + 1;
								}else if(self.allPo[i].status == '4'){
									self.barChartDataPO[2].data[3] = self.barChartDataPO[2].data[3] + 1;
								}
							}else if(self.allPo[i].type == "P"){
								self.barChartDataPO[0].data[4] = self.barChartDataPO[0].data[4] + 1;
								if(self.allPo[i].status == '3'){
									self.barChartDataPO[1].data[4] = self.barChartDataPO[1].data[4] + 1;
								}else if(self.allPo[i].status == '4'){
									self.barChartDataPO[2].data[4] = self.barChartDataPO[2].data[4] + 1;
								}
							}
							
							
							
						}else if(self.allPo[i].type == 'J'){
							var index:any = new Date(self.allPo[i].createDate).getMonth();
							self.lineChartData[3].data[index] = self.lineChartData[3].data[index] + 1;
							
							self.barChartDataPO[0].data[5] = self.barChartDataPO[0].data[5] + 1;
							if(self.allPo[i].status == '3'){
								self.barChartDataPO[1].data[5] = self.barChartDataPO[1].data[5] + 1;
							}else if(self.allPo[i].status == '4'){
								self.barChartDataPO[2].data[5] = self.barChartDataPO[2].data[5] + 1;
							}
						}
					}
				}
				self.fetchOpenSr()
				
			}
		);
	}
	
	fetchOpenSr = function(){
		var self = this;
		
		self.http.getAllSr()
			.subscribe(
				(data) => {
					this.allOpenSrList = data;
				},
				(error) => {
					this.errorMsg = error
				},
				() => {
					for(var i=0; i<self.allOpenSrList.length; i++){
					if(new Date(self.allOpenSrList[i].storeGoodReceiveHeader.createDate).getFullYear() == self.thisYear){
						var index:any = new Date(self.allOpenSrList[i].storeGoodReceiveHeader.createDate).getMonth();
						self.lineChartData[4].data[index] = self.lineChartData[4].data[index] + 1;
						
						self.doughnutChartDataSR[0] = self.doughnutChartDataSR[0] + 1;
						if(self.allOpenSrList[i].storeGoodReceiveHeader.status == '3'){
							self.doughnutChartDataSR[1] = self.doughnutChartDataSR[1] + 1;
						}else if(self.allOpenSrList[i].storeGoodReceiveHeader.status == '4'){
							self.doughnutChartDataSR[2] = self.doughnutChartDataSR[2] + 1;
						}
					}
				}
					self.fetchOpenMr();
					
				}
			);
	}
	
	
	fetchOpenMr = function(){
		var self = this;
		
		self.http.getAllMr()
			.subscribe(
				(data) => {
					this.allOpenMrList = data;
				},
				(error) => {
					this.errorMsg = error
				},
				() => {
					for(var i=0; i<self.allOpenMrList.length; i++){
					if(new Date(self.allOpenMrList[i].materialGoodReceiveHeader.createDate).getFullYear() == self.thisYear){
						var index:any = new Date(self.allOpenMrList[i].materialGoodReceiveHeader.createDate).getMonth();
						self.lineChartData[5].data[index] = self.lineChartData[5].data[index] + 1;
						
						if(self.allOpenMrList[i].materialGoodReceiveHeader.status == '16'){
							self.doughnutChartDataMR[0] = self.doughnutChartDataMR[0] + 1;
						}else{
							self.doughnutChartDataMR[1] = self.doughnutChartDataMR[1] + 1;
						if(self.allOpenMrList[i].materialGoodReceiveHeader.status == '3'){
							self.doughnutChartDataMR[2] = self.doughnutChartDataMR[2] + 1;
						}else if(self.allOpenMrList[i].materialGoodReceiveHeader.status == '4'){
							self.doughnutChartDataMR[3] = self.doughnutChartDataMR[3] + 1;
						}
						}
					}
					}
					self.fetchSrIssue();
				}
			)
	}
	
	
	fetchSrIssue = function(){
		var self = this;
		
		self.http.getAllIssue()
			.subscribe(
				(data) => {
					this.allSrIssue = data;
				},
				(error) => {
					this.errorMsg = error
				},
				() => {
					for(var i=0; i<self.allSrIssue.length; i++){
					if(parseInt(self.allSrIssue[i].issueHeader.finnacialYear) == parseInt(self.thisYear)){
						if(self.allSrIssue[i].issueHeader.goodType == 'MR'){
							var index:any = new Date(self.allSrIssue[i].issueHeader.createDate).getMonth();
							self.lineChartData[7].data[index] = self.lineChartData[7].data[index] + 1;
						}else if(self.allSrIssue[i].issueHeader.goodType == 'SR'){
							var index:any = new Date(self.allSrIssue[i].issueHeader.createDate).getMonth();
							self.lineChartData[6].data[index] = self.lineChartData[6].data[index] + 1;
						}
					}
				}
					self.serviceLoaded = true;
				}
			);
	}
  
}
