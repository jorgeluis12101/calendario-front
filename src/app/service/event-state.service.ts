import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';
import { EventService } from './event.service';
import { AuthService } from './auth.service';
import { Evento } from 'src/app/Compartido/evento';

@Injectable({
  providedIn: 'root'
})
export class EventStateService {
  private eventosSubject = new BehaviorSubject<Evento[]>([]);
  public eventos$ = this.eventosSubject.asObservable();
  public eventosUpdated = new Subject<void>();  // Emitirá cada vez que los eventos cambien

  constructor(private eventService: EventService, private authService: AuthService) {}

  loadEventos(): void {
    const userId = this.authService.getUsuarioId(); // Obtiene el ID del usuario desde el AuthService
    if (userId) {
      this.eventService.getEventosByUsuario(userId).subscribe(
        eventos => {
          this.eventosSubject.next(eventos);
          this.eventosUpdated.next(); // Emitir aquí para indicar que los eventos han sido cargados o actualizados
        },
        error => console.error('Error al cargar los eventos:', error)
      );
    } else {
      console.error('User ID not found, cannot load events.');
    }
  }

  addEvento(evento: Evento): void {
    const userId = this.authService.getUsuarioId();
    if (userId) {
      this.eventService.createEvento(userId, evento).subscribe(newEvento => {
        const updatedEventos = [...this.eventosSubject.value, newEvento];
        this.eventosSubject.next(updatedEventos);
        this.eventosUpdated.next(); // Emitir después de añadir un nuevo evento
      });
    } else {
      console.error('User ID not found, cannot add event.');
    }
  }

  updateEvento(evento: Evento): void {
    if (evento.id) {
      this.eventService.updateEvento(evento.id, evento).subscribe(() => {
        const updatedEventos = this.eventosSubject.value.map(e => e.id === evento.id ? evento : e);
        this.eventosSubject.next(updatedEventos);
        this.eventosUpdated.next(); // Emitir después de actualizar un evento
      });
    }
  }

  deleteEvento(id: number): void {
    this.eventService.deleteEvento(id).subscribe(() => {
      const filteredEventos = this.eventosSubject.value.filter(e => e.id !== id);
      this.eventosSubject.next(filteredEventos);
      this.eventosUpdated.next(); // Emitir después de eliminar un evento
    });
  }
}
