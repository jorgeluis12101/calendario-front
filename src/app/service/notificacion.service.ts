// notification.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Notificacion } from '../Compartido/notificacion'; // Asegúrate de definir la interfaz/modelo Notificacion

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  private notificacionesUrl = 'http://localhost:8080/notificaciones';

  constructor(private http: HttpClient) {}

  getNotificacionesNoLeidas(usuarioId: number): Observable<Notificacion[]> {
    return this.http.get<Notificacion[]>(`${this.notificacionesUrl}/usuario/${usuarioId}`);
  }

  marcarComoLeida(notificacionId: number): Observable<void> {
    return this.http.post<void>(`${this.notificacionesUrl}/leer/${notificacionId}`, {});
  }
}
