import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomerAppointmentsList } from './customer-appointments-list';

describe('CustomerAppointmentsList', () => {
  let component: CustomerAppointmentsList;
  let fixture: ComponentFixture<CustomerAppointmentsList>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CustomerAppointmentsList],
    }).compileComponents();

    fixture = TestBed.createComponent(CustomerAppointmentsList);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
