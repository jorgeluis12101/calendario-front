// src/app/services/event.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Evento } from '../../app/../../src/app/Compartido/evento';  // Ajusta la importación del modelo Evento

@Injectable({
  providedIn: 'root'
})
export class EventService {
  private eventosUrl = 'https://com-example-parcial.fly.dev/eventos';

  constructor(private http: HttpClient) { }

  getEventosByUsuario(usuarioId: number): Observable<Evento[]> {
    return this.http.get<Evento[]>(`${this.eventosUrl}/usuario/${usuarioId}`);
  }

  createEvento(usuarioId: number, evento: Evento): Observable<Evento> {
    return this.http.post<Evento>(`${this.eventosUrl}/usuario/${usuarioId}`, evento);
  }

  updateEvento(id: number, evento: Evento): Observable<Evento> {
    return this.http.put<Evento>(`${this.eventosUrl}/${id}`, evento);
  }

  deleteEvento(id: number): Observable<void> {
    return this.http.delete<void>(`${this.eventosUrl}/${id}`);
  }

  getTipoEventosSugeridos(query: string): Observable<string[]> {
    return this.http.get<string[]>(`${this.eventosUrl}/tipos-eventos?query=${query}`);
  }

  completarEvento(id: number): Observable<any> {  // Cambia 'any' al tipo de retorno adecuado si es necesario
    return this.http.post<any>(`${this.eventosUrl}/completar/${id}`, {});
  }
  getEventosActivosByUsuario(usuarioId: number): Observable<Evento[]> {
    return this.http.get<Evento[]>(`${this.eventosUrl}/usuario/${usuarioId}/activos`);
  }
  getAllEventosByUsuario(usuarioId: number): Observable<Evento[]> {
    return this.http.get<Evento[]>(`${this.eventosUrl}/usuario/${usuarioId}/completados`);
  }

  getEventosCompletadosByUsuario(usuarioId: number): Observable<Evento[]> {
    return this.http.get<Evento[]>(`${this.eventosUrl}/usuario/${usuarioId}/completados`);
  }

}
