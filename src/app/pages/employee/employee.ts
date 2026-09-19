import { Component, computed, inject, OnInit, PLATFORM_ID, signal } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { CommonDatePipe } from '../../common/common-date.pipe';
import { EmployeeList, EmployeeService } from './employee-service';
import { EmployeeCreateUpdate } from './employee-create-update/employee-create-update';
import { ToastService } from '../../toast/toast-service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-employee',
  imports: [CommonDatePipe, EmployeeCreateUpdate, FormsModule],
  templateUrl: './employee.html',
  styleUrl: './employee.scss',
})
export class Employee implements OnInit {
  isEditMode = false;
  selectedEmployee: any = null;
  employees = signal<EmployeeList[]>([]);
  private platformId = inject(PLATFORM_ID);
  showEmployeeForm = false;

  constructor(private employeeService: EmployeeService, private toastService: ToastService) { }

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.getEmployees();
    }
  }

  getEmployees(): void {
    this.employeeService.getEmployees().subscribe({
      next: (response) => {
        console.log('Employees API response:', response);
        this.employees.set(response);
      },
      error: (error) => {
        console.error('Employees API error:', error);
      }

    });

  }





  addEmployee(): void {
    this.isEditMode = false;
    this.selectedEmployee = null;
    this.showEmployeeForm = true;
  }

  closeEmployeeForm(): void {
    this.showEmployeeForm = false;
  }

  editEmployee(employee: any): void {
    console.log(employee)
    this.isEditMode = true;
    this.selectedEmployee = employee;
    this.showEmployeeForm = true;
    console.log(this.isEditMode)
  }

  closeEmployeePopup(): void {
    this.showEmployeeForm = false;
    this.selectedEmployee = null;
  }



  employeeSaved(): void {
    this.getEmployees();
    this.closeEmployeeForm();
    this.selectedEmployee = null;
  }

  isConfirmActive = false;
  showStatusPopup = false;
  openStatusConfirmation(employee: any): void {
    this.selectedEmployee = employee;
    this.showStatusPopup = true;
  } closeStatusPopup(): void {
    this.showStatusPopup = false;
    this.selectedEmployee = null;
  }
  confirmStatusChange(): void {
    const employeeId = this.selectedEmployee?._id;
    if (!employeeId) {
      return;
    }
    this.employeeService
      .toggleEmployeeStatus(employeeId)
      .subscribe({
        next: (response: any) => {
          this.toastService.success(
            response?.message || 'Status updated successfully'
          );
          this.closeStatusPopup();
          this.getEmployees();
        },
        error: (error) => {
          this.toastService.error(
            error?.error?.message || 'Failed to update status'
          );
        }
      });
  }


  searchName = '';
  searchEmail = '';
  searchDepartment = '';
  searchStatus = '';

  searchEmployees() {
    const body = {
      name: this.searchName,
      email: this.searchEmail,
      department: this.searchDepartment,
      isActive: this.searchStatus === ''
        ? null
        : this.searchStatus === 'true'
    };
    console.log('Search body:', body);
    this.employeeService.searchEmployees(body).subscribe({
      next: (response: any) => {
        this.employees.set(response.data);
      },
      error: (error) => {
        console.error('Search failed:', error);
      }
    });
  }

  clearSearch() {

    this.searchName = '';
    this.searchEmail = '';
    this.searchDepartment = '';
    this.searchStatus = '';

    this.getEmployees();
  }

  exportExcel() {

    const body = {
      name: this.searchName,
      email: this.searchEmail,
      department: this.searchDepartment,
      isActive: this.searchStatus === ''
        ? null
        : this.searchStatus === 'true'
    };

    this.employeeService
      .exportEmployeesExcel(body)
      .subscribe({
        next: (response) => {

          const blob = new Blob(
            [response],
            {
              type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
            }
          );

          const url = window.URL.createObjectURL(blob);

          const link = document.createElement('a');

          link.href = url;
          link.download = 'Employee_List.xlsx';

          link.click();

          window.URL.revokeObjectURL(url);
        },

        error: (error) => {
          console.error(error);
        }
      });
  }

  exportPDF() {

    const body = {
      name: this.searchName,
      email: this.searchEmail,
      department: this.searchDepartment,
      isActive: this.searchStatus === ''
        ? null
        : this.searchStatus === 'true'
    };

    this.employeeService
      .exportEmployeesPDF(body)
      .subscribe({
        next: (response) => {

          const blob = new Blob(
            [response],
            {
              type: 'application/pdf'
            }
          );

          const url = window.URL.createObjectURL(blob);

          const link = document.createElement('a');

          link.href = url;
          link.download = 'Employee_List.pdf';

          link.click();

          window.URL.revokeObjectURL(url);
        },

        error: (error) => {
          console.error(error);
        }
      });
  }

  currentPage = signal(1);
  pageSize = signal(10);

  // Total pages
  totalPages = computed(() =>
    Math.ceil(this.employees().length / this.pageSize())
  );

  // Employees displayed on current page
  paginatedEmployees = computed(() => {

    const start = (this.currentPage() - 1) * this.pageSize();
    const end = start + this.pageSize();

    return this.employees().slice(start, end);
  });

  // Change page
  goToPage(page: number) {

    if (page < 1 || page > this.totalPages()) {
      return;
    }

    this.currentPage.set(page);
  }

  // Previous
  previousPage() {

    if (this.currentPage() > 1) {
      this.currentPage.update(page => page - 1);
    }
  }

  // Next
  nextPage() {

    if (this.currentPage() < this.totalPages()) {
      this.currentPage.update(page => page + 1);
    }
  }

  // Page numbers
  pages = computed(() =>
    Array.from(
      { length: this.totalPages() },
      (_, i) => i + 1
    )
  );

}
