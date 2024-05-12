import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EventosTardiosComponent } from './eventos-tardios.component';

describe('EventosTardiosComponent', () => {
  let component: EventosTardiosComponent;
  let fixture: ComponentFixture<EventosTardiosComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [EventosTardiosComponent]
    });
    fixture = TestBed.createComponent(EventosTardiosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
