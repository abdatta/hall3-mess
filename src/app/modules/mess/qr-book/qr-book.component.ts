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
    const data = this.data.split('\u200B');
    this.rollno = data.shift();

    this.loading = true;
    this.dishesService.getSomedaysDishes(moment().format('dddd'))
        .subscribe(dishes => {
          this.dishes = dishes.filter(dish => {
            if (data.includes(dish.short_id)) {
              dish.quantity = +data[data.indexOf(dish.short_id) + 1];
              return true;
            }
            return false;
          });
          this.loading = false;
        });
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
                  console.log(token);
                  this.dialogRef.close();
                });
          } else if (s === 401) {
            pass.focus();
            this.snackBar.open('Incorrect Username or Password');
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
