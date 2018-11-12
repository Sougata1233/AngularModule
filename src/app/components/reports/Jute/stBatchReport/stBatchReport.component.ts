import { Component, OnInit, AfterViewInit } from '@angular/core';
import * as $ from 'jquery';


@Component({
  selector: 'app-worklist',
  templateUrl: './stBatchReport.component.html'
})
export class stBatchReportComponent implements OnInit {
	
	
	
	
	
	constructor() {}
		
	ngOnInit() {
		
		
	}
	
	print = function(){
		window.print();
	}
	
	
}
