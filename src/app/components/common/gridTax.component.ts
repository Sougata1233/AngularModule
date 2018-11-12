import {Component} from "@angular/core";

import {ICellRendererAngularComp} from "ag-grid-angular";

@Component({
    selector: 'tax-cell',
    template: `{{taxresult}}`
})
export class gridTaxComponent implements ICellRendererAngularComp {
    public params: any;
	public taxresult: any;

    agInit(params: any): void {
        this.params = params;
		this.taxresult = ((this.params.value * this.params.data.rate)* this.params.data.item.itemTax.gst)/100;
		if( isNaN(this.taxresult)){this.taxresult = "";}else{this.taxresult = parseFloat(this.taxresult.toFixed(2))}
    }

    refresh(): boolean {
        return false;
    }
}