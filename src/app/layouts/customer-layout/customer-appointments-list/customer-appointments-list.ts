import { Component, OnInit, signal } from '@angular/core';
import { Router } from '@angular/router';
import { CustomerService } from '../customer-service';
import { CommonDatePipe } from '../../../common/common-date.pipe';

interface Appointment {
  _id: string;
  serviceId?: {
    name: string;
    price: number;
  };
  staffId?: {
    name: string;
  };
  appointmentDate: string;
  startTime: string;
  status: string;
}

@Component({
  selector: 'app-customer-appointments-list',
  imports: [CommonDatePipe],
  templateUrl: './customer-appointments-list.html',
  styleUrl: './customer-appointments-list.scss',
})
export class CustomerAppointmentsList implements OnInit {

  appointments = signal<Appointment[]>([]);

  constructor(
    private router: Router,
    private customerService: CustomerService
  ) {}

  ngOnInit(): void {
    this.getCustomerAppointments();
  }

  getCustomerAppointments(): void {
    this.customerService.getCustomerAppointments().subscribe({
      next: (response: any) => {
        console.log('Customer appointments response:', response);

        const appointments: Appointment[] = response?.data ?? [];

        this.appointments.set([...appointments]);

        console.log(
          'Appointments count:',
          this.appointments().length
        );
      },

      error: (error) => {
        console.error(
          'Failed to load customer appointments:',
          error
        );

        this.appointments.set([]);
      },
    });
  }

  bookAppointment(): void {
    this.router.navigate(['/customer-service-list']);
  }

  viewDetails(appointmentId: string): void {
    this.router.navigate([
      '/customer-appointment-details',
      appointmentId,
    ]);
  }
}