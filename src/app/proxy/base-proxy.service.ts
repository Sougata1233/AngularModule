import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/throw';

@Injectable()
export class BaseProxyService {

    constructor(public _http: Http) {}

    get(url: string): Observable<any> {
		return this._http.get(url)
			.map((res: Response) => res.json())
			.catch(this.handleError);
	}

	post(url: string, params: any, headers: any): Observable<any> {
		return this._http.post(url, params, {
			headers: headers
		})
		.map((res: Response) => res.json())
		.catch(this.handleError);
	}

	postResponse(url: string, params: any, headers: any): Observable<any> {
		return this._http.post(url, params, {
			headers: headers
		})
		.map((res: Response) => res)
		.catch(this.handleError);
	}
	
	
	postNoResponse(url: string, params: any, headers: any): Observable<any> {
		return this._http.post(url, params, {
			headers: headers
		})
		.map((res: Response) => res)
		.catch(this.handleError);
	}
	
	postCallback(url: string, params: any, headers: any): Observable<any> {
		return this._http.post(url, params, {
			headers: headers
		})
		.map((res: Response) => res.json())
		.catch(this.handleError);
	}
	
	put(url: string, params: any, headers: any): Observable<any> {
		return this._http.put(url, params, {
			headers: headers
		})
		.map((res: Response) => res.json())
		.catch(this.handleError);
	}

	delete(url: string): Observable<any> {
		return this._http.delete(url)
			.map((res: Response) => res.json())
			.catch(this.handleError);
	}
	
	deleteXml(url: string): Observable<any> {
		return this._http.delete(url)
			.map((res: Response) => res)
			.catch(this.handleError);
	}

	public handleError(error: any) {
		return Observable.throw(error);
	}

}
