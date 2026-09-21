import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StaffAppointments } from './staff-appointments';

describe('StaffAppointments', () => {
  let component: StaffAppointments;
  let fixture: ComponentFixture<StaffAppointments>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StaffAppointments],
    }).compileComponents();

    fixture = TestBed.createComponent(StaffAppointments);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
