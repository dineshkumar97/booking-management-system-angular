import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CustomerService } from '../customer-service';

interface Appointment {
  id: string;
  serviceName: string;
  staffName: string;
  appointmentDate: string;
  startTime: string;
  status: string;
  price: number;
}

@Component({
  selector: 'app-customer-appointments-list',
  imports: [],
  templateUrl: './customer-appointments-list.html',
  styleUrl: './customer-appointments-list.scss',
})
export class CustomerAppointmentsList implements OnInit {
  constructor(private router: Router,private customerService: CustomerService, ) {

  }
  ngOnInit(): void {
    this.getMyAppointments();
  }

  appointments:any;

  bookAppointment(): void {
    this.router.navigate(['/customer-service-list']);

  }
  getMyAppointments(): void {
    this.customerService.getMyAppointments().subscribe({
      next: (response: any) => {
        this.appointments = response.data;
      },
      error: (error) => {
      }
    });

  }

  viewDetails(appointmentId: string): void {
    this.router.navigate(['/customer-appointment-details', appointmentId]);
  }

}