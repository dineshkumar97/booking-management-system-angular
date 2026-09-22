import {
  Component,
  OnInit,
  signal
} from '@angular/core';

import {
  CommonModule
} from '@angular/common';

import {Appointment} from '../admin-service';

import {
  AdminService
} from '../admin-service';

import {
  ToastService
} from '../../../toast/toast-service';

@Component({
  selector: 'app-appointment-management',
  standalone: true,
  imports: [
    CommonModule
  ],
  templateUrl: './appointment-management.html',
  styleUrl: './appointment-management.scss'
})
export class AppointmentManagement
  implements OnInit {

  appointments = signal<Appointment[]>([]);

  isLoading = signal(false);

  constructor(
    private appointmentService: AdminService,
    private toast: ToastService
  ) {}

  ngOnInit(): void {
    this.getAppointments();
  }

  // ==========================================
  // GET MY APPOINTMENTS
  // ==========================================

  getAppointments(): void {

    this.isLoading.set(true);

    this.appointmentService
      .getAllAppointments()
      .subscribe({

        next: (response: any) => {

          console.log(
            'APPOINTMENT API RESPONSE:',
            response
          );

          this.appointments.set(
            response?.data || []
          );

          this.isLoading.set(false);
        },

        error: (error: any) => {

          console.error(
            'Get appointments error:',
            error
          );

          this.appointments.set([]);

          this.isLoading.set(false);

          this.toast.error(
            error?.error?.message ||
            'Failed to fetch appointments'
          );
        }
      });
  }


  // ==========================================
  // CANCEL APPOINTMENT
  // ==========================================

  cancelAppointment(
    appointmentId: string
  ): void {

    this.appointmentService
      .cancelAppointment(appointmentId)
      .subscribe({

        next: (response: any) => {

          this.toast.success(
            response?.message ||
            'Appointment cancelled successfully'
          );

          this.getAppointments();
        },

        error: (error: any) => {

          console.error(
            'Cancel appointment error:',
            error
          );

          this.toast.error(
            error?.error?.message ||
            'Failed to cancel appointment'
          );
        }
      });
  }


  // ==========================================
  // STATUS CLASS
  // ==========================================

  getStatusClass(
    status: string
  ): string {

    switch (status) {

      case 'PENDING':
        return 'status-pending';

      case 'CONFIRMED':
        return 'status-confirmed';

      case 'COMPLETED':
        return 'status-completed';

      case 'CANCELLED':
        return 'status-cancelled';

      case 'REJECTED':
        return 'status-rejected';

      default:
        return '';
    }
  }


  // ==========================================
  // SERVICE NAME
  // ==========================================

  getServiceName(
    appointment: Appointment
  ): string {

    if (
      typeof appointment.serviceId === 'object'
    ) {
      return appointment.serviceId.name;
    }

    return appointment.serviceId;
  }


  // ==========================================
  // STAFF NAME
  // ==========================================

  getStaffName(
    appointment: Appointment
  ): string {

    if (
      typeof appointment.staffId === 'object'
    ) {
      return appointment.staffId.name;
    }

    return appointment.staffId;
  }


  // ==========================================
  // DATE FORMAT
  // ==========================================

  formatDate(
    date: string
  ): string {

    return new Date(date)
      .toLocaleDateString(
        'en-IN',
        {
          day: '2-digit',
          month: 'short',
          year: 'numeric'
        }
      );
  }
}