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
    private router: Router) {
     }

  canActivate(): Promise<boolean> {
    return this.authService.check()
      .then(async (user: boolean) => {
        if (user) {
          const admin = await this.authService.isAdmin();
          const mess = await this.authService.checkMess();
          this.router.navigateByUrl( admin ? '/control' : mess ? '/mess' : '/home' );
        }
        return !user;
      });
  }

}
