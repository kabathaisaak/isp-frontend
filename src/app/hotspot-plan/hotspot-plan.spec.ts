import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HotspotPlan } from './hotspot-plan';

describe('HotspotPlan', () => {
  let component: HotspotPlan;
  let fixture: ComponentFixture<HotspotPlan>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HotspotPlan]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HotspotPlan);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
