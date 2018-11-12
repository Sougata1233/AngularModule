import { Component, OnInit, AfterViewInit } from '@angular/core';
import * as $ from 'jquery';


@Component({
  selector: 'app-worklist',
  templateUrl: './dailyJuteStockReport.component.html'
})
export class dailyJuteStockReportComponent implements OnInit {
	
	
	
	
	
	constructor() {}
		
	ngOnInit() {
		
		
	}
	
	print = function(){
		window.print();
	}
	
	
}
