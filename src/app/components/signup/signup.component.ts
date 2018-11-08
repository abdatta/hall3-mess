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

  submitting: boolean;
  constructor(private authService: AuthService,
              private router: Router , public snackBar: MatSnackBar) { }

  ngOnInit() {
  }

  signUp(rollno: string, password: string, repassword: string) {
    if (rollno && password && repassword) {
      if (password === repassword) {
        this.submitting = true;
        this.authService.signUp(rollno, password)
          .subscribe(s => {
            if (s === 200) {
              this.router.navigateByUrl('/home');
              this.snackBar.open('Sign up successful! Please check your mail.');
            } else if (s === 401) {
              this.snackBar.open('User already exists.');
            } else {
              this.snackBar.open('Oops! Some error occured.', 'Retry')
                  .onAction().subscribe(_ => this.signUp(rollno, password, repassword));
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
