import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HistorialEventosComponent } from './historial-eventos.component';

describe('HistorialEventosComponent', () => {
  let component: HistorialEventosComponent;
  let fixture: ComponentFixture<HistorialEventosComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [HistorialEventosComponent]
    });
    fixture = TestBed.createComponent(HistorialEventosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
