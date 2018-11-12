import {Component} from "@angular/core";

import {ICellRendererAngularComp} from "ag-grid-angular";

@Component({
    selector: 'receive-cell',
    template: `<label class="switch"> 
			    <input type="checkbox" data-action-type="receive" [checked] = "params.data.status != '4'">
				<span class="slider round"></span>
			  </label>`
})
export class gridReceiveRejectComponent implements ICellRendererAngularComp { 
    public params: any; 
	public result: any;

    agInit(params: any): void {
        this.params = params;
	}

    refresh(): boolean {
        return false;
    }
}