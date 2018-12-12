import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, Router, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from '@app/services';

@Injectable({
  providedIn: 'root'
})
export class MessAuthGuard implements CanActivate {

  constructor(private authService: AuthService,
              private router: Router) {}

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
      return this.authService.checkMess()
      .then((result: boolean) => {
        if (!result) {
          this.router.navigateByUrl('/mess');
        }
        return result;
      });
  }
}
