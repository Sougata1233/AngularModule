import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule, Http, RequestOptions, XHRBackend } from '@angular/http';
import { HashLocationStrategy, LocationStrategy} from '@angular/common';
import { ChartsModule } from 'ng2-charts';
import { OwlDateTimeModule, OwlNativeDateTimeModule } from 'ng-pick-datetime';



import { AppComponent } from './app.component';
import { HttpTestService } from './services/http.service';
import { sessionServices } from './services/session.services';
import { CanActivateViaAuthGuard } from './guard/activateGuard';
import { BaseProxyService } from './proxy/base-proxy.service';
import { OwlModule } from 'ngx-owl-carousel';

import {gridDateComponent} from "./components/common/gridDateFormat.component";
import {gridIndentSearchLinkComponent} from "./components/common/gridIndentSearchLink.Component";
import {gridtatusComponent} from "./components/common/gridDtatus.component";
import {legacyCodeItemNameComponent} from "./components/common/legacy_item.component";
import {gridDeleteComponent} from "./components/common/gridRowDelete.component";
import {gridIndentLinkComponent} from "./components/common/gridIndentLink.Component";
import {gridPOPrintLinkComponent} from "./components/common/gridPOPrintLink.Component";
import {gridSRSearchLinkComponent} from "./components/common/gridSRSearchLink";
import {gridMRSearchLinkComponent} from "./components/common/gridMRSearchLink";
import {numericRequiredEditorComponent} from "./components/editor/numericRequiredEditor.component";
import {numericPercentageEditorComponent} from "./components/editor/numaricpercentageEditor.component";
import {gridDaviationComponent} from "./components/common/gridDaviation.component";
import {gridReceiveRejectComponent} from "./components/common/gridReceiveRejectComponent";
import {griddateSRcomponent} from "./components/common/gridDatepickerSR.component";
import {claimforconditioncomponent} from "./components/common/claimForCondition.Component";
import {gridSRLinkComponent} from "./components/common/gridSRLinkComponent";
import {gridMRLinkComponent} from "./components/common/gridMRLinkComponent";
import {gridDaviationSRComponent} from "./components/common/gridDaviationSR.component";
import {gridConversionComponentPer} from "./components/common/gridPerConvertion.Component";
import {gridConversionComponentBale} from "./components/common/gridBaleConvertion.Component";
import {gridSrIssueSearchLinkComponent} from "./components/common/srIssueSearchLink";
import {gridMrIssueSearchLinkComponent} from "./components/common/mrIssueSearchLink";
import {issuedtlselectcomponent} from "./components/common/gridIssueDtlSelect.component";
import {gridDRCRLinkComponent} from "./components/common/gridDRCRLink.component";
import {billpassLinkComponent} from "./components/common/billpassLink.component";
import {gridUserStatus} from "./components/common/gridUserStatus";
import {gridUserDetailsLinkComponent} from "./components/common/gridUserDetailsLink";
import {gridPOTotPriceComponent} from "./components/common/PurchaseTotalPrice.Component";
import {gridPOPyblPriceComponent} from "./components/common/PurchasePayablePrice.Component";
import {SGSTComponent} from "./components/common/SGSTComponent";
import {IGSTComponent} from "./components/common/IGSTComponent";
import {gridPOWorklistLinkComponent} from "./components/common/gridPOWorklistLink.Component";
import {gridPOAmmndLinkComponent} from "./components/common/gridPOAmmendLink.Component";
import {gridPOPriceLinkComponent} from "./components/common/gridPOPriceLink.Component";
import {gridTaxComponent} from "./components/common/gridTax.component";
import {gridSGSTComponent} from "./components/common/gridSGst.component";
import {gridPOSupLinkComponent} from "./components/common/gridPOSupLink.Component";
import {gridGSTComponent} from "./components/common/gridGst.component";
import {gridDeleteMasterComponent} from "./components/common/gridRowDeleteMaster.component";
import {griditembuttonMasterComponent} from "./components/common/gridRowitembuttonMaster";
import { suppliermukameditorComponent} from "./components/common/suppliermukameditor";
import { brokerSuppliereditorComponent} from "./components/common/brokerSupplierEditor";
import {gridRowsupplierbuttonMasterComponent} from "./components/common/gridRowsupplierbuttonMaster";
import {gridActualQuantityTriggerComponent} from "./components/common/gridActualQuantityTrigger.component";
import {gridActualItemTriggerComponent} from "./components/common/gridActualItemTrigger.component";
import {batchcellrenderer} from "./components/common/batchcellrenderer.component";
import {gridstoreeditLinkComponent} from "./components/common/storeEditLink";
import {gridfinishingsaleeditLinkComponent} from "./components/common/finishingsaleEditLink";
import {gridjuteeditLinkComponent} from "./components/common/juteEditLink";
import {gridUomItemTriggerComponent} from "./components/common/gridUomItemTrigger.component";
import {gridPOSupApprovalLinkComponent} from "./components/common/gridPOSupApprovalLink.Component";
import {userNameComponent} from "./components/common/userName.component";
import {gridUserGrpDtlLinkComponent} from "./components/common/gridUserGroupLink.component";
import {gridStoreEditTriggerComponent} from "./components/common/gridStoreEditTriggerComponent";
import {gridWaEdirehousetTriggerComponent} from "./components/common/gridWaEdirehousetTriggerComponent";

import {AgGridModule} from 'ag-grid-angular/main';
import { MyDatePickerModule } from 'mydatepicker';
import {SelectModule} from 'angular2-select';
import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import { PERFECT_SCROLLBAR_CONFIG } from 'ngx-perfect-scrollbar';
import { PerfectScrollbarConfigInterface } from 'ngx-perfect-scrollbar';

import { AppRoutingModule, routingComponents } from './config/routes/app.routes';


const DEFAULT_PERFECT_SCROLLBAR_CONFIG: PerfectScrollbarConfigInterface = {
  suppressScrollX: true
};



@NgModule({
  declarations: [
    AppComponent,
	routingComponents,
	gridDateComponent, 
	gridIndentSearchLinkComponent, 
	gridtatusComponent,
	legacyCodeItemNameComponent,
	gridDeleteComponent,
	gridIndentLinkComponent,
	gridPOPrintLinkComponent,
	gridSRSearchLinkComponent,
	gridMRSearchLinkComponent,
	numericRequiredEditorComponent,
	numericPercentageEditorComponent,
	gridDaviationComponent,
	gridReceiveRejectComponent,
	griddateSRcomponent,
	claimforconditioncomponent,
	gridSRLinkComponent,
	gridMRLinkComponent,
	gridDaviationSRComponent,
	gridConversionComponentPer,
	gridConversionComponentBale,
	gridSrIssueSearchLinkComponent,
	gridMrIssueSearchLinkComponent,
	issuedtlselectcomponent,
	gridDRCRLinkComponent,
	billpassLinkComponent,
	gridUserStatus,
	gridUserDetailsLinkComponent,
	gridPOTotPriceComponent,
	gridPOPyblPriceComponent,
	SGSTComponent,
	IGSTComponent,
	gridPOWorklistLinkComponent,
	gridPOAmmndLinkComponent,
	gridPOPriceLinkComponent,
	gridTaxComponent,
	gridSGSTComponent,
	gridPOSupLinkComponent,
	gridGSTComponent,
	gridDeleteMasterComponent,
	griditembuttonMasterComponent,
	suppliermukameditorComponent,
	brokerSuppliereditorComponent,
	gridRowsupplierbuttonMasterComponent,
	gridActualQuantityTriggerComponent,
	gridActualItemTriggerComponent,
	batchcellrenderer,
	gridstoreeditLinkComponent,
	gridfinishingsaleeditLinkComponent,
	gridjuteeditLinkComponent,
	gridUomItemTriggerComponent,
	gridPOSupApprovalLinkComponent,
	userNameComponent,
	gridUserGrpDtlLinkComponent,
	gridStoreEditTriggerComponent,
	gridWaEdirehousetTriggerComponent
	
   ],
  imports: [
    BrowserModule,
	BrowserAnimationsModule,
	FormsModule,
	HttpModule,
	AppRoutingModule,
	MyDatePickerModule,
	SelectModule,
	OwlModule,
	OwlDateTimeModule, 
	OwlNativeDateTimeModule,
	ChartsModule,
	PerfectScrollbarModule,
	AgGridModule.withComponents([
		gridDateComponent, 
		gridIndentSearchLinkComponent, 
		gridtatusComponent,
		legacyCodeItemNameComponent,
		gridDeleteComponent,
		gridIndentLinkComponent,
		gridPOPrintLinkComponent,
		gridSRSearchLinkComponent,
		gridMRSearchLinkComponent,
		numericRequiredEditorComponent,
		numericPercentageEditorComponent,
		gridDaviationComponent,
		gridReceiveRejectComponent,
		griddateSRcomponent,
		claimforconditioncomponent,
		gridSRLinkComponent,
		gridMRLinkComponent,
		gridDaviationSRComponent,
		gridConversionComponentPer,
		gridConversionComponentBale,
		gridSrIssueSearchLinkComponent,
		gridMrIssueSearchLinkComponent,
		issuedtlselectcomponent,
		gridDRCRLinkComponent,
		billpassLinkComponent,
		gridUserStatus,
		gridUserDetailsLinkComponent,
		gridPOTotPriceComponent,
		gridPOPyblPriceComponent,
		SGSTComponent,
		IGSTComponent,
		gridPOWorklistLinkComponent,
		gridPOAmmndLinkComponent,
		gridPOPriceLinkComponent,
		gridTaxComponent,
		gridSGSTComponent,
		gridPOSupLinkComponent,
		gridGSTComponent,
		gridDeleteMasterComponent,
		griditembuttonMasterComponent,
		suppliermukameditorComponent,
		brokerSuppliereditorComponent,
		gridRowsupplierbuttonMasterComponent,
		gridActualQuantityTriggerComponent,
		gridActualItemTriggerComponent,
		batchcellrenderer,
		gridstoreeditLinkComponent,
		gridfinishingsaleeditLinkComponent,
		gridjuteeditLinkComponent,
		gridUomItemTriggerComponent,
		gridPOSupApprovalLinkComponent,
		userNameComponent,
		gridUserGrpDtlLinkComponent,
		gridStoreEditTriggerComponent,
		gridWaEdirehousetTriggerComponent
	])
	
  ],
  providers: [BaseProxyService, HttpTestService, sessionServices, CanActivateViaAuthGuard, {provide: LocationStrategy, useClass:HashLocationStrategy}, {provide: PERFECT_SCROLLBAR_CONFIG, useValue: DEFAULT_PERFECT_SCROLLBAR_CONFIG}],
  bootstrap: [AppComponent]
})
export class AppModule { }
