import {Component} from "@angular/core";

import {ICellRendererAngularComp} from "ag-grid-angular";
import {IMyDpOptions} from 'mydatepicker';

@Component({
    selector: 'date-cell',
    template: `<span data-action-type = "expdtpckr" style="display:block; min-height:22px;">{{params.value | date:'mediumDate'}}</span>`
})
export class griddateSRcomponent implements ICellRendererAngularComp {
    public params: any;

    agInit(params: any): void {
        this.params = params;
    }

    refresh(): boolean {
        return false;
    }
}