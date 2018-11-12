import {Component} from "@angular/core";

import {ICellRendererAngularComp} from "ag-grid-angular";

@Component({
    selector: 'date-cell',
    template: `<a [routerLink]="['/settings/user/', params.value]" title="View Details">{{params.value}}</a>`
})
export class gridUserDetailsLinkComponent implements ICellRendererAngularComp {
    public params: any;

    agInit(params: any): void {
        this.params = params;
    }

    refresh(): boolean {
        return false;
    }
}