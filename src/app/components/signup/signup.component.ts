import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MatSnackBar, MatDialog } from '@angular/material';
import { AuthService } from '@app/services';
import { IITKAuthComponent } from '../iitk-auth/iitk-auth.component';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit {

  signupsuccess = false;
  submitting: boolean;
  constructor(private authService: AuthService,
              private router: Router,
              public dialog: MatDialog,
              public snackBar: MatSnackBar) { }

  ngOnInit() {
  }

  signUp(name: string, rollno: string, password: string, repassword: string) {
    // Remove leading and trailing spaces
    name = name.trim();
    rollno = rollno.trim();
    // Check if all fields are filled before proceeding
    if (name && rollno && password && repassword) {
      // Check if password matches retyped password before proceeding
      if (password === repassword) {
        this.dialog.open(IITKAuthComponent, {
            width: '90%',
            maxWidth: '400px'
          })
          .afterClosed().subscribe(iitk => {
            if (iitk && iitk.username && iitk.password) {
              this.submitting = true;
              this.authService.signUp(name, rollno, password, iitk.username, iitk.password)
                .subscribe(s => {
                  if (s === 200) {
                    this.signupsuccess = true;
                  } else if (s === 401) {
                    this.snackBar.open('User already exists.');
                  } else if (s === 400) {
                    this.snackBar.open('User already exists. Use Forgot Password to verify your account.');
                    this.router.navigateByUrl('/forgotpassword');
                  } else if (s === 999) {
                    this.snackBar.open('No internet connection. Come online and try again.');
                  } else {
                    this.snackBar.open('Oops! Some error occured.', 'Retry')
                        .onAction().subscribe(_ => this.signUp(name, rollno, password, repassword));
                  }
                  this.submitting = false;
                });
            } else {
              this.snackBar.open('You must authorise as an IITK user before signup.');
            }
          });
        } else {
          this.snackBar.open('Passwords do not match.');
        }
      } else {
        this.snackBar.open('Please fill all the fields.');
      }
  }

}
