import {Component} from "@angular/core";

import {ICellRendererAngularComp} from "ag-grid-angular";
import { HttpTestService } from '../../services/http.service';

@Component({
    selector: 'total-cell',
    template: `<button class="btn btn-success btn-block statusBlck" (click)="getStockDetails()">Select Stock Details</button>`
})
export class issuedtlselectcomponent implements ICellRendererAngularComp {
    public params: any;
	public result: any;
	public stckDtl : any;

	constructor(public http: HttpTestService) { }
	
    agInit(params: any): void {
        this.params = params;
		
    }
	
	
	getStockDetails = function(){
		var self = this;
		
		this.http.getSRStockDtl('0^'+(self.params.data.item.id).toString()+'^'+(self.params.data.issueQuantity).toString())
			.subscribe(
			(data) => {
				self.stckDtl = data;
			},
			(error) => self.errorMsg = error,
			() => console.log("completed")
		);
	}

    refresh(): boolean {
        return false;
    }
}