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
  availableDates: string[] = [];
  // =========================
  // Available Time Slots
  // =========================
  availableTimeSlots: string[] = [
  ];
  staffList: any;
  serviceDetails: any;
  appointments: any;
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
    this.generateAvailableDates();
    this.getCustomerAppointments();
  }
  generateAvailableDates(): void {
    const today = new Date();
    this.availableDates = [];
    for (let i = 0; i < 12; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      const formattedDate = date.toLocaleDateString(
        'en-GB',
        {
          day: '2-digit',
          month: 'short',
          year: 'numeric'
        }
      );
      this.availableDates.push(formattedDate);
    }
  }

   getCustomerAppointments(): void {
    this.customerService.getCustomerAppointments().subscribe({
      next: (response: any) => {
        this.appointments = response.data;
      },
      error: (error) => {
      }
    });

  }

  generateTimeSlots(selectedDate: string): void {
    const interval = 5;
    this.availableTimeSlots = [];
    const now = new Date();
    const selected = new Date(selectedDate);
    // ==============================
    // PAST DATE
    // ==============================
    const today = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate()
    );
    if (selected < today) {
      return;
    }
    // ==============================
    // MORNING
    // 09:00 AM - 01:00 PM
    // ==============================
    this.addTimeSlots(
      selected,
      9,
      13,
      interval,
      now
    );
    // ==============================
    // EVENING
    // 07:30 PM - 10:00 PM
    // ==============================
    this.addTimeSlots(
      selected,
      19,
      22,
      interval,
      now
    );
    console.log(
      'Available Time Slots:',
      this.availableTimeSlots
    );
    this.removeBookedSlots(selectedDate);
  }
  addTimeSlots(
    selected: Date,
    startHour: number,
    endHour: number,
    interval: number,
    now: Date
  ): void {
    for (
      let minutes = startHour * 60;
      minutes <= endHour * 60;
      minutes += interval
    ) {
      const hour = Math.floor(minutes / 60);
      const minute = minutes % 60;
      const slotDate = new Date(selected);
      slotDate.setHours(
        hour,
        minute,
        0,
        0
      );
      // ==============================
      // TODAY
      // DON'T SHOW PAST TIME
      // ==============================
      if (
        selected.toDateString() === now.toDateString() &&
        slotDate <= now
      ) {
        continue;
      }
      // ==============================
      // DISPLAY TIME
      // ==============================
      this.availableTimeSlots.push(
        slotDate.toLocaleTimeString(
          'en-US',
          {
            hour: '2-digit',
            minute: '2-digit',
            hour12: true
          }
        )
      );
    }
  }
  removeBookedSlots(selectedDate: string): void {

    const selected = new Date(selectedDate);

    this.availableTimeSlots =
      this.availableTimeSlots.filter(slot => {

        const isBooked =
          this.appointments.some((appointment:any) => {

            const appointmentDate =
              new Date(appointment.appointmentDate);

            return (
              appointmentDate.toDateString() ===
              selected.toDateString() &&
              appointment.startTime === slot &&
              appointment.status !== 'CANCELLED' &&
              appointment.status !== 'REJECTED'
            );
          });

        return !isBooked;
      });
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
    this.generateTimeSlots(this.selectedDate);
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