import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA} from '@angular/material';

@Component({
  selector: 'app-qr-dialog',
  templateUrl: './qr-dialog.component.html',
  styleUrls: ['./qr-dialog.component.css']
})
export class QRDialogComponent implements OnInit {

  constructor(private dialogRef: MatDialogRef<QRDialogComponent>,
              @Inject(MAT_DIALOG_DATA) public data: string) { }

  ngOnInit() {

  }

}
