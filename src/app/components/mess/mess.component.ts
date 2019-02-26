import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material';
import { AuthService } from '@app/services';

@Component({
  selector: 'app-mess',
  templateUrl: './mess.component.html',
  styleUrls: ['./mess.component.css']
})
export class MessComponent implements OnInit {

  submitting: boolean;

  constructor(private authService: AuthService,
              private router: Router,
              public snackBar: MatSnackBar) { }

  ngOnInit() {
  }

  messIn(password: string) {
    if (password) {
      this.submitting = true;
      this.authService.messIn(password)
        .subscribe((s: number) => {
          if (s === 200) {
            this.router.navigateByUrl('/mess/login');
          } else if (s === 403) {
            this.snackBar.open('Incorrect Password');
          } else if (s === 999) {
            this.snackBar.open('No internet connection. Come online and try again.');
          } else {
            this.snackBar.open('Oops! Some error occured.', 'Retry')
                  .onAction().subscribe(_ => this.messIn(password));
          }
          this.submitting = false;
      });
    } else {
      this.snackBar.open('Please fill all the fields.');
    }
  }

}
