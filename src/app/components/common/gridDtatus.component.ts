import {Component} from "@angular/core";

import {ICellRendererAngularComp} from "ag-grid-angular";

@Component({
    selector: 'date-cell',
    template: `<span class="btn btn-block statusBlck btn-info" *ngIf="params.value == '1'">OPEN</span>
										<span class="btn btn-block statusBlck btn-primary" *ngIf="params.value == '2'">IN-PROGRESS</span>
										<span class="btn btn-block statusBlck btn-success" *ngIf="params.value == '3'">APPROVED</span>
										<span class="btn btn-block statusBlck btn-danger" *ngIf="params.value == '4'">REJECTED</span>
										<span class="btn btn-block statusBlck btn-warning" *ngIf="params.value == '5'">CLOSED</span>
										<span class="btn btn-block statusBlck btn-danger" *ngIf="params.value == '6'">CANCELED</span>
										<span class="btn btn-block statusBlck btn-success" *ngIf="params.value == '7'">BOOKED</span>
										<span class="btn btn-block statusBlck btn-warning" *ngIf="params.value == '8'">RAISE PENDING</span>
										<span class="btn btn-block statusBlck btn-danger" *ngIf="params.value == '9'">RAISE REJECTED</span>
										<span class="btn btn-block statusBlck btn-warning" *ngIf="params.value == '10'">MODIFY PENDING</span>
										<span class="btn btn-block statusBlck btn-success" *ngIf="params.value == '11'">AVAILABLE</span>
										<span class="btn btn-block statusBlck btn-danger" *ngIf="params.value == '12'">LAPSED</span>
										<span class="btn btn-block statusBlck btn-warning" *ngIf="params.value == '13'">PENDING</span>
										<span class="btn btn-block statusBlck btn-primary" *ngIf="params.value == '14'">INVITED</span>
										<span class="btn btn-block statusBlck btn-info" *ngIf="params.value == '15'">READY</span>
										<span class="btn btn-block statusBlck btn-warning" *ngIf="params.value == '17'">APPROVED(LEVEL 1)</span>
										<span class="btn btn-block statusBlck btn-warning" *ngIf="params.value == '18'">APPROVED(LEVEL 2)</span>
										<span class="btn btn-block statusBlck btn-warning" *ngIf="params.value == '19'">APPROVED(LEVEL 3)</span>
										<span class="btn btn-block statusBlck btn-warning" *ngIf="params.value == '20'">APPROVED(LEVEL 4)</span>
										<span class="btn btn-block statusBlck btn-warning" *ngIf="params.value == '21'">SAVED</span>`
})
export class gridtatusComponent implements ICellRendererAngularComp {
    public params: any;

    agInit(params: any): void {
        this.params = params;
    }

    refresh(): boolean {
        return false;
    }
}