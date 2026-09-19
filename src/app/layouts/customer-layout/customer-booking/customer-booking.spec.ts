import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomerBooking } from './customer-booking';

describe('CustomerBooking', () => {
  let component: CustomerBooking;
  let fixture: ComponentFixture<CustomerBooking>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CustomerBooking],
    }).compileComponents();

    fixture = TestBed.createComponent(CustomerBooking);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
