import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import {MatSnackBar} from '@angular/material';
import { AuthService } from '@app/services';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  // TODO: Add errors for invalid login
  submitted = false;
  error = '';
  noinput = '';
  constructor(private authService: AuthService,
              private router: Router ,  public snackBar: MatSnackBar) { }

  ngOnInit() {
  }

  openSnackBar() {
    this.snackBar.open( this.error , this.noinput , {
      duration: 1600,
    });
  }

  logIn(rollno: string, password: string) {
    this.submitted = true;
    this.authService.logIn(rollno, password)
        .subscribe((s: number) => {
      if (s === 200) {
        this.router.navigateByUrl('/home');
      } else {
        this.error = 'Incorrect Username or Password';
        this.submitted = false;
        this.openSnackBar();
      }
    });
  }

}
