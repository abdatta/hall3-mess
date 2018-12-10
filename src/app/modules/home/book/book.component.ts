import { Component, OnInit } from '@angular/core';
import { DishesService, TokensService } from '@app/services';
import { DishModel } from '@app/models';
import { Router, ActivatedRoute } from '@angular/router';
import { MatSnackBar } from '@angular/material';
import { MatDialog } from '@angular/material';
import { QRDialogComponent } from '@home/qr-dialog/qr-dialog.component';
import { AuthService } from '@app/services';
import * as moment from 'moment';

@Component({
  selector: 'app-book',
  templateUrl: './book.component.html',
  styleUrls: ['./book.component.css']
})
export class BookComponent implements OnInit {

  user: string;
  dishes: DishModel[];
  loading: boolean;
  submitting: boolean;
  slot: ('Breakfast' | 'Lunch' | 'Dinner');

  constructor(private router: Router,
              private qrdialog: MatDialog,
              private snackBar: MatSnackBar,
              private authService: AuthService,
              private dishesService: DishesService,
              private tokensService: TokensService) { }

  ngOnInit() {
    this.loading = true;

    this.authService.getUser()
      .then(user => this.user = user.rollno);

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

  showQR(selected: boolean[]) {
    const dishes = this.dishes && this.dishes.filter((_, i) => selected[i]);

    if (dishes && dishes.length) {
      const qrdata =
        [this.user, ...dishes.map(dish => `${dish.short_id}\u200B${dish.quantity}`)].join('\u200B');

      this.qrdialog.open(QRDialogComponent, {
        width: '95%',
        maxWidth: '450px',
        data: qrdata
      });
    } else {
      this.snackBar.open('No dish is selected.');
    }

  }

}
