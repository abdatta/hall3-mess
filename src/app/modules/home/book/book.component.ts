import { Component, OnInit } from '@angular/core';
import { DishesService, TokensService } from '@app/services';
import { DishModel } from '@app/models';
import { Router, ActivatedRoute } from '@angular/router';
import { MatSnackBar } from '@angular/material';
import { AuthService } from '@app/services';
import * as moment from 'moment';

@Component({
  selector: 'app-book',
  templateUrl: './book.component.html',
  styleUrls: ['./book.component.css']
})
export class BookComponent implements OnInit {

  dishes: DishModel[];
  loading: boolean;
  submitting: boolean;
  slot: ('Breakfast' | 'Lunch' | 'Dinner');

  constructor(private router: Router,
              private snackBar: MatSnackBar,
              private dishesService: DishesService,
              private tokensService: TokensService) { }

  ngOnInit() {
    this.loading = true;
    this.dishesService.getSomedaysDishes(moment().format('dddd'))
      .subscribe(dishes => {
        this.dishes = dishes.filter(dish => !dish.prebookable);
        dishes.forEach(dish => {
          dish.quantity = 0;
          dish['selected'] = false;
        });
        this.loading = false;
      },
      error => {
        this.snackBar.open('Oops! Some error occured. Please refresh the page.');
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
    const dishes = this.dishes && this.dishes.filter(dish => dish['selected']);
    if (dishes && dishes.length) {
      this.submitting = true;
      this.tokensService.bookToken(dishes)
        .subscribe(token => {
          this.router.navigateByUrl('/home/history?show=' + token._id);
          this.submitting = false;
        },
        error => {
          if (error === 400) {
            this.snackBar.open('Invalid Request');
            this.loading = false;
          } else {
            this.snackBar.open('Oops! Some error occured', 'Retry')
              .onAction().subscribe(_ => this.book());
            this.loading = false;
          }
          this.submitting = false;
        });
    } else {
        this.snackBar.open('No dish is selected.');
    }
  }

}
