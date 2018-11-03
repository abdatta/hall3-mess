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
      .then((result: boolean) => {
        if (result) {
          this.router.navigateByUrl('/home');
        }
        return !result;
      });
  }
}
