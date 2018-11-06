import { Component, OnInit } from '@angular/core';
import { DishesService, TokensService } from '@app/services';
import { DishModel } from '@app/models';
import { Router } from '@angular/router';

@Component({
  selector: 'app-book',
  templateUrl: './book.component.html',
  styleUrls: ['./book.component.css']
})
export class BookComponent implements OnInit {

  // sample dishes for extras
  dishes: DishModel[];
  loading: boolean;

  constructor(private router: Router,
              private dishesService: DishesService,
              private tokensService: TokensService) { }

  ngOnInit() {
    this.loading = true;
    this.dishesService.getTodaysDishes()
      .subscribe(dishes => {
        this.dishes = dishes;
        dishes.forEach(dish => {
          dish.quantity = 0;
          dish['selected'] = false;
        });
        this.loading = false;
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

  book() {
    this.tokensService
      .bookToken(this.dishes.filter(dish => dish['selected']))
      .subscribe(token => {
        if (token) {
          this.router.navigateByUrl('/home/history?show=' + token._id);
        } // TODO: to handle cases of failure
      });
  }

}
