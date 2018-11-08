import { Component, OnInit } from '@angular/core';
import { DishesService, TokensService } from '@app/services';
import { DishModel } from '@app/models';
import { Router } from '@angular/router';
import * as moment from 'moment';
import { MatSnackBar } from '@angular/material';

@Component({
  selector: 'app-prebook',
  templateUrl: './prebook.component.html',
  styleUrls: ['./prebook.component.css']
})
export class PrebookComponent implements OnInit {

  dishes: DishModel[];
  loading: boolean;

  constructor(private router: Router,
              private snackBar: MatSnackBar,
              private dishesService: DishesService,
              private tokensService: TokensService) { }

  ngOnInit() {
    this.loading = true;
    this.dishesService.getSomedaysDishes(moment().add(1, 'd').format('dddd'))
      .subscribe(dishes => {
        this.dishes = dishes.filter(dish => dish.prebookable);
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

  prebook() {
    const dishes = this.dishes && this.dishes.filter(dish => dish['selected']);
    if (dishes && dishes.length) {
      this.tokensService
        .bookToken(dishes)
        .subscribe(token => {
          if (token) {
            this.router.navigateByUrl('/home/history?show=' + token._id);
          }
        },
        error => {
          if (error === 400) {
            this.snackBar.open('Invalid Request');
          } else {
            this.snackBar.open('Oops! Some error occured', 'Retry')
              .onAction().subscribe(_ => this.prebook());
          }
        });
      } else {
        this.snackBar.open('No dish is selected.');
      }
  }

}
