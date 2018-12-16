import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from '@app/services';

@Injectable({
  providedIn: 'root'
})
export class UnAuthGuard implements CanActivate {

  constructor(
    private authService: AuthService,
    private router: Router) {}

  canActivate(): Promise<boolean> {
    return this.authService.check()
      .then((user: boolean) => {
        if (user) {
          this.authService.checkMess().then(mess => {
            this.router.navigateByUrl(mess ? '/mess' : '/home');
          });
        }
        return !user;
      });
  }
}
