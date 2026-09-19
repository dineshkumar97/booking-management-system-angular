import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomerAppointmentDetails } from './customer-appointment-details';

describe('CustomerAppointmentDetails', () => {
  let component: CustomerAppointmentDetails;
  let fixture: ComponentFixture<CustomerAppointmentDetails>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CustomerAppointmentDetails],
    }).compileComponents();

    fixture = TestBed.createComponent(CustomerAppointmentDetails);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
