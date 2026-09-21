import { DatePipe } from '@angular/common';
import { Component, OnInit, signal } from '@angular/core';
import { Router } from '@angular/router';
import { CustomerService } from '../customer-service';

@Component({
  selector: 'app-customer-dashboard',
  standalone: true,
  imports: [DatePipe],
  templateUrl: './customer-dashboard.html',
  styleUrl: './customer-dashboard.scss',
})
export class CustomerDashboard implements OnInit {

  // =========================
  // USER
  // =========================

  userName = signal<string>('Dinesh');

  // =========================
  // APPOINTMENTS
  // =========================

  recentAppointments = signal<any[]>([]);

  upcomingAppointment = signal<any>(null);

  // =========================
  // DIALOG
  // =========================

  showCancelDialog = signal<boolean>(false);

  cancelLoading = signal<boolean>(false);

  // =========================
  // STATISTICS
  // =========================

  upcomingCount = signal<number>(0);

  completedCount = signal<number>(0);

  cancelledCount = signal<number>(0);


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

    this.customerService
      .getMyAppointments()
      .subscribe({

        next: (response: any) => {

          console.log(
            'Customer Appointments Response:',
            response
          );

          const appointments =
            Array.isArray(response?.data)
              ? response.data
              : [];

          console.log(
            'Customer Appointments Data:',
            appointments
          );


          // =========================
          // RECENT APPOINTMENTS
          // =========================

          this.recentAppointments.set(
            appointments
          );


          // =========================
          // STATISTICS
          // =========================

          const upcomingCount =
            appointments.filter(
              (appointment: any) =>
                appointment.status === 'PENDING' ||
                appointment.status === 'CONFIRMED'
            ).length;


          const completedCount =
            appointments.filter(
              (appointment: any) =>
                appointment.status === 'COMPLETED'
            ).length;


          const cancelledCount =
            appointments.filter(
              (appointment: any) =>
                appointment.status === 'CANCELLED'
            ).length;


          this.upcomingCount.set(
            upcomingCount
          );

          this.completedCount.set(
            completedCount
          );

          this.cancelledCount.set(
            cancelledCount
          );


          // =========================
          // FIND UPCOMING
          // =========================

          const upcoming =
            appointments
              .filter(
                (appointment: any) =>
                  appointment.status === 'PENDING' ||
                  appointment.status === 'CONFIRMED'
              )
              .sort(
                (a: any, b: any) =>
                  new Date(
                    a.appointmentDate
                  ).getTime() -
                  new Date(
                    b.appointmentDate
                  ).getTime()
              );


          console.log(
            'Upcoming Appointments:',
            upcoming
          );


          // =========================
          // SET UPCOMING APPOINTMENT
          // =========================

          if (upcoming.length > 0) {

            const appointment =
              upcoming[0];

            this.upcomingAppointment.set({

              id: appointment._id,

              service:
                appointment.serviceId?.name || '',

              status:
                appointment.status,

              date:
                appointment.appointmentDate,

              time:
                appointment.startTime,

              staff:
                appointment.staffId?.name || '',

              price:
                appointment.serviceId?.price || 0

            });

          } else {

            this.upcomingAppointment.set(null);

          }


          console.log(
            'Statistics:',
            {
              upcoming: this.upcomingCount(),
              completed: this.completedCount(),
              cancelled: this.cancelledCount()
            }
          );

          console.log(
            'Upcoming Appointment:',
            this.upcomingAppointment()
          );

        },


        error: (error) => {

          console.error(
            'Failed to load appointments:',
            error
          );


          // Reset signals

          this.recentAppointments.set([]);

          this.upcomingAppointment.set(null);

          this.upcomingCount.set(0);

          this.completedCount.set(0);

          this.cancelledCount.set(0);

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

    const appointment =
      this.upcomingAppointment();

    if (!appointment?.id) {

      console.error(
        'Appointment ID is missing'
      );

      return;

    }

    this.showCancelDialog.set(true);

  }


  // =========================
  // CLOSE CANCEL DIALOG
  // =========================

  closeCancelDialog(): void {

    if (this.cancelLoading()) {
      return;
    }

    this.showCancelDialog.set(false);

  }


  // =========================
  // CANCEL APPOINTMENT
  // =========================

  cancelAppointment(): void {

    const appointment =
      this.upcomingAppointment();

    const appointmentId =
      appointment?.id;


    if (!appointmentId) {

      console.error(
        'Appointment ID is missing'
      );

      return;

    }


    this.cancelLoading.set(true);


    this.customerService
      .cancelAppointment(appointmentId)
      .subscribe({

        next: (response: any) => {

          console.log(
            'Cancel success:',
            response
          );


          this.cancelLoading.set(false);

          this.showCancelDialog.set(false);


          // Get latest data from API

          this.getMyAppointments();

        },


        error: (error: any) => {

          console.error(
            'Cancel error:',
            error
          );

          this.cancelLoading.set(false);

        }

      });

  }

}