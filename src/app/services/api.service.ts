import { Injectable } from '@angular/core';
import { AuthService } from './auth/auth.service';
import { Observable } from 'rxjs/Observable';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/throw';

@Injectable()
export class ApiService {

  constructor(
    private http: HttpClient,
    private auth: AuthService) { }

  private get _authHeader(): string {
    return `Bearer ${localStorage.getItem('access_token')}`;
  }

  private _handleError(err: HttpErrorResponse | any) {
    const errorMsg = err.message || 'Error: Unable to complete request.';
    if (err.message && err.message.indexOf('No JWT present') > -1) {
      this.auth.login();
    }
    return Observable.throw(errorMsg);
  }

  /* 
    Put All API Calls Down Below 
  */

  //get all users from api
  getAllUsers() {
    return this.http.get('/api/getAllUsers', {
      headers: new HttpHeaders().set('Authorization', this._authHeader)
    })
      .catch(this._handleError);
  }

  getProducts() {
    return this.http.get('./assets/mock-data/products.json')
      .catch(this._handleError);
  }

  //get Books by name
  //q='science' is an optional param, if don't pass something, it will default load science books
  getBooks(q = 'science') {
    const googleUrl = `https://www.googleapis.com/books/v1/volumes?q=${q}&filter=paid-ebooks&printType=books&orderBy=newest&projection=full&maxResults=40&key=AIzaSyDJDuTh2FkoJ9w9aBbgL3YGZnJtcVGJgZQ`;
    return this.http.get(googleUrl)
      .catch(this._handleError);
  }
  SearchByISBN(isbn){
  var encodedURI = encodeURI("https://www.googleapis.com/books/v1/volumes?q=isbn:" + isbn +"&maxResults=1");
  return this.http.get(encodedURI)
      .catch(this._handleError);
}

}
