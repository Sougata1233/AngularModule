import {Component} from "@angular/core";

import {ICellRendererAngularComp} from "ag-grid-angular";

@Component({
    selector: 'total-cell',
    template: `{{result | number : '1.0-2'}}`
})
export class gridDaviationSRComponent implements ICellRendererAngularComp {
    public params: any;
	public result: any;

    agInit(params: any): void {
        this.params = params;
		this.result = (this.params.data.advisedQuantity - this.params.data.actualQuantity);
		if( isNaN(this.result)){this.result = "";}
    }

    refresh(): boolean {
        return false;
    }
}