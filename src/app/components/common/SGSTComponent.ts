import {Component} from "@angular/core";

import {ICellRendererAngularComp} from "ag-grid-angular";

import { AppSettings } from '../../config/settings/app-settings';

@Component({
    selector: 'date-cell',
    template: `{{previewData}}`
})
export class SGSTComponent implements ICellRendererAngularComp {
    public params: any;
	public previewData : any = "";

    agInit(params: any): void {
        this.params = params;
		if(this.params.data.supplier.state == AppSettings.COMPANY_STATE){
			this.previewData = params.value/2
		}
    }

    refresh(): boolean {
        return false;
    }
}