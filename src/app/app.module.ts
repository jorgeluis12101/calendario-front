import { LOCALE_ID, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginRegisterComponent } from './Compartido/componentes/login-register/login-register.component';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { AuthInterceptor } from './service/auth-interceptor.service';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AdminComponent } from './Compartido/componentes/admin/admin.component';
import { UserComponent } from './Compartido/componentes/user/user.component';
import { NavVerticalComponent } from './Compartido/componentes/user/nav-vertical/nav-vertical.component';
import { NavbarprincipalComponent } from './navbarprincipal/navbarprincipal.component';
import { CalendarioComponent } from './Compartido/componentes/user/calendario/calendario.component';
import { FullCalendarModule } from '@fullcalendar/angular';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { EventosTardiosComponent } from './Compartido/componentes/user/eventos-tardios/eventos-tardios.component';
import { HistorialEventosComponent } from './Compartido/componentes/user/historial-eventos/historial-eventos.component';

import { registerLocaleData } from '@angular/common';
import localeEs from '@angular/common/locales/es';
registerLocaleData(localeEs);
@NgModule({
  declarations: [
    AppComponent,
    LoginRegisterComponent,
    AdminComponent,
    UserComponent,
    NavVerticalComponent,
    NavbarprincipalComponent,
    CalendarioComponent,
    EventosTardiosComponent,
    HistorialEventosComponent,
   
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    FullCalendarModule,
    BrowserAnimationsModule,
    ReactiveFormsModule,
    
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
    { provide: LOCALE_ID, useValue: 'es' }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
