import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

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
  constructor(private router:Router){

  }
  ngOnInit(): void {
      
  }

  appointments: Appointment[] = [
    {
      id: 'APT001',
      serviceName: 'Hair Cut',
      staffName: 'John',
      appointmentDate: '20 Sep 2026',
      startTime: '10:00 AM',
      status: 'CONFIRMED',
      price: 500
    },
    {
      id: 'APT002',
      serviceName: 'Facial',
      staffName: 'Sarah',
      appointmentDate: '22 Sep 2026',
      startTime: '02:00 PM',
      status: 'PENDING',
      price: 800
    },
    {
      id: 'APT003',
      serviceName: 'Massage',
      staffName: 'David',
      appointmentDate: '25 Sep 2026',
      startTime: '04:00 PM',
      status: 'COMPLETED',
      price: 1200
    }
  ];
  
  bookAppointment():void{
        this.router.navigate(['/customer-service-list']);

  }

  viewDetails(appointmentId: string): void {
  this.router.navigate(['/customer-appointment-details',appointmentId]);
}

}