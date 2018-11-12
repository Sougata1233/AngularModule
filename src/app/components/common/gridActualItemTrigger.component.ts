import {Component} from "@angular/core";

import {ICellRendererAngularComp} from "ag-grid-angular";

@Component({
    selector: 'date-cell',
    template: `<span class="actualitemtrigger" data-action-type="actualitemtrigger">{{params.data.item.legacyItemCode+"_"+params.value}}</span>`
})
export class gridActualItemTriggerComponent implements ICellRendererAngularComp {
    public params: any;

    agInit(params: any): void {
        this.params = params;
    }

    refresh(): boolean {
        return false;
    }
}