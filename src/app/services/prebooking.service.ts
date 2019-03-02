import { Injectable } from '@angular/core';
import { Observable, of, throwError } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { LocalStorage } from '@ngx-pwa/local-storage';
import { Network } from '@ngx-pwa/offline';

import { PrebookingModel } from '@app/models/prebooking.model';

import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class PrebookingService {

  constructor(private http: HttpClient,
              private localStorage: LocalStorage,
              private network: Network) { }

   prebook(dishes: PrebookingModel): Observable<PrebookingModel> {
    return this.http.post<PrebookingModel>('/api/prebooking/add', { dishes })
      .pipe(
        catchError(this.handleError)
      );
  }

  handleError(error: any): Observable<any> {
    if (error.status) {
      return of(error.status);
    }
    return throwError(error.message || error);
  }

}
