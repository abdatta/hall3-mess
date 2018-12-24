import { Injectable  } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from '@app/services';

@Injectable({
  providedIn: 'root'
})
export class UnAuthGuard implements CanActivate {

  role: string;

  constructor(
    private authService: AuthService,
    private router: Router) { }

  canActivate(): Promise<boolean> {
    this.authService.getUser()
            .then(user => this.role = user.rollno );
    return this.authService.check()
      .then((user: boolean) => {
        if (user) {
            this.authService.checkMess().then(mess => {
              if ( this.role === 'admin' || this.role === 'messsecy' || this.role === 'messmanager') {
                this.router.navigateByUrl('/control');
              } else {
                this.router.navigateByUrl(mess ? '/mess' : '/home');
              }
          });
        }
        return !user;
      });
  }

}
