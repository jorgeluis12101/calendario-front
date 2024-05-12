import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from './auth.service';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AdminGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}

  canActivate() {
    return this.authService.getRole().pipe(
      map(role => {
        if (role === 'ADMIN') {
          return true;
        } else {
          this.router.navigate(['/no-permission']); // Redirigir si no tiene permiso
          return false;
        }
      })
    );
  }
}
