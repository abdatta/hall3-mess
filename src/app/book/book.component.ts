import { Component, OnInit } from '@angular/core';
import { DishesService } from '@app/services';
import { DishModel } from '@app/models';

@Component({
  selector: 'app-book',
  templateUrl: './book.component.html',
  styleUrls: ['./book.component.css']
})
export class BookComponent implements OnInit {

  // sample dishes for extras
  dishes: DishModel[];

  constructor(private dishesService: DishesService) { }

  ngOnInit() {
    this.dishesService.getTodaysDishes()
      .subscribe(dishes => {
        this.dishes = dishes;
        dishes.forEach(dish => dish.quantity = 0);
      });
  }

  changeQuantity(i: number, q: number) {
    this.dishes[i].quantity += q;
    if (this.dishes[i].quantity < 1) {
      this.dishes[i].quantity = 1;
    }
  }

  resetQuantity(i: number) {
    this.dishes[i].quantity = 1;
  }

}
