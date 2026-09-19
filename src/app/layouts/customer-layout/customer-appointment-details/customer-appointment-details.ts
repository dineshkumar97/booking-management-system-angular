import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

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

  appointment: Appointment = {
    id: 'APT001',
    serviceName: 'Hair Cut',
    staffName: 'John',
    appointmentDate: '20 Sep 2026',
    startTime: '10:00 AM',
    endTime: '10:30 AM',
    price: 500,
    status: 'CONFIRMED',
    notes: 'Regular haircut'
  };

  constructor(
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {

    this.appointmentId =
      this.route.snapshot.paramMap.get('id') || '';

    console.log('Appointment ID:', this.appointmentId);

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

}