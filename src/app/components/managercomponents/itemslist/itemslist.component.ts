import { Component, OnInit } from '@angular/core';
import { DishesService, TokensService } from '@app/services';
import { DishModel } from '@app/models';
import { Router , NavigationEnd } from '@angular/router';
import { MatSnackBar } from '@angular/material';
import { AuthService } from '@app/services';

@Component({
  selector: 'app-itemslist',
  templateUrl: './itemslist.component.html',
  styleUrls: ['./itemslist.component.css']
})
export class ItemslistComponent implements OnInit {

  dishes: DishModel[];
  loading: boolean;
  submitting: boolean;
  currentUrl: string;

  constructor(private router: Router,
              private snackBar: MatSnackBar,
              private dishesService: DishesService,
              private tokensService: TokensService,
              private authService: AuthService) { router.events.subscribe((_: NavigationEnd) => this.currentUrl = _.url); }

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
          this.submitting = false;
          this.authService.logout(this.currentUrl);
        },
        error => {
          if (error === 400) {
            this.snackBar.open('Invalid Request');
          } else {
            this.snackBar.open('Oops! Some error occured', 'Retry')
              .onAction().subscribe(_ => this.book());
          }
          this.submitting = false;
        });
    } else {
        this.snackBar.open('No dish is selected.');
    }

  }

}
