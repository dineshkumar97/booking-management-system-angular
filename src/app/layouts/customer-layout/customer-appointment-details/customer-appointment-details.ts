import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CustomerService } from '../customer-service';
import { ToastService } from '../../../toast/toast-service';

interface Appointment {
  id: string;
  serviceName: string;
  staffName: string;
  appointmentDate: string;
  startTime: string;
  endTime: string;
  price: number;
  status: string;
  notes: string;
}

@Component({
  selector: 'app-customer-appointment-details',
  imports: [],
  templateUrl: './customer-appointment-details.html',
  styleUrl: './customer-appointment-details.scss',
})
export class CustomerAppointmentDetails implements OnInit {

  appointmentId = '';
  showCancelDialog = false;

  appointment: any;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private customerService: CustomerService,
    private toast: ToastService
  ) { }

  ngOnInit(): void {

    this.appointmentId =
      this.route.snapshot.paramMap.get('id') || '';

    console.log('Appointment ID:', this.appointmentId);
    this.getAppointmentAll();
  }


  getAppointmentAll(): void {
    this.customerService.getCustomerAppointmentById(this.appointmentId).subscribe({
      next: (response: any) => {
        this.appointment = response.data;
      },
      error: (error) => {
      }
    });

  }
  goBack(): void {
    this.router.navigate([
      '/customer-appointment-list'
    ]);
  }

  openCancelDialog(): void {
    this.showCancelDialog = true;
  }

  closeCancelDialog(): void {
    this.showCancelDialog = false;
  }

  confirmCancel(): void {
    console.log('Cancel appointment:', this.appointment.id);

    this.showCancelDialog = false;
  }

  cancelAppointment(): void {
    if (!this.appointment) {
      return;
    }
    const appointmentId = this.appointment._id;
    this.customerService
      .cancelAppointment(appointmentId)
      .subscribe({
        next: (response) => {
          console.log('Cancel response:', response);
          this.toast.success(response.message)
          this.appointment.status = 'CANCELLED';
        },
        error: (error) => {
          console.error('Cancel error:', error);
          this.toast.success(error?.error?.message || 'Failed to cancel appointment.');
        }
      });
  }

}