import { Component, OnInit } from '@angular/core';
import { DishesService, TokensService } from '@app/services';
import { DishModel } from '@app/models';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material';
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
        this.loading = false;
      },
      error => {
        this.snackBar.open('Oops! Some error occured. Please refresh the page.');
        this.loading = false;
      });
  }

  book(selected: boolean[]) {
    const dishes = this.dishes && this.dishes.filter((_, i) => selected[i]);

    if (dishes && dishes.length) {
      this.submitting = true;
      this.tokensService.bookToken(dishes)
        .subscribe(_ => {
          this.router.navigateByUrl('/mess/login');
          this.submitting = false;
        },
        error => {
          if (error === 400) {
            this.snackBar.open('Invalid Request');
            this.loading = false;
          } else {
            this.snackBar.open('Oops! Some error occured', 'Retry')
              .onAction().subscribe(_ => this.book(selected));
            this.loading = false;
          }
          this.submitting = false;
        });
    } else {
        this.snackBar.open('No dish is selected.');
    }
  }
}
