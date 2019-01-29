import { Component, OnInit } from '@angular/core';
import { AuthService } from '@app/services';
import { MatSnackBar } from '@angular/material';

@Component({
  selector: 'app-credits',
  templateUrl: './credits.component.html',
  styleUrls: ['./credits.component.css']
})
export class CreditsComponent implements OnInit {

  thumbsup: boolean;

  constructor(private snackBar: MatSnackBar,
              private authService: AuthService) { }

  ngOnInit() {
    this.authService.getUser()
        .then(user => this.thumbsup = user.liked);
  }

  async like(liked: boolean) {
    this.thumbsup = liked;
    this.authService.like(this.thumbsup)
        .subscribe((s: number) => {
          if (s === 200) {
              this.snackBar.open('Thank you for your feedback! 😊');
          } else if (s === 999) {
            this.snackBar.open('You are OFFLINE. Come online and try again.');
          } else {
              this.ngOnInit();
              this.snackBar.open('Oops! Some error occured.', 'Retry')
                .onAction().subscribe(_ => this.like(liked));
          }
        });
  }

}
