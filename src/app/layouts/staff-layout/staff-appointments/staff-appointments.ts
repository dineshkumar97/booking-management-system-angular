import { Component, OnInit, computed, signal } from '@angular/core';
import { Router } from '@angular/router';
import { CustomerService } from '../../customer-layout/customer-service';

@Component({
  selector: 'app-staff-appointments',
  standalone: true,
  imports: [],
  templateUrl: './staff-appointments.html',
  styleUrl: './staff-appointments.scss'
})
export class StaffAppointments implements OnInit {

  selectedStatus = signal<string>('ALL');

  appointments = signal<any[]>([]);

  filteredAppointments = computed(() => {

    const status = this.selectedStatus();
    const data = this.appointments();

    if (status === 'ALL') {
      return data;
    }

    return data.filter(
      appointment => appointment.status === status
    );

  });

  constructor(
    private router: Router,
    private customerService: CustomerService
  ) {}

  ngOnInit(): void {
    this.getStaffAppointments();
  }

  getStaffAppointments(): void {

    this.customerService.getStaffAppointments().subscribe({

      next: (response: any) => {

        console.log(
          'Staff Appointments:',
          response.data
        );

        this.appointments.set(
          response?.data ?? []
        );

      },

      error: (error) => {

        console.error(
          'Error loading staff appointments:',
          error
        );

        this.appointments.set([]);

      }

    });

  }

  selectStatus(status: string): void {

    this.selectedStatus.set(status);

  }

  viewAppointment(id: string): void {

    this.router.navigate([
      '/staff-appointment-details',
      id
    ]);

  }

}