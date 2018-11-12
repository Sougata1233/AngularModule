import {Component} from "@angular/core";

import {ICellRendererAngularComp} from "ag-grid-angular";
import { AppSettings } from '../../config/settings/app-settings';

@Component({
    selector: 'date-cell',
    template: `<a [routerLink]="['/purchase/supplier/', params.value]" title="View Details">{{prefix+"/Indent/" + params.value}}</a>`
})
export class gridPOSupLinkComponent implements ICellRendererAngularComp {
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