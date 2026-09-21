import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CustomerService } from '../customer-service';
import { ToastService } from '../../../toast/toast-service';
interface Staff {
  _id: string;
  name: string;
  designation: string;
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

  selectedStaffId: any;
  selectedDate = '';
  selectedTime = '';


  // =========================
  // Service
  // =========================

  serviceName: any;
  servicePrice: any;


  // =========================
  // Staff
  // =========================




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

  staffList: any;
  serviceDetails: any;
  constructor(
    private route: ActivatedRoute,
    private customerService: CustomerService,
    private router: Router,
    private toastService: ToastService
  ) { }


  ngOnInit(): void {

    this.serviceId =
      this.route.snapshot.queryParamMap.get('serviceId') || '';

    // console.log('Selected Service:', this.serviceId);
    this.getStaffList();
    this.getServiceParticular();

  }


  getStaffList(): void {
    this.customerService.getStaffAll().subscribe({
      next: (response: any) => {
        this.staffList = response.data;
      },
      error: (error) => {
      }
    });

  }

  getServiceParticular(): void {
    this.customerService.getServiceID(this.serviceId).subscribe({
      next: (response: any) => {
        this.serviceDetails = response.data;
        this.serviceName = this.serviceDetails.name;
        this.servicePrice = this.serviceDetails.price
      },
      error: (error) => {
      }
    });

  }


  // =========================
  // Selected Staff
  // =========================

  get selectedStaff(): Staff | undefined {
    console.log(this.staffList)

    return this.staffList.find(
      (staff: any) => staff?._id === this.selectedStaffId?._id
    );
  }


  get selectedStaffName(): string {

    return this.selectedStaff?.name || '';

  }


  // =========================
  // Selection Methods
  // =========================

  staffselectBox: string | undefined;
  selectStaff(staffId: any): void {
    this.staffselectBox = staffId?._id
    this.selectedStaffId = staffId;
    console.log(this.selectedStaffId)

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
        return !!this.selectedStaffId?._id;

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
    const booking: any = {
      serviceId: this.serviceId,
      staffId: this.selectedStaffId?._id,
      appointmentDate: this.selectedDate,
      startTime: this.selectedTime,
      notes: 'Noted'
    };
    this.customerService.createAppointment(booking).subscribe({
      next: (response: any) => {
        this.toastService.success(response.message);
        this.router.navigate(['/customer-dashboard'])
      },
      error: (error) => {
        this.toastService.error(error?.error?.message);
      }
    });
  }

  goToServices(): void {
    this.router.navigate(['/customer-service-list']);
  }

}