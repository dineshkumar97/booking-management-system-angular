import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface User {
  _id: string;
  uniqueUserId: string;
  name: string;
  email: string;
  phone?: string;
  role: string;
  designation?: string;
  status?: 'ACTIVE' | 'INACTIVE';
  profileImage?: string;
  services?: string[];
  isActive: boolean;
  onlineStatus:any;
  lastSeen:any;
  availabilityStatus:any;
}
@Injectable({
  providedIn: 'root'
})
export class UserService {

  // private apiUrl = 'http://localhost:3000/booking-management-systemt/user/all';
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) { }

  getUsers(): Observable<User[]> {
    return this.http.get<User[]>(`${this.apiUrl}/user/all`);
  }
  createUser(userData: any) {
    return this.http.post(
      `${this.apiUrl}/user/create`,
      userData
    );
  }
  updateUser(idUser: string, userData: any) {
    return this.http.put(
      `${this.apiUrl}/user/update/${idUser}`,
      userData
    );
  }

  deleteUser(idUser: string) {
    return this.http.delete(
      `${this.apiUrl}/user/delete/${idUser}`
    );
  }

 
  assignStaffServie(
    id: string,
    serviceData: any
  ): Observable<any> {
    return this.http.put(
      `${this.apiUrl}/user/staff/assign/${id}/services`,
      serviceData
    );
  }
}