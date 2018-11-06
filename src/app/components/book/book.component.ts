import { Component, OnInit } from '@angular/core';
import { DishesService, TokensService } from '@app/services';
import { DishModel } from '@app/models';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material';

@Component({
  selector: 'app-book',
  templateUrl: './book.component.html',
  styleUrls: ['./book.component.css']
})
export class BookComponent implements OnInit {

  dishes: DishModel[];
  loading: boolean;

  constructor(private router: Router,
              private snackBar: MatSnackBar,
              private dishesService: DishesService,
              private tokensService: TokensService) { }

  ngOnInit() {
    this.loading = true;
    this.dishesService.getTodaysDishes()
      .subscribe(dishes => {
        this.dishes = dishes.filter(dish => !dish.prebookable);
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
      },
      error => {
        if (error === 400) {
          this.snackBar.open('Invalid Request', null, { duration: 1600 });
        } else {
          this.snackBar.open('Oops! Some error occured', 'Retry', { duration: 1600 })
            .onAction().subscribe(_ => this.book());
        }
      });
  }

}
