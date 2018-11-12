
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CanActivateViaAuthGuard } from '../../guard/activateGuard';
import { mainNavComponent } from '../../components/main-nav-panel/main-nav-panel.component';
import { subNavComponent } from '../../components/sub-nav-panel/sub-nav-panel.component';
import { loginComponent } from '../../components/login/login.component';
import { DashboardComponent } from '../../components/dashboard/task/dashboard.component';
import { DashboardSummeryComponent } from '../../components/dashboard/summery/dashboardSummery.component';

//store imports
import { indentSearchComponent } from '../../components/store/indent_search/indentSearch.component';
import { sreditComponent } from '../../components/store/indent/sredit/sredit.component';
import { mreditComponent } from '../../components/store/indent/mredit/mredit.component';
import { indentSearchDtlComponent } from '../../components/store/indent_search_dtl/indentSearchDtl.component';
import { createMRIndentComponent } from '../../components/store/indent/mr/create-mr-indent.component';
import { createIndentComponent } from '../../components/store/indent/sr/create-indent.component';
import { indentApprovalListComponent } from '../../components/store/approval_list/indentApprovalList.component';
import { indentApprovalListJuteComponent } from '../../components/store/approval_list/indentApprovalListJute.component';
import { indentApprovalDetailsComponent } from '../../components/store/approval_details/indentApprovalDetails.component';
import { srListComponent } from '../../components/store/goodreceive/list/srList.component';
import { mrListComponent } from '../../components/store/goodreceive/list/mrList.component';
import { mrDtlsWorklistComponent } from '../../components/store/goodreceive/details/mrWorklistDtls.component';
import { agentMRDtlsComponent } from '../../components/store/goodreceive/agentmrdetails/agentMrDtls.component';
import { srDtlsWorklistComponent } from '../../components/store/goodreceive/details/srWorklistDtls.component';
import { srDtlslistComponent } from '../../components/store/goodreceive/listdetails/srlistDtls.component';
import { mrDtlslistComponent } from '../../components/store/goodreceive/listdetails/mrlistDtls.component';
import { mrWorklistComponent } from '../../components/store/goodreceive/worklist/mrWorkList.component';
import { srWorklistComponent } from '../../components/store/goodreceive/worklist/srWorkList.component';
import { grnMaterialReceiveComponent } from '../../components/store/goodreceive/grnMaterialReceive.component';
import { grnStoreReceiveComponent } from '../../components/store/goodreceive/grnStoreReceive.component';
import { mrReadingComponent } from '../../components/store/goodreceive/mrReading.component';
import { issueDetailsComponent } from '../../components/store/goodissue/details/issueDtls.component';
import { srissueListComponent } from '../../components/store/goodissue/list/srissueList.component';
import { mrissueListComponent } from '../../components/store/goodissue/list/mrissueList.component';
import { grnMrIssueComponent } from '../../components/store/goodissue/grnMaterialIssue.component';
import { grnSrIssueComponent } from '../../components/store/goodissue/grnStoreIssue.component';
import { debitCreditCreateComponent } from '../../components/store/debitcredit/create/debitCreditCreate.component';
import { debitCreditListDtlComponent } from '../../components/store/debitcredit/details/debitCreditListDtl.component';
import { debitCreditList } from '../../components/store/debitcredit/list/debitCreditList.component';
import { billPassList } from '../../components/store/billpass/list/billPassList.component';
import { billPassListDtlComponent } from '../../components/store/billpass/details/billPassListDtl.component';
import { billPassCreateComponent } from '../../components/store/billpass/create/billPassCreate.component';
import { agentmrListComponent } from '../../components/store/goodreceive/agentmrlist/agentmrlist.component';


//purchase import
import { purchaseCancelPrintComponent } from '../../components/purchase/po_cancel_Print/poCancel_PrintDetails.component';
import { purchaseOrderDetails } from '../../components/purchase/po_cancel_Print_details/poCancelDetails.component';
import { createPOComponent } from '../../components/purchase/create/sr/purchaseOrderCreate.component';
import { createMRPOComponent } from '../../components/purchase/create/mr/purchaseOrderCreate.component';
import { purchaseApprovalListJuteComponent } from '../../components/purchase/approval_list/poApprovalListJute.component';
import { purchaseApprovalListComponent } from '../../components/purchase/approval_list/poApprovalList.component';
import { purchaseApprovalDetailsComponent } from '../../components/purchase/approval_details/poApprovalDetails.component';
import { purchaseAmmendmentListComponent } from '../../components/purchase/po_ammendment_list/poAmmendmentList.component';
import { purchaseAmmendmentListJuteComponent } from '../../components/purchase/po_ammendment_list/poAmmendmentListJute.component';
import { purchaseAmmendmentDetailsComponent } from '../../components/purchase/po_ammendment_dtl/poAmmendmentDetails.component';
import { inviteVendorComponent } from '../../components/purchase/invite_list/inviteVendorComponent.component';
import { inviteVendorDetailsComponent } from '../../components/purchase/invite_details/inviteVendorDetailsComponent.component';
import { supplierWorklistComponent } from '../../components/purchase/supplier_worklist/supplierWorklist.component';
import { supplierWorkDetailsComponent } from '../../components/purchase/supplier_details/supplierWorklistDetails.component';
import { supplierApprovalWorklistComponent } from '../../components/purchase/supplier_approval_worklist/supplierApprovalWorklist.component';		
import { supplierApprovalDetailsComponent } from '../../components/purchase/supplier_approval_details/supplierApprovalDetails.component';



//hrms imports
import { userProfileSummeryComponent } from '../../components/hrms/profile/summery/user-profile-summery.component';
import { userProfilePersonalComponent } from '../../components/hrms/profile/personal/user-profile-personal.component';
import { userProfileBankComponent } from '../../components/hrms/profile/bank/user-profile-bank.component';
import { userProfileAcademicComponent } from '../../components/hrms/profile/academic/user-profile-academic.component';
import { userProfileProfessionalComponent } from '../../components/hrms/profile/professional/user-profile-professional.component';



//settings
import { ViewUserComponent } from '../../components/settings/user/search/view-user.component';
import { createUserComponent } from '../../components/settings/user/create/create-user.component';
import { disableEnableUserComponent } from '../../components/settings/user/disable_enable_user/disableEnableUser.component';
import { MapUserGroupComponent } from '../../components/settings/usergroupmapping/map-userGroup.component';
import { userGroupComponent } from '../../components/settings/usergroup/search/view-usergroup.component';
import { userGroupDtlComponent } from '../../components/settings/usergroup/details/userGrpDetails.component';
import { createUserGroupComponent } from '../../components/settings/usergroup/usergroupcreate/usergroupcreate.component';


//reports
import { godownwiseStockReportComponent } from '../../components/reports/Jute/godownwiseStockReport/godownwiseStockReport.component';
import { juteRateReportComponent } from '../../components/reports/Jute/juteRateReport/juteRateReport.component';
import { ReceiptRegisterComponent } from '../../components/reports/Jute/ReceiptRegister/ReceiptRegister.component';
import { qualityWiseStockComponent } from '../../components/reports/Jute/qualityWiseStock/qualityWiseStock.component';
import { groupwisestockComponent } from '../../components/reports/Jute/groupwisestock/groupwisestock.component';
import { summeryReceiptRegisterComponent } from '../../components/reports/Jute/summeryReceiptRegister/summeryReceiptRegister.component';
import { issueRegisterComponent } from '../../components/reports/Jute/issueRegister/issueRegister.component';
import { dailyJuteStockReportComponent } from '../../components/reports/Jute/dailyJuteStockReport/dailyJuteStockReport.component';
import { stBatchReportComponent } from '../../components/reports/Jute/stBatchReport/stBatchReport.component';
import { indentDetailsReportComponent } from '../../components/reports/store/indentDetailsReport/indentDetailsReport';
import { outstandingIndentReportComponent } from '../../components/reports/store/outstandingIndentReport/outstandingIndentReport';
import { indentcancelregisterComponent } from '../../components/reports/store/indentcancelregister/indentcancelregister';
import { rptin12Component } from '../../components/reports/store/rptin12/rptin12';
import { indentdetailsitemwiseReportComponent } from '../../components/reports/store/indentdetailitemwise/indentdetailitemwise';
import { outstandingIndentReportItemwiseComponent } from '../../components/reports/store/outstandingIndentReportItemwise/outstandingIndentReportItemwise';
import { indentWaitingforPOReportComponent } from '../../components/reports/store/indentwaitingforpo/indentWaitingforPOReport';
import { outstandingIndentReportDeptwiseComponent } from '../../components/reports/store/outstandingIndentReportDeptwise/outstandingIndentReportDeptwise';
import { outstandingIndentReportGrpwiseComponent } from '../../components/reports/store/outstandingIndentReportGroupwise/outstandingIndentReportGrpwise';

//master
import { countryListComponent } from '../../components/masterscreeen/country_list/countryList.component';
import { createCountryComponent } from '../../components/masterscreeen/create_country/createCountry.component';
import { stateListComponent } from '../../components/masterscreeen/state_list/stateList.component';
import {  createStateComponent } from '../../components/masterscreeen/create_state/createState.component';
import { CityListComponent } from '../../components/masterscreeen/city_list/CityList.component';
import { CreateCityComponent } from '../../components/masterscreeen/create_city/CreateCity.component';
import { organizationListComponent } from '../../components/masterscreeen/organization_list/organizationList.component';
import { createOrganizationComponent } from '../../components/masterscreeen/create_organization/createOrganization.component';
import { DepartmentListComponent } from '../../components/masterscreeen/department_list/DepartmentList.component';
import { createDepartmentComponent } from '../../components/masterscreeen/create_department/createDepartment.component';
import { employeeListComponent } from '../../components/masterscreeen/employee_list/employeeList.component';
import { createEmployeeComponent } from '../../components/masterscreeen/create_employee/createEmployee.component';
import { LocationListComponent } from '../../components/masterscreeen/location_list/LocationList.component';
import { createLocationComponent } from '../../components/masterscreeen/create_location/createLocation.component';
import { HolidayListComponent } from '../../components/masterscreeen/holiday_list/HolidayList.component';
import { createHolidayComponent } from '../../components/masterscreeen/create_holiday/createHoliday.component';
import { leaveListComponent } from '../../components/masterscreeen/leave_list/leaveList.component';
import { createLeaveComponent } from '../../components/masterscreeen/create_leave/createLeave.component';
import { weekendListComponent } from '../../components/masterscreeen/weekend_list/weekendList.component';
import { createWeekendComponent } from '../../components/masterscreeen/create_weekend/createWeekend.component';
import { usergroupListComponent } from '../../components/masterscreeen/usergroup_list/usergroupList.component';
import { createUsergroupmasterComponent } from '../../components/masterscreeen/create_usergroup/createUsergroup.component';
import { codeListComponent } from '../../components/masterscreeen/code_list/codeList.component';
import { createCodeComponent } from '../../components/masterscreeen/create_code/createCode.component';
import { projectListComponent } from '../../components/masterscreeen/project_list/projectList.component';
import { createProjectComponent } from '../../components/masterscreeen/create_project/createProject.component';
import { machineListComponent } from '../../components/masterscreeen/machine_list/machineList.component';
import { createMachineComponent } from '../../components/masterscreeen/create_machine/createMachine.component';
import {  uomListComponent } from '../../components/masterscreeen/uom_list/uomList.component';
import { createUomComponent } from '../../components/masterscreeen/create_uom/createUom.component';
import { frameListComponent } from '../../components/masterscreeen/frame_list/frameList.component';
import { createFrameComponent } from '../../components/masterscreeen/create_frame/createFrame.component';
import {  jutequalitypriceListComponent } from '../../components/masterscreeen/jutequalityprice_list/jutequalitypriceList.component';
import { createJutequalitypriceComponent } from '../../components/masterscreeen/create_jutequalityprice/createJutequalityprice.component';
import {  menuListComponent } from '../../components/masterscreeen/menu_list/menuList.component';
import { createMenuComponent } from '../../components/masterscreeen/create_menu/createMenu.component';
import {  submenuListComponent } from '../../components/masterscreeen/submenu_list/submenuList.component';
import { createSubmenuComponent } from '../../components/masterscreeen/create_submenu/createSubmenu.component';
import { mukamListComponent } from '../../components/masterscreeen/mukam_list/mukamList.component';
import { createMukamComponent } from '../../components/masterscreeen/create_mukam/createMukam.component';
import {  supplierListComponent } from '../../components/masterscreeen/supplier_list/supplierList.component';
import {  broakerListComponent } from '../../components/masterscreeen/broker_list/broakerList.component';
import { createSupplierComponent } from '../../components/masterscreeen/create_supplier/createSupplier.component';
import { createBrokerComponent } from '../../components/masterscreeen/create_broker/createBroker.component';
import {  statusListComponent } from '../../components/masterscreeen/status_list/statusList.component';
import { createStatusComponent } from '../../components/masterscreeen/create_status/createStatus.component';
import {  shiftListComponent } from '../../components/masterscreeen/shift_list/shiftList.component';
import { createShiftComponent } from '../../components/masterscreeen/create_shift/createShift.component';
import { selectionqualityListComponent } from '../../components/masterscreeen/selectionquality_list/selectionqualityList.component';
import { createSelectionqualityComponent } from '../../components/masterscreeen/create_selectionquality/createSelectionquality.component';
import { scmindenttypeListComponent } from '../../components/masterscreeen/scmindenttype_list/scmindenttypeList.component';
import { createScmindenttypeComponent } from '../../components/masterscreeen/create_scmindenttype/createScmindenttype.component';
import { roledetailsListComponent } from '../../components/masterscreeen/roledetails_list/roledetailsList.component';
import { createRoledetailsComponent } from '../../components/masterscreeen/create_roledetails/createRoledetails.component';
import {  activtyListComponent } from '../../components/masterscreeen/activty_list/activtyList.component';
import { createActivityComponent } from '../../components/masterscreeen/create_activity/createActivity.component';
import { itemgroupListComponent } from '../../components/masterscreeen/itemgroup_list/itemgroupList.component';
import { createItemgroupComponent  } from '../../components/masterscreeen/create_itemgroup/createItemgroup.component';
import { itemListComponent } from '../../components/masterscreeen/item_list/itemList.component';
import { createItemComponent } from '../../components/masterscreeen/create_item/createItem.component';
import { tasktypeListComponent } from '../../components/masterscreeen/tasktype_list/tasktypeList.component';
import { createTasktypeComponent } from '../../components/masterscreeen/create_tasktype/createTasktype.component';
import { BankListComponent } from '../../components/masterscreeen/bank_list/BankList.component';
import { CreateBankComponent } from '../../components/masterscreeen/create_bank/CreateBank.component';
import { BranchListComponent } from '../../components/masterscreeen/branch_list/BranchList.component';
import { CreateBranchComponent } from '../../components/masterscreeen/create_branch/CreateBranch.component';
import { createApproverComponent } from '../../components/masterscreeen/create_approver/createApprover.component';
import { priceListComponent } from '../../components/masterscreeen/price_list/priceList.component';
import { createPriceComponent } from '../../components/masterscreeen/create_price/createPrice.component';

//security
import { storeEntryRegisterComponent } from '../../components/security/store_entry_register_list/storeEntryRegister.component';
import { storeEntryRegisterCreateComponent } from '../../components/security/store_entry_register_create/storeEntryRegisterCreate.component';
import { storeEntryRegisterEditComponent } from '../../components/security/store_entry_register_edit/storeEntryRegisterEdit.component';
import { juteEntryRegisterComponent } from '../../components/security/jute_entry_register_list/juteEntryRegister.component';
import { juteEntryRegisterCreateComponent } from '../../components/security/jute_entry_register_create/juteEntryRegisterCreate.component';
import { juteEntryRegisterEditComponent } from '../../components/security/jute_entry_register_edit/juteEntryRegisterEdit.component';

import { visitorRegisterComponent } from '../../components/security/visitor_register/visitorRegister.component';
import { storeRegisterComponent } from '../../components/security/store_register/storeRegister.component';
import { storeRegisterSearchComponent } from '../../components/security/store_register/storeRegisterSearch.component';
import { storeRegisterEditComponent } from '../../components/security/store_register/storeRegisterEdit.component';

import { finishingsaleRegisterComponent } from '../../components/security/finishingsale_register/finishingsaleRegister.component';
import { finishingsaleRegisterEditComponent } from '../../components/security/finishingsale_register/finishingsaleRegisterEdit.component';
import { finishingsaleRegisterSearchComponent } from '../../components/security/finishingsale_register/finishingsaleRegisterSearch.component';

import { juteRegisterComponent } from '../../components/security/jute_register/juteRegister.component';
import { juteRegisterEditComponent } from '../../components/security/jute_register/juteRegisterEdit.component';
import { juteRegisterSearchComponent } from '../../components/security/jute_register/juteRegisterSearch.component';



const router: Routes = [
	{ path: '', component: loginComponent },
	{ path: 'login', component: loginComponent},
	{ path: 'home/task', component: DashboardComponent, canActivate: [CanActivateViaAuthGuard] },
	{ path: 'home/dashboard', component: DashboardSummeryComponent, canActivate: [CanActivateViaAuthGuard] },
	
	//store
	{ path: 'store', component: indentSearchComponent,  canActivate: [CanActivateViaAuthGuard] },
	{ path: 'jute', component: indentSearchComponent,  canActivate: [CanActivateViaAuthGuard] },
	{ path: 'store/list/:id', component: indentSearchDtlComponent, canActivate: [CanActivateViaAuthGuard] },
	{ path: 'store/indentedit/:id', component: sreditComponent, canActivate: [CanActivateViaAuthGuard] },
	{ path: 'jute/mrindentedit/:id', component: mreditComponent, canActivate: [CanActivateViaAuthGuard] },
	{ path: 'jute/mrindent', component: createMRIndentComponent, canActivate: [CanActivateViaAuthGuard]},
	{ path: 'store/srindent', component: createIndentComponent, canActivate: [CanActivateViaAuthGuard]},
	{ path: 'store/worklist', component: indentApprovalListComponent, canActivate: [CanActivateViaAuthGuard] },
	{ path: 'jute/juteworklist', component: indentApprovalListJuteComponent, canActivate: [CanActivateViaAuthGuard] },
	{ path: 'store/worklist/:id', component: indentApprovalDetailsComponent, canActivate: [CanActivateViaAuthGuard] },
	{ path: 'store/storereceive', component: srListComponent, canActivate: [CanActivateViaAuthGuard]},
	{ path: 'jute/materialreceive', component: mrListComponent, canActivate: [CanActivateViaAuthGuard]},
	{ path: 'store/srworklist/:id', component: srDtlsWorklistComponent, canActivate: [CanActivateViaAuthGuard] },
	{ path: 'store/storereceive/:id', component: srDtlslistComponent, canActivate: [CanActivateViaAuthGuard]},
	{ path: 'jute/materialreceive/:id', component: mrDtlslistComponent, canActivate: [CanActivateViaAuthGuard]},
	{ path: 'jute/mrworklist', component: mrWorklistComponent, canActivate: [CanActivateViaAuthGuard] },
	{ path: 'store/srworklist', component: srWorklistComponent, canActivate: [CanActivateViaAuthGuard] },
	{ path: 'jute/materialreceivecreate', component: grnMaterialReceiveComponent, canActivate: [CanActivateViaAuthGuard]},
	{ path: 'store/storereceivecreate', component: grnStoreReceiveComponent, canActivate: [CanActivateViaAuthGuard]},
	{ path: 'jute/materialreading', component: mrReadingComponent, canActivate: [CanActivateViaAuthGuard] },
	{ path: 'jute/mrworklist/:id', component: mrDtlsWorklistComponent, canActivate: [CanActivateViaAuthGuard] },
	{ path: 'store/srgoodissue/:id', component: issueDetailsComponent, canActivate: [CanActivateViaAuthGuard] },
	{ path: 'jute/mrgoodissue/:id', component: issueDetailsComponent, canActivate: [CanActivateViaAuthGuard] },
	{ path: 'store/srgoodissue', component: srissueListComponent, canActivate: [CanActivateViaAuthGuard] },
	{ path: 'jute/mrgoodissue', component: mrissueListComponent, canActivate: [CanActivateViaAuthGuard] },
	{ path: 'jute/mrissuecreate', component: grnMrIssueComponent, canActivate: [CanActivateViaAuthGuard] },
	{ path: 'store/srissuecreate', component: grnSrIssueComponent, canActivate: [CanActivateViaAuthGuard] },
	{ path: 'store/debitcreditCreate', component: debitCreditCreateComponent, canActivate: [CanActivateViaAuthGuard] },
	{ path: 'store/debitCredit/:id', component: debitCreditListDtlComponent, canActivate: [CanActivateViaAuthGuard] },
	{ path: 'store/debitCredit', component: debitCreditList, canActivate: [CanActivateViaAuthGuard] },
	{ path: 'store/billpass', component: billPassList, canActivate: [CanActivateViaAuthGuard]},
	{ path: 'store/billpass/:id', component: billPassListDtlComponent, canActivate: [CanActivateViaAuthGuard] },
	{ path: 'store/billpassCreate', component: billPassCreateComponent, canActivate: [CanActivateViaAuthGuard] },
	{ path: 'jute/agentmrlist', component: agentmrListComponent, canActivate: [CanActivateViaAuthGuard] },
	{ path: 'jute/agentmrlist/:id', component: agentMRDtlsComponent, canActivate: [CanActivateViaAuthGuard] },
	
	//purchase
	{ path: 'purchase', component: purchaseCancelPrintComponent, canActivate: [CanActivateViaAuthGuard] },
	{ path: 'jute/purchase', component: purchaseCancelPrintComponent, canActivate: [CanActivateViaAuthGuard] },
	{ path: 'purchase/list/:id', component: purchaseOrderDetails, canActivate: [CanActivateViaAuthGuard] },
	{ path: 'purchase/srpocreate', component: createPOComponent, canActivate: [CanActivateViaAuthGuard] },
	{ path: 'jute/mrpocreate', component: createMRPOComponent, canActivate: [CanActivateViaAuthGuard] },
	{ path: 'jute/jutePOworklist', component: purchaseApprovalListJuteComponent, canActivate: [CanActivateViaAuthGuard] },
	{ path: 'purchase/worklist', component: purchaseApprovalListComponent, canActivate: [CanActivateViaAuthGuard] },
	{ path: 'purchase/worklist/:id', component: purchaseApprovalDetailsComponent, canActivate: [CanActivateViaAuthGuard] },
	{ path: 'purchase/amendment', component: purchaseAmmendmentListComponent, canActivate: [CanActivateViaAuthGuard] },
	{ path: 'jute/juteamendment', component: purchaseAmmendmentListJuteComponent, canActivate: [CanActivateViaAuthGuard] },
	{ path: 'purchase/amendment/:id', component: purchaseAmmendmentDetailsComponent, canActivate: [CanActivateViaAuthGuard] },
	{ path: 'purchase/requestprice', component: inviteVendorComponent, canActivate: [CanActivateViaAuthGuard] },
	{ path: 'purchase/requestprice/:id', component: inviteVendorDetailsComponent, canActivate: [CanActivateViaAuthGuard] },
	{ path: 'purchase/supplier', component: supplierWorklistComponent, canActivate: [CanActivateViaAuthGuard] },
	{ path: 'purchase/supplier/:id', component: supplierWorkDetailsComponent, canActivate: [CanActivateViaAuthGuard] },
	{ path: 'purchase/supplierapprovallist', component: supplierApprovalWorklistComponent, canActivate: [CanActivateViaAuthGuard] },		
	{ path: 'purchase/supplierapprovallist/:id', component: supplierApprovalDetailsComponent, canActivate: [CanActivateViaAuthGuard] },
	
	
	//hrms
	{ path: 'hrms', component: userProfileSummeryComponent, canActivate: [CanActivateViaAuthGuard] },
	{ path: 'hrms/profile', component: userProfileSummeryComponent, canActivate: [CanActivateViaAuthGuard] },
	{ path: 'hrms/profile/personal', component: userProfilePersonalComponent, canActivate: [CanActivateViaAuthGuard] },
	{ path: 'hrms/profile/bank', component: userProfileBankComponent, canActivate: [CanActivateViaAuthGuard] },
	{ path: 'hrms/profile/academic', component: userProfileAcademicComponent, canActivate: [CanActivateViaAuthGuard] },
	{ path: 'hrms/profile/professional', component: userProfileProfessionalComponent, canActivate: [CanActivateViaAuthGuard] },
	
	//settings
	{ path: 'settings/user/create', component: createUserComponent, canActivate: [CanActivateViaAuthGuard] },
	{ path: 'settings/user/:id', component : disableEnableUserComponent, canActivate: [CanActivateViaAuthGuard]},
	{ path: 'settings/user', component: ViewUserComponent, canActivate: [CanActivateViaAuthGuard] },
	{ path: 'settings/usergroupmapping', component: MapUserGroupComponent, canActivate: [CanActivateViaAuthGuard] },
	{ path: 'settings/usergroup', component: userGroupComponent, canActivate: [CanActivateViaAuthGuard] },
	{ path: 'settings/usergroup/:id', component: userGroupDtlComponent, canActivate: [CanActivateViaAuthGuard] },
	{ path: 'settings/usergroupcreate', component: createUserGroupComponent, canActivate: [CanActivateViaAuthGuard] },
	
	
	
	//reports
	{ path: 'reports', component: godownwiseStockReportComponent, canActivate: [CanActivateViaAuthGuard] },
	{ path: 'reports/jute', component: godownwiseStockReportComponent, canActivate: [CanActivateViaAuthGuard] },
	{ path: 'reports/jute/godownwiseStockReport', component: godownwiseStockReportComponent, canActivate: [CanActivateViaAuthGuard] },
	{ path: 'reports/jute/juteratereport', component: juteRateReportComponent, canActivate: [CanActivateViaAuthGuard] },
	{ path: 'reports/jute/receiptregister', component: ReceiptRegisterComponent, canActivate: [CanActivateViaAuthGuard] },
	{ path: 'reports/jute/qualitywisestockregister', component: qualityWiseStockComponent, canActivate: [CanActivateViaAuthGuard] },
	{ path: 'reports/jute/groupwisestockregister', component: groupwisestockComponent, canActivate: [CanActivateViaAuthGuard] },
	{ path: 'reports/jute/summeryreceiptregister', component: summeryReceiptRegisterComponent, canActivate: [CanActivateViaAuthGuard] },
	{ path: 'reports/jute/issueregister', component: issueRegisterComponent, canActivate: [CanActivateViaAuthGuard] },
	{ path: 'jute/dailyjutestockreport', component: dailyJuteStockReportComponent, canActivate: [CanActivateViaAuthGuard] },
	{ path: 'jute/stbacthreport', component: stBatchReportComponent, canActivate: [CanActivateViaAuthGuard] },
	{ path: 'reports/store', component: indentDetailsReportComponent, canActivate: [CanActivateViaAuthGuard] },
	{ path: 'reports/store/indentdetails', component: indentDetailsReportComponent, canActivate: [CanActivateViaAuthGuard] },
	{ path: 'reports/store/outstandingindent', component: outstandingIndentReportComponent, canActivate: [CanActivateViaAuthGuard] },
	{ path: 'reports/store/indentcancelregister', component: indentcancelregisterComponent, canActivate: [CanActivateViaAuthGuard] },
	{ path: 'reports/store/rptin', component: rptin12Component, canActivate: [CanActivateViaAuthGuard] },
	{ path: 'reports/store/indentdetailitemwise', component: indentdetailsitemwiseReportComponent, canActivate: [CanActivateViaAuthGuard] },
	{ path: 'reports/store/outstandingindentitemwise', component: outstandingIndentReportItemwiseComponent, canActivate: [CanActivateViaAuthGuard] },
	{ path: 'reports/store/indentWaitingforPO', component: indentWaitingforPOReportComponent, canActivate: [CanActivateViaAuthGuard] },
	{ path: 'reports/store/outstandingindentdeptwise', component: outstandingIndentReportDeptwiseComponent, canActivate: [CanActivateViaAuthGuard] },
	{ path: 'reports/store/outstandingindentgrpwise', component: outstandingIndentReportGrpwiseComponent, canActivate: [CanActivateViaAuthGuard] },
	
	//master
	{ path: 'masterscreen', component: organizationListComponent, canActivate: [CanActivateViaAuthGuard]  },
	{ path: 'masterscreen/countrylist', component:  countryListComponent, canActivate: [CanActivateViaAuthGuard]  },
	{ path: 'masterscreen/createcountry', component: createCountryComponent, canActivate: [CanActivateViaAuthGuard] },
	{ path: 'masterscreen/statelist', component:  stateListComponent, canActivate: [CanActivateViaAuthGuard] },
	{ path: 'masterscreen/createstate', component:  createStateComponent, canActivate: [CanActivateViaAuthGuard]},
	{ path: 'masterscreen/CityList', component: CityListComponent, canActivate: [CanActivateViaAuthGuard] },
	{ path: 'masterscreen/CreateCity', component:CreateCityComponent, canActivate: [CanActivateViaAuthGuard]},
	{ path: 'masterscreen/OrganizationList', component:  organizationListComponent,canActivate: [CanActivateViaAuthGuard]  },
	{ path: 'masterscreen/createorganization', component: createOrganizationComponent,canActivate: [CanActivateViaAuthGuard] },
	{ path: 'masterscreen/departmentlist', component: DepartmentListComponent,canActivate: [CanActivateViaAuthGuard]   },
	{ path: 'masterscreen/createdepartment', component: createDepartmentComponent,canActivate: [CanActivateViaAuthGuard]  },
	{ path: 'masterscreen/employeeList', component: employeeListComponent,canActivate: [CanActivateViaAuthGuard]   },
	{ path: 'masterscreen/createemployee', component: createEmployeeComponent,canActivate: [CanActivateViaAuthGuard]  },
	{ path: 'masterscreen/locationlist', component:  LocationListComponent,canActivate: [CanActivateViaAuthGuard]   },
	{ path: 'masterscreen/createlocation', component: createLocationComponent,canActivate: [CanActivateViaAuthGuard]  },
	{ path: 'masterscreen/holidaylist', component: HolidayListComponent,canActivate: [CanActivateViaAuthGuard]   },
	{ path: 'masterscreen/createholiday', component:createHolidayComponent,canActivate: [CanActivateViaAuthGuard]  },
	{ path: 'masterscreen/leavelist', component: leaveListComponent,canActivate: [CanActivateViaAuthGuard]   },
	{ path: 'masterscreen/createleave', component: createLeaveComponent,canActivate: [CanActivateViaAuthGuard]   },
	{ path: 'masterscreen/weekendlist', component: weekendListComponent,canActivate: [CanActivateViaAuthGuard]  },
	{ path: 'masterscreen/createweekend', component: createWeekendComponent,canActivate: [CanActivateViaAuthGuard]   },
	{ path: 'masterscreen/usergrouplist', component: usergroupListComponent,canActivate: [CanActivateViaAuthGuard]  },
	{ path: 'masterscreen/createUsergroup', component: createUsergroupmasterComponent,canActivate: [CanActivateViaAuthGuard]  },
	{ path: 'masterscreen/codelist', component: codeListComponent,canActivate: [CanActivateViaAuthGuard]  },
	{ path: 'masterscreen/createcode', component: createCodeComponent,canActivate: [CanActivateViaAuthGuard]  },
	{ path: 'masterscreen/projectlist', component: projectListComponent,canActivate: [CanActivateViaAuthGuard]  },
	{ path: 'masterscreen/createproject', component: createProjectComponent,canActivate: [CanActivateViaAuthGuard]  },
	{ path: 'masterscreen/machinelist', component: machineListComponent,canActivate: [CanActivateViaAuthGuard]   },
	{ path: 'masterscreen/createmachine', component: createMachineComponent,canActivate: [CanActivateViaAuthGuard]  },
	{ path: 'masterscreen/uomlist', component: uomListComponent,canActivate: [CanActivateViaAuthGuard]   },
	{ path: 'masterscreen/createuom', component: createUomComponent,canActivate: [CanActivateViaAuthGuard]  },
	{ path: 'masterscreen/framelist', component: frameListComponent,canActivate: [CanActivateViaAuthGuard]   },
	{ path: 'masterscreen/createframe', component: createFrameComponent,canActivate: [CanActivateViaAuthGuard]   },
	{ path: 'masterscreen/jutequalitypricelist', component: jutequalitypriceListComponent,canActivate: [CanActivateViaAuthGuard]  },
	{ path: 'masterscreen/createjutequalityprice', component: createJutequalitypriceComponent,canActivate: [CanActivateViaAuthGuard]  },
	{ path: 'masterscreen/menulist', component: menuListComponent,canActivate: [CanActivateViaAuthGuard]  },
	{ path: 'masterscreen/createmenu', component: createMenuComponent,canActivate: [CanActivateViaAuthGuard]  },
	{ path: 'masterscreen/submenulist', component: submenuListComponent,canActivate: [CanActivateViaAuthGuard]  },
	{ path: 'masterscreen/createsubmenu', component: createSubmenuComponent,canActivate: [CanActivateViaAuthGuard]  },
	{ path: 'masterscreen/mukamList', component: mukamListComponent,canActivate: [CanActivateViaAuthGuard]   },
	{ path: 'masterscreen/createMukam', component: createMukamComponent,canActivate: [CanActivateViaAuthGuard]  },
	{ path: 'masterscreen/roledetailslist', component: roledetailsListComponent,canActivate: [CanActivateViaAuthGuard]  },
	{ path: 'masterscreen/createroledetails', component: createRoledetailsComponent,canActivate: [CanActivateViaAuthGuard]  },
	{ path: 'masterscreen/supplierlist', component: supplierListComponent,canActivate: [CanActivateViaAuthGuard]   },
	{ path: 'masterscreen/broakerlist', component: broakerListComponent,canActivate: [CanActivateViaAuthGuard]   },
	{ path: 'masterscreen/createsupplier', component: createSupplierComponent,canActivate: [CanActivateViaAuthGuard]  },
	{ path: 'masterscreen/createbroker', component: createBrokerComponent,canActivate: [CanActivateViaAuthGuard]  },
	{ path: 'masterscreen/shiftlist', component: shiftListComponent,canActivate: [CanActivateViaAuthGuard]   },
	{ path: 'masterscreen/createshift', component: createShiftComponent,canActivate: [CanActivateViaAuthGuard]  },
	{ path: 'masterscreen/selectionqualityList', component: selectionqualityListComponent,canActivate: [CanActivateViaAuthGuard]  },
	{ path: 'masterscreen/createselectionquality', component: createSelectionqualityComponent,canActivate: [CanActivateViaAuthGuard]  },
	{ path: 'masterscreen/scmindenttypelist', component: scmindenttypeListComponent,canActivate: [CanActivateViaAuthGuard]   },
	{ path: 'masterscreen/createscmindenttype', component: createScmindenttypeComponent,canActivate: [CanActivateViaAuthGuard]  },
	{ path: 'masterscreen/statuslist', component: statusListComponent,canActivate: [CanActivateViaAuthGuard]   },
	{ path: 'masterscreen/createstatus', component: createStatusComponent,canActivate: [CanActivateViaAuthGuard]  },
	{ path: 'masterscreen/activtylist', component: activtyListComponent,canActivate: [CanActivateViaAuthGuard]  },
	{ path: 'masterscreen/createactivity', component: createActivityComponent,canActivate: [CanActivateViaAuthGuard]  },
	{ path: 'masterscreen/itemgrouplist', component: itemgroupListComponent,canActivate: [CanActivateViaAuthGuard]  },
	{ path: 'masterscreen/createitemgroup', component: createItemgroupComponent,canActivate: [CanActivateViaAuthGuard]   },
	{ path: 'masterscreen/itemlist', component: itemListComponent,canActivate: [CanActivateViaAuthGuard]  },
	{ path: 'masterscreen/createitem', component: createItemComponent,canActivate: [CanActivateViaAuthGuard]  },
	{ path: 'masterscreen/tasktypelist', component: tasktypeListComponent,canActivate: [CanActivateViaAuthGuard]  },
	{ path: 'masterscreen/createtasktype', component: createTasktypeComponent,canActivate: [CanActivateViaAuthGuard]  },
	{ path: 'masterscreen/banklist', component:  BankListComponent,canActivate: [CanActivateViaAuthGuard]   },
	{ path: 'masterscreen/createbank', component: CreateBankComponent,canActivate: [CanActivateViaAuthGuard]  },
	{ path: 'masterscreen/branchlist', component: BranchListComponent,canActivate: [CanActivateViaAuthGuard]   },
	{ path: 'masterscreen/createbranch', component: CreateBranchComponent,canActivate: [CanActivateViaAuthGuard]  },
	{ path: 'masterscreen/createapprover', component: createApproverComponent},
	{ path: 'masterscreen/ pricelist', component: priceListComponent,canActivate: [CanActivateViaAuthGuard]  },
	{ path: 'masterscreen/createprice', component: createPriceComponent,canActivate: [CanActivateViaAuthGuard]  },
	
	
	
	
	
	//security
	{ path: 'security', component: storeEntryRegisterComponent, canActivate: [CanActivateViaAuthGuard]  },
	{ path: 'security/storeentryregister', component: storeEntryRegisterComponent, canActivate: [CanActivateViaAuthGuard]  },
	{ path: 'security/storeentryregistercreate', component: storeEntryRegisterCreateComponent, canActivate: [CanActivateViaAuthGuard]  },
	{ path: 'security/storeentryregister/:id', component: storeEntryRegisterEditComponent, canActivate: [CanActivateViaAuthGuard]  },
	{ path: 'security/juteentryregister', component: juteEntryRegisterComponent, canActivate: [CanActivateViaAuthGuard]  },
	{ path: 'security/juteentryregistercreate', component: juteEntryRegisterCreateComponent, canActivate: [CanActivateViaAuthGuard]  },
	{ path: 'security/juteentryregister/:id', component: juteEntryRegisterEditComponent, canActivate: [CanActivateViaAuthGuard]  },
	
	{ path: 'security/visitorRegister', component: visitorRegisterComponent,canActivate: [CanActivateViaAuthGuard]  },
	{ path: 'Security/storeregister', component: storeRegisterComponent, canActivate: [CanActivateViaAuthGuard]  },
	{ path: 'Security/storeregistersearch', component: storeRegisterSearchComponent, canActivate: [CanActivateViaAuthGuard]  },
	{ path: 'Security/storeregisteredit/:hdrId', component: storeRegisterEditComponent, canActivate: [CanActivateViaAuthGuard]  },

	{ path: 'Security/finishingsaleregister', component: finishingsaleRegisterComponent, canActivate: [CanActivateViaAuthGuard]  },
	{ path: 'Security/finishingsaleregisteredit/:challanNo', component: finishingsaleRegisterEditComponent, canActivate: [CanActivateViaAuthGuard]  },
	{ path: 'Security/finishingsaleregistersearch', component: finishingsaleRegisterSearchComponent, canActivate: [CanActivateViaAuthGuard]  },

	{ path: 'Security/juteregister', component: juteRegisterComponent, canActivate: [CanActivateViaAuthGuard]  },
	{ path: 'Security/juteregisteredit/:id', component: juteRegisterEditComponent, canActivate: [CanActivateViaAuthGuard]  },
	{ path: 'Security/juteregistersearch', component: juteRegisterSearchComponent, canActivate: [CanActivateViaAuthGuard]  }
]
;

@NgModule ({
    imports : [ RouterModule.forRoot(router) ],
    exports : [ RouterModule ]
})
export class AppRoutingModule {}

export const routingComponents = [
	loginComponent,
	 mainNavComponent,
	subNavComponent,
	DashboardComponent,
	DashboardSummeryComponent,
	//store
	indentSearchComponent,
	indentSearchDtlComponent,
	createMRIndentComponent,
	createIndentComponent,
	indentApprovalListComponent,
	indentApprovalListJuteComponent,
	indentApprovalDetailsComponent,
	srListComponent,
	mrListComponent,
	srDtlsWorklistComponent,
	srDtlslistComponent,
	mrDtlslistComponent,
	mrWorklistComponent,
	srWorklistComponent,
	grnMaterialReceiveComponent,
	grnStoreReceiveComponent,
	mrReadingComponent,
	mrDtlsWorklistComponent,
	agentMRDtlsComponent,
	issueDetailsComponent,
	srissueListComponent,
	mrissueListComponent,
	grnMrIssueComponent,
	grnSrIssueComponent,
	debitCreditCreateComponent,
	debitCreditListDtlComponent,
	debitCreditList,
	billPassList,
	billPassListDtlComponent,
	billPassCreateComponent,
	agentmrListComponent,
	sreditComponent,
	mreditComponent,
	
	//purchase
	purchaseCancelPrintComponent,
	purchaseOrderDetails,
	createPOComponent,
	createMRPOComponent,
	purchaseApprovalDetailsComponent,
	purchaseApprovalListComponent,
	purchaseApprovalListJuteComponent,
	purchaseAmmendmentListComponent,
	purchaseAmmendmentListJuteComponent,
	purchaseAmmendmentDetailsComponent,
	inviteVendorComponent,
	inviteVendorDetailsComponent,
	supplierWorklistComponent,
	supplierWorkDetailsComponent,
	supplierApprovalWorklistComponent,		
	supplierApprovalDetailsComponent,
	
	
	//hrms
	userProfileSummeryComponent,
	userProfilePersonalComponent,
	userProfileBankComponent,
	userProfileAcademicComponent,
	userProfileProfessionalComponent,
	
	//settings
	ViewUserComponent,
	disableEnableUserComponent,
	createUserComponent,
	MapUserGroupComponent,
	userGroupComponent,
	userGroupDtlComponent,
	createUserGroupComponent,
	
	//reports
	godownwiseStockReportComponent,
	juteRateReportComponent,
	ReceiptRegisterComponent,
	qualityWiseStockComponent,
	groupwisestockComponent,
	summeryReceiptRegisterComponent,
	issueRegisterComponent,
	dailyJuteStockReportComponent,
	stBatchReportComponent,
	indentDetailsReportComponent,
	outstandingIndentReportComponent,
	indentcancelregisterComponent,
	rptin12Component,
	indentdetailsitemwiseReportComponent,
	outstandingIndentReportItemwiseComponent,
	indentWaitingforPOReportComponent,
	outstandingIndentReportDeptwiseComponent,
	outstandingIndentReportGrpwiseComponent,
	
	//master
	countryListComponent,
	createCountryComponent,
	stateListComponent,
	createStateComponent,
	CityListComponent,
	CreateCityComponent,
	organizationListComponent,
	createOrganizationComponent,
	DepartmentListComponent,
	createDepartmentComponent,
	employeeListComponent,
	createEmployeeComponent,
	LocationListComponent,
	createLocationComponent,
	HolidayListComponent,
	createHolidayComponent,
	leaveListComponent,
	createLeaveComponent,
	weekendListComponent,
	createWeekendComponent,
	usergroupListComponent,
	createUsergroupmasterComponent,
	codeListComponent,
	createCodeComponent,
	projectListComponent,
	createProjectComponent,
	machineListComponent,
	createMachineComponent,
	uomListComponent,
	createUomComponent,
	frameListComponent,
	createFrameComponent,
	jutequalitypriceListComponent ,
	createJutequalitypriceComponent,
	menuListComponent,
	createMenuComponent,
	submenuListComponent,
	createSubmenuComponent,
	roledetailsListComponent,
	createRoledetailsComponent,
	mukamListComponent,
	createMukamComponent,
	supplierListComponent,
	broakerListComponent,
	createSupplierComponent,
	createBrokerComponent,
	statusListComponent,
	createStatusComponent,
	shiftListComponent,
	createShiftComponent,
	selectionqualityListComponent,
	createSelectionqualityComponent,
	scmindenttypeListComponent,
	createScmindenttypeComponent,
	activtyListComponent,
	createActivityComponent,
	itemListComponent,
	createItemComponent,
	itemgroupListComponent,
	createItemgroupComponent,
	tasktypeListComponent,
	createTasktypeComponent,
	BankListComponent,
	CreateBankComponent,
	BranchListComponent,
	CreateBranchComponent,
	createApproverComponent,
	priceListComponent,
	createPriceComponent,
	
	
	//security
	storeEntryRegisterComponent,
	storeEntryRegisterCreateComponent,
	storeEntryRegisterEditComponent,
	juteEntryRegisterComponent,
	juteEntryRegisterCreateComponent,
	juteEntryRegisterEditComponent,
	
	visitorRegisterComponent,
	storeRegisterComponent,
	storeRegisterSearchComponent,
	storeRegisterEditComponent,
	finishingsaleRegisterComponent,
	finishingsaleRegisterEditComponent,
	finishingsaleRegisterSearchComponent,
	juteRegisterComponent,
	juteRegisterEditComponent,
	juteRegisterSearchComponent
]
