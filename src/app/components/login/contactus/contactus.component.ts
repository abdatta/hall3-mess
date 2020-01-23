import { Component, OnInit } from '@angular/core';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
@Component({
  selector: 'app-contactus',
  templateUrl: './contactus.component.html',
  styleUrls: ['./contactus.component.css']
})
export class ContactusComponent implements OnInit {

  constructor(public dialogRef: MatDialogRef<ContactusComponent>) { }
  onNoClick(): void {
    this.dialogRef.close();
  }
  ngOnInit() {
  }

}
