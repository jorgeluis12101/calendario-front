import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UserGuard } from './service/user.guard';
import { AdminGuard } from './service/admin.guard';
import { LoginRegisterComponent } from './Compartido/componentes/login-register/login-register.component';
import { UserComponent } from './Compartido/componentes/user/user.component';
import { AdminComponent } from './Compartido/componentes/admin/admin.component';
import { CalendarioComponent } from './Compartido/componentes/user/calendario/calendario.component';
import { EventosTardiosComponent } from './Compartido/componentes/user/eventos-tardios/eventos-tardios.component';
import { HistorialEventosComponent } from './Compartido/componentes/user/historial-eventos/historial-eventos.component';

const routes: Routes = [
  { path: '', redirectTo: '/login-registro', pathMatch: 'full' },
  { path: 'login-registro', component: LoginRegisterComponent },

  {
    path: 'admin', component: AdminComponent, canActivate: [AdminGuard],
    children: [

    ]
  },
  {
    path: 'user', component: UserComponent, canActivate: [UserGuard],
    children: [
      { path: 'calendario', component: CalendarioComponent },
      { path: 'eventotarde', component: EventosTardiosComponent },
      { path: 'historial', component:  HistorialEventosComponent },
     
    ]


  }
];
@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
