import {Component} from "@angular/core";

import {ICellRendererAngularComp} from "ag-grid-angular";

@Component({
    selector: 'date-cell',
    template: `<span>{{(params.data.poActualQuantity/totJuteQuantity)*100 | number : '1.0-2'}} %</span>`
})
export class gridConversionComponentPer implements ICellRendererAngularComp {
    public params: any;
	public totJuteQuantity: any;

    agInit(params: any): void {
        this.params = params;
		var totQan = 0;
		console.log(this.params);
	for(var i = 0; i < this.params.data.length; i++){
		totQan = totQan + this.params.data[i].poActualQuantity;
	}
	this.totJuteQuantity = totQan;
	
    }

    refresh(): boolean {
        return false;
    }
}