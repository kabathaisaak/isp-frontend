import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Mikrotik } from './mikrotik';

describe('Mikrotik', () => {
  let component: Mikrotik;
  let fixture: ComponentFixture<Mikrotik>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Mikrotik]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Mikrotik);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
