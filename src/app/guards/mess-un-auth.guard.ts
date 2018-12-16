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
          this.router.navigateByUrl('/mess/login');
        }
        return !result;
      });
  }
}
