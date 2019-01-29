import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '@app/services';

@Component({
  selector: 'app-verify',
  templateUrl: './verify.component.html',
  styleUrls: ['./verify.component.css']
})
export class VerifyComponent implements OnInit {

  user_id: string;
  verifying: boolean;
  status: boolean;
  message: string;

  constructor(private authService: AuthService,
              private route: ActivatedRoute) { }

  ngOnInit() {
    this.status = false;
    this.route.params.subscribe(params => {
      this.user_id = params['id'];
      this.verify();
    });
  }

  verify() {
    this.verifying = true;
    this.message = 'Verifying your account. Please wait.';
    this.authService.verifyUser(this.user_id)
      .subscribe(code => {
        if (code === 200) {
          this.status = true;
          this.message = 'Verification Successful!';
        } else if (code === 404) {
          this.status = false;
          this.message =
            'User does not exist. You either haven\'t signed up or your account has been deregistered using the link in your email.';
        } else if (code === 999) {
          this.status = false;
          this.message = 'You are offline. You need to be online to verify your account.';
        } else {
          this.status = false;
          this.message = 'Verification Failed! Click to try again.';
        }
        this.verifying = false;
      });
  }

}
