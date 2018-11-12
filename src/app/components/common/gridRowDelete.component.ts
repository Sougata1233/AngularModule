import {Component} from "@angular/core";

import {ICellRendererAngularComp} from "ag-grid-angular";

@Component({
    selector: 'total-cell',
    template: `<button *ngIf="totRowCount > 1" class="btn ntn-danger grid-delete-button" data-action-type="remove"><span class="glyphicon glyphicon-minus"></span></button>`
})
export class gridDeleteComponent implements ICellRendererAngularComp {
    public params: any;
	public totRowCount : number;
	
    agInit(params: any): void {
        this.params = params;
		this.totRowCount = this.params.api.getModel().getRowCount();
	}
	
	refresh(): boolean {
        return false;
    }
}