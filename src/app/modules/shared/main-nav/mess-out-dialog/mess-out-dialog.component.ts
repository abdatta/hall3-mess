import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material';
import { AuthService } from '@app/services';
import { MatSnackBar } from '@angular/material';

@Component({
  selector: 'app-mess-out-dialog',
  templateUrl: './mess-out-dialog.component.html',
  styleUrls: ['./mess-out-dialog.component.css']
})
export class MessOutDialogComponent implements OnInit {

  submitting = false;

  constructor(private dialogRef: MatDialogRef<MessOutDialogComponent>,
              private authService: AuthService,
              private snackBar: MatSnackBar) { }

  ngOnInit() {
  }

  logout(password: string) {
      if (password) {
        this.submitting = true;
        this.authService.messOut(password)
          .then((s: number) => {
            if (s === 200) {
              this.dialogRef.close();
            } else if (s === 401) {
              this.snackBar.open('Incorrect Password');
            } else if (s === 999) {
              this.snackBar.open('You are OFFLINE. Come online and try again.');
            } else {
              this.snackBar.open('Oops! Some error occured.', 'Retry')
                    .onAction().subscribe(_ => this.logout(password));
            }
            this.submitting = false;
        });
      } else {
        this.snackBar.open('Please fill all the fields.');
    }
  }

  cancel() {
    this.dialogRef.close();
  }

}
