import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material';
import { AuthService } from '@app/services';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  submitting: boolean;

  constructor(private authService: AuthService,
              private router: Router ,  public snackBar: MatSnackBar) { }

  ngOnInit() {
  }

  logIn(rollno: string, password: string) {
    if (rollno && password) {
      this.submitting = true;
      this.authService.logIn(rollno, password)
        .subscribe((s: number) => {
          if (s === 200) {
            if ( rollno === 'messmanager' || rollno === 'messsecy' || rollno === 'admin') {
              this.router.navigateByUrl('/control');
            } else {
              this.router.navigateByUrl('/home');
            }
          } else if (s === 401) {
            this.snackBar.open('Incorrect Username or Password');
          } else if (s === 403) {
            this.snackBar.open('Account not verified. Please check email.');
          } else {
            this.snackBar.open('Oops! Some error occured.', 'Retry')
                  .onAction().subscribe(_ => this.logIn(rollno, password));
          }
          this.submitting = false;
      });
    } else {
      this.snackBar.open('Please fill all the fields.');
    }
  }

}
