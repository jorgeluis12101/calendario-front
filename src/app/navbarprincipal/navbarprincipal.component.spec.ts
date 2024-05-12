import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NavbarprincipalComponent } from './navbarprincipal.component';

describe('NavbarprincipalComponent', () => {
  let component: NavbarprincipalComponent;
  let fixture: ComponentFixture<NavbarprincipalComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [NavbarprincipalComponent]
    });
    fixture = TestBed.createComponent(NavbarprincipalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
