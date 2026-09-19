import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmployeeCreateUpdate } from './employee-create-update';

describe('EmployeeCreateUpdate', () => {
  let component: EmployeeCreateUpdate;
  let fixture: ComponentFixture<EmployeeCreateUpdate>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EmployeeCreateUpdate],
    }).compileComponents();

    fixture = TestBed.createComponent(EmployeeCreateUpdate);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
