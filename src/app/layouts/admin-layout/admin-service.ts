

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface Service {
  _id: string;
  name: string;
  description: string;
  duration: number;
  price: number;
  status: 'ACTIVE' | 'INACTIVE';
  createdAt?: string;
  updatedAt?: string;
}

@Injectable({
  providedIn: 'root'
})
export class AdminService {

   private apiUrl = environment.apiUrl;
 

  constructor(
    private http: HttpClient
  ) {}

  getServices(): Observable<Service[]> {
    return this.http.get<Service[]>(
      `${this.apiUrl}/service/all`
    );
  }

  getServiceById(id: string): Observable<Service> {
    return this.http.get<Service>(
      `${this.apiUrl}/service/get/${id}`
    );
  }

  createService(serviceData: any): Observable<any> {
    return this.http.post(
      `${this.apiUrl}/service/create`,
      serviceData
    );
  }

  updateService(
    id: string,
    serviceData: any
  ): Observable<any> {
    return this.http.put(
      `${this.apiUrl}/service/update/${id}`,
      serviceData
    );
  }

  deleteService(id: string): Observable<any> {
    return this.http.delete(
      `${this.apiUrl}/service/delete/${id}`
    );
  }

 
 
}