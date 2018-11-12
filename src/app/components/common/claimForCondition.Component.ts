import {Component} from "@angular/core";

import {ICellRendererAngularComp} from "ag-grid-angular";

@Component({
    selector: 'date-cell',
    template: `<span class="btn btn-sm statusBlck btn-info" data-action-type = "addcondition">Condition Reading</span> {{result}}`
})
export class claimforconditioncomponent implements ICellRendererAngularComp {
    public params: any;
	public result: any;

    agInit(params: any): void {
        this.params = params;
		this.result = parseFloat(this.params.value);
		if( isNaN(this.result)){this.result = "";}else{this.result = parseFloat(this.result.toFixed(2))}
    }

    refresh(): boolean {
        return false;
    }
}