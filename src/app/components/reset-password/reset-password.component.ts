import { Component, OnInit } from '@angular/core';
import { AuthService } from '@app/services';
import { ActivatedRoute, Router } from '@angular/router';
import { MatSnackBar } from '@angular/material';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.css']
})
export class ResetPasswordComponent implements OnInit {

  rollno: string;
  reset_id: string;
  reseting: boolean;

  constructor(private authService: AuthService,
              private route: ActivatedRoute,
              private router: Router,
              private snackBar: MatSnackBar) { }

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.rollno = params['rollno'];
      this.reset_id = params['id'];
    });
  }

  reset(newpass: string, renewpass: string) {
    if (!newpass && !renewpass) {
      this.snackBar.open('Fill all fields.');
    } else if ( newpass !== renewpass) {
      this.snackBar.open('Retype new password correctly');
    } else {
      this.reseting = true;
      this.authService.resetPassword(this.rollno, this.reset_id, newpass)
          .subscribe(code => {
            if (code === 200) {
              this.router.navigateByUrl('/login');
              this.snackBar.open('Reset successful');
            } else if (code === 404) {
              this.snackBar.open('The link has expired or does not exist.');
            } else if (code === 999) {
              this.snackBar.open('No internet connection. Come online and try again.');
            } else {
              this.snackBar.open('Oops! Some error occured.', 'Retry')
                  .onAction().subscribe(_ => this.reset(newpass, renewpass));
            }
            this.reseting = false;
          });
        }
      }

}
