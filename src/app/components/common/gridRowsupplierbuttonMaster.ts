import {Component} from "@angular/core";

import {ICellRendererAngularComp} from "ag-grid-angular";

@Component({
    selector: 'date-cell',
    template: `<button  type="button"  [disabled] = "params.data.suppTyp == 'STORE' || params.data.suppTyp == 'OTHERS'" class="btn statusBlck btn-info" data-action-type = "addcondition">Edit</button>
     `
})
export class gridRowsupplierbuttonMasterComponent implements ICellRendererAngularComp {
    public params: any;
    

    agInit(params: any): void {
        this.params = params;
        
    }

    refresh(): boolean {
        return false;
    }
}


