import { Component, OnInit } from '@angular/core';
import { EventService } from '../../../../service/event.service';
import { Evento } from '../../../evento';  // Asegúrate de que la ruta es correcta

@Component({
  selector: 'app-eventos-tardios',
  templateUrl: './eventos-tardios.component.html',
  styleUrls: ['./eventos-tardios.component.css']
})
export class EventosTardiosComponent implements OnInit {
  eventos: Evento[] = [];

  constructor(private eventService: EventService) {}

  ngOnInit() {
      this.loadEventosActivos();
  }

  loadEventosActivos() {
      const usuarioId = 1; // Debe obtenerse de manera segura
      this.eventService.getEventosActivosByUsuario(usuarioId).subscribe({
          next: (eventos) => this.eventos = eventos,
          error: (error) => console.error('Error al obtener eventos activos:', error)
      });
  }
  
  completarEvento(id: number): void {
    this.eventService.completarEvento(id).subscribe({
      next: () => {
        // Filtrar fuera el evento completado de la lista de eventos.
        this.eventos = this.eventos.filter(evento => evento.id !== id);
        console.log('Evento completado con éxito');
        window.location.reload();
      },
      error: (error: any) => {
        console.error('Error al completar el evento', error);
      }
    });
  }
}
