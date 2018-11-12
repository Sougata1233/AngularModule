import {Component} from "@angular/core";

import {ICellRendererAngularComp} from "ag-grid-angular";

@Component({
    selector: 'date-cell',
    template: `<span class="actualqualitytrigger" data-action-type="actualqualitytrigger">{{params.value}}</span>`
})
export class gridActualQuantityTriggerComponent implements ICellRendererAngularComp {
    public params: any;

    agInit(params: any): void {
        this.params = params;
    }

    refresh(): boolean {
        return false;
    }
}