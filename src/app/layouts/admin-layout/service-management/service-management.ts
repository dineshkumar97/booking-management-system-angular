import {
  Component,
  inject,
  OnInit,
  PLATFORM_ID,
  signal
} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';
import { AdminService, Service } from '../admin-service';
import { ToastService } from '../../../toast/toast-service';
@Component({
  selector: 'app-service-management',
  standalone: true,
  imports: [
    ReactiveFormsModule
  ],
  templateUrl: './service-management.html',
  styleUrl: './service-management.scss'
})
export class ServiceManagement implements OnInit {
  private platformId = inject(PLATFORM_ID);
  constructor(
    private serviceService: AdminService,
    private fb: FormBuilder,
    private toast: ToastService
  ) { }
  // =====================================================
  // SERVICE LIST
  // =====================================================
  serviceList = signal<Service[]>([]);
  // =====================================================
  // FORM
  // =====================================================
  serviceForm!: FormGroup;
  // =====================================================
  // CREATE / EDIT
  // =====================================================
  showCreateForm = signal(false);
  isEditMode = signal(false);
  selectedServiceId = signal<string | null>(null);
  // =====================================================
  // DELETE
  // =====================================================
  showDeletePopup = signal(false);
  selectedDeleteService = signal<Service | null>(null);
  // =====================================================
  // INIT
  // =====================================================

  selectedDuration: number = 30;

  durationOptions: number[] = [15, 30, 45, 60];
  ngOnInit(): void {
    this.serviceForm = this.fb.group({
      name: [
        '',
        [
          Validators.required,
          Validators.minLength(2)
        ]
      ],
      description: [
        '',
        Validators.required
      ],
      duration: [
        '',
        [
          Validators.required,
          Validators.min(1)
        ]
      ],
      price: [
        '',
        [
          Validators.required,
          Validators.min(0)
        ]
      ],
      status: [
        'ACTIVE',
        Validators.required
      ]
    });
    if (isPlatformBrowser(this.platformId)) {
      this.getServices();
    }
  }
  // =====================================================
  // GET SERVICES
  // =====================================================
  getServices(): void {
    this.serviceService
      .getServices()
      .subscribe({
        next: (response: any) => {
          this.serviceList.set(response.data);
        },
        error: (error) => {
          console.error(
            'Get services error:',
            error
          );
        }
      });
  }
  // =====================================================
  // CREATE SERVICE
  // =====================================================
  createService(): void {
    this.isEditMode.set(false);
    this.selectedServiceId.set(null);
    this.serviceForm.reset({
      name: '',
      description: '',
      duration: '',
      price: '',
      status: 'ACTIVE'
    });
    this.showCreateForm.set(true);
  }
  // =====================================================
  // EDIT SERVICE
  // =====================================================
  editService(service: Service): void {
    console.log(
      'Edit Service:',
      service
    );
    this.isEditMode.set(true);
    this.selectedServiceId.set(
      service._id
    );
    this.serviceForm.patchValue({
      name: service.name || '',
      description: service.description || '',
      duration: service.duration ?? '',
      price: service.price ?? '',
      status: service.status || 'ACTIVE'
    });
    this.showCreateForm.set(true);
  }
  // =====================================================
  // SUBMIT SERVICE
  // =====================================================
  submitService(): void {
    if (this.serviceForm.invalid) {
      this.serviceForm.markAllAsTouched();
      return;
    }
    const formData =
      this.serviceForm.getRawValue();
    const serviceData = {
      name: formData.name,
      description: formData.description,
      duration: Number(formData.duration),
      price: Number(formData.price),
      status: formData.status
    };
    console.log(
      'Service Data:',
      serviceData
    );
    // =================================================
    // CREATE
    // =================================================
    if (!this.isEditMode()) {
      this.serviceService
        .createService(serviceData)
        .subscribe({
          next: (response) => {
            console.log(
              'Service created:',
              response
            );
            this.toast.success(response.message);
            this.closeForm();
            this.getServices();
          },
          error: (error) => {
            this.toast.error(error.error.error);
            console.error(
              'Create service error:',
              error
            );
          }
        });
      return;
    }
    // =================================================
    // UPDATE
    // =================================================
    const serviceId =
      this.selectedServiceId();
    if (!serviceId) {
      console.error(
        'Service ID not found'
      );
      return;
    }
    this.serviceService
      .updateService(
        serviceId,
        serviceData
      )
      .subscribe({
        next: (response) => {
          this.toast.success(response.message);
          console.log(
            'Service updated:',
            response
          );
          this.closeForm();
          this.getServices();
        },
        error: (error) => {
          this.toast.error(error.error.error);
          console.error(
            'Update service error:',
            error
          );
        }
      });
  }
  // =====================================================
  // CLOSE FORM
  // =====================================================
  closeForm(): void {
    this.showCreateForm.set(false);
    this.isEditMode.set(false);
    this.selectedServiceId.set(null);
  }
  // =====================================================
  // DELETE SERVICE
  // =====================================================
  deleteService(service: Service): void {
    console.log(
      'Delete Service:',
      service
    );
    this.selectedDeleteService.set(
      service
    );
    this.showDeletePopup.set(true);
  }
  // =====================================================
  // CANCEL DELETE
  // =====================================================
  cancelDelete(): void {
    this.showDeletePopup.set(false);
    this.selectedDeleteService.set(null);
  }
  // =====================================================
  // CONFIRM DELETE
  // =====================================================
  confirmDelete(): void {
    const service =
      this.selectedDeleteService();
    if (!service) {
      return;
    }
    this.serviceService
      .deleteService(service._id)
      .subscribe({
        next: (response) => {
          console.log(
            'Service deleted:',
            response
          );
          this.cancelDelete();
          this.getServices();
        },
        error: (error) => {
          console.error(
            'Delete service error:',
            error
          );
        }
      });
  }
}