import {Component} from "@angular/core";

import {ICellRendererAngularComp} from "ag-grid-angular";

@Component({
    selector: 'total-cell',
    template: `{{result | number : '1.0-2'}}`
})
export class gridDaviationComponent implements ICellRendererAngularComp {
    public params: any;
	public result: any;

    agInit(params: any): void {
        this.params = params;
		var avrg = this.params.data.claimsCondition;
		var allowableMoisture = this.params.data.allowableMoisturePercentage;
		var normalDav = (this.params.data.advisedWeight - this.params.data.actualWeight);
		if(avrg > allowableMoisture){
			this.result = normalDav + (this.params.data.actualWeight * (avrg-allowableMoisture)/100);
		}else{
			this.result = normalDav;
		}
		if( isNaN(this.result)){this.result = "";}
    }

    refresh(): boolean {
        return false;
    }
}