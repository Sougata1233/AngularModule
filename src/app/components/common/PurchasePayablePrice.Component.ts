import {Component} from "@angular/core";

import {ICellRendererAngularComp} from "ag-grid-angular";

@Component({
    selector: 'payable-cell',
    template: `{{result}}`
})
export class gridPOPyblPriceComponent implements ICellRendererAngularComp {
    public params: any;
	public result: any;

    agInit(params: any): void {
        this.params = params;
		this.result = (this.params.value * this.params.data.rate);
		this.result = this.result - (this.result * (this.params.data.discount/100));
		this.result = this.result + (this.result * this.params.data.item.itemTax.gst)/100;
		if( isNaN(this.result)){this.result = "";}else{this.result = parseFloat(this.result.toFixed(2))}
    }

    refresh(): boolean {
        return false;
    }
}