import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { DishModel } from '@app/models';
import * as moment from 'moment';

@Component({
  selector: 'app-dish-picker',
  templateUrl: './dish-picker.component.html',
  styleUrls: ['./dish-picker.component.css']
})
export class DishPickerComponent implements OnInit {

  @Input() title: string;
  @Input() submitText: string;
  @Input() loading: boolean;
  @Input() submitting: boolean;

  @Input('dishes')
  set setDishes(dishes: DishModel[]) {
    if (dishes) {
      dishes.forEach(dish => dish.quantity = dish.quantity || 0);
      this.selected = dishes.map(_ => false);
      this.dishes = dishes;
    }
  }

  dishes: DishModel[];
  selected: boolean[];
  slotnow: string;
  active: number;
  slots = ['Breakfast',
          'Lunch',
          'Dinner'];
  menu = {};

  @Output() submit = new EventEmitter<boolean[]>();

  constructor() { }

  ngOnInit() {
    if (moment().format('HHmm') <= '1045') {
      this.slotnow = 'Breakfast';
    } else if ((moment().format('HHmm') > '1045') && (moment().format('HHmm') <= '1700')) {
      this.slotnow = 'Lunch';
    } else {this.slotnow = 'Dinner'; }
  }

  resetQuantity(i: number) {
    this.dishes[i].quantity = 1;
  }

  changeQuantity(i: number, q: number) {
    this.dishes[i].quantity += q;
    if (this.dishes[i].quantity < 1) {
      this.dishes[i].quantity = 1;
    }
  }

}
