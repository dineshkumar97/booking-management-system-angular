import {
  Component,
  inject,
  OnInit,
  PLATFORM_ID,
  signal
} from '@angular/core';

import { isPlatformBrowser } from '@angular/common';

import {
  UserService,
  User
} from '../../../pages/users/user-service';

import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';

import {
  AdminService,
  Service
} from '../admin-service';
import { ToastService } from '../../../toast/toast-service';

@Component({
  selector: 'app-staff-management',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './staff-management.html',
  styleUrl: './staff-management.scss'
})
export class StaffManagement implements OnInit {

  private platformId = inject(PLATFORM_ID);

  constructor(
    private userService: UserService,
    private adminService: AdminService,
    private fb: FormBuilder,
    private toast: ToastService
  ) { }


  // =========================
  // STAFF
  // =========================

  staffList = signal<User[]>([]);

  staffForm!: FormGroup;

  showCreateForm = signal(false);

  isEditMode = signal(false);

  selectedStaffId = signal<string | null>(null);


  // =========================
  // STAFF CHECKBOX
  // =========================

  selectedStaffIds = signal<string[]>([]);

  selectAllStaff = signal(false);


  // =========================
  // DELETE
  // =========================

  showDeletePopup = signal(false);

  selectedDeleteStaff = signal<User | null>(null);


  // =========================
  // SERVICES
  // =========================

  serviceList = signal<Service[]>([]);

  showServicePopup = signal(false);

  selectedServiceStaff = signal<User | null>(null);

  selectedServiceIds = signal<string[]>([]);


  // =========================
  // INIT
  // =========================

  ngOnInit(): void {

    this.staffForm = this.fb.group({

      name: [
        '',
        [
          Validators.required,
          Validators.minLength(2)
        ]
      ],

      email: [
        '',
        [
          Validators.required,
          Validators.email
        ]
      ],

      phone: [
        '',
        [
          Validators.required,
          Validators.pattern(/^[0-9]{10}$/)
        ]
      ],

      designation: [
        '',
        Validators.required
      ],

      status: [
        'ACTIVE',
        Validators.required
      ]

    });


    if (isPlatformBrowser(this.platformId)) {

      this.getStaff();

      this.getServices();

    }

  }


  // =========================
  // GET STAFF
  // =========================

  getStaff(): void {

    this.userService.getUsers().subscribe({

      next: (response: User[]) => {

        const staffUsers =response.filter(user => user.role === 'STAFF');

        this.staffList.set(staffUsers);
        console.log(
          'STAFF:',
          staffUsers
        );

      },

      error: error => {

        console.error(
          'Get staff error:',
          error
        );

        this.staffList.set([]);

      }

    });

  }


  // =========================
  // GET SERVICES
  // =========================

  getServices(): void {

    this.adminService.getServices().subscribe({
      next: (response: any) => {

        console.log('SERVICE API RESPONSE:', response);

        let services: Service[] = [];

        if (Array.isArray(response)) {

          services = response;

        } else if (Array.isArray(response?.services)) {

          services = response.services;

        } else if (Array.isArray(response?.data)) {

          services = response.data;

        }

        console.log('SERVICE LIST:', services);

        this.serviceList.set(services);
      },

      error: error => {

        console.error(
          'Get services error:',
          error
        );

        this.serviceList.set([]);
      }
    });
  }


  // =========================
  // CREATE STAFF
  // =========================

  createStaff(): void {

    this.isEditMode.set(false);

    this.selectedStaffId.set(null);

    this.staffForm.reset({

      name: '',

      email: '',

      phone: '',

      designation: '',

      status: 'ACTIVE'

    });

    this.showCreateForm.set(true);

  }


  // =========================
  // EDIT STAFF
  // =========================

  editStaff(staff: User): void {

    this.isEditMode.set(true);

    this.selectedStaffId.set(
      staff._id
    );

    this.staffForm.patchValue({

      name: staff.name || '',

      email: staff.email || '',

      phone: staff.phone || '',

      designation:
        staff.designation || '',

      status:
        staff.status || 'ACTIVE'

    });

    this.showCreateForm.set(true);

  }


  // =========================
  // CLOSE FORM
  // =========================

  closeForm(): void {

    this.showCreateForm.set(false);

    this.isEditMode.set(false);

    this.selectedStaffId.set(null);

  }


  // =========================
  // CREATE / UPDATE
  // =========================

  submitStaff(): void {

    if (this.staffForm.invalid) {

      this.staffForm.markAllAsTouched();

      return;

    }


    const formData =
      this.staffForm.getRawValue();


    const staffData = {

      name: formData.name,

      email: formData.email,

      phone:parseInt( formData.phone),

      designation:
        formData.designation,

      status:
        formData.status,

      role: 'STAFF'

    };


    // CREATE

    if (!this.isEditMode()) {

      this.userService
        .createUser(staffData)
        .subscribe({

          next: (response:any) => {

            this.closeForm();

            this.getStaff();
            this.toast.success(response.message);

          },

          error: (error:any) => {
            this.toast.error(error.error.error);

            console.error(
              'Create staff error:',
              error
            );

          }

        });

      return;

    }


    // UPDATE

    const staffId =
      this.selectedStaffId();


    if (!staffId) {

      return;

    }


    this.userService
      .updateUser(
        staffId,
        staffData
      )
      .subscribe({

        next: (response:any) => {

          this.closeForm();

          this.getStaff();
            this.toast.success(response.message);

        },

        error: (error:any) => {
            this.toast.error(error.error.error);

          console.error(
            'Update staff error:',
            error
          );

        }

      });

  }


  // =========================
  // STAFF CHECKBOX
  // =========================

  toggleStaffSelection(
    staffId: string,
    checked: boolean
  ): void {

    if (checked) {

      // Only one staff can be selected
      this.selectedStaffIds.set([staffId]);

    } else {

      // Remove selection
      this.selectedStaffIds.set([]);

    }

    console.log(
      'Selected Staff IDs:',
      this.selectedStaffIds()
    );
  }
  // =========================
  // SELECT ALL
  // =========================

  toggleSelectAll(
    checked: boolean
  ): void {

    this.selectAllStaff.set(
      checked
    );


    if (checked) {

      this.selectedStaffIds.set(

        this.staffList().map(
          staff => staff._id
        )

      );

    } else {

      this.selectedStaffIds.set([]);

    }

  }


  // =========================
  // CHECK STAFF
  // =========================

  isStaffSelected(staffId: string): boolean {

    return this.selectedStaffIds().includes(staffId);

  }
  // =========================
  // OPEN SERVICES
  // =========================

  openServices(): void {

    const selectedId = this.selectedStaffIds()[0];

    if (!selectedId) {
      return;
    }

    const staff = this.staffList().find(
      item => item._id === selectedId
    );

    if (!staff) {
      return;
    }

    console.log('Selected Staff:', staff);

    this.selectedServiceStaff.set(staff);

    // Convert populated service objects to service IDs
    const serviceIds = Array.isArray(staff.services)
      ? staff.services.map((service: any) =>
        typeof service === 'string'
          ? service
          : service._id
      )
      : [];

    this.selectedServiceIds.set(serviceIds);

    console.log(
      'Selected Service IDs:',
      serviceIds
    );

    this.showServicePopup.set(true);
  }
  // =========================
  // SERVICE CHECKBOX
  // =========================

  toggleService(
    serviceId: string
  ): void {

    const current =
      [...this.selectedServiceIds()];


    if (current.includes(serviceId)) {

      this.selectedServiceIds.set(

        current.filter(
          id => id !== serviceId
        )

      );

    } else {

      this.selectedServiceIds.set([

        ...current,

        serviceId

      ]);

    }

  }


  // =========================
  // SERVICE SELECTED
  // =========================

  isServiceSelected(
    serviceId: string
  ): boolean {

    return this.selectedServiceIds()
      .includes(serviceId);

  }


  // =========================
  // CLOSE SERVICE POPUP
  // =========================

  closeServicePopup(): void {

    this.showServicePopup.set(false);

    this.selectedServiceStaff.set(null);

    this.selectedServiceIds.set([]);

  }


  // =========================
  // SAVE SERVICES
  // =========================

  saveStaffServices(): void {
    const staff = this.selectedServiceStaff();
    if (!staff) {
      return;
    }
    const selectedServices = this.selectedServiceIds();
    // No service selected
    if (selectedServices.length === 0) {
      this.toast.warning('Please select at least one service.')

      return;
    }
    console.log('STAFF ID:', staff._id);
    console.log('SERVICES:', selectedServices);
    let json = {
      services: selectedServices
    }

    this.userService.assignStaffServie(staff._id, json).subscribe({

      next: (response: any) => {
        this.toast.success(response.message);

        // Clear selected staff checkbox
        this.selectedStaffIds.set([]);

        // Clear select-all checkbox
        this.selectAllStaff.set(false);

        // Close service popup
        this.closeServicePopup();

        // Refresh staff list
        this.getStaff();
      },

      error: (error: any) => {

        console.error(
          'Get staff error:',
          error
        );

        this.toast.error(error.error.error);
        this.staffList.set([]);

      }

    });

    // API will be connected here
  }


  // =========================
  // DELETE
  // =========================

  deleteStaff(
    staff: User
  ): void {

    this.selectedDeleteStaff.set(
      staff
    );

    this.showDeletePopup.set(
      true
    );

  }


  cancelDelete(): void {

    this.showDeletePopup.set(false);

    this.selectedDeleteStaff.set(null);

  }


  confirmDelete(): void {

    const staff =
      this.selectedDeleteStaff();


    if (!staff) {

      return;

    }


    this.userService
      .deleteUser(staff._id)
      .subscribe({

        next: () => {

          this.cancelDelete();

          this.getStaff();

        },

        error: error => {

          console.error(
            'Delete staff error:',
            error
          );

        }

      });

  }

}