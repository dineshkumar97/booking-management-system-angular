import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StaffAppointmentDetails } from './staff-appointment-details';

describe('StaffAppointmentDetails', () => {
  let component: StaffAppointmentDetails;
  let fixture: ComponentFixture<StaffAppointmentDetails>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StaffAppointmentDetails],
    }).compileComponents();

    fixture = TestBed.createComponent(StaffAppointmentDetails);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
