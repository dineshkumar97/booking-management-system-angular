import { Component, OnInit, signal } from '@angular/core';
import { CustomerService } from '../../customer-layout/customer-service';

@Component({
  selector: 'app-staff-dashboard',
  standalone: true,
  imports: [],
  templateUrl: './staff-dashboard.html',
  styleUrl: './staff-dashboard.scss'
})
export class StaffDashboard implements OnInit {

  todayAppointments = signal(0);

  pendingAppointments = signal(0);

  confirmedAppointments = signal(0);

  completedAppointments = signal(0);


  constructor(
    private customerService: CustomerService
  ) {}


  ngOnInit(): void {

    this.getStaffAppointments();

  }


  // =========================
  // GET STAFF APPOINTMENTS
  // =========================

  getStaffAppointments(): void {

    this.customerService
      .getStaffAppointments()
      .subscribe({

        next: (response: any) => {

          console.log(
            'Staff Dashboard Response:',
            response
          );

          const appointments =
            response?.data || [];

          console.log(
            'Staff Dashboard Appointments:',
            appointments
          );


          // =========================
          // TODAY
          // =========================

          const today =
            new Date();

          const todayString =
            today.toISOString().split('T')[0];


          const todayCount =
            appointments.filter(
              (appointment: any) => {

                if (!appointment.appointmentDate) {
                  return false;
                }

                const appointmentDate =
                  new Date(
                    appointment.appointmentDate
                  );

                const appointmentDateString =
                  appointmentDate
                    .toISOString()
                    .split('T')[0];

                return (
                  appointmentDateString ===
                  todayString
                );

              }
            ).length;


          // =========================
          // PENDING
          // =========================

          const pendingCount =
            appointments.filter(
              (appointment: any) =>
                appointment.status === 'PENDING'
            ).length;


          // =========================
          // CONFIRMED
          // =========================

          const confirmedCount =
            appointments.filter(
              (appointment: any) =>
                appointment.status === 'CONFIRMED'
            ).length;


          // =========================
          // COMPLETED
          // =========================

          const completedCount =
            appointments.filter(
              (appointment: any) =>
                appointment.status === 'COMPLETED'
            ).length;


          // =========================
          // SET SIGNAL VALUES
          // =========================

          this.todayAppointments.set(
            todayCount
          );

          this.pendingAppointments.set(
            pendingCount
          );

          this.confirmedAppointments.set(
            confirmedCount
          );

          this.completedAppointments.set(
            completedCount
          );


          console.log(
            'Today:',
            this.todayAppointments()
          );

          console.log(
            'Pending:',
            this.pendingAppointments()
          );

          console.log(
            'Confirmed:',
            this.confirmedAppointments()
          );

          console.log(
            'Completed:',
            this.completedAppointments()
          );

        },


        error: (error) => {

          console.error(
            'Failed to load staff appointments:',
            error
          );


          this.todayAppointments.set(0);

          this.pendingAppointments.set(0);

          this.confirmedAppointments.set(0);

          this.completedAppointments.set(0);

        }

      });

  }

}