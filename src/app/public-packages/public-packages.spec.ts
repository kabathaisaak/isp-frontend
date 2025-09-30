import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PublicPackages } from './public-packages';

describe('PublicPackages', () => {
  let component: PublicPackages;
  let fixture: ComponentFixture<PublicPackages>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PublicPackages]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PublicPackages);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
