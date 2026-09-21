import { HttpClient } from '@angular/common/http';
import { inject, Injectable, PLATFORM_ID, signal } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';


export interface serviceDetails {
  name: string;
  description: string;
  duration?: number;
  price?: number;
  status?: string;
}
export interface CreateAppointmentRequest {
  serviceId: string;
  staffId: string;
  appointmentDate: string;
  startTime: string;
  endTime?: string;
  notes?: string;
}


export interface serverResponse {
  message: string;
}


export interface Appointment {
  _id: string;
  customerId: string;

  serviceId: {
    _id: string;
    name: string;
    description: string;
    duration: number;
    price: number;
  };

  staffId: {
    _id: string;
    name: string;
    email: string;
    designation?: string;
  };

  appointmentDate: string;
  startTime: string;
  endTime: string;
  status: string;
  notes: string;
}

export interface AppointmentResponse {
  message: string;
  appointments: Appointment[];
}
@Injectable({
  providedIn: 'root',
})
export class CustomerService {
  private platformId = inject(PLATFORM_ID);
  private apiUrl = environment.apiUrl;
  private http = inject(HttpClient);
  constructor() { }

  public createService(data: any): Observable<serverResponse> {
    return this.http.post<serverResponse>(`${this.apiUrl}/services/create`, data);
  }

  public updateService(idUser: string, data: any): Observable<serverResponse> {
    return this.http.put<serverResponse>(`${this.apiUrl}/services/update/${idUser}`, data);
  }

  public getServiceID(id: string) {
    return this.http.get(`${this.apiUrl}/services/get/${id}`);
  }

  public getServiceAll() {
    return this.http.get(`${this.apiUrl}/services/all`);
  }

  public getStaffAll() {
    return this.http.get(`${this.apiUrl}/staff/all`);
  }
  createAppointment(data: CreateAppointmentRequest): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/appointments/create`, data);
  }


  getMyAppointments(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/appointments/all`);
  }

  getMyAppointmentsID(id: any): Observable<AppointmentResponse> {
    return this.http.get<AppointmentResponse>(`${this.apiUrl}/appointments/get/${id}`);
  }

  cancelAppointment(id: string): Observable<any> {
    return this.http.patch<any>(`${this.apiUrl}/booking/${id}/cancel`, {});
  }

  getStaffAppointments(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/appointments/staffAppointment`);
  }
  getStaffAppointmentsID(id: any): Observable<AppointmentResponse> {
    return this.http.get<AppointmentResponse>(`${this.apiUrl}/appointments/staff/${id}`);
  }
  confirmStaffAppointment(id: string): Observable<any> {
    return this.http.put(
      `${this.apiUrl}/appointments/staff/${id}/confirm`,
      {}
    );
  }

  rejectStaffAppointment(id: string): Observable<any> {
    return this.http.put(
      `${this.apiUrl}/appointments/staff/${id}/reject`,
      {});
  }

  completeStaffAppointment(id: string): Observable<any> {
    return this.http.put(
      `${this.apiUrl}/appointments/staff/${id}/complete`,
      {});
  }
}


/* appointmentDate: this.convertDateToApiFormat(this.bookingData.date),
startTime: this.convertTimeTo24Hour(this.bookingData.time),

convertDateToApiFormat(date: string): string {

  const [day, monthName, year] = date.split(' ');

  const months: Record<string, string> = {
    Jan: '01',
    Feb: '02',
    Mar: '03',
    Apr: '04',
    May: '05',
    Jun: '06',
    Jul: '07',
    Aug: '08',
    Sep: '09',
    Oct: '10',
    Nov: '11',
    Dec: '12'
  };

  return `${year}-${months[monthName]}-${day.padStart(2, '0')}`;


  convertTimeTo24Hour(time: string): string {

  const [timePart, modifier] = time.split(' ');

  let [hours, minutes] = timePart.split(':');

  if (modifier === 'PM' && hours !== '12') {
    hours = String(Number(hours) + 12);
  }

  if (modifier === 'AM' && hours === '12') {
    hours = '00';
  }

  return `${hours.padStart(2, '0')}:${minutes}`;
}
} */