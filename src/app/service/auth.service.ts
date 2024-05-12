
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { map } from 'rxjs/operators';
import { jwtDecode } from "jwt-decode";
import baserUrl from './helper';

interface JwtPayload {
  id: number;
  username: string;
  role: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private loggedIn = new BehaviorSubject<boolean>(false);
  private currentUserRole = new BehaviorSubject<string>('');

  constructor(private http: HttpClient) {
    this.checkToken();
  }

  public login(username: string, password: string): Observable<any> {
    const loginData = { username, password };
    return this.http.post(`${baserUrl}/usuario/login`, loginData).pipe(
      map((response: any) => {
        const token = response.token;
        this.setToken(token);
        const decodedToken = jwtDecode<JwtPayload>(token); // Decodificar como JwtPayload
        this.currentUserRole.next(decodedToken.role); // Usar el role del token
        return response;
      })
    );
  }

  // Método para registrar un nuevo usuario
  public register(user: any): Observable<any> {
    return this.http.post(`${baserUrl}/usuario/registrar`, user);
  }

  public setToken(token: string): void {
    localStorage.setItem('token', token);
    this.loggedIn.next(true);
    this.checkToken(); // Verifica el token inmediatamente después de establecerlo
  }

  public getToken(): string | null {
    return localStorage.getItem('token');
  }


  public logout(): void {
    localStorage.removeItem('token');
    this.loggedIn.next(false);
    this.currentUserRole.next('');
  }

  public getRole(): Observable<string> {
    return this.currentUserRole.asObservable();
  }

  private checkToken(): void {
    const token = this.getToken();
    if (token) {
      try {
        const decodedToken = jwtDecode<JwtPayload>(token);
        this.currentUserRole.next(decodedToken.role);
        this.loggedIn.next(true);
      } catch (error) {
        console.error('Failed to decode token:', error);
        this.logout(); // Considera cerrar la sesión si el token no es válido
      }
    }
  }
  isLoggedIn(): Observable<boolean> {
    return this.loggedIn.asObservable();
  }

  getUsuarioId(): number | null {
    const token = localStorage.getItem('token');
    if (!token) {
      return null;
    }

    const decoded: any = jwtDecode(token);
    return decoded.userId;  // Usa 'userId' como en la estructura de tu token
  }


}
