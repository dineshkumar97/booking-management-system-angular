import { Component, inject, OnInit, PLATFORM_ID, signal } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { ToastService } from '../../toast/toast-service';
import { FormsModule } from '@angular/forms';
import { DepartmentForm } from './department-form/department-form';
import { DepartmentService, DepartmentList } from './department-service';

@Component({
  selector: 'app-department',
  imports: [FormsModule, DepartmentForm],
  templateUrl: './department.html',
  styleUrl: './department.scss',
})
export class Department implements OnInit {
  isEditMode = false;
  selectedDepartment: any = null;
  departments = signal<DepartmentList[]>([]);
  private platformId = inject(PLATFORM_ID);
  showDepartmentForm = false;

  constructor(private departmentService: DepartmentService, private toastService: ToastService) { }

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.getDepartment();
    }
  }

  getDepartment(): void {
    this.departmentService.getDepartment().subscribe({
      next: (response) => {
        console.log('Employees API response:', response);
        this.departments.set(response);
      },
      error: (error) => {
        console.error('Employees API error:', error);
      }

    });

  }





  addDepartment(): void {
    this.isEditMode = false;
    this.selectedDepartment = null;
    this.showDepartmentForm = true;
  }

  closeDepartmentForm(): void {
    this.showDepartmentForm = false;
    this.selectedDepartment = null;

  }

  editDepartment(employee: any): void {
    console.log(employee)
    this.isEditMode = true;
    this.selectedDepartment = employee;
    this.showDepartmentForm = true;
    console.log(this.isEditMode)
  }



  departmentSaved(): void {
    this.getDepartment();
    this.closeDepartmentForm();
    this.selectedDepartment = null;
  }

  isConfirmActive = false;
  showStatusPopup = false;
  openStatusConfirmation(employee: any): void {
    this.selectedDepartment = employee;
    this.showStatusPopup = true;
  } closeStatusPopup(): void {
    this.showStatusPopup = false;
    this.selectedDepartment = null;
  }
  // confirmStatusChange(): void {
  //   const departmentId = this.selectedDepartment?._id;
  //   if (!departmentId) {
  //     return;
  //   }
  //   this.departmentService
  //     .toggleDepartmentStatus(departmentId)
  //     .subscribe({
  //       next: (response: any) => {
  //         this.toastService.success(
  //           response?.message || 'Status updated successfully'
  //         );
  //         this.closeStatusPopup();
  //         this.getDepartment();
  //       },
  //       error: (error) => {
  //         this.toastService.error(
  //           error?.error?.message || 'Failed to update status'
  //         );
  //       }
  //     });
  // }

  confirmStatusChange(department?: any) {
    console.log(this.selectedDepartment)
    this.departmentService.deleteDepartment(this.selectedDepartment._id)
      .subscribe({
        next: (response: any) => {
          console.log(response);
          this.getDepartment();
          this.closeStatusPopup();
        },
        error: (error) => {
          console.error(error);
        }
      });
  }




}
