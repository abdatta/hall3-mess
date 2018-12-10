import { Component, OnInit } from '@angular/core';
import { AuthService } from '@app/services';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material';

@Component({
  selector: 'app-mess-login',
  templateUrl: './mess-login.component.html',
  styleUrls: ['./mess-login.component.css']
})
export class MessLoginComponent implements OnInit {

  submitting: boolean;

  constructor(private authService: AuthService,
              private router: Router,
              public snackBar: MatSnackBar) { }

  ngOnInit() {
  }

  logIn(rollno: string, password: string) {
    if (rollno && password) {
      this.submitting = true;
      this.authService.logIn(rollno, password)
        .subscribe((s: number) => {
          if (s === 200) {
            this.router.navigateByUrl('/mess/book');
          } else if (s === 401) {
            this.snackBar.open('Incorrect Username or Password');
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
