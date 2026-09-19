
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface DepartmentList {
  data(data: any): unknown;
  _id: string;
  name: string;
  createdAt?: string;
  isActive: boolean;
  updatedAt?: string;
}

@Injectable({
  providedIn: 'root'
})
export class DepartmentService {

  private apiUrl = environment.apiUrl;
  constructor(private http: HttpClient) { }

  getDepartment(): Observable<DepartmentList[]> {
    return this.http.get<DepartmentList[]>(`${this.apiUrl}/department/all`);
  }


  public createDepartment(data: DepartmentList): Observable<DepartmentList> {
    return this.http.post<DepartmentList>(`${this.apiUrl}/department/create`, data);
  }
  public updateDepartment(idUser: string, data: DepartmentList): Observable<DepartmentList> {
    return this.http.put<DepartmentList>(`${this.apiUrl}/department/update/${idUser}`, data);
  }
  public toggleDepartmentStatus(idUser: string): Observable<DepartmentList> {
    return this.http.put<DepartmentList>(`${this.apiUrl}/department/status/${idUser}`, {});
  }

   public deleteDepartment(idUser: string): Observable<DepartmentList> {
    return this.http.delete<DepartmentList>(`${this.apiUrl}/department/delete/${idUser}`);
  }




}