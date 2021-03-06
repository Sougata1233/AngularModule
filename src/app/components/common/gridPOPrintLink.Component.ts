import {Component} from "@angular/core";

import {ICellRendererAngularComp} from "ag-grid-angular";
import { AppSettings } from '../../config/settings/app-settings';

@Component({
    selector: 'date-cell',
    template: `<a [routerLink]="['/purchase/list/', params.value]" title="View Details">{{prefix+"/PO/"+params.value}}</a>`
})
export class gridPOPrintLinkComponent implements ICellRendererAngularComp {
    public params: any;
	public startingNumber:any;
	public prefix:string;
	

    agInit(params: any): void {
        this.params = params;
		this.prefix = AppSettings.PREFIX;
    }

    refresh(): boolean {
        return false;
    }
}