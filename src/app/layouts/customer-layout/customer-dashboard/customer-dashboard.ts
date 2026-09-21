import { Component, OnInit } from '@angular/core';
import { DatePipe } from '@angular/common';
import { Router } from '@angular/router';
import { CustomerService } from '../customer-service';

@Component({
  selector: 'app-customer-dashboard',
  imports: [DatePipe],
  templateUrl: './customer-dashboard.html',
  styleUrl: './customer-dashboard.scss',
})
export class CustomerDashboard implements OnInit {

  userName = 'Dinesh';

  recentAppointments: any[] = [];

  upcomingAppointment: any = null;

  showCancelDialog = false;

  cancelLoading = false;

  statistics = {
    upcoming: 0,
    completed: 0,
    cancelled: 0
  };

  constructor(
    private router: Router,
    private customerService: CustomerService
  ) {}

  ngOnInit(): void {
    this.getMyAppointments();
  }

  // =========================
  // GET MY APPOINTMENTS
  // =========================

  getMyAppointments(): void {

    this.customerService.getMyAppointments().subscribe({

      next: (response: any) => {

        const appointments = response?.data || [];

        this.recentAppointments = appointments;

        // =========================
        // STATISTICS
        // =========================

        this.statistics.upcoming = appointments.filter(
          (appointment: any) =>
            appointment.status === 'PENDING' ||
            appointment.status === 'CONFIRMED'
        ).length;

        this.statistics.completed = appointments.filter(
          (appointment: any) =>
            appointment.status === 'COMPLETED'
        ).length;

        this.statistics.cancelled = appointments.filter(
          (appointment: any) =>
            appointment.status === 'CANCELLED'
        ).length;

        // =========================
        // FIND UPCOMING APPOINTMENT
        // =========================

        const upcoming = appointments
          .filter(
            (appointment: any) =>
              appointment.status === 'PENDING' ||
              appointment.status === 'CONFIRMED'
          )
          .sort(
            (a: any, b: any) =>
              new Date(a.appointmentDate).getTime() -
              new Date(b.appointmentDate).getTime()
          );

        if (upcoming.length > 0) {

          const appointment = upcoming[0];

          this.upcomingAppointment = {
            id: appointment._id,
            service: appointment.serviceId?.name || '',
            status: appointment.status,
            date: appointment.appointmentDate,
            time: appointment.startTime,
            staff: appointment.staffId?.name || '',
            price: appointment.serviceId?.price || 0
          };
        } else {

          this.upcomingAppointment = null;

        }

      },

      error: (error) => {

        console.error(
          'Failed to load appointments:',
          error
        );

      }

    });

  }

  // =========================
  // BOOK APPOINTMENT
  // =========================

  bookAppointment(): void {

    this.router.navigate([
      '/customer-service-list'
    ]);

  }

  // =========================
  // MY APPOINTMENTS
  // =========================

  myAppointment(): void {

    this.router.navigate([
      '/customer-appointment-list'
    ]);

  }

  // =========================
  // OPEN CANCEL DIALOG
  // =========================

  openCancelDialog(): void {

    if (!this.upcomingAppointment?.id) {

      console.error(
        'Appointment ID is missing'
      );

      return;
    }

    this.showCancelDialog = true;

  }

  // =========================
  // CLOSE CANCEL DIALOG
  // =========================

  closeCancelDialog(): void {

    if (this.cancelLoading) {
      return;
    }

    this.showCancelDialog = false;

  }

  // =========================
  // CANCEL APPOINTMENT
  // =========================

  cancelAppointment(): void {

    const appointmentId =
      this.upcomingAppointment?.id;

    

    if (!appointmentId) {

      console.error(
        'Appointment ID is missing'
      );

      return;

    }

    this.cancelLoading = true;

    this.customerService
      .cancelAppointment(appointmentId)
      .subscribe({

        next: (response: any) => {

          console.log(
            'Cancel success:',
            response
          );

          this.cancelLoading = false;

          this.showCancelDialog = false;

          // Reload latest appointment data
          this.getMyAppointments();

        },

        error: (error: any) => {

          console.error(
            'Cancel error:',
            error
          );

          this.cancelLoading = false;

        }

      });

  }

}