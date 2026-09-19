import {
  Component,
  EventEmitter,
  OnInit,
  Output,
  effect,
  inject,
  input
} from '@angular/core';

import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';
import { EmployeeService } from '../employee-service';
import { ToastService } from '../../../toast/toast-service';

@Component({
  selector: 'app-employee-create-update',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './employee-create-update.html',
  styleUrl: './employee-create-update.scss'
})
export class EmployeeCreateUpdate implements OnInit {

  employee = input<any>(null);
  isEditMode = input(false);
  employeeForm!: FormGroup
  @Output() close = new EventEmitter<void>();
  @Output() save = new EventEmitter<any>();
  @Output() employeeTable = new EventEmitter<void>();
  private fb = inject(FormBuilder);
  departmentList!: any;



  constructor(private employeeService: EmployeeService, private toastService: ToastService
  ) {

    effect(() => {
      const employee = this.employee();
      if (!employee) {
        return;
      }
      this.employeeForm.patchValue({
        name: employee.name,
        email: employee.email,
        phone: employee.phone,
        department: employee.department,
        dob: employee.dob
      });
      console.log('🔥 FORM VALUE:', this.employeeForm.getRawValue());
    });
  }

  ngOnInit(): void {
    this.loadEmployeeForm();
    this.getDepartmentList();
  }

  loadEmployeeForm(): void {
    this.employeeForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', [
        Validators.required,
        Validators.pattern(/^[0-9]{10}$/)
      ]],
      department: ['', Validators.required],
      dob: ['', Validators.required]

    });
  }

  closePopup(): void {
    this.close.emit();
  }

  saveUpdate(): void {
    if (this.employeeForm.invalid) {
      this.employeeForm.markAllAsTouched();
      return;
    }
    console.log(this.isEditMode())
    if (!this.isEditMode()) {
      const formData = this.employeeForm.getRawValue();
      this.save.emit({
        isEditMode: this.isEditMode(),
        employeeId: this.employee()?._id,
        data: formData
      });
      this.employeeService.createEmployee(this.employeeForm.value).subscribe({
        next: (response: any) => {
          this.toastService.success(response.message);
          this.employeeTable.emit();
          this.closePopup();
          // Navigate after token is stored
        },
        error: (error) => {
          this.toastService.error(
            error?.error?.message || 'Employee failed'
          );
        }

      });
    } else {
      const formData = this.employeeForm.getRawValue();
      const employeeId = this.employee()?._id;

      this.employeeService.updateEmployee(employeeId, formData)
        .subscribe({
          next: (response: any) => {
            this.toastService.success(
              response?.message || 'Employee updated successfully'
            );

            this.employeeTable.emit();
            this.closePopup();
          },
          error: (error) => {
            this.toastService.error(
              error?.error?.message || 'Employee update failed'
            );
          }
        });
    }

  }

  getDepartmentList(): void {
    this.employeeService.getDepartment().subscribe({
      next: (response: any) => {
        this.departmentList = response;
      },
      error: (error) => {
        this.toastService.error(
          error?.error?.message || 'Employee failed'
        );
      }
    });
  }
}