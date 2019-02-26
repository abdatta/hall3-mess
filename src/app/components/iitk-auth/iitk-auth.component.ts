import { Component, OnInit } from '@angular/core';
import { MatDialogRef, MatSnackBar } from '@angular/material';
import { AuthService } from '@app/services';

@Component({
  selector: 'app-iitk-auth',
  templateUrl: './iitk-auth.component.html',
  styleUrls: ['./iitk-auth.component.css']
})
export class IITKAuthComponent implements OnInit {

  authorising: boolean;

  constructor(private dialogRef: MatDialogRef<IITKAuthComponent>,
    private authService: AuthService,
    private snackBar: MatSnackBar) { }

  ngOnInit() {
  }

  authoriseIITK(user: string, pass: string) {
    if (user && pass) {
      this.authorising = true;
      this.authService.authIITK(user, pass)
          .subscribe(code => {
            if (code === 200) {
              this.dialogRef.close({
                username: user,
                password: pass
              });
            } else if (code === 403) {
              this.snackBar.open('Incorrect IITK Username or Password.');
            } else if (code === 408) {
              this.snackBar.open('IITK server is down. Please try after some time.');
            } else if (code === 999) {
              this.snackBar.open('No internet connection. You need to be online to authenticate.');
            } else {
              this.snackBar.open('Oops! Some error occured.', 'Retry')
                    .onAction().subscribe(_ => this.authoriseIITK(user, pass));
            }
            this.authorising = false;
          });
    } else {
      this.snackBar.open('Please fill all the fields.');
    }
  }

}
