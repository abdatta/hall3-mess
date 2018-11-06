import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { TokenModel, DishModel } from '@app/models';

@Injectable({
  providedIn: 'root'
})
export class TokensService {

  constructor(private http: HttpClient) { }

  getTokens(): Observable<TokenModel[]> {
    return this.http.get<TokenModel[]>('/api/tokens')
      .pipe(catchError(this.handleError));
  }

  bookToken(dishes: DishModel[]): Observable<TokenModel> {
    return this.http.post<TokenModel>('/api/tokens/book', { dishes: dishes })
      .pipe(catchError(this.handleError));
  }

  handleError(error: any): Observable<any> {
    return throwError(error.status || error.message || error);
  }
}
