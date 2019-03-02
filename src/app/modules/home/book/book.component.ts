import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { DishesService } from '@app/services';
import { DishModel } from '@app/models';
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
  prebook = false;

  @ViewChild('logo')
  logoElement: ElementRef;

  constructor(private qrdialog: MatDialog,
              private snackBar: MatSnackBar,
              private authService: AuthService,
              private dishesService: DishesService) { }

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
        if (error === 999) {
          this.snackBar.open('We have no offline data at the moment. Please come online to load some data.');
        } else {
          this.snackBar.open('Oops! Some error occured. Please refresh the page.');
        }
        this.loading = false;
      });
  }

  showQR(selected: boolean[]) {
    const dishes = this.dishes && this.dishes.filter((_, i) => selected[i]);

    if (dishes && dishes.length) {
      const qrdata =
        [this.user, ...dishes.map(dish => `${dish.short_id}\u200B${dish.quantity}`)].join('\u200B');

      this.qrdialog.open(QRDialogComponent, {
        width: '95%',
        maxWidth: '450px',
        data: { qrdata, qrlogo: this.logoElement.nativeElement }
      })
      .afterClosed().subscribe(() => selected.forEach((sel, i) => selected[i] = false));
    } else {
      this.snackBar.open('No dish is selected.');
    }
  }

}
