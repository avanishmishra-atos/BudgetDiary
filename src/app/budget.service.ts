import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';

export class Budget {
  paidBy: string;
  paidTo: string;
  expenseType: string;
  amount: number;
  paidDate: Date;
  remark: string;
}

@Injectable({
  providedIn: 'root'
})
export class BudgetService {

  constructor(private http: Http) { }

  /**
   * Method to extract user from store
   */
  getUsers() {
    return this.http.get('/api/users')
    .map((res) => { return res.json(); })
    .catch(this.handleError);
  }

  /**
   * Method to get services from store
   */
  getServices() {
    return this.http.get('/api/services')
    .map((res) => { return res.json(); })
    .catch(this.handleError);
  }

  /**
   * Method to get payment details
   */
  getPaymentDetails() {
    return this.http.get('/api/budgets')
    .map((res) => { return res.json(); })
    .catch(this.handleError);
  }

  /**
   * Method to add payment details
   * @param budget
   */
  addPaymentDetails(budget) {
    const headers = new Headers({ 'Content-Type': 'application/json' });
    const options = new RequestOptions({ headers: headers });
    return this.http.post('/api/add', budget, options)
      .map((res) => { return res.json(); })
      .catch(this.handleError)
  }

  /**
   * Method to handle error
   * @param error 
   */
  private handleError(error: any) {
    let errMsg = (error.message) ? error.message :
      error.status ? `${error.status} - ${error.statusText}` : 'Server error';
    console.error(errMsg);
    return errMsg;
  }
}
