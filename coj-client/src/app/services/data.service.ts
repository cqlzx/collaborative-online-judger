import { Injectable } from '@angular/core';
import { Http, Headers, Response } from '@angular/http';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Observable } from 'rxjs/Rx';

import 'rxjs/add/operator/toPromise';


import { Problem } from '../models/problem.model';

@Injectable()
export class DataService {
  private _problemSource = new BehaviorSubject([]);
  constructor(private http: Http) { }

  getProblems(): Observable<Problem[]> {
    this.http.get('api/v1/problems')
      .toPromise()
      .then((res: Response) => {
        this._problemSource.next(res.json());
      })
      .catch(this.handleError);

      return this._problemSource.asObservable();
  }

  getProblem(id: number): Promise<Problem> {
    return this.http.get(`api/v1/problems/${id}`)
      .toPromise()
      .then((res: Response) => {
        return res.json();
      })
      .catch(this.handleError);
  }

  addProblem(newProblem: Problem)  {
    const header = new Headers({'content-type': 'application/json'});
    return this.http.post('api/v1/problems', newProblem, header)
      .toPromise()
      .then((res: Response) => {
        this.getProblems();
        return res.json();
      })
      .catch(this.handleError);
  }

  submitCode(code): Promise<any> {
    const header = new Headers({'content-type': 'application/json'});
    return this.http.post('api/v1/codes', code, header)
      .toPromise()
      .then((res: Response) => {
        // console.log(res);
        return res.json();
      })
      .catch(this.handleError);
  }

  private handleError(error: any): Promise<any> {
    console.log('An error occurs', error);
    return Promise.reject(error.body || error);
  }
}
