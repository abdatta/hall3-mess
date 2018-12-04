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
  request_in: string;

  constructor(private router: Router,
              private snackBar: MatSnackBar,
              private dishesService: DishesService,
              private tokensService: TokensService,
              private authService: AuthService,
              private route: ActivatedRoute) { }

  ngOnInit() {
    this.loading = true;
    this.route.queryParams
          .subscribe(param => {
            if (param.show) {
              this.request_in = param.show;
            }
          });
    this.dishesService.getTodaysDishes()
      .subscribe(dishes => {
        if (this.request_in === 'mess') {
          if (moment().format('HHmm') <= '1045') {
            this.slot = 'Breakfast';
          } else if ((moment().format('HHmm') > '1045') && (moment().format('HHmm') <= '1700')) {
            this.slot = 'Lunch';
          } else {this.slot = 'Dinner'; }
          this.dishes = dishes.filter(dish => dish.slot.includes(this.slot) && !dish.prebookable);
        } else {
          this.dishes = dishes.filter(dish => !dish.prebookable);
        }
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
      if (this.request_in !== 'mess') {
        this.submitting = true;
      } else {
        this.loading = true;
      }
      this.tokensService.bookToken(dishes)
        .subscribe(token => {
          if (token && this.request_in !== 'mess') {
            this.router.navigateByUrl('/home/history?show=' + token._id);
          } else if (token) {
            this.authService.logout(this.request_in);
          }
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