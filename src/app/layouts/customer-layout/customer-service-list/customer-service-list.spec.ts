import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomerServiceList } from './customer-service-list';

describe('CustomerServiceList', () => {
  let component: CustomerServiceList;
  let fixture: ComponentFixture<CustomerServiceList>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CustomerServiceList],
    }).compileComponents();

    fixture = TestBed.createComponent(CustomerServiceList);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
