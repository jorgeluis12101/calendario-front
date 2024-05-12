import { Component, OnInit } from '@angular/core';
import Swal from 'sweetalert2';
import { EventService } from '../../../../service/event.service';
import { AuthService } from '../../../../service/auth.service';
import { Observable, of } from 'rxjs';
import { startWith, map, debounceTime, switchMap } from 'rxjs/operators';
import { FormControl } from '@angular/forms';
import { EventStateService } from '../../../../service/event-state.service';

import { NotificationService } from '../../../../service/notification.service';
interface Evento {
  id?: number;
  titulo: string;
  fecha: string;
  descripcion?: string;
  usuarioId: number;
}

@Component({
  selector: 'app-calendario',
  templateUrl: './calendario.component.html',
  styleUrls: ['./calendario.component.css']
})
export class CalendarioComponent implements OnInit {
  currentDate: Date = new Date();
  currentMonth: Date = new Date();
  daysOfWeek = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];
  calendar: any[] = [];
  eventos: Evento[] = [];

  tipoEventoControl = new FormControl();
  filteredTiposEventos: Observable<string[]> = of([]);

  constructor(
    private eventService: EventService,
    private authService: AuthService,
    private eventStateService: EventStateService,
    private notificationService: NotificationService,) { }


  previousMonth(): void {
    console.log('Before:', this.currentMonth);
    this.currentMonth = new Date(this.currentMonth.getFullYear(), this.currentMonth.getMonth() - 1, 1);
    console.log('After:', this.currentMonth);
    this.generateCalendar();
  }

  nextMonth(): void {
    console.log('Before:', this.currentMonth);
    this.currentMonth = new Date(this.currentMonth.getFullYear(), this.currentMonth.getMonth() + 1, 1);
    console.log('After:', this.currentMonth);
    this.generateCalendar();
  }




  ngOnInit(): void {
    this.eventStateService.eventos$.subscribe(eventos => {
      this.eventos = eventos.filter(e => !e.completado);
      this.generateCalendar(); // Función para generar o actualizar la vista del calendario
      this.loadEvents();

    });
  }



  isToday(date: Date): boolean {
    let today = new Date();
    today.setHours(0, 0, 0, 0); // Ignora la hora para la comparación
    return date.setHours(0, 0, 0, 0) === today.getTime();
  }



  setupAutocomplete(): void {
    this.filteredTiposEventos = this.tipoEventoControl.valueChanges
      .pipe(
        debounceTime(300),  // esperar 300ms después de cada tecla antes de considerar el término
        switchMap(value => this.eventService.getTipoEventosSugeridos(value))
      );
  }

  loadEvents(): void {
    const userId = this.authService.getUsuarioId();
    if (userId) {
      this.eventService.getEventosActivosByUsuario(userId).subscribe({
        next: (eventos) => {
          this.eventos = eventos;
          this.generateCalendar();
        },
        error: (error) => {
          console.error('Error al cargar eventos:', error);
          alert('Error al cargar eventos: ' + error.message);
        }
      });
    } else {
      console.error('ID de usuario no disponible');
      alert('ID de usuario no disponible');
    }
  }



  generateCalendar(): void {
    const startDay = new Date(this.currentMonth.getFullYear(), this.currentMonth.getMonth(), 1);
    while (startDay.getDay() !== 0) {
      startDay.setDate(startDay.getDate() - 1);  // Mueve hacia atrás hasta el domingo
    }

    const endDay = new Date(this.currentMonth.getFullYear(), this.currentMonth.getMonth() + 1, 0);
    while (endDay.getDay() !== 6) {
      endDay.setDate(endDay.getDate() + 1);  // Mueve hacia adelante hasta el sábado
    }

    this.calendar = [];
    let date = new Date(startDay);

    while (date <= endDay) {
      const week = [];
      for (let i = 0; i < 7; i++) {
        week.push({
          date: new Date(date),
          isToday: this.isToday(date),
          events: this.getEventsByDate(date)
        });
        date.setDate(date.getDate() + 1);
      }
      this.calendar.push(week);
    }
  }


  getEventsByDate(date: Date): Evento[] {
    return this.eventos.filter(event => {
      const eventDate = new Date(event.fecha);
      return eventDate.toISOString().split('T')[0] === date.toISOString().split('T')[0];
    });
  }



  addEvent(date: Date): void {
    console.log('Attempting to add event on date:', date);
    Swal.fire({
      title: 'Agregar Evento',
      html: `
      <div class="container-fluid">
        <div class="row mb-2">
          <div class="col-12">
            <label for="titulo" class="form-label">Título del evento</label>
            <input id="titulo" type="text" class="form-control" placeholder="Ingresa el título">
          </div>
        </div>
        <div class="row mb-2">
          <div class="col-6">
            <label for="hora" class="form-label">Hora del evento</label>
            <input id="hora" type="time" class="form-control">
          </div>
          <div class="col-6">
            <label for="tipoEvento" class="form-label">Tipo de evento</label>
            <input id="tipoEvento" type="text" class="form-control" placeholder="Ej. Pago de servicios">
            <div id="tipoEventoSuggestions" class="list-group mt-1"></div>
          </div>
        </div>
        <div class="row">
          <div class="col-12">
            <label for="descripcion" class="form-label">Descripción del evento</label>
            <textarea id="descripcion" class="form-control" rows="3" placeholder="Detalles del evento"></textarea>
          </div>
        </div>
      </div>`,
      showCancelButton: true,
      confirmButtonText: 'Aceptar',
      cancelButtonText: 'Cancelar',
      buttonsStyling: false,
      customClass: {
        confirmButton: 'btn btn-success', // Clases de Bootstrap para el botón de aceptar
        cancelButton: 'btn btn-danger',  // Clases de Bootstrap para el botón de cancelar
        container: 'swal-wide' // Asegurarse de que el contenedor es lo suficientemente ancho
      },
      didOpen: () => {
        const tipoEventoInput = document.getElementById('tipoEvento') as HTMLInputElement;
        tipoEventoInput.addEventListener('input', async (e) => {
          const value = (e.target as HTMLInputElement).value;
          if (value.length > 1) {
            this.eventService.getTipoEventosSugeridos(value).subscribe(suggestions => {
              const suggestionsContainer = document.getElementById('tipoEventoSuggestions') as HTMLDivElement;
              if (suggestionsContainer) {
                if (suggestions && suggestions.length) {
                  suggestionsContainer.innerHTML = suggestions.map(s => `<button class="list-group-item list-group-item-action" onclick="document.getElementById('tipoEvento').value = '${s}'; document.getElementById('tipoEventoSuggestions').innerHTML = '';">${s}</button>`).join('');
                } else {
                  suggestionsContainer.innerHTML = '<div class="list-group-item">No suggestions found</div>';
                }
              }
            });
          } else {
            const suggestionsContainer = document.getElementById('tipoEventoSuggestions');
            if (suggestionsContainer) {
              suggestionsContainer.innerHTML = '';
            }
          }
        });
      },
      preConfirm: () => {
        const titulo = (document.getElementById('titulo') as HTMLInputElement).value;
        const hora = (document.getElementById('hora') as HTMLInputElement).value;
        const tipoEvento = (document.getElementById('tipoEvento') as HTMLInputElement).value;
        const descripcion = (document.getElementById('descripcion') as HTMLTextAreaElement).value;
        return { titulo, hora, tipoEvento, descripcion };
      }
    }).then((result) => {
      if (result.isConfirmed && result.value.titulo) {
        const usuarioId = this.authService.getUsuarioId();
        if (usuarioId) {
          const newEvento = {
            titulo: result.value.titulo,
            fecha: date.toISOString().split('T')[0],
            hora: result.value.hora,
            tipoEvento: result.value.tipoEvento,
            descripcion: result.value.descripcion,
            usuarioId: usuarioId
          };
          this.eventService.createEvento(usuarioId, newEvento).subscribe({
            next: (evento) => {
              console.log('Evento creado:', evento);
              window.location.reload(); // Considerar eliminar esta línea si no desea recargar toda la página
              this.eventos.push(evento);
              this.generateCalendar();
            },
            error: (error) => {
              console.error('Error al crear evento:', error);
              Swal.fire('Error', 'No se pudo crear el evento', 'error');
            }
          });
        } else {
          Swal.fire('Error', 'Usuario no identificado', 'error');
          console.error('Usuario no identificado o token inválido');
        }
      }
    });
  }

}
