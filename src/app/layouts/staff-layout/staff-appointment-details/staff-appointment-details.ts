import { DatePipe } from '@angular/common';
import { Component, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CustomerService } from '../../customer-layout/customer-service';
import { ToastService } from '../../../toast/toast-service';

@Component({
  selector: 'app-staff-appointment-details',
  standalone: true,
  imports: [
    DatePipe,
    FormsModule
  ],
  templateUrl: './staff-appointment-details.html',
  styleUrl: './staff-appointment-details.scss'
})
export class StaffAppointmentDetails implements OnInit {

  appointmentId = '';

  appointment = signal<any | null>(null);

  // Reject popup
  showRejectPopup = signal(false);

  rejectionComment = '';

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

          console.log(
            'API Response:',
            response
          );

          const selectedAppointment =
            response.data;

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
      .confirmStaffAppointment(
        this.appointmentId
      )
      .subscribe({

        next: (response: any) => {

          console.log(
            'Appointment Confirmed:',
            response
          );

          this.appointment.update(
            (current: any) =>
              current
                ? {
                    ...current,
                    status: 'CONFIRMED'
                  }
                : null
          );

          this.toastService.success(
            response.message
          );
        },

        error: (error) => {

          this.toastService.error(
            error?.error?.message ||
            'Failed to confirm appointment'
          );

          console.error(
            'Confirm appointment error:',
            error
          );
        }
      });
  }

  // ==============================
  // REJECT POPUP
  // ==============================

  openRejectPopup(): void {

    this.rejectionComment = '';

    this.showRejectPopup.set(true);
  }

  closeRejectPopup(): void {

    this.showRejectPopup.set(false);

    this.rejectionComment = '';
  }

  submitRejectAppointment(): void {

    if (!this.rejectionComment.trim()) {

      this.toastService.error(
        'Please enter rejection comment'
      );

      return;
    }

    this.customerService
      .rejectStaffAppointment(
        this.appointmentId,
        this.rejectionComment.trim()
      )
      .subscribe({

        next: (response: any) => {

          console.log(
            'Appointment Rejected:',
            response
          );

          this.appointment.update(
            (current: any) =>
              current
                ? {
                    ...current,
                    status: 'REJECTED',
                    notes:
                      this.rejectionComment.trim()
                  }
                : null
          );

          this.toastService.success(
            response.message
          );

          this.closeRejectPopup();
        },

        error: (error) => {

          this.toastService.error(
            error?.message
          );

          console.error(
            'Reject appointment error:',
            error
          );
        }
      });
  }

  completeAppointment(): void {

    this.customerService
      .completeStaffAppointment(
        this.appointmentId
      )
      .subscribe({

        next: (response: any) => {

          console.log(
            'Appointment Completed:',
            response
          );

          this.appointment.update(
            (current: any) =>
              current
                ? {
                    ...current,
                    status: 'COMPLETED'
                  }
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