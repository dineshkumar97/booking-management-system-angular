import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

interface Staff {
  id: string;
  name: string;
  role: string;
}

@Component({
  selector: 'app-customer-booking',
  imports: [],
  templateUrl: './customer-booking.html',
  styleUrl: './customer-booking.scss',
})
export class CustomerBooking implements OnInit {

  // =========================
  // Booking State
  // =========================

  currentStep = 1;

  serviceId = '';

  selectedStaffId = '';
  selectedDate = '';
  selectedTime = '';


  // =========================
  // Service
  // =========================

  serviceName = 'Hair Cut';
  servicePrice = 500;


  // =========================
  // Staff
  // =========================

  staffs: Staff[] = [
    {
      id: '1',
      name: 'John',
      role: 'Senior Stylist'
    },
    {
      id: '2',
      name: 'Sarah',
      role: 'Beauty Specialist'
    },
    {
      id: '3',
      name: 'David',
      role: 'Massage Therapist'
    }
  ];


  // =========================
  // Available Dates
  // =========================

  availableDates: string[] = [
    '20 Sep 2026',
    '21 Sep 2026',
    '22 Sep 2026',
    '23 Sep 2026',
    '24 Sep 2026',
    '25 Sep 2026',
    '26 Sep 2026'
  ];


  // =========================
  // Available Time Slots
  // =========================

  availableTimeSlots: string[] = [
    '09:00 AM',
    '09:30 AM',
    '10:00 AM',
    '10:30 AM',
    '11:00 AM',
    '11:30 AM',
    '12:00 PM',
    '02:00 PM',
    '02:30 PM',
    '03:00 PM',
    '03:30 PM',
    '04:00 PM'
  ];


  constructor(
    private route: ActivatedRoute
  ) {}


  ngOnInit(): void {

    this.serviceId =
      this.route.snapshot.queryParamMap.get('serviceId') || '';

    // console.log('Selected Service:', this.serviceId);

  }


  // =========================
  // Selected Staff
  // =========================

  get selectedStaff(): Staff | undefined {

    return this.staffs.find(
      staff => staff.id === this.selectedStaffId
    );

  }


  get selectedStaffName(): string {

    return this.selectedStaff?.name || '';

  }


  // =========================
  // Selection Methods
  // =========================

  selectStaff(staffId: string): void {

    this.selectedStaffId = staffId;

  }


  selectDate(date: string): void {

    this.selectedDate = date;

  }


  selectTime(time: string): void {

    this.selectedTime = time;

  }


  // =========================
  // Step Navigation
  // =========================

  nextStep(): void {

    if (!this.canContinue()) {
      return;
    }

    if (this.currentStep < 4) {
      this.currentStep++;
    }

  }


  previousStep(): void {

    if (this.currentStep > 1) {
      this.currentStep--;
    }

  }


  canContinue(): boolean {

    switch (this.currentStep) {

      case 1:
        return !!this.selectedStaffId;

      case 2:
        return !!this.selectedDate;

      case 3:
        return !!this.selectedTime;

      default:
        return false;

    }

  }


  // =========================
  // Confirm Booking
  // =========================

  confirmBooking(): void {

    const booking = {
      serviceId: this.serviceId,
      serviceName: this.serviceName,
      servicePrice: this.servicePrice,
      staffId: this.selectedStaffId,
      staffName: this.selectedStaffName,
      date: this.selectedDate,
      time: this.selectedTime
    };

    console.log('Booking:', booking);

  }

}