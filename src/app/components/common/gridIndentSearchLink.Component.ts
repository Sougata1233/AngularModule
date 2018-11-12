import {Component} from "@angular/core";

import {ICellRendererAngularComp} from "ag-grid-angular";
import { AppSettings } from '../../config/settings/app-settings';

@Component({
    selector: 'date-cell',
    template: `<a *ngIf="params.data.status != '21'" [routerLink]="['/store/list/', params.value]" title="View Details">{{prefix+"/Indent/"+ params.value}}</a>
	<a *ngIf="params.data.status == '21' && params.data.type != 'J'" [routerLink]="['/store/indentedit/', params.value]" title="View Details">{{prefix+"/Indent/"+ params.value}}</a>
	<a *ngIf="params.data.status == '21' && params.data.type == 'J'" [routerLink]="['/jute/mrindentedit/', params.value]" title="View Details">{{prefix+"/Indent/"+ params.value}}</a>`
})
export class gridIndentSearchLinkComponent implements ICellRendererAngularComp {
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