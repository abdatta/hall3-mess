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

  submitted = false;
  error = '';
  noinput = '';
  constructor(private authService: AuthService,
              private router: Router , public snackBar: MatSnackBar) { }

  ngOnInit() {
  }

  openSnackBar() {
    this.snackBar.open( this.error , this.noinput , {
      duration: 2700,
    });
  }
  signUp(rollno: string, password: string, repassword: string) {
    if (password === repassword) {
      this.authService.signUp(rollno, password)
        .subscribe(s => {
          if (s === 200) {
            this.router.navigateByUrl('/home');
            this.error = 'Please Check your mail for first time PIN';
            this.openSnackBar();
          } else {
            this.error = 'User already exists';
            this.submitted = false;
            this.openSnackBar();
          }
        });
      } else {
        this.error = 'Passwords do not match';
        this.openSnackBar();
      }
  }

}
