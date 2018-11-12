import {Component} from "@angular/core";

import {ICellRendererAngularComp} from "ag-grid-angular";

@Component({
    selector: 'date-cell',
    template: `<a [routerLink]="['/store/debitCredit/', params.value]" title="View Details">{{params.value}}</a>`
})
export class gridDRCRLinkComponent implements ICellRendererAngularComp {
    public params: any;

    agInit(params: any): void {
        this.params = params;
    }

    refresh(): boolean {
        return false;
    }
}