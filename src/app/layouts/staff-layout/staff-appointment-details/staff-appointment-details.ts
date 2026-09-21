import { DatePipe } from '@angular/common';
import { Component, OnInit, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CustomerService } from '../../customer-layout/customer-service';
import { ToastService } from '../../../toast/toast-service';

@Component({
  selector: 'app-staff-appointment-details',
  standalone: true,
  imports: [DatePipe],
  templateUrl: './staff-appointment-details.html',
  styleUrl: './staff-appointment-details.scss'
})
export class StaffAppointmentDetails implements OnInit {
  appointmentId = '';
  appointment = signal<any | null>(null);
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private customerService: CustomerService,
    private toastService: ToastService
  ) { }

  ngOnInit(): void {
    this.appointmentId =
      this.route.snapshot.paramMap.get('id') || '';
    console.log(
      'Appointment ID:',
      this.appointmentId
    );
    if (this.appointmentId) {
      this.getAppointmentDetails();
    }
  }

  getAppointmentDetails(): void {

    this.customerService
      .getStaffAppointmentsID(this.appointmentId)
      .subscribe({

        next: (response: any) => {
          console.log('API Response:', response);
          const selectedAppointment = response?.data?.find(
            (item: any) =>
              item._id === this.appointmentId
          );
          console.log(
            'Selected Appointment:',
            selectedAppointment
          );
          this.appointment.set(
            selectedAppointment ?? null
          );

          console.log(
            'Appointment:',
            this.appointment()
          );

        },

        error: (error) => {

          console.error(
            'Error loading appointment details:',
            error
          );

          this.appointment.set(null);

        }

      });

  }

  backToAppointments(): void {
    this.router.navigate([
      '/staff-appointments'
    ]);
  }

  confirmAppointment(): void {
    this.customerService
      .confirmStaffAppointment(this.appointmentId)
      .subscribe({
        next: (response: any) => {
          console.log(
            'Appointment Confirmed:',
            response
          );
          this.appointment.update(
            (current: any) => current
              ? {
                ...current,
                status: 'CONFIRMED'
              }
              : null
          );
          this.toastService.success(response.message);
        },

        error: (error) => {
          this.toastService.success(error?.error?.message);
          console.error(
            'Confirm appointment error:',
            error
          );

        }

      });

  }

  rejectAppointment(): void {
    this.customerService
      .rejectStaffAppointment(this.appointmentId)
      .subscribe({
        next: (response: any) => {
          console.log(
            'Appointment Rejected:',
            response
          );
          this.appointment.update((current: any) => current ? {
            ...current,
            status: 'REJECTED'
          } : null);
          this.toastService.success(response.message);
        },

        error: (error) => {
          this.toastService.success(error?.error?.message);
          console.error(
            'Reject appointment error:',
            error
          );

        }

      });

  }

  completeAppointment(): void {
    this.customerService
      .completeStaffAppointment(this.appointmentId)
      .subscribe({
        next: (response: any) => {
          console.log('Appointment Completed:', response);

          this.appointment.update(
            (current: any) =>
              current
                ? { ...current, status: 'COMPLETED' }
                : null
          );
        },
        error: (error) => {
          console.error(
            'Complete appointment error:',
            error
          );
        }
      });
  }

}