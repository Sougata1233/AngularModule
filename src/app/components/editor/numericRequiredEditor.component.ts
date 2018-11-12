import {AfterViewInit, Component, ViewChild, ViewContainerRef} from "@angular/core";

import {ICellEditorAngularComp} from "ag-grid-angular";

@Component({
    selector: 'numeric-cell',
    template: `<input class="ag-cell-edit-input" #input (keydown)="onKeyDown($event)" [(ngModel)]="value" style="width: 100%" required pattern="^\s*(?=.*[0-9])\d*(?:\.\d{1,2})?\s*$">`
})
export class numericRequiredEditorComponent implements ICellEditorAngularComp, AfterViewInit {
    public params: any;
    public value: number;
    public cancelBeforeStart: boolean = false;

    @ViewChild('input', {read: ViewContainerRef}) public input; 


    agInit(params: any): void {
        this.params = params;
        this.value = this.params.value;

        // only start edit if key pressed is a number, not a letter
        this.cancelBeforeStart = params.charPress && ('1234567890.'.indexOf(params.charPress) < 0);
    }

    getValue(): any {
        return this.value;
    }

    isCancelBeforeStart(): boolean {
        return this.cancelBeforeStart;
    }

    // will reject the number if it greater than 1,000,000
    // not very practical, but demonstrates the method.
    isCancelAfterEnd(): boolean {
        return this.value > 1000000;
    };

    onKeyDown(event): void {
        if (!this.isKeyPressedNumeric(event)) {
            if (event.preventDefault) event.preventDefault();
        }
    }

    // dont use afterGuiAttached for post gui events - hook into ngAfterViewInit instead for this
    ngAfterViewInit() {
        setTimeout(() => {
            this.input.element.nativeElement.focus();
        })
    }

    public getCharCodeFromEvent(event): any {
        event = event || window.event;
        return (typeof event.which == "undefined") ? event.keyCode : event.which;
    }

    public isCharNumeric(charStr): boolean {
        return !!/\d/.test(charStr);
    }

    public isKeyPressedNumeric(event): boolean {
        const charCode = this.getCharCodeFromEvent(event);
        const charStr = event.key ? event.key : String.fromCharCode(charCode);
        return charStr;//isCharNumeric(charStr)
    }
}