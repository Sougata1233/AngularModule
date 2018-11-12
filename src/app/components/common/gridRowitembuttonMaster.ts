import {Component} from "@angular/core";

import {ICellRendererAngularComp} from "ag-grid-angular";

@Component({
    selector: 'date-cell',
    template: `<button  type="button" class="btn statusBlck btn-info" data-action-type = "addcondition">Edit</button>
   `
})
export class griditembuttonMasterComponent implements ICellRendererAngularComp {
    public params: any;

    agInit(params: any): void {
        this.params = params;
    }

    refresh(): boolean {
        return false;
    }
}


