import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from '@app/services';

@Injectable({
  providedIn: 'root'
})
export class ControlAuthGuard implements CanActivate {

  constructor(private authService: AuthService,
              private router: Router) {}

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
      return this.authService.hasControl()
        .then((result: boolean) => {
          if (!result) {
            this.router.navigateByUrl('/');
          }
          if (next.data.permissions) {
            return this.authService.hasPermissions(next.data.permissions)
              .then(allowed => {
                if (!allowed) {
                  this.router.navigateByUrl(next.data.redirectTo);
                }
                return allowed;
              });
          }
          return result;
        });
  }

}
