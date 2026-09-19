
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
import { ToastService } from '../../../toast/toast-service';
import { DepartmentService } from '../department-service';


@Component({
  selector: 'app-department-form',
  imports: [ReactiveFormsModule],
  templateUrl: './department-form.html',
  styleUrl: './department-form.scss',
})
export class DepartmentForm implements OnInit {

  departmentEditValue = input<any>(null);
  isEditMode = input(false);
  departmentForm!: FormGroup
  @Output() close = new EventEmitter<void>();
  @Output() save = new EventEmitter<any>();
  @Output() departmentTable = new EventEmitter<void>();
  private fb = inject(FormBuilder);



  constructor(private departmentService: DepartmentService, private toastService: ToastService
  ) {

    effect(() => {
      const employee = this.departmentEditValue();
      if (!employee) {
        return;
      }
      this.departmentForm.patchValue({
        name: employee.name,
      });
      console.log('🔥 FORM VALUE:', this.departmentForm.getRawValue());
    });
  }

  ngOnInit(): void {
    this.loaddepartmentForm();
  }

  loaddepartmentForm(): void {
    this.departmentForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2)]],

    });
  }

  closePopup(): void {
    this.close.emit();
  }

  saveUpdate(): void {
    if (this.departmentForm.invalid) {
      this.departmentForm.markAllAsTouched();
      return;
    }
    console.log(this.isEditMode())
    if (!this.isEditMode()) {
      const formData = this.departmentForm.getRawValue();
      this.save.emit({
        isEditMode: this.isEditMode(),
        departmentId: this.departmentEditValue()?._id,
        data: formData
      });
      this.departmentService.createDepartment(this.departmentForm.value).subscribe({
        next: (response: any) => {
          this.toastService.success(response.message);
          this.departmentTable.emit();
          this.closePopup();
        },
        error: (error) => {
          this.toastService.error(
            error?.error?.message || 'Department failed'
          );
        }

      });
    } else {
      const formData = this.departmentForm.getRawValue();
      const departmentId = this.departmentEditValue()?._id;
      this.departmentService.updateDepartment(departmentId, formData)
        .subscribe({
          next: (response: any) => {
            this.toastService.success(
              response?.message || 'Department updated successfully'
            );

            this.departmentTable.emit();
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
}