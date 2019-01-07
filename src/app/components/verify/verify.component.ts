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
        } else {
          this.status = false;
          this.message = 'Verification Failed! Click to try again.';
        }
        this.verifying = false;
      });
  }

}
