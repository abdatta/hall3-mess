import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { AuthService } from '@app/services';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  // TODO: Add errors for invalid login
  submitted = false;
  loginerror = '';
  signuperror = '';

  constructor(private authService: AuthService,
              private router: Router) { }

  ngOnInit() {
  }

  logIn(rollno: string, password: string) {
    this.submitted = true;
    this.authService.logIn(rollno, password)
        .subscribe((s: number) => {
      if (s === 200) {
        this.router.navigateByUrl('/home');
      } else {
        this.loginerror = 'Incorrect Username or Password';
        this.submitted = false;
      }
    });
  }

}
