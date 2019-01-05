import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { DishModel } from '@app/models/dish.model';

@Injectable({
  providedIn: 'root'
})
export class DishesService {

  constructor(private http: HttpClient) { }

  getSomedaysDishes(day: string): Observable<DishModel[]> {
    return this.http.get<DishModel[]>('/api/dishes/' + day.toLowerCase())
      .pipe(catchError(this.handleError));
  }

  getAllDishes(): Observable<DishModel[]> {
    return this.http.get<DishModel[]>('/api/dishes/all')
      .pipe(catchError(this.handleError));
  }

  updateDish(dish: DishModel): Observable<DishModel> {
    return this.http.put<DishModel>('/api/dishes/update/' + dish._id, dish)
      .pipe(catchError(this.handleError));
  }

  handleError(error: any): Observable<any> {
    return throwError(error.status || error.message || error);
  }
}
