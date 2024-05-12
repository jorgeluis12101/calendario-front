import { Component, OnInit } from '@angular/core';
import { EventService } from '../../../../service/event.service';
import { AuthService } from '../../../../service/auth.service';
import { Evento } from 'src/app/Compartido/evento';
import Swal from 'sweetalert2';
import { EventStateService } from 'src/app/service/event-state.service';

@Component({
  selector: 'app-nav-vertical',
  templateUrl: './nav-vertical.component.html',
  styleUrls: ['./nav-vertical.component.css']
})
export class NavVerticalComponent implements OnInit {
  eventos: Evento[] = [];
  viewAll: boolean = false;
  constructor(private eventService: EventService, private authService: AuthService, private eventStateService: EventStateService) { }

  ngOnInit(): void {
    this.loadEvents();
    this.eventStateService.eventos$.subscribe(eventos => {
      this.eventos = eventos.filter(e => !e.completado);

    });
  }

  loadEvents(): void {
    const userId = this.authService.getUsuarioId();
    if (userId) {
      // Usar el método getEventosActivosByUsuario para obtener sólo eventos no completados.
      this.eventService.getEventosActivosByUsuario(userId).subscribe({
        next: (eventos) => {
          this.eventos = eventos;
        },
        error: (error) => {
          console.error('Error al cargar eventos:', error);
        }
      });
    } else {
      console.error('ID de usuario no disponible');
    }

  }


  toggleViewAll(): void {
    this.viewAll = !this.viewAll;
  }

  editEvent(evento: Evento): void {
    if (evento.id === undefined) {
      console.error('Error: ID del evento no está definido.');
      Swal.fire('Error', 'No se puede editar el evento sin un ID válido.', 'error');
      return;
    }
  
    Swal.fire({
      title: 'Editar Evento',
      html: `
        <div class="form-group">
          <label for="titulo">Título del evento</label>
          <input id="titulo" type="text" class="form-control" value="${evento.titulo}" placeholder="Título del evento">
        </div>
        <div class="form-group">
          <label for="fecha">Fecha del evento</label>
          <input id="fecha" type="date" class="form-control" value="${evento.fecha.split('T')[0]}">
        </div>
        <div class="form-group">
          <label for="hora">Hora del evento</label>
          <input id="hora" type="time" class="form-control" value="${evento.hora || ''}">
        </div>
        <div class="form-group">
          <label for="descripcion">Descripción</label>
          <textarea id="descripcion" class="form-control" rows="3">${evento.descripcion || ''}</textarea>
        </div>
      `,
      focusConfirm: false,
      showCancelButton: true,
      customClass: {
        confirmButton: 'btn btn-success',
        cancelButton: 'btn btn-danger'
      },
      confirmButtonText: 'Guardar',
      cancelButtonText: 'Cancelar',
      buttonsStyling: false,
      preConfirm: () => {
        return {
          titulo: (document.getElementById('titulo') as HTMLInputElement).value,
          fecha: (document.getElementById('fecha') as HTMLInputElement).value,
          hora: (document.getElementById('hora') as HTMLInputElement).value,
          descripcion: (document.getElementById('descripcion') as HTMLTextAreaElement).value
        }
      }
    }).then((result) => {
      if (result.isConfirmed && result.value) {
        let updatedEvento = {
          ...evento,
          titulo: result.value.titulo,
          fecha: result.value.fecha,
          hora: result.value.hora,
          descripcion: result.value.descripcion
        };
        // Verificar que el ID no es undefined antes de llamar a la función de actualización
        if (typeof evento.id === 'number') {
          this.eventService.updateEvento(evento.id, updatedEvento).subscribe({
            next: (updated) => {
              console.log('Evento actualizado:', updated);
              window.location.reload();
              this.refreshEvents(); // Recarga los eventos
              Swal.fire('Actualizado', 'El evento se ha actualizado correctamente.', 'success');
            },
            error: (error) => {
              console.error('Error al actualizar evento:', error);
              Swal.fire('Error', 'No se pudo actualizar el evento.', 'error');
            }
          });
        }
      }
    });
  }
  
  private refreshEvents(): void {
    this.loadEvents(); // Carga de nuevo los eventos desde el servidor para reflejar los cambios
  }


  deleteEvent(evento: Evento): void {
    // Verificar que el ID del evento esté definido y sea un número
    if (typeof evento.id === 'number') {
      // Modal de confirmación antes de eliminar
      Swal.fire({
        title: '¿Estás seguro?',
        text: 'Esta acción no se puede deshacer',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Sí, eliminar!',
        cancelButtonText: 'Cancelar'
      }).then((result) => {
        if (result.isConfirmed) {
          // Proceder a eliminar si el usuario confirma
          if (typeof evento.id === 'number') { // Verificación adicional antes de la llamada
            this.eventService.deleteEvento(evento.id).subscribe({
              next: () => {
                console.log('Evento eliminado');
                window.location.reload();
                this.eventos = this.eventos.filter(e => e.id !== evento.id); // Actualizar la vista inmediatamente
                Swal.fire('Eliminado!', 'El evento ha sido eliminado.', 'success');
              },
              error: (error) => {
                console.error('Error al eliminar evento:', error);
                Swal.fire('Error', 'No se pudo eliminar el evento.', 'error');
              }
            });
          } else {
            console.error('Event ID is undefined or not a number after confirmation.');
            Swal.fire('Error', 'No se puede eliminar el evento sin un ID válido.', 'error');
          }
        }
      });
    } else {
      console.error('Event ID is undefined or not a number.');
      Swal.fire('Error', 'No se puede eliminar el evento sin un ID válido.', 'error');
    }
  }


}