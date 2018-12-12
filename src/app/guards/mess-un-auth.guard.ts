import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from '@app/services';

@Injectable({
  providedIn: 'root'
})
export class MessUnAuthGuard implements CanActivate {
  constructor(
    private authService: AuthService,
    private router: Router) {}

  canActivate(): Promise<boolean> {
    return this.authService.checkMess()
      .then((result: boolean) => {
        if (result) {
          this.authService.check().then(user =>
            this.router.navigateByUrl(user ? '/mess/book' : '/mess/login'));
        }
        return !result;
      });
  }
}
