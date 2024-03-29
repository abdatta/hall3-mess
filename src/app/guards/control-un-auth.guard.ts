import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from '@app/services';

@Injectable({
  providedIn: 'root'
})

export class ControlUnAuthGuard implements CanActivate {

  constructor(private authService: AuthService,
              private router: Router) {}

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
      return this.authService.hasControl()
      .then((result: boolean) => {
        if (result) {
          this.router.navigateByUrl('/control');
        }
        return !result;
      });
  }

}
