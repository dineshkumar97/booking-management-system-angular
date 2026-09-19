import { Component } from '@angular/core';

@Component({
  selector: 'app-customer-dashboard',
  imports: [],
  templateUrl: './customer-dashboard.html',
  styleUrl: './customer-dashboard.scss',
})
export class CustomerDashboard {

  userName = 'Dinesh';

  upcomingAppointment = {
    id: 'APT001',
    service: 'Hair Cut',
    date: '20 Sep 2026',
    time: '10:30 AM - 11:00 AM',
    staff: 'John',
    price: 500,
    status: 'CONFIRMED'
  };

  statistics = {
    upcoming: 2,
    completed: 8,
    cancelled: 1
  };

  recentAppointments = [
    {
      id: 'APT002',
      service: 'Hair Cut',
      date: '15 Sep 2026',
      staff: 'John',
      status: 'COMPLETED'
    },
    {
      id: 'APT003',
      service: 'Facial',
      date: '10 Sep 2026',
      staff: 'Sarah',
      status: 'COMPLETED'
    },
    {
      id: 'APT004',
      service: 'Massage',
      date: '05 Sep 2026',
      staff: 'David',
      status: 'CANCELLED'
    }
  ];
}
