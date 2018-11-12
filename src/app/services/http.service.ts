import { Injectable,Output,EventEmitter } from '@angular/core';
import { Http, Headers } from '@angular/http';
import 'rxjs/add/operator/map';

import { BaseProxyService } from '../proxy/base-proxy.service';
import { AppSettings } from '../config/settings/app-settings';

@Injectable()
export class HttpTestService {
  
	constructor(public _baseProxy: BaseProxyService) {}
	
	//store Services
	getAllMukams(){
		return this._baseProxy.get(AppSettings.API_PURCHASE + AppSettings.ALLMUKAMS);
	}
	
	getHigherchy(id){
		return this._baseProxy.get(AppSettings.API_MASTER + AppSettings.GETALLHIGHERCHY + id);
	}
	
	
	getAllMukamsbysup(id){
		return this._baseProxy.get(AppSettings.API_PURCHASE + id + AppSettings.GETMUKAMBYSUP);
	}
	
	getAllItemsByMukams(id){
		return this._baseProxy.get(AppSettings.API_PURCHASE +id+ AppSettings.GETITEMBYMUKAM);
	}
	
	getAllIndentsByMukams(id){
		return this._baseProxy.get(AppSettings.API_PURCHASE +id+ AppSettings.GETINDENTBYMUKAM);
	}
	
	getAllVehicles(){
		return this._baseProxy.get(AppSettings.API_PURCHASE + AppSettings.ALLVEHICLES);
	}
	
	
	getindentDetailsReport(formdt,todt){
		return this._baseProxy.get(AppSettings.API_REPORT_STORE + AppSettings.INDNTDTLSREPORT+formdt+'/'+todt);
	}
	
	getOutstandingReport(formdt,todt){
		return this._baseProxy.get(AppSettings.API_REPORT_STORE + AppSettings.OUTSTNDNGREPORT+formdt+'/'+todt);
	}
	
	getIndentCancelRegisterReport(formdt,todt){
		return this._baseProxy.get(AppSettings.API_REPORT_STORE + AppSettings.INDCANREGISTER+formdt+'/'+todt);
	}
	
	getRptinReport(formdt){
		return this._baseProxy.get(AppSettings.API_REPORT_STORE + AppSettings.RPTIN+formdt);
	}
	
	getIndentDetailsReportItemwise(formdt,todt){
		return this._baseProxy.get(AppSettings.API_REPORT_STORE + AppSettings.INDDTLITMWISEREPORT+formdt+'/'+todt);
	}
	
	getOutstandingReportItemwise(formdt){
		return this._baseProxy.get(AppSettings.API_REPORT_STORE + AppSettings.OUTSTNITEMWISEREPORT+formdt);
	}
	
	getWaitingForPOReport(formdt){
		return this._baseProxy.get(AppSettings.API_REPORT_STORE + AppSettings.WAITNGFORPOINDREPORT+formdt);
	}
	
	getOutstandingReportDeptise(formdt){
		return this._baseProxy.get(AppSettings.API_REPORT_STORE + AppSettings.OOUTSTANDNGINDDEPTWISEREPORT+formdt);
	}
	
	getOutstandingReportGrpise(formdt){
		return this._baseProxy.get(AppSettings.API_REPORT_STORE + AppSettings.OOUTSTANDNGINDGRPWISEREPORT+formdt);
	}
	
	
	getItemGroups(){
		return this._baseProxy.get(AppSettings.API_PURCHASE + AppSettings.ITEMGROUP);
	}
	
	getItemDescByGrpId(id){
		return this._baseProxy.get(AppSettings.API_PURCHASE + id + AppSettings.ITEMDESCBYGRP);
	}
	
	getItemDescBySup(id){
		return this._baseProxy.get(AppSettings.API_PURCHASE + id + AppSettings.ITEMDESCBYSUP);
	}
	
	getAllDepartments() {
		return this._baseProxy.get(AppSettings.API_PURCHASE + AppSettings.GETALLDEPT);
	}
	
	getAllUnits() {
		return this._baseProxy.get(AppSettings.API_PURCHASE + AppSettings.GETALLUNITS);
	}
	
	getAllBatchTypes() {
		return this._baseProxy.get(AppSettings.API_PURCHASE + AppSettings.GETALLBATCHTYPE);
	}
  
	
	
	getIndentTypes() {
		return this._baseProxy.get(AppSettings.API_PURCHASE + AppSettings.INDENTTYPES);
	}
	
	getAllQuality(id) {
		return this._baseProxy.get(AppSettings.API_PURCHASE + id + AppSettings.GETQUALITY);
	}
	
	getIndentDtlFrJt(id) {
		return this._baseProxy.get(AppSettings.API_PURCHASE + id + AppSettings.INDNTDTLFRJT);
	}
	
	getSuppler(id) {
		return this._baseProxy.get(AppSettings.API_PURCHASE + id + AppSettings.GETSUP);
	}
	
	getInvitedSuppliers(id) {
		return this._baseProxy.get(AppSettings.API_PURCHASE + id + AppSettings.GETINVITEDSUPL);
	}
	
	getAllSuppliers() {
		return this._baseProxy.get(AppSettings.API_PURCHASE + AppSettings.GETALLSUP);
	}
	
	getIndentByType(id) {
		return this._baseProxy.get(AppSettings.API_PURCHASE + id + AppSettings.GETINDENTBYTYPE);
	}
	
	getRateComparison(id) {
		return this._baseProxy.get(AppSettings.API_PURCHASE + id + AppSettings.GETRATECOMPARE);
	}
	
	createPO(data) {
  	var theaders = new Headers();
  	theaders.append('Content-Type', 'application/json');
	
	return this._baseProxy.post(AppSettings.API_PURCHASE + AppSettings.CREATEPO ,
  		data,
  		{
  			headers: theaders	
  		})
  		.map(res => res);
	}
	
	
	
	
	
	createIndent(data) {
  	var theaders = new Headers();
  	theaders.append('Content-Type', 'application/json');
	
	return this._baseProxy.post(AppSettings.API_PURCHASE + AppSettings.CREATEINDENT ,
  		data,
  		{
  			headers: theaders	
  		})
  		.map(res => res);
	}
	
	mapSupplier(data) {
  	var theaders = new Headers();
  	theaders.append('Content-Type', 'application/json');
	
	return this._baseProxy.post(AppSettings.API_PURCHASE + AppSettings.MAPSUPPLIERTOINDENT ,
  		data,
  		{
  			headers: theaders	
  		})
  		.map(res => res);
	}
	
	
	inviteVendor(data) {
  	var theaders = new Headers();
  	theaders.append('Content-Type', 'application/json');
	
	return this._baseProxy.post(AppSettings.API_PURCHASE + AppSettings.INVITEVNDR ,
  		data,
  		{
  			headers: theaders	
  		})
  		.map(res => res);
	}
	
	
	updateIndent(data) {
  	var theaders = new Headers();
  	theaders.append('Content-Type', 'application/json');
	
	return this._baseProxy.post(AppSettings.API_PURCHASE + AppSettings.UPDTINDENT ,
  		data,
  		{
  			headers: theaders	
  		})
  		.map(res => res);
	}
	
	updatePO(data) {
  	var theaders = new Headers();
  	theaders.append('Content-Type', 'application/json');
	
	return this._baseProxy.post(AppSettings.API_PURCHASE + AppSettings.UPDATEPO ,
  		data,
  		{
  			headers: theaders	
  		})
  		.map(res => res);
	}
	
	getIndenApprovalList(id) {
		return this._baseProxy.get(AppSettings.API_PURCHASE + id + AppSettings.INDENTAPPROVAL);
	}
	
	getApprovedPOList(stat) {
		return this._baseProxy.get(AppSettings.API_PURCHASE + stat + AppSettings.GETAPPROVEDJUTEIND);
	}
	
	getSupByType(stat) {
		return this._baseProxy.get(AppSettings.API_PURCHASE + stat + AppSettings.GETSUPPLIERBYTYPE);
	}
	
	getPOApprovalList(id) {
		return this._baseProxy.get(AppSettings.API_PURCHASE + id + AppSettings.POBYSTAT);
	}
	
	getTotGrnVal(id,type) {
		return this._baseProxy.get(AppSettings.API_PURCHASE + AppSettings.GETGRNVAL + id +"/"+type);
	}
	
	getIndentData(id) {
		return this._baseProxy.get(AppSettings.API_PURCHASE + id + AppSettings.INDENTDETAIL);
	}
	getallindentidsbysupplieritem(id) {
		return this._baseProxy.get(AppSettings.API_PURCHASE + id + AppSettings.GETINDENTBYSUPITM);
	}
	
	indentStatusChange(data) {
  	var theaders = new Headers();
  	theaders.append('Content-Type', 'application/json');
	
	return this._baseProxy.post(AppSettings.API_PURCHASE + AppSettings.INDENTSTATUS ,
  		data,
  		{
  			headers: theaders	
  		})
  		.map(res => res);
	}
	
	getVendorData() {
		return this._baseProxy.get(AppSettings.LOCAL_API_ENDPOINT + AppSettings.VENDORLIST);
	}
	

	
	//purchase Services
	
	getPOSelectItems() {
		return this._baseProxy.get(AppSettings.LOCAL_API_ENDPOINT + AppSettings.PURCHASE);
	}
	
	getSupplierDetails(id) {
		return this._baseProxy.get(AppSettings.API_PURCHASE + id + AppSettings.SUPDTL);
	}
	
	getAllPO() {
		return this._baseProxy.get(AppSettings.API_PURCHASE + AppSettings.ALLPO);
	}
	
	getAllIndent() {
		return this._baseProxy.get(AppSettings.API_PURCHASE + AppSettings.ALLIND);
	}
	
	
	getAllExpType() {
		return this._baseProxy.get(AppSettings.API_MASTER + AppSettings.GETEXPTYPE);
	}
	
	getAllCostCenter() {
		return this._baseProxy.get(AppSettings.API_MASTER + AppSettings.COSTCENTER);
	}
	
	getPoApprovalList() {
		return this._baseProxy.get(AppSettings.LOCAL_API_ENDPOINT + AppSettings.POAPPROVAL);
	}
	
	getPOData(id) {
		return this._baseProxy.get(AppSettings.API_PURCHASE + id + AppSettings.PODETAIL);
	}
	
	getSupApprovalDetail(id) {
		return this._baseProxy.get(AppSettings.API_PURCHASE + AppSettings.GETSUPPLIERAPPROVALDTL + id);
	}
	
	getIndentBySupplier(id) {
		return this._baseProxy.get(AppSettings.API_PURCHASE + id + AppSettings.GETINDBYSUPP);
	}
	
	getIndentDetlsBySupplier(id){
		return this._baseProxy.get(AppSettings.API_PURCHASE + id + AppSettings.GETINDENTDETLSBYSUP);
	}
	
	getItemsbyIndent(id) {
		return this._baseProxy.get(AppSettings.API_PURCHASE + id + AppSettings.GETITMBYIND);
	}
	
	getChallanDtlsMr(id) {
		return this._baseProxy.get(AppSettings.API_PURCHASE + id + AppSettings.GETCHALLANDTLSMR);
	}
	
	getPODtlsMr(sup,chalan) {
		return this._baseProxy.get(AppSettings.API_PURCHASE + AppSettings.GETPODTLSMR + sup +"/"+chalan);
	}
	
	getMrdetailFrmChalan(emteredChalan,enteredsupp,enteredpo) {
		return this._baseProxy.get(AppSettings.API_PURCHASE + AppSettings.GETMRFRMCHALAN + emteredChalan+"/"+enteredsupp+"/"+enteredpo);
	}
	
	getMrdetailFrmChalanNew(emteredChalan,enteredsupp,enteredpo) {
		return this._baseProxy.get(AppSettings.API_PURCHASE + AppSettings.GETMRFRMCHALANNEW + emteredChalan+"/"+enteredsupp+"/"+enteredpo);
	}
	
	getSrdetailFrmChalan(emteredChalan,enteredsupp,enteredpo) {
		return this._baseProxy.get(AppSettings.API_PURCHASE + AppSettings.GETSRFRMCHALAN + emteredChalan+"/"+enteredsupp+"/"+enteredpo);
	}
	
	getChallanDtlsSr(id) {
		return this._baseProxy.get(AppSettings.API_PURCHASE + id + AppSettings.GETCHALLANDTLSSR);
	}
	
	getMrbyStatus(stat) {
		return this._baseProxy.get(AppSettings.API_PURCHASE + stat + AppSettings.GETMRBYSTAT);
	}
	
	getSrbyStatus(stat) {
		return this._baseProxy.get(AppSettings.API_PURCHASE + stat + AppSettings.GETSRBYSTAT);
	}
	
	getMrbyId(id) {
		return this._baseProxy.get(AppSettings.API_PURCHASE + id + AppSettings.GETMRBYID);
	}
	
	
	getItmgrpByDept(id) {
		return this._baseProxy.get(AppSettings.API_PURCHASE + id + AppSettings.GETITEMGROUPBYDEPT);
	}
	
	getBillbyId(id) {
		return this._baseProxy.get(AppSettings.API_PURCHASE + id + AppSettings.GETBILLBYID);
	}
	
	getSrbyId(id) {
		return this._baseProxy.get(AppSettings.API_PURCHASE + id + AppSettings.GETSRBYID);
	}
	
	getIssuebyId(id) {
		return this._baseProxy.get(AppSettings.API_PURCHASE + id + AppSettings.GETISSUEBYID);
	}
	
	getAllDRCR() {
		return this._baseProxy.get(AppSettings.API_PURCHASE + AppSettings.GETALLDRCR);
	}
	
	getAllBillPass() {
		return this._baseProxy.get(AppSettings.API_PURCHASE + AppSettings.GETALLBILLPASS);
	}
	
	
	getAllMr() {
		return this._baseProxy.get(AppSettings.API_PURCHASE + AppSettings.GETALLMR);
	}
	
	getAllSr() {
		return this._baseProxy.get(AppSettings.API_PURCHASE + AppSettings.GETALLSR);
	}
	
	getAllIssue() {
		return this._baseProxy.get(AppSettings.API_PURCHASE + AppSettings.GETALLISSUE);
	}
	
	getSRStockDtl(request) {
		return this._baseProxy.get(AppSettings.API_PURCHASE + request + AppSettings.GETSRSTOCKDTL);
	}
	
	getMrWarehouseStckDtl(request) {
		return this._baseProxy.get(AppSettings.API_PURCHASE + request + AppSettings.GETMRWARESTCKDTL);
	}
	
	getSrStckStckDtl(request) {
		return this._baseProxy.get(AppSettings.API_PURCHASE + request + AppSettings.GETSRSTRSTCKDTL);
	}
	
	getMRStockDtl(request) {
		return this._baseProxy.get(AppSettings.API_PURCHASE + request + AppSettings.GETMRSTOCKDTL);
	}
	
	getDRCRbyId(id) {
		return this._baseProxy.get(AppSettings.API_PURCHASE + id + AppSettings.GETDRCRBYID);
	}
	
	getReading(request) {
		return this._baseProxy.get(AppSettings.API_PURCHASE + request + AppSettings.GETREADING);
	}
	
	getPrintCount(request) {
		return this._baseProxy.get(AppSettings.API_PURCHASE + request + AppSettings.GETPRINTCOUNTER);
	}
	
	addCounter(data) {
  	var theaders = new Headers();
  	theaders.append('Content-Type', 'application/json');
	
	return this._baseProxy.post(AppSettings.API_PURCHASE + AppSettings.ADDPRINTCOUNTER ,
  		data,
  		{
  			headers: theaders	
  		})
  		.map(res => res);
	}
	
	createIssue(data) {
  	var theaders = new Headers();
  	theaders.append('Content-Type', 'application/json');
	
	return this._baseProxy.post(AppSettings.API_PURCHASE + AppSettings.CREATEISSUE ,
  		data,
  		{
  			headers: theaders	
  		})
  		.map(res => res);
	}
	
	
	saveSupplierApprovalData(data) {
  	var theaders = new Headers();
  	theaders.append('Content-Type', 'application/json');
	
	return this._baseProxy.post(AppSettings.API_PURCHASE + AppSettings.SAVESUPPLIERAPPROVALDTL ,
  		data,
  		{
  			headers: theaders	
  		})
  		.map(res => res);
	}
	
	createReading(data) {
  	var theaders = new Headers();
  	theaders.append('Content-Type', 'application/json');
	
	return this._baseProxy.post(AppSettings.API_PURCHASE + AppSettings.ADDREADING ,
  		data,
  		{
  			headers: theaders	
  		})
  		.map(res => res);
	}
	
	createMR(data) {
  	var theaders = new Headers();
  	theaders.append('Content-Type', 'application/json');
	
	return this._baseProxy.post(AppSettings.API_PURCHASE + AppSettings.CREATEMR ,
  		data,
  		{
  			headers: theaders	
  		})
  		.map(res => res);
	}
	
	createSR(data) {
  	var theaders = new Headers();
  	theaders.append('Content-Type', 'application/json');
	
	return this._baseProxy.post(AppSettings.API_PURCHASE + AppSettings.CREATESR ,
  		data,
  		{
  			headers: theaders	
  		})
  		.map(res => res);
	}
	
	
	updateSR(data) {
  	var theaders = new Headers();
  	theaders.append('Content-Type', 'application/json');
	
	return this._baseProxy.post(AppSettings.API_PURCHASE + AppSettings.UPDATESR ,
  		data,
  		{
  			headers: theaders	
  		})
  		.map(res => res);
	}
	
	updateMR(data) {
  	var theaders = new Headers();
  	theaders.append('Content-Type', 'application/json');
	
	return this._baseProxy.post(AppSettings.API_PURCHASE + AppSettings.UPDATEMR ,
  		data,
  		{
  			headers: theaders	
  		})
  		.map(res => res);
	}
	
	createDRCR(data) {
  	var theaders = new Headers();
  	theaders.append('Content-Type', 'application/json');
	
	return this._baseProxy.post(AppSettings.API_PURCHASE + AppSettings.CREATEDRCR ,
  		data,
  		{
  			headers: theaders	
  		})
  		.map(res => res);
	}
	
	createBillpass(data) {
  	var theaders = new Headers();
  	theaders.append('Content-Type', 'application/json');
	
	return this._baseProxy.post(AppSettings.API_PURCHASE + AppSettings.CREATEBILLPASS ,
  		data,
  		{
  			headers: theaders	
  		})
  		.map(res => res);
	}



	//User Services
	
	logedIn(request) {
		return this._baseProxy.get(AppSettings.API_PURCHASE +request+ AppSettings.LOgIN);
	}

	getOrganizations() {
		return this._baseProxy.get(AppSettings.API_USER + AppSettings.GETORGANIZATIONS);
	}

	getDesignations() {
		return this._baseProxy.get(AppSettings.API_USER + AppSettings.GETDESIGNATIONS);
	}

	getUserRoles() {
		return this._baseProxy.get(AppSettings.API_USER + AppSettings.GETUSERROLES);
	}

	getDepartmentByOrg(id) {
		return this._baseProxy.get(AppSettings.API_USER + AppSettings.GETDEPTBYORG + id);
	}
	
	getUserDetailsByName(name) {
		return this._baseProxy.get(AppSettings.API_USER + AppSettings.GETUSRBYUSRNM + name);
	}
	
	getUserDetailsById(id) {
		return this._baseProxy.get(AppSettings.API_USER + AppSettings.GETUSRBYUSRID + id);
	}
	
	getUserImageById(id) {
		return this._baseProxy.get(AppSettings.API_USER + AppSettings.GETUSRIMGBYID + id);
	}
	
	getUserProfessionById(id) {
		return this._baseProxy.get(AppSettings.API_USER + AppSettings.GETUSRPROFBYID + id);
	}
	
	getUserAcademyById(id) {
		return this._baseProxy.get(AppSettings.API_USER + AppSettings.GETUSRACADBYID + id);
	}
	
	getUserBankById(id) {
		return this._baseProxy.get(AppSettings.API_USER + AppSettings.GETUSRBNKBYID + id);
	}
	
	getUserRoleAll() {
		return this._baseProxy.get(AppSettings.API_USER + AppSettings.GETUSRROLEALL);
	}
	
	getUserGroupAll() {
		return this._baseProxy.get(AppSettings.API_USER + AppSettings.GETUSRGRPALL);
	}
	
	getUserAll() {
		return this._baseProxy.get(AppSettings.API_USER + AppSettings.GETUSRALL);
	}
	
	getMenuAll() {
		return this._baseProxy.get(AppSettings.API_USER + AppSettings.GETMENUALL);
	}
	
	getBankAll() {
		return this._baseProxy.get(AppSettings.API_USER + AppSettings.GETBANKALL);
	}
	
	getBranchByBank(id) {
		return this._baseProxy.get(AppSettings.API_USER + AppSettings.GETBRANCH + id);
	}
	
	getUserGroupById(id) {
		return this._baseProxy.get(AppSettings.API_USER + AppSettings.GETUSRGROUP + id);
	}
	
	getMenuByUserGroup(id) {
		return this._baseProxy.get(AppSettings.API_USER + AppSettings.GETMENUBYGROUP + id);
	}
	
	getSubMenuByUserGroup(id) {
		return this._baseProxy.get(AppSettings.API_USER + AppSettings.GETSUBMENUBYGROUP + id);
	}
	
	getRouteURL(id) {
		return this._baseProxy.get(AppSettings.API_USER + AppSettings.GETMENUURL + id);
	}
	
	
	getAllUsersOfGroup(id) {
		return this._baseProxy.get(AppSettings.API_USER + AppSettings.GETALLUSRBYGRP + id);
	}
	
	deleteUserFromUserGrp(id) {
		return this._baseProxy.deleteXml(AppSettings.API_USER + AppSettings.DELETEUSERGROUPMAP + id);
	}
	
	deleteSubmenuFromUserGrp(id) {
		return this._baseProxy.deleteXml(AppSettings.API_USER + AppSettings.DELETESUBMENUGROUPMAP + id);
	}
	
	getAllUsersOfGroupwithMapId(id) {
		return this._baseProxy.get(AppSettings.API_USER + AppSettings.GETALLUSRBYGRPMAPPED + id);
	}
	
	loadAllMenusByGrp(id) {
		return this._baseProxy.get(AppSettings.API_USER + AppSettings.GETALLMNUBYGRP + id);
	}
	
	getApprovalData(id) {
		return this._baseProxy.get(AppSettings.API_USER + AppSettings.GETAPPROVALDATA + id);
	}
	
	
	getTokkenData(id) {
		return this._baseProxy.get(AppSettings.API_PURCHASE + id + AppSettings.GETTOKKEN);
	}
	
	
	
	godownwisestockregisterreport(dateString){
		return this._baseProxy.get(AppSettings.API_REPORT + AppSettings.GODSTCKREPORT + dateString);
	}
	
	GroupwiseQualityStockRegister(dateString){
		return this._baseProxy.get(AppSettings.API_REPORT + AppSettings.GRPSTCKREPORT + dateString);
	}
	
	issueregisterreport(dateString){
		return this._baseProxy.get(AppSettings.API_REPORT + AppSettings.ISSUEREGISTER + dateString);
	}
	
	juteratereport(dateString){
		return this._baseProxy.get(AppSettings.API_REPORT + AppSettings.JUTERATEREPORT + dateString);
	}
	
	getqualitywisestockreport(dateString){
		return this._baseProxy.get(AppSettings.API_REPORT + AppSettings.QLTYSTCKREPORT + dateString);
	}
	
	getReceiptRegister(dateString){
		return this._baseProxy.get(AppSettings.API_REPORT + AppSettings.RECEIPTREGREP + dateString);
	}
	
	summeryreport(dateString){
		return this._baseProxy.get(AppSettings.API_REPORT + AppSettings.SUMMARYREPORT + dateString);
	}
	
	
	
	addTokken(data) {
  	var theaders = new Headers();
  	theaders.append('Content-Type', 'application/json');
	return this._baseProxy.post(AppSettings.API_PURCHASE + AppSettings.TOKKEN ,
  		data,
  		{
  			headers: theaders	
  		})
  		.map(res => res);
	}
	
	
	createUser(data) {
  	var theaders = new Headers();
  	theaders.append('Content-Type', 'application/json');
	return this._baseProxy.post(AppSettings.API_USER + AppSettings.CREATEUSR ,
  		data,
  		{
  			headers: theaders	
  		})
  		.map(res => res);
	}
	
	
	addproffession(data) {
  	var theaders = new Headers();
  	theaders.append('Content-Type', 'application/json');
	return this._baseProxy.post(AppSettings.API_USER + AppSettings.ADDPROFESSION ,
  		data,
  		{
  			headers: theaders	
  		})
  		.map(res => res);
	}
	
	createUserGroup(data) {
  	var theaders = new Headers();
  	theaders.append('Content-Type', 'application/json');
	return this._baseProxy.post(AppSettings.API_USER + AppSettings.CREATEUSRGRP ,
  		data,
  		{
  			headers: theaders	
  		})
  		.map(res => res);
	}
	
	updateUserGroup(data) {
  	var theaders = new Headers();
  	theaders.append('Content-Type', 'application/json');
	return this._baseProxy.postNoResponse(AppSettings.API_USER + AppSettings.UPDATEUSERGRP ,
  		data,
  		{
  			headers: theaders	
  		})
  		.map(res => res);
	}
	
	
	updateUserDetails(data) {
  	var theaders = new Headers();
  	theaders.append('Content-Type', 'application/json');
	return this._baseProxy.post(AppSettings.API_USER + AppSettings.UPDATEUSER ,
  		data,
  		{
  			headers: theaders	
  		})
  		.map(res => res);
	}
	
	updateUserProfession(data) {
  	var theaders = new Headers();
  	theaders.append('Content-Type', 'application/json');
	return this._baseProxy.post(AppSettings.API_USER + AppSettings.UPDATEUSERPROF ,
  		data,
  		{
  			headers: theaders	
  		})
  		.map(res => res);
	}
	
	addUserAcademics(data) {
  	var theaders = new Headers();
  	theaders.append('Content-Type', 'application/json');
	return this._baseProxy.post(AppSettings.API_USER + AppSettings.ADDUSERACADEMICS ,
  		data,
  		{
  			headers: theaders	
  		})
  		.map(res => res);
	}
	
	updateUserBank(data) {
					var theaders = new Headers();
					theaders.append('Content-Type', 'application/json');
				  return this._baseProxy.post(AppSettings.API_USER + AppSettings.UPDATEUSERBANK ,
						data,
						{
							headers: theaders	
						})
						.map(res => res);
				  }
	
	updateUserAcademics(data) {
  	var theaders = new Headers();
  	theaders.append('Content-Type', 'application/json');
	return this._baseProxy.post(AppSettings.API_USER + AppSettings.UPDATEUSERACAD ,
  		data,
  		{
  			headers: theaders	
  		})
  		.map(res => res);
	}
	
	updateUserRoleMapping(postData) {
  	var theaders = new Headers();
  	theaders.append('Content-Type', 'application/json');
	console.log(postData);
	return this._baseProxy.post(AppSettings.API_USER + AppSettings.UPDATEUSERROLEMAP ,
  		postData,
  		{
  			headers: theaders	
  		})
  		.map(res => res);
	}
	
	usertoUsergroupMapping(postData) {
  	var theaders = new Headers();
  	theaders.append('Content-Type', 'application/json');
	console.log(postData);
	return this._baseProxy.post(AppSettings.API_USER + AppSettings.MAPUSRTOGRP ,
  		postData,
  		{
  			headers: theaders	
  		})
  		.map(res => res);
	}
	
	menutoUsergroupMapping(postData) {
  	var theaders = new Headers();
  	theaders.append('Content-Type', 'application/json');
	console.log(postData);
	return this._baseProxy.post(AppSettings.API_USER + AppSettings.MAPMENUTOGRP ,
  		postData,
  		{
  			headers: theaders	
  		})
  		.map(res => res);
	}
	
	mainMenutoUsergroupMapping(postData) {
  	var theaders = new Headers();
  	theaders.append('Content-Type', 'application/json');
	console.log(postData);
	return this._baseProxy.post(AppSettings.API_USER + AppSettings.MAPMNMENUTOGRP ,
  		postData,
  		{
  			headers: theaders	
  		})
  		.map(res => res);
	}
 
	//leave services
	
	getLeaveDetails() {
		return this._baseProxy.get(AppSettings.LOCAL_API_ENDPOINT + AppSettings.GETLEAVEDETAILS);
	}
	
	getLeaveTypes() {
		return this._baseProxy.get(AppSettings.LOCAL_API_ENDPOINT + AppSettings.GETLEAVETYPES);
	}
	
	getAllEvents() {
		return this._baseProxy.get(AppSettings.LOCAL_API_ENDPOINT + AppSettings.GETALLEVENTS);
	}
	
	
	getAllLeaveType() {
		return this._baseProxy.get(AppSettings.API_LEAVE + AppSettings.GETLEAVETYPE);
	}

	applyLeave(postData) {
		var theaders = new Headers();
		theaders.append('Content-Type', 'application/json');
		console.log(postData);
		///easybusiness/leave/applycompoff/{userId}/
		//{leaveTypeId}/{leaveStartDate}/{leaveEnddate}/{locationId}/{unitId}/{dayType}
		if(postData.selectedLeaveType == 3) { 
			var link = AppSettings.API_LEAVE + AppSettings.APPLYCOMPLEAVE + "/"+postData.userId + "/" +postData.selectedLeaveType + "/" +postData.fromDate.formatted+ "/" +postData.toDate.formatted+ "/" +postData.locationId+"/" +postData.unitId+"/" +postData.dayType;
		} else {
			var link = AppSettings.API_LEAVE + AppSettings.APPLYLEAVE + "/"+postData.userId + "/" +postData.selectedLeaveType + "/" +postData.fromDate.formatted+ "/" +postData.toDate.formatted+ "/" +postData.locationId+"/" +postData.unitId+"/" +postData.dayType;
		}
		console.log(link);
		return this._baseProxy.post( link,
				'',
				{
					headers: theaders	
				})
				.map(res => res);
	}

	modifyLeave(postData, operationType) {
		var theaders = new Headers();
		theaders.append('Content-Type', 'application/json');
		console.log(postData);
		///easybusiness/leave/applycompoff/{userId}/
		//{leaveTypeId}/{leaveStartDate}/{leaveEnddate}/{locationId}/{unitId}/{dayType}
		if(postData.selectedLeaveType == 3) { 
			var link = AppSettings.API_LEAVE + AppSettings.MODIFYCOMPLEAVE +"/"+postData.userId + "/" +postData.leaveTransactionId + "/" +postData.fromDate.formatted+ "/" +postData.toDate.formatted+ "/" +postData.locationId+"/" +postData.unitId+"/" +postData.dayType;
		} else {
			var link = AppSettings.API_LEAVE + AppSettings.MODIFYLEAVE +"/"+ operationType + "/"+postData.userId + "/" +postData.selectedLeaveType + "/" +postData.leaveTransactionId+ "/" +postData.fromDate.formatted+ "/" +postData.toDate.formatted+ "/" +postData.locationId+"/" +postData.unitId+"/" +postData.dayType;
		}
		console.log(link);
		return this._baseProxy.post( link,
				'',
				{
					headers: theaders	
				})
				.map(res => res);
	}

	getUserLeaveListByTypeAndDate(stDt,endDt,leaveType,loggedInUserID) {
		return this._baseProxy.get(AppSettings.API_LEAVE + AppSettings.GETUSERLEAVELISTBYTYPE + "/"+loggedInUserID + "/" + leaveType + "/" +stDt+ "/" +endDt);
	}

	getLeaveApprovalList(status) {
		return this._baseProxy.get(AppSettings.API_LEAVE + AppSettings.LEAVEAPPROVAL + "/" + status);
	}

	approveOrRejectLeave(data) {
		var theaders = new Headers();
		theaders.append('Content-Type', 'application/json');
	
	return this._baseProxy.post(AppSettings.API_LEAVE + AppSettings.LEAVEAPPROVALLINK ,
			data,
			{
				headers: theaders	
			})
			.map(res => res);
	}
	
	getAttendanceTimeData(request) {
		return this._baseProxy.get(AppSettings.LOCAL_API_ENDPOINT + AppSettings.MYWEEKTIMEREPORT);
	}
	
	getProjectData() {
		return this._baseProxy.get(AppSettings.LOCAL_API_ENDPOINT + AppSettings.PROJECTDETAILS);
	}
	
	getAttendanceWorkList(data) {
		return this._baseProxy.get(AppSettings.LOCAL_API_ENDPOINT + AppSettings.GETWORKLIST);
	}
	
	getSwipeData(data) {
		return this._baseProxy.get(AppSettings.LOCAL_API_ENDPOINT + AppSettings.GETSWIPEDATA);
	}
	
	getLocation() {
		return this._baseProxy.get(AppSettings.LOCAL_API_ENDPOINT + AppSettings.GETLOCATION);
	}
	
	getMappingData() {
		return this._baseProxy.get(AppSettings.LOCAL_API_ENDPOINT + AppSettings.GETMAPPINGDATA);
	}
	
	getEmployeeData() {
		return this._baseProxy.get(AppSettings.LOCAL_API_ENDPOINT + AppSettings.GETEMPDATA);
	}
	
	getAsignmentSearchData() {
		return this._baseProxy.get(AppSettings.LOCAL_API_ENDPOINT + AppSettings.SETASIGNSEARCHDATA);
	}
	
	/*getAttendanceWorkList(data) {
		var theaders = new Headers();
		theaders.append('Content-Type', 'application/json');
	
	return this._baseProxy.post(AppSettings.LOCAL_API_ENDPOINT + AppSettings.GETWORKLIST ,
			data,
			{
				headers: theaders	
			})
			.map(res => res);
	}*/
	
	
	
	getIndentReport(data) {
		var theaders = new Headers();
		theaders.append('Content-Type', 'application/json');
	
	return this._baseProxy.post(AppSettings.API_REPORT + AppSettings.INDENTREPORT ,
			data,
			{
				headers: theaders	
			})
			.map(res => res);
	}
	
	
//master
getCountry() {
	return this._baseProxy.get(AppSettings.API_MASTER + AppSettings.GETALLCOUNTRYMASTER);
}

getStateByCountry(country) {
	return this._baseProxy.get(AppSettings.API_MASTER + AppSettings.GETSTATEBYCOUNTRY + country);
}

getCityByState(state) {
	return this._baseProxy.get(AppSettings.API_MASTER + AppSettings.GETCITYBYSTATE + state);
}



createCountry(data) {
		return this._baseProxy.post(AppSettings.API_MASTER + AppSettings.ADDCOUNTRYMASTER ,
		  data,
		  {})
		  .map(res => res);
}
editCountry(data) {
	return this._baseProxy.post(AppSettings.API_MASTER + AppSettings.UPDATECOUNTRYMASTER ,
	  data,
	  {})
	  .map(res => res);
}
deleteCountry(id) {
	return this._baseProxy.delete(AppSettings.API_MASTER + AppSettings.DELETECOUNTRYMASTER + "/"+ id);
		
}



getState(){
	return this._baseProxy.get(AppSettings.API_MASTER + AppSettings.GETALLSTATEMASTER);
}

getAllStores(){
	return this._baseProxy.get(AppSettings.API_MASTER + AppSettings.GETALLSTORE);
}

getAllWarehouse(){
	return this._baseProxy.get(AppSettings.API_MASTER + AppSettings.GETALLWAREHOUSE);
}


createState(data) {
  return this._baseProxy.post(AppSettings.API_MASTER + AppSettings.ADDSTATEMASTER ,
	data,
	{})
	.map(res => res);
}
editState(data) {
  return this._baseProxy.post(AppSettings.API_MASTER + AppSettings.UPDATESTATEMASTER ,
	data,
	{})
	.map(res => res);
}

deleteState(id) {
  return this._baseProxy.delete(AppSettings.API_MASTER + AppSettings.DELETESTATEMASTER + "/"+ id);
	  
}




getcityList(){
	return this._baseProxy.get(AppSettings.API_MASTER + AppSettings.GETALLCITY);
}
createCity(data) {
  return this._baseProxy.post(AppSettings.API_MASTER + AppSettings.ADDCITY ,
	data,
	{})
	.map(res => res);
}

deleteCity(id) {
  return this._baseProxy.delete(AppSettings.API_MASTER + AppSettings.DELETECITY + "/"+ id);
	  
}

editCitymaster(data) {
	return this._baseProxy.post(AppSettings.API_MASTER + AppSettings.EDITCITYMASTER,
	  data,
	  {})
	  .map(res => res);
}



getorganizationmaster(){
	return this._baseProxy.get(AppSettings.API_MASTER + AppSettings.GETALLORGANIZATIONMASTER);
}
getheadorganizationmaster(){
	return this._baseProxy.get(AppSettings.API_MASTER + AppSettings.GETALLHEADORGANIZATIONMASTER);
}
createorganizationmaster(data) {
  return this._baseProxy.postResponse(AppSettings.API_MASTER + AppSettings.ADDORGANIZATIONMASTER ,
	data,
	{})
	.map(res => res);
}

deleteorganizationmaster(id) {
  return this._baseProxy.delete(AppSettings.API_MASTER + AppSettings.DELETEORGANIZATIONMASTER + "/"+ id);
	  
}
editorganizationmaster(data) {
	return this._baseProxy.post(AppSettings.API_MASTER + AppSettings.EDITORGANIZATIONMASTER,
	  data,
	  {})
	  .map(res => res);
}

getDepartmentmaster(){
	return this._baseProxy.get(AppSettings.API_MASTER + AppSettings.GETALLDEPARTMENTMASTER);
}
createDepartmentmaster(data) {
  return this._baseProxy.postResponse(AppSettings.API_MASTER + AppSettings.ADDDEPARTMENTMASTER ,
	data,
	{})
	.map(res => res);
}

deleteDepartmentmaster(id) {
  return this._baseProxy.delete(AppSettings.API_MASTER + AppSettings.DELETEDEPARTMENTMASTER + "/"+ id);
	  
}

editDepartmentmaster(data) {
	return this._baseProxy.post(AppSettings.API_MASTER + AppSettings.EDITDEPARTMENTMASTER,
	  data,
	  {})
	  .map(res => res);
}

getEmployeemaster(){
	return this._baseProxy.get(AppSettings.API_MASTER + AppSettings.GETALLEMPLOYEEMASTER);
}

createEmployeemaster(data) {
	return this._baseProxy.post(AppSettings.API_MASTER + AppSettings.ADDEMPLOYEEMASTER ,
	  data,
	  {})
	  .map(res => res);
}

deleteEmployeemaster(id) {
		return this._baseProxy.delete(AppSettings.API_MASTER + AppSettings.DELETEEMPLOYEEMASTER + "/"+ id);
			
}
	
editEmployeemaster(data) {
		return this._baseProxy.post(AppSettings.API_MASTER + AppSettings.EDITEMPLOYEEMASTER,
			data,
			{})
			.map(res => res);
}	


getLocationmaster(){
	return this._baseProxy.get(AppSettings.API_MASTER + AppSettings.GETALLLOCATIONMASTER);
}

createLocationmaster(data) {
	return this._baseProxy.post(AppSettings.API_MASTER + AppSettings.ADDLOCATIONMASTER ,
	  data,
	  {})
	  .map(res => res);
  }

deleteLocationmaster(id) {
	return this._baseProxy.delete(AppSettings.API_MASTER + AppSettings.DELETELOCATIONMASTER + "/"+ id);
		
  }

editLocationmaster(data) {
	return this._baseProxy.post(AppSettings.API_MASTER + AppSettings.EDITLOCATIONMASTER ,
	  data,
	  {})
	  .map(res => res);
}

getHolidaymaster(){
	return this._baseProxy.get(AppSettings.API_MASTER + AppSettings.GETALLHOLIDAYMASTER);
}

createHolidaymaster(data) {
	return this._baseProxy.post(AppSettings.API_MASTER + AppSettings.ADDHOLIDAYMASTER ,
	  data,
	  {})
	  .map(res => res);
  }

deleteHolidaymaster(id) {
	return this._baseProxy.delete(AppSettings.API_MASTER + AppSettings. DELETEHOLIDAYMASTER + "/"+ id);
		
  }

editHolidaymaster(data) {
	return this._baseProxy.post(AppSettings.API_MASTER + AppSettings.EDITHOLIDAYMASTER ,
	  data,
	  {})
	  .map(res => res);
}


getWeekendmaster(){
	return this._baseProxy.get(AppSettings.API_MASTER + AppSettings.GETALLWEEKEND);
}

createWeekendmaster(data) {
	return this._baseProxy.post(AppSettings.API_MASTER + AppSettings.ADDWEEKEND,
	  data,
	  {})
	  .map(res => res);
  }

deleteWeekendmaster(id) {
	return this._baseProxy.delete(AppSettings.API_MASTER + AppSettings.DELETEWEEKEND + "/"+ id);
		
  }
editWeekendmaster(data) {
	return this._baseProxy.post(AppSettings.API_MASTER + AppSettings.EDITWEEKEND,
	  data,
	  {})
	  .map(res => res);
}

getUsergroupmaster(){
	return this._baseProxy.get(AppSettings.API_MASTER + AppSettings.GETALLUSERGROUPMASTER);
}

createUsergroupmaster(data) {
	return this._baseProxy.post(AppSettings.API_MASTER + AppSettings.ADDUSERGROUPMASTER,
	  data,
	  {})
	  .map(res => res);
  }

deleteUsergroupmaster(id) {
	return this._baseProxy.delete(AppSettings.API_MASTER + AppSettings.DELETEUSERGROUPMASTER + "/"+ id);
		
  }
editUsergroupmaster(data) {
	return this._baseProxy.post(AppSettings.API_MASTER + AppSettings.EDITUSERGROUPMASTER,
	  data,
	  {})
	  .map(res => res);
}


getCodemaster(){
	return this._baseProxy.get(AppSettings.API_MASTER + AppSettings.GETALLCODEMASTER);
}

createCodemaster(data) {
	return this._baseProxy.post(AppSettings.API_MASTER + AppSettings.ADDCODEMASTER,
	  data,
	  {})
	  .map(res => res);
  }

deleteCodemaster(id) {
	return this._baseProxy.delete(AppSettings.API_MASTER + AppSettings.DELETECODEMASTER + "/"+ id);
		
  }
editCodemaster(data) {
	return this._baseProxy.post(AppSettings.API_MASTER + AppSettings.EDITCODEMASTER,
	  data,
	  {})
	  .map(res => res);
}


getProjectmaster(){
	return this._baseProxy.get(AppSettings.API_MASTER + AppSettings.GETALLPROJECTMASTER);
}

createProjectmaster(data) {
	return this._baseProxy.post(AppSettings.API_MASTER + AppSettings.ADDPROJECTMASTER,
	  data,
	  {})
	  .map(res => res);
  }

deleteProjectmaster(id) {
	return this._baseProxy.delete(AppSettings.API_MASTER + AppSettings.DELETEPROJECTMASTER + "/"+ id);
		
  }
editProjectmaster(data) {
	return this._baseProxy.post(AppSettings.API_MASTER + AppSettings.EDITPROJECTMASTER,
	  data,
	  {})
	  .map(res => res);
}

getMachinemaster(){
	return this._baseProxy.get(AppSettings.API_MASTER + AppSettings.GETALLMACHINEMASTER);
}

createMachinemaster(data) {
	return this._baseProxy.post(AppSettings.API_MASTER + AppSettings.ADDMACHINEMASTER,
	  data,
	  {})
	  .map(res => res);
  }

deleteMachinemaster(id) {
	return this._baseProxy.delete(AppSettings.API_MASTER + AppSettings.DELETEMACHINEMASTER + "/"+ id);
		
  }
editMachinemaster(data) {
	return this._baseProxy.post(AppSettings.API_MASTER + AppSettings.EDITMACHINEMASTER,
	  data,
	  {})
	  .map(res => res);
}

getUom(){
	return this._baseProxy.get(AppSettings.API_MASTER + AppSettings.GETALLUOMMASTER);
}

createUom(data) {
	return this._baseProxy.postResponse(AppSettings.API_MASTER + AppSettings.ADDUOMMASTER ,
	  data,
	  {})
	  .map(res => res);
  }

deleteUom(id) {
	return this._baseProxy.delete(AppSettings.API_MASTER + AppSettings.DELETEUOMMASTER + "/"+ id);
		
  }

editUom(data) {
	return this._baseProxy.post(AppSettings.API_MASTER + AppSettings.EDITUOMMASTER ,
	  data,
	  {})
	  .map(res => res);
}

getFramemaster(){
	return this._baseProxy.get(AppSettings.API_MASTER + AppSettings.GETALLFRAMEMASTER);
}

createFramemaster(data) {
	return this._baseProxy.post(AppSettings.API_MASTER + AppSettings.ADDFRAMEMASTER,
	  data,
	  {})
	  .map(res => res);
  }

deleteFramemaster(id) {
	return this._baseProxy.delete(AppSettings.API_MASTER + AppSettings.DELETEFRAMEMASTER + "/"+ id);
		
  }
editFramemaster(data) {
	return this._baseProxy.post(AppSettings.API_MASTER + AppSettings.EDITFRAMEMASTER,
	  data,
	  {})
	  .map(res => res);
}

getJutequalitypricemaster(){
	return this._baseProxy.get(AppSettings.API_MASTER + AppSettings.GETALLJUTEQUALITYPRICEMASTER);
}

createJutequalitypricemaster(data) {
	return this._baseProxy.post(AppSettings.API_MASTER + AppSettings.ADDJUTEQUALITYPRICEMASTER ,
	  data,
	  {})
	  .map(res => res);
  }

deleteJutequalitypricemaster(id) {
	return this._baseProxy.delete(AppSettings.API_MASTER + AppSettings.DELETEJUTEQUALITYPRICEMASTER + "/"+ id);
		
  }
editJutequalitypricemaster(data) {
	return this._baseProxy.post(AppSettings.API_MASTER + AppSettings.EDITJUTEQUALITYPRICEMASTER ,
	  data,
	  {})
	  .map(res => res);
}

getMenumaster(){
	return this._baseProxy.get(AppSettings.API_MASTER + AppSettings.GETALLMENUMASTER);
}

createMenumaster(data) {
	return this._baseProxy.post(AppSettings.API_MASTER + AppSettings.ADDMENUMASTER ,
	  data,
	  {})
	  .map(res => res);
  }

deleteMenumaster(id) {
	return this._baseProxy.delete(AppSettings.API_MASTER + AppSettings.DELETEMENUMASTER + "/"+ id);
		
  }
editMenumaster(data) {
	return this._baseProxy.post(AppSettings.API_MASTER + AppSettings.EDITMENUMASTER ,
	  data,
	  {})
	  .map(res => res);
}

getSubmenumaster(){
	return this._baseProxy.get(AppSettings.API_MASTER + AppSettings.GETALLSUBMENUMASTER);
}

createSubmenumaster(data) {
	return this._baseProxy.post(AppSettings.API_MASTER + AppSettings.ADDSUBMENUMASTER ,
	  data,
	  {})
	  .map(res => res);
  }

deleteSubmenumaster(id) {
	return this._baseProxy.delete(AppSettings.API_MASTER + AppSettings.DELETESUBMENUMASTER + "/"+ id);
		
  }
editSubmenumaster(data) {
	return this._baseProxy.post(AppSettings.API_MASTER + AppSettings.EDITSUBMENUMASTER ,
	  data,
	  {})
	  .map(res => res);
}

getMukammaster(){
	return this._baseProxy.get(AppSettings.API_MASTER + AppSettings.GETALLMUKAMMASTER);
}
getidMukammaster(id) {
	return this._baseProxy.get(AppSettings.API_MASTER + AppSettings.GETIdMUKAMMASTER + "/"+ id)
	
	}
	

	getitemofgroupmaster(){
		return this._baseProxy.get(AppSettings.API_MASTER + AppSettings.GETALLITEMOFGROUPMASTER);
	}


createMukammaster(data) {
	return this._baseProxy.post(AppSettings.API_MASTER + AppSettings.ADDMUKAMMASTER,
	  data,
	  {})
	  .map(res => res);
  }

deleteMukammaster(id) {
	return this._baseProxy.delete(AppSettings.API_MASTER + AppSettings.DELETEMUKAMMASTER + "/"+ id);
		
  }
editMukammaster(data) {
	return this._baseProxy.post(AppSettings.API_MASTER + AppSettings.EDITMUKAMMASTER,
	  data,
	  {})
	  .map(res => res);
}


getRoleMaster(){
	return this._baseProxy.get(AppSettings.API_MASTER + AppSettings.GETALLROLEMASTER);
}

createRoleMaster(data) {
	return this._baseProxy.post(AppSettings.API_MASTER + AppSettings.ADDROLEMASTER,
	  data,
	  {})
	  .map(res => res);
  }

deleteRoleMaster(id) {
	return this._baseProxy.delete(AppSettings.API_MASTER + AppSettings.DELETEROLEMASTER + "/"+ id);
		
  }
editRoleMaster(data) {
	return this._baseProxy.post(AppSettings.API_MASTER + AppSettings.EDITROLEMASTER ,
	  data,
	  {})
	  .map(res => res);
}

getScmindenttype(){
	return this._baseProxy.get(AppSettings.API_MASTER + AppSettings.GETALLSCMINDENTTYPEMASTER);
}

createScmindenttype(data) {
	return this._baseProxy.post(AppSettings.API_MASTER + AppSettings.ADDSCMINDENTTYPEMASTER ,
	  data,
	  {})
	  .map(res => res);
  }

deleteScmindenttype(id) {
	return this._baseProxy.delete(AppSettings.API_MASTER + AppSettings.DELETESCMINDENTTYPEMASTER + "/"+ id);
		
  }
editScmindenttype(data) {
	return this._baseProxy.post(AppSettings.API_MASTER + AppSettings.EDITSCMINDENTTYPEMASTER ,
	  data,
	  {})
	  .map(res => res);
}

getSelectionquality(){
	return this._baseProxy.get(AppSettings.API_MASTER + AppSettings.GETALLSELECTIONQUALITY);
}

createSelectionquality(data) {
	return this._baseProxy.post(AppSettings.API_MASTER + AppSettings.ADDSELECTIONQUALITY ,
	  data,
	  {})
	  .map(res => res);
  }

deleteSelectionquality(id) {
	return this._baseProxy.delete(AppSettings.API_MASTER + AppSettings.DELETESELECTIONQUALITY + "/"+ id);
		
  }
editSelectionquality(data) {
	return this._baseProxy.post(AppSettings.API_MASTER + AppSettings.EDITSELECTIONQUALITY ,
	  data,
	  {})
	  .map(res => res);
}


getShift(){
	return this._baseProxy.get(AppSettings.API_MASTER + AppSettings.GETALLSHIFTMASTER);
}

createShift(data) {
	return this._baseProxy.post(AppSettings.API_MASTER + AppSettings.ADDSHIFTMASTER ,
	  data,
	  {})
	  .map(res => res);
  }

deleteShift(id) {
	return this._baseProxy.delete(AppSettings.API_MASTER + AppSettings.DELETESHIFTMASTER + "/"+ id);
		
  }

editShift(data) {
	return this._baseProxy.post(AppSettings.API_MASTER + AppSettings.EDITSHIFTMASTER ,
	  data,
	  {})
	  .map(res => res);
}

getStatus(){
	return this._baseProxy.get(AppSettings.API_MASTER + AppSettings.GETALLSTATUSMASTER);
}

createStatus(data) {
	return this._baseProxy.post(AppSettings.API_MASTER + AppSettings.ADDSTATUSMASTER ,
	  data,
	  {})
	  .map(res => res);
  }

deleteStatus(id) {
	return this._baseProxy.delete(AppSettings.API_MASTER + AppSettings.DELETESTATUSMASTER + "/"+ id);
		
  }

editStatus(data) {
	return this._baseProxy.post(AppSettings.API_MASTER + AppSettings.EDITSTATUSMASTER ,
	  data,
	  {})
	  .map(res => res);
}


getSupplier(){
	return this._baseProxy.get(AppSettings.API_MASTER + AppSettings.GETALLSUPPLIERMASTER);
}

getidSuppliermaster(id) {
	return this._baseProxy.get(AppSettings.API_MASTER + AppSettings.GETIDSUPPLIERMASTER + "/"+ id)
	
}
	

createSupplier(data) {
	return this._baseProxy.postResponse(AppSettings.API_MASTER + AppSettings.ADDSUPPLIERMASTER ,
	  data,
	  {})
	  .map(res => res);
  }

deleteSupplier(id) {
	return this._baseProxy.delete(AppSettings.API_MASTER + AppSettings.DELETESUPPLIERMASTER + "/"+ id);
		
  }

editSupplier(data) {
	return this._baseProxy.post(AppSettings.API_MASTER + AppSettings.EDITSUPPLIERMASTER ,
	  data,
	  {})
	  .map(res => res);
}


getActivitymaster(){
	return this._baseProxy.get(AppSettings.API_MASTER + AppSettings.GETALLACTIVITYEMASTER);
}

createActivitymaster(data) {
	return this._baseProxy.post(AppSettings.API_MASTER + AppSettings.ADDACTIVITYEMASTER ,
	  data,
	  {})
	  .map(res => res);
  }

deleteActivitymaster(id) {
	return this._baseProxy.delete(AppSettings.API_MASTER + AppSettings.DELETEACTIVITYEMASTER + "/"+ id);
		
  }
editActivitymaster(data) {
	return this._baseProxy.post(AppSettings.API_MASTER + AppSettings.EDITACTIVITYEMASTER ,
	  data,
	  {})
	  .map(res => res);
}

getItemgroupmaster(){
	return this._baseProxy.get(AppSettings.API_MASTER + AppSettings.GETALLITEMGROUPMASTER);
}
getidItemgroupmaster(id) {
	return this._baseProxy.get(AppSettings.API_MASTER + AppSettings.GETIdITEMGROUPMASTER + "/"+ id)
	
  }
createItemgroupmaster(data) {
	return this._baseProxy.postResponse(AppSettings.API_MASTER + AppSettings.ADDITEMGROUPMASTER ,
	  data,
	  {})
	  .map(res => res);
  }

deleteItemgroupmaster(id) {
	return this._baseProxy.delete(AppSettings.API_MASTER + AppSettings.DELETEITEMGROUPMASTER + "/"+ id);
		
  }
editItemgroupmaster(data) {
	return this._baseProxy.post(AppSettings.API_MASTER + AppSettings.EDITITEMGROUPMASTER ,
	  data,
	  {})
	  .map(res => res);
}
getItemmaster(){
	return this._baseProxy.get(AppSettings.API_MASTER + AppSettings.GETALLITEMMASTER);
}
getIdItemmaster(id) {
	return this._baseProxy.get(AppSettings.API_MASTER + AppSettings.GETIdITEMMASTER + "/"+ id)
	
  }

createItemmaster(data) {
	return this._baseProxy.post(AppSettings.API_MASTER + AppSettings.ADDITEMMASTER ,
	  data,
	  {})
	  .map(res => res);
  }

deleteItemmaster(id) {
	return this._baseProxy.delete(AppSettings.API_MASTER + AppSettings.DELETEITEMMASTER + "/"+ id);
		
  }
editItemmaster(data) {
	return this._baseProxy.post(AppSettings.API_MASTER + AppSettings.EDITITEMMASTER ,
	  data,
	  {})
	  .map(res => res);
}

getTasktypemaster(){
	return this._baseProxy.get(AppSettings.API_MASTER + AppSettings.GETALLTASKTYPEMASTER);
}

createTasktypemaster(data) {
	return this._baseProxy.post(AppSettings.API_MASTER + AppSettings.ADDTASKTYPEMASTER,
	  data,
	  {})
	  .map(res => res);
  }

deleteTasktypemaster(id) {
	return this._baseProxy.delete(AppSettings.API_MASTER + AppSettings.DELETETASKTYPEMASTER + "/"+ id);
		
  }
editTasktypemaster(data) {
	return this._baseProxy.post(AppSettings.API_MASTER + AppSettings.EDITTASKTYPEMASTER,
	  data,
	  {})
	  .map(res => res);
}


getApprovermaster(){
	return this._baseProxy.get(AppSettings.API_MASTER + AppSettings.GETALLAPPROVERMASTER);
}

createApprovermaster(data) {
	return this._baseProxy.post(AppSettings.API_MASTER + AppSettings.ADDAPPROVERMASTER,
	  data,
	  {})
	  .map(res => res);
  }

deleteApprovermaster(id) {
	return this._baseProxy.delete(AppSettings.API_MASTER + AppSettings.DELETEAPPROVERMASTER + "/"+ id);
		
  }
editApprovermaster(data) {
	return this._baseProxy.post(AppSettings.API_MASTER + AppSettings.EDITAPPROVERMASTER,
	  data,
	  {})
	  .map(res => res);
}

getBankmaster(){
	return this._baseProxy.get(AppSettings.API_MASTER + AppSettings.GETALLBANKMASTER);
}

createBankmaster(data) {
	return this._baseProxy.post(AppSettings.API_MASTER + AppSettings.ADDBANKMASTER,
	  data,
	  {})
	  .map(res => res);
  }

deleteBankmaster(id) {
	return this._baseProxy.delete(AppSettings.API_MASTER + AppSettings.DELETEBANKMASTER + "/"+ id);
		
  }
editBankmaster(data) {
	return this._baseProxy.post(AppSettings.API_MASTER + AppSettings.EDITBANKMASTER,
	  data,
	  {})
	  .map(res => res);
}
getBranchmaster(){
	return this._baseProxy.get(AppSettings.API_MASTER + AppSettings.GETALLBRANCHMASTER);
}

createBranchmaster(data) {
	return this._baseProxy.post(AppSettings.API_MASTER + AppSettings.ADDBRANCHMASTER,
	  data,
	  {})
	  .map(res => res);
  }

deleteBranchmaster(id) {
	return this._baseProxy.delete(AppSettings.API_MASTER + AppSettings.DELETEBRANCHMASTER + "/"+ id);
		
  }
editBranchmaster(data) {
	return this._baseProxy.post(AppSettings.API_MASTER + AppSettings.EDITBRANCHMASTER,
	  data,
	  {})
	  .map(res => res);
}

getLeavemaster(){
	return this._baseProxy.get(AppSettings.API_MASTER + AppSettings.GETALLLEAVEMASTER);
}

createLeavemaster(data) {
	return this._baseProxy.post(AppSettings.API_MASTER + AppSettings.ADDLEAVEMASTER,
	  data,
	  {})
	  .map(res => res);
  }

deleteLeavemaster(id) {
	return this._baseProxy.delete(AppSettings.API_MASTER + AppSettings.DELETELEAVEMASTER + "/"+ id);
		
  }
editLeavemaster(data) {
	return this._baseProxy.post(AppSettings.API_MASTER + AppSettings.EDITLEAVEMASTER,
	  data,
	  {})
	  .map(res => res);
}
	
getStackbyItemStore(id) {
	return this._baseProxy.get(AppSettings.API_PURCHASE + id + AppSettings.GETSTACKBYITEMSTORE);
		
  }
  
  getStackbyItemWare(id) {
	return this._baseProxy.get(AppSettings.API_PURCHASE + id + AppSettings.GETSTACKBYITEMWARE);
		
  }
  
  getSupplierByBroker(id) {
	return this._baseProxy.get(AppSettings.API_PURCHASE + id + AppSettings.GETSUPPLIERBYBROKER);
		
  }
  
  
  
  getAllMasterBroker() {
	return this._baseProxy.get(AppSettings.API_MASTER + AppSettings.GETALLBROKER);
		
  }
  
  editBrokermaster(data) {
	return this._baseProxy.post(AppSettings.API_MASTER + AppSettings.UPDATEBROKER,
	  data,
	  {})
	  .map(res => res);
}

 createBrokermaster(data) {
	return this._baseProxy.postResponse(AppSettings.API_MASTER + AppSettings.CREATEBROKER,
	  data,
	  {})
	  .map(res => res);
}

deleteBrokermaster(brokerId) {
	return this._baseProxy.delete(AppSettings.API_MASTER + AppSettings.DELETEBROKER + "/"+ brokerId);
		
}
getidBrokermaster(brokerId) {
	return this._baseProxy.get(AppSettings.API_MASTER + AppSettings.GETIdBROKER + "/"+ brokerId)
	
  }
	getAllpricemaster(){
		return this._baseProxy.get(AppSettings.API_MASTER + AppSettings.GETALLPRICEMASTER);
	}
	
	
	createPricemaster(data) {
		return this._baseProxy.post(AppSettings.API_MASTER + AppSettings.ADDPRICEMASTER,
			data,
			{})
			.map(res => res);
		}
	
	deletePricemaster(priceId) {
		return this._baseProxy.delete(AppSettings.API_MASTER + AppSettings.DELETEPRICEMASTER + "/"+ priceId);
			
		}
	editPricemaster(data) {
		return this._baseProxy.post(AppSettings.API_MASTER + AppSettings.EDITPRICEMASTER ,
			data,
			{})
			.map(res => res);
	}  
  getFilteritemgroupmaster(){
		return this._baseProxy.get(AppSettings.API_MASTER + AppSettings.GETFILTERITEMGROUPMASTER);
	}
	getidItemmaster(id) {
		return this._baseProxy.get(AppSettings.API_MASTER + AppSettings.GETITEMMASTERID + "/"+ id)
	}
		
	getChalanBySupplier(id) {
	return this._baseProxy.get(AppSettings.API_PURCHASE + AppSettings.GETMRCHALANBYSUP + id);
	}
	
	getMrChalanBySupplier(id) {
	return this._baseProxy.get(AppSettings.API_PURCHASE + AppSettings.GETMRCHALANBYSUP + id);
	}

//SECURITY
supplierMAsterdata(){
	return this._baseProxy.get(AppSettings.API_SECURITY + AppSettings.SUPPLIERMASTERDATA);
}
createStoreentry(data) {
	return this._baseProxy.postResponse(AppSettings.API_SECURITY + AppSettings.ADDSTOREENTRY,
		data,
		{})
		.map(res => res);
	}
	getSuppliername(suppName) {
		return this._baseProxy.get(AppSettings.API_SECURITY + AppSettings.SUPPLIERMASTERNAME+ "/"+ suppName)
	}
	getSupplierid (suppCode)  {
		return this._baseProxy.get(AppSettings.API_SECURITY + AppSettings.SUPPLIERMASTERCODE + "/"+ suppCode)
	}

	getPallno ()  {
		return this._baseProxy.get(AppSettings.API_SECURITY + AppSettings.PONOALLDATA)
	}
	getUomall ()  {
		return this._baseProxy.get(AppSettings.API_SECURITY + AppSettings.UOMALLDATA)
	}
	getSearchstore (fromDate,toDate)  {
		return this._baseProxy.get(AppSettings.API_SECURITY + AppSettings.SEARCHSTORE + "/"+ fromDate + "/"+ toDate)
	}
getChallanno (challanNo,suppCode)  {
	return this._baseProxy.get(AppSettings.API_SECURITY + AppSettings.CHALLANNO + "/"+ challanNo + "/"+ suppCode)
}
getStoreentryById(hdrId)  {
	return this._baseProxy.get(AppSettings.API_SECURITY + AppSettings.GATEALLSTOREENTRYHDRBYID + "/"+ hdrId)
}

updateStoreEntry(data) {
	return this._baseProxy.postResponse(AppSettings.API_SECURITY + AppSettings.UPDATESTOREENTRY,
		data,
		{})
		.map(res => res);
}
outStoreEntry(data) {
		return this._baseProxy.postResponse(AppSettings.API_SECURITY + AppSettings.OUTSTOREENTRY,
			data,
			{})
			.map(res => res);
}
grtApprovedBySuppcode (suppCode)  {
	return this._baseProxy.get(AppSettings.API_SECURITY + AppSettings.GETAPPROVEDBYSUPPCODE + "/"+ suppCode)
}
grtApprovedBySuppname (suppName)  {
	return this._baseProxy.get(AppSettings.API_SECURITY + AppSettings.GETAPPROVEDBYSUPPNAME + "/"+ suppName)
}
getAllstoreItemGroups ()  {
	return this._baseProxy.get(AppSettings.API_SECURITY + AppSettings.GETALLSTOREITEMGROUPS)
}

//finishingsale

createFinishingSale(data) {
	return this._baseProxy.post(AppSettings.API_SECURITY + AppSettings.ADDFINISHINGSALE,
		data,
		{})
		.map(res => res);
	}
	getFinishingSaleChallanno (challanNo)  {
		return this._baseProxy.get(AppSettings.API_SECURITY + AppSettings.FINISHINGSALECHALLANNO + "/"+ challanNo)
	}
	getAllselectionqulity ()  {
		return this._baseProxy.get(AppSettings.API_SECURITY + AppSettings.ALLSELECTIONQULITY)
	}

updateFinishingSale(data) {
		return this._baseProxy.post(AppSettings.API_SECURITY + AppSettings.UPDATEFINISHINGSALE,
			data,
			{})
			.map(res => res);
}
outFinishingSale(data) {
			return this._baseProxy.post(AppSettings.API_SECURITY + AppSettings.OUTFINISHINGSALE,
				data,
				{})
				.map(res => res);
}
getSearchFinishingSale (fromDate,toDate)  {
	return this._baseProxy.get(AppSettings.API_SECURITY + AppSettings.FINISHINGSALESEARCHCHALLANNO  + "/"+ fromDate + "/"+ toDate)
}
//juteentry
getJuteentrySupplier ()  {
	return this._baseProxy.get(AppSettings.API_SECURITY + AppSettings.GETJUTEENTRYSUPPLIER)
}
getJutelineitemBypono (pono)  {
	return this._baseProxy.get(AppSettings.API_SECURITY + AppSettings.GETJUTEPOLINEITEMBYNO + "/"+ pono)
}
getAlljutequlity ()  {
	return this._baseProxy.get(AppSettings.API_SECURITY + AppSettings.GETALLJUTEQUALITY)
}
createJuteentry(data) {
	return this._baseProxy.postResponse(AppSettings.API_SECURITY + AppSettings.ADDJUTEENTRY,
		data,
		{})
		.map(res => res);
}
getJuteChallanno (challanNo,suppName)  {
	return this._baseProxy.get(AppSettings.API_SECURITY + AppSettings.JUTEENTRYCHALLANNO + "/"+ challanNo + "/"+ suppName)
}
getJuteentryById(id)  {
	return this._baseProxy.get(AppSettings.API_SECURITY + AppSettings.GATEALLJUTEENTRYHDRBYID + "/"+ id)
}
updateJuteEntry(data) {
	return this._baseProxy.postResponse(AppSettings.API_SECURITY + AppSettings.UPDATEJUTEENTRY,
		data,
		{})
		.map(res => res);
}
outJuteEntry(data) {
		return this._baseProxy.postResponse(AppSettings.API_SECURITY + AppSettings.OUTJUTEENTRY,
			data,
			{})
			.map(res => res);
}
getSearchJuteentry (fromDate,toDate)  {
	return this._baseProxy.get(AppSettings.API_SECURITY + AppSettings.JUTEALLJUTEENTRYHDRBYDATE  + "/"+ fromDate + "/"+ toDate)
}
getPno (poId)  {
	return this._baseProxy.get(AppSettings.API_SECURITY + AppSettings.PONODATA + "/"+ poId)
}
getJutePno (poId)  {
	return this._baseProxy.get(AppSettings.API_SECURITY + AppSettings.JUTEPONODATA + "/"+ poId)
}

getJutePosupplierBypono (id)  {
	return this._baseProxy.get(AppSettings.API_SECURITY + AppSettings.JUTEPOSUPPLIERBYPONO + "/"+ id)
}



getStorePosupplierBypono (id)  {
	return this._baseProxy.get(AppSettings.API_SECURITY + AppSettings.STOREPOSUPPLIERBYPONO + "/"+ id)
}


getStoreEntryByRange(startDate,endDate)  {
	return this._baseProxy.get(AppSettings.API_SECURITY + AppSettings.SEARCHSTOREENTRYRANGE + "/"+ startDate +"/"+endDate)
}


getJuteEntryByRange(startDate,endDate)  {
	return this._baseProxy.get(AppSettings.API_SECURITY + AppSettings.SEARCHJUTEENTRYRANGE + "/"+ startDate +"/"+endDate)
}

getAllFinancialyear ()  {
	return this._baseProxy.get(AppSettings.API_SECURITY + AppSettings.GETALLFINANCIALYEAR)
}

getMukamByName(mukam) {
	return this._baseProxy.get(AppSettings.API_MASTER + AppSettings.GETMUKAMBYNAME + "/"+ mukam)
	
}
	getBrokerAndSupplierCode(suppCode) {
		return this._baseProxy.get(AppSettings.API_SECURITY + AppSettings.BROKERANDSUPPLIERMASTERCODE+ "/"+ suppCode)
}
getVehicleById(id){
	return this._baseProxy.get(AppSettings.API_PURCHASE + id + AppSettings.GETVEHICLEBYID);
}
// getHieracymaster(id){
// 	return this._baseProxy.get(AppSettings.API_HIERARCY + AppSettings.GETALLUSERHIERARCY + "/" + id);
// }
	
// getUsermaster(){
// 	return this._baseProxy.get(AppSettings.API_HIERARCY + AppSettings.GETALLUSERMASTER);
// }


	//callmanagement

	getAllTicketCategory(){
		return this._baseProxy.get(AppSettings.API_CALL + AppSettings.GETALLCAT);
	}
	
	getAllTicketSubCategory(){
		return this._baseProxy.get(AppSettings.API_CALL + AppSettings.GETALLSUBCAT);
	}
	
	getAllTicketSeverity(){
		return this._baseProxy.get(AppSettings.API_CALL + AppSettings.GETALLSEVERITY);
	}

	getSubCategoryByTicketCat(id){
		return this._baseProxy.get(AppSettings.API_CALL +'admin/'+id+ AppSettings.GETALLSUBCATBYCAT);
	}

	getAsigngrpBySubCat(id){
		return this._baseProxy.get(AppSettings.API_CALL +'admin/'+id+ AppSettings.GETASIGNYGRPBYSUBCAT);
	}

	getSeverityById(id){
		return this._baseProxy.get(AppSettings.API_CALL +'admin/'+id+ AppSettings.GETSEVERITYBYID);
	}

	createNewTicket(data) {
  	var theaders = new Headers();
  	theaders.append('Content-Type', 'application/json');
	
	return this._baseProxy.post(AppSettings.API_CALL + AppSettings.CREATENEWTICKET ,
  		data,
  		{
  			headers: theaders	
  		})
  		.map(res => res);
	}
	
	addUpdateTicketCategory(data) {
  	var theaders = new Headers();
  	theaders.append('Content-Type', 'application/json');
	
	return this._baseProxy.post(AppSettings.API_CALL + AppSettings.ADDUPDATECAT ,
  		data,
  		{
  			headers: theaders	
  		})
  		.map(res => res);
	}
	
	
	addUpdateTicketSubCategory(data) {
  	var theaders = new Headers();
  	theaders.append('Content-Type', 'application/json');
	
	return this._baseProxy.post(AppSettings.API_CALL + AppSettings.ADDUPDATESUBCAT ,
  		data,
  		{
  			headers: theaders	
  		})
  		.map(res => res);
	}



}
