import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { DishModel } from '@app/models/dish.model';

@Injectable({
  providedIn: 'root'
})
export class DishesService {

  constructor(private http: HttpClient) { }

  getTodaysDishes(): Observable<DishModel[]> {
    return this.http.get<DishModel[]>('/api/dishes/today')
      .pipe(catchError(this.handleError));
  }

  getSomedaysDishes(day: string): Observable<DishModel[]> {
    return this.http.get<DishModel[]>('/api/dishes/' + day.toLowerCase())
      .pipe(catchError(this.handleError));
  }

  handleError(error: any): Observable<any> {
    if (error.status) {
      return of(error.status);
    }
    return throwError(error.message || error);
  }
}
