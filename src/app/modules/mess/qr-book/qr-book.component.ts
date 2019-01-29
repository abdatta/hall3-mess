import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatSnackBar} from '@angular/material';
import { DishModel } from '@app/models';
import { DishesService, AuthService, TokensService } from '@app/services';
import * as moment from 'moment';

@Component({
  selector: 'app-qr-book',
  templateUrl: './qr-book.component.html',
  styleUrls: ['./qr-book.component.css']
})
export class QRBookComponent implements OnInit {

  rollno: string;
  dishes: DishModel[] = [];
  loading: boolean;

  constructor(private dialogRef: MatDialogRef<QRBookComponent>,
              private dishesService: DishesService,
              private authService: AuthService,
              private tokenService: TokensService,
              private snackBar: MatSnackBar,
              @Inject(MAT_DIALOG_DATA) public data: string) { }

  ngOnInit() {
    if (!this.isValidQR(this.data)) {
      this.snackBar.open('Invalid QR Code. Update your App and Try again.');
      this.dialogRef.close();
      return;
    }

    const data = this.data.split('\u200B');
    this.rollno = data.shift();

    this.loading = true;
    this.dishesService.getSomedaysDishes(moment().format('dddd'))
        .subscribe(dishes => {
          const data_ids = data.filter((d, i) => i % 2 === 0);
          const data_qty = data.filter((d, i) => i % 2 !== 0).map(q => +q);

          this.dishes = dishes.filter(dish => {
            if (data_ids.includes(dish.short_id)) {
              dish.quantity = data_qty[data_ids.indexOf(dish.short_id)];
              return true;
            }
            return false;
          });
          if (this.dishes.length === 0) {
            // TODO: Differentiate an actual invalid QR with one having no today's dishes
            this.snackBar.open('Invalid QR Code.');
            this.dialogRef.close();
          }
          this.loading = false;
        });
  }

  isValidQR(QRdata: string): boolean {
    const data = QRdata.split('\u200B');
    data.shift(); // remove the roll no at front

    if (data.length <= 0 || data.length % 2 !== 0) {
      return false;
    }

    // id should be of length 2 and qty should be a number
    return data.every((d, i) => i % 2 === 0 ? d.length === 2 : !isNaN(+d));
  }

  logInAndBook(pass) {
    const password = pass.value;
    if (password) {
      pass.blur();
      this.authService.logIn(this.rollno, password)
        .subscribe((s: number) => {
          if (s === 200) {
            this.tokenService.bookToken(this.dishes)
                .subscribe(token => {
                  this.snackBar.open('Dishes booked successfully');
                  this.dialogRef.close();
                },
                error => {
                  if (error === 400) {
                    this.snackBar.open('Invalid Request');
                  } else if (error === 999) {
                    this.snackBar.open('You are OFFLINE. Booking only works online.');
                  } else {
                    this.snackBar.open('Oops! Some error occured', 'Retry')
                      .onAction().subscribe(_ => this.logInAndBook(pass));
                  }
                });
          } else if (s === 401) {
            pass.focus();
            this.snackBar.open('Incorrect Username or Password');
          } else if (s === 999) {
            this.snackBar.open('You are OFFLINE. Come online and try again.');
          } else {
            this.snackBar.open('Oops! Some error occured.', 'Retry')
                  .onAction().subscribe(_ => this.logInAndBook(pass));
          }
      });
    } else {
      this.snackBar.open('Please fill all the fields.');
    }
  }

}
