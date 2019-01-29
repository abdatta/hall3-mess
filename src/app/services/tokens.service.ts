import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError, Subject } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { Moment } from 'moment';
import { Network } from '@ngx-pwa/offline';

import { TokenModel, DishModel } from '@app/models';

@Injectable({
  providedIn: 'root'
})
export class TokensService {

  private _recentTokens: TokenModel[];
  recentTokens: Subject<TokenModel[]>;

  constructor(private http: HttpClient,
              private network: Network) {
    this._recentTokens = [];
    this.recentTokens = new Subject();
  }

  private setRecentTokens(tokens: TokenModel[]) {
    this._recentTokens = tokens;
    this.recentTokens.next(this._recentTokens);
    return tokens;
  }

  private updateRecentTokens(token: TokenModel) {
    this._recentTokens.unshift(token);
    this.recentTokens.next(this._recentTokens);
  }

  getTokens(): Observable<TokenModel[]> {
    return this.http.get<TokenModel[]>('/api/tokens/user')
      .pipe(catchError(this.handleError));
  }

  bookToken(dishes: DishModel[]): Observable<TokenModel> {
    return this.http.post<TokenModel>('/api/tokens/book', { dishes })
      .pipe(
        map((token: TokenModel) => {
          this.updateRecentTokens(token);
          return token;
        }),
        catchError(this.handleError)
      );
  }

  reduceDishesInToken(token: TokenModel, dish: DishModel): Observable<TokenModel> {
      return this.http.post<TokenModel>('/api/tokens/reduce/' + token._id, dish )
        .pipe(catchError(this.handleError));
  }

  getRecentTokens(): Observable<TokenModel[]> {
    return this.http.get<TokenModel[]>('/api/tokens')
      .pipe(
        map((response: TokenModel[]) => this.setRecentTokens(response)),
        catchError(this.handleError)
      );
  }

  getEditTokens(rollno: string): Observable<TokenModel[]> {
    return this.http.get<TokenModel[]>('/api/tokens/filter?rollno=' + rollno)
      .pipe(catchError(this.handleError));
  }

  downloadMessBill(from: Moment, to: Moment): Observable<{name: string, data: Blob}> {
    const billName = `Mess_Bill_${from.format('DDMMMYYYY')}_TO_${to.format('DDMMMYYYY')}`.toUpperCase() + '.xlsx';
    return this.http.get(
        `/api/tokens/bill?from=${encodeURIComponent(from.format())}&to=${encodeURIComponent(to.format())}`,
        {responseType: 'arraybuffer'}
      )
      .pipe(
        map(data => ({ name: billName, data: new Blob([data], {type: 'application/ms-excel'})})),
        catchError(this.handleError)
      );
  }

  handleError = (error: any): Observable<any> => {
    if (!this.network.online) {
      error.status = 999; // Custom Error Code for Offline Status
    }
    return throwError(error.status || error.message || error);
  }
}
