import { Component } from '@angular/core';
import { AuthService } from '../service/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-navbarprincipal',
  templateUrl: './navbarprincipal.component.html',
  styleUrls: ['./navbarprincipal.component.css']
})
export class NavbarprincipalComponent {
  isLoggedIn: boolean = false;
  isAdmin: boolean = false;

  constructor(private authService: AuthService, private router: Router) { }

  ngOnInit(): void {
    this.authService.isLoggedIn().subscribe(isLoggedIn => {
      this.isLoggedIn = isLoggedIn;
    });

    // Obtener el rol del usuario actual
    this.authService.getRole().subscribe(role => {
      this.isAdmin = role === 'ADMIN'; // Verificar si el rol es 'admin'
    });
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/']);
  }

}
