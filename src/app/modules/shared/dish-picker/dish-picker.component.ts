import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { DishModel } from '@app/models';
import { DishesService } from '@app/services';

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
      dishes.sort((a: DishModel, b: DishModel) => b.frequency - a.frequency);
      dishes.forEach(dish => dish.quantity = dish.quantity || 0);
      this.selected = dishes.map(_ => false);
      this.dishes = dishes;
    }
  }

  dishes: DishModel[];
  selected: boolean[];
  active: number;
  slots = ['Breakfast',
          'Lunch',
          'Dinner'];

  @Output() submit = new EventEmitter<boolean[]>();

  constructor(public dishService: DishesService) { }

  ngOnInit() {
  }

  getSelectedCount() {
    return this.selected && this.selected.filter(_ => _).length;
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

  currentSlot() {
    return this.slots.indexOf(this.dishService.getSlot());
  }
}
