import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { AuthService } from '@app/services';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit {

  submitted = false;
  error = '';

  constructor(private authService: AuthService,
              private router: Router) { }

  ngOnInit() {
  }

  signUp(rollno: string, password: string, repassword: string) {
    if (password === repassword) {
      this.authService.signUp(rollno, password)
        .subscribe(s => {
          if (s === 200) {
            this.router.navigateByUrl('/home');
          } else {
            this.error = 'User already exists';
            this.submitted = false;
          }
        });
      } else {
        this.error = 'Passwords do not match';
      }
  }

}
