import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

import { TokenModel, DishModel } from '@app/models';
import { AuthService } from '@app/services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class TokensService {

  constructor(private http: HttpClient,
              private authService: AuthService) { }

  getTokens(): Observable<TokenModel[]> {
    return this.http.get<TokenModel[]>('/api/tokens/user')
      .pipe(catchError(this.handleError));
  }

  bookToken(dishes: DishModel[]): Observable<TokenModel> {
    return this.http.post<TokenModel>('/api/tokens/book', { dishes: dishes })
      .pipe(
        map((token: TokenModel) => {
          this.authService.checkMess().then(mess => {
            if (mess) {
              this.authService.logout();
            }
          });
          return token;
        }),
        catchError(this.handleError)
      );
  }

  getLatestTokens(): Observable<TokenModel[]> {
    return this.http.get<TokenModel[]>('/api/tokens')
      .pipe(catchError(this.handleError));
  }

  handleError(error: any): Observable<any> {
    return throwError(error.status || error.message || error);
  }
}
