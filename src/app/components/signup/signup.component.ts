import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import {MatSnackBar} from '@angular/material';
import { AuthService } from '@app/services';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit {

  signupsuccess = false;
  submitting: boolean;
  constructor(private authService: AuthService,
              private router: Router , public snackBar: MatSnackBar) { }

  ngOnInit() {
  }

  signUp(name: string, rollno: string, password: string, repassword: string) {
    if (name && rollno && password && repassword) {
      if (isNaN(rollno as any)) {
        this.snackBar.open('Roll number must be a number.');
        return;
      }
      if (password === repassword) {
        this.submitting = true;
        this.authService.signUp(name, rollno, password)
          .subscribe(s => {
            if (s === 200) {
              this.signupsuccess = true;
            } else if (s === 401) {
              this.snackBar.open('User already exists.');
            } else {
              this.snackBar.open('Oops! Some error occured.', 'Retry')
                  .onAction().subscribe(_ => this.signUp(name, rollno, password, repassword));
            }
            this.submitting = false;
          });
        } else {
          this.snackBar.open('Passwords do not match.');
        }
      } else {
        this.snackBar.open('Please fill all the fields.');
      }
  }

}
