import { Component, OnInit, OnDestroy } from '@angular/core';
import { DishesService, TokensService, AuthService } from '@app/services';
import { DishModel } from '@app/models';
import { Router } from '@angular/router';
import { MatSnackBar, MatDialogRef } from '@angular/material';
import * as moment from 'moment';

@Component({
  selector: 'app-book',
  templateUrl: './book.component.html',
  styleUrls: ['./book.component.css']
})
export class BookComponent implements OnInit, OnDestroy {

  dishes: DishModel[];
  loading: boolean;
  submitting: boolean;
  slot: ('Breakfast' | 'Lunch' | 'Dinner');

  constructor(private router: Router,
              private snackBar: MatSnackBar,
              private dialogRef: MatDialogRef<BookComponent>,
              private dishesService: DishesService,
              private tokensService: TokensService,
              private authService: AuthService) { }

  ngOnInit() {
    this.loading = true;

    this.dishesService.getSomedaysDishes(moment().format('dddd'))
      .subscribe(dishes => {
        this.dishes = dishes.filter(dish => !dish.prebookable);
        this.loading = false;
      },
      error => {
        if (error === 999) {
          this.snackBar.open('We have no offline data at the moment. Please come online to load some data.');
        } else {
          this.snackBar.open('Oops! Some error occured. Please refresh the page.');
        }
        this.loading = false;
      });
  }

  book(selected: boolean[]) {
    const dishes = this.dishes && this.dishes.filter((_, i) => selected[i]);

    if (dishes && dishes.length) {
      this.submitting = true;
      this.tokensService.bookToken(dishes)
        .subscribe(_ => {
          this.snackBar.open('Dishes booked successfully');
          this.submitting = false;
          this.dialogRef.close();
        },
        error => {
          if (error === 400) {
            this.snackBar.open('Invalid Request');
          } else if (error === 999) {
            this.snackBar.open('You are OFFLINE. Booking only works online.');
          } else {
            this.snackBar.open('Oops! Some error occured', 'Retry')
              .onAction().subscribe(_ => this.book(selected));
          }
          this.loading = false;
          this.submitting = false;
        });
    } else {
        this.snackBar.open('No dish is selected.');
    }
  }

  cancel() {
    this.dialogRef.close();
    this.snackBar.open('No dishes booked');
  }

  ngOnDestroy() {
    this.authService.logout(); // logout the user when the dialog closes
  }
}
