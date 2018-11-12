import {Component} from "@angular/core";

import {ICellRendererAngularComp} from "ag-grid-angular";

@Component({
    selector: 'date-cell',
    template: `<span class="btn btn-sm statusBlck btn-info" data-action-type = "addcondition">Edit</span> {{displayVal.toString()}}
   `
})
export class brokerSuppliereditorComponent implements ICellRendererAngularComp {
    public params: any;
	public displayVal: any = [];

    agInit(params: any): void {
        this.params = params;
		for(var i=0; i<this.params.data.suppliers.length; i++){
			this.displayVal.push(this.params.data.suppliers[i].suppName);
		}
		
		
		
    }

    refresh(): boolean {
        return false;
    }
}