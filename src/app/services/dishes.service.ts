import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { DishModel } from '@app/models/dish.model';

@Injectable({
  providedIn: 'root'
})
export class DishesService {

  constructor(private http: HttpClient) { }

  getTodaysDishes(): Observable<DishModel[]> {
    // TODO: Handle errors
    return this.http.get<DishModel[]>('/api/dishes/today');
  }
}
