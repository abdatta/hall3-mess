import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import {MatSnackBar} from '@angular/material';

@Component({
  selector: 'app-forgotkey',
  templateUrl: './forgotkey.component.html',
  styleUrls: ['./forgotkey.component.css']
})
export class ForgotkeyComponent implements OnInit {

  error = '';
  noinput = '';
  constructor(private router: Router ,  public snackBar: MatSnackBar) { }

  ngOnInit() {
  }

}
