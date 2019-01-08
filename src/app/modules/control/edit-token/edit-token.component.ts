import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material';
import { TokensService } from '@app/services';
import { TokenModel } from '@app/models';

@Component({
  selector: 'app-edit-token',
  templateUrl: './edit-token.component.html',
  styleUrls: ['./edit-token.component.css']
})
export class EditTokenComponent implements OnInit {

  tokens: TokenModel[];

  constructor(private snackbar: MatSnackBar,
              private tokenService: TokensService) { }

  ngOnInit() {
  }

  listtoken(rollno: number) {
    this.tokenService.getEditTokens(rollno)
        .subscribe(tokens => {
          this.tokens = tokens;
          console.log(this.tokens);
        });
  }
}
