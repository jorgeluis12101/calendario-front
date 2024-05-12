import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/service/auth.service';
import { EventService } from 'src/app/service/event.service';
import { Evento } from 'src/app/Compartido/evento';

@Component({
  selector: 'app-historial-eventos',
  templateUrl: './historial-eventos.component.html',
  styleUrls: ['./historial-eventos.component.css']
})
export class HistorialEventosComponent implements OnInit {
  eventos: Evento[] = [];

  constructor(private eventService: EventService, private authService: AuthService) {}

  ngOnInit(): void {
    this.loadEventos();
  }

  loadEventos(): void {
    const userId = this.authService.getUsuarioId(); // Asume que existe este método
    if (userId) {
      this.eventService.getAllEventosByUsuario(userId).subscribe({
        next: (eventos) => {
          this.eventos = eventos; // Asumiendo que los eventos vienen con el campo completado como boolean
          console.log('Eventos cargados:', this.eventos); // Verifica los valores recibidos
        },
        error: (error) => {
          console.error('Error al cargar el historial de eventos:', error);
        }
      });
    }
  }
}
