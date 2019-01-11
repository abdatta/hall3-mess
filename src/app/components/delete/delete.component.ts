import { Component, OnInit } from '@angular/core';
import { AuthService } from '@app/services';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-delete',
  templateUrl: './delete.component.html',
  styleUrls: ['./delete.component.css']
})
export class DeleteComponent implements OnInit {


  user_id: string;
  deleting: boolean;
  status: boolean;
  message: string;

  constructor(private authService: AuthService,
              private route: ActivatedRoute) { }

  ngOnInit() {
    this.status = false;
    this.route.params.subscribe(params => {
      this.user_id = params['id'];
      this.delete();
    });
  }

  delete() {
    this.deleting = true;
    this.authService.deleteUnverifiedUser(this.user_id)
      .subscribe(code => {
        if (code === 200) {
          this.status = true;
          this.message = 'Deletion Successful!';
        } else {
          this.status = false;
          this.message = 'Failed to Delete! Click to try again.';
        }
        this.deleting = false;
      });
  }

}
