import {Component} from "@angular/core";

import {ICellRendererAngularComp} from "ag-grid-angular";

@Component({
    selector: 'date-cell',
    template: `<span class="btn btn-block statusBlck btn-success" *ngIf="params.value == '1'">Active</span>
										<span class="btn btn-block statusBlck btn-danger" *ngIf="params.value == '0'">Inactive</span>`
})
export class gridUserStatus implements ICellRendererAngularComp {
    public params: any;

    agInit(params: any): void {
        this.params = params;
    }

    refresh(): boolean {
        return false;
    }
}