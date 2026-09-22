import { HttpClient } from '@angular/common/http';
import { inject, Injectable, PLATFORM_ID, signal } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { isPlatformBrowser } from '@angular/common';


export interface LoginRequest {
  email: string;
  password: string;
}
export interface UserDetails {
  email: string;
  name: string;
  phone?: string;
  profileImage?: string;
}


export interface LoginResponse {
  message: string;
}

@Injectable({
  providedIn: 'root',
})
export class LoginService {
  private platformId = inject(PLATFORM_ID);
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) { }

  public login(data: LoginRequest): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(
      `${this.apiUrl}/user/authenticate`,
      data
    );
  }

  public forgotPassword(data: any): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(
      `${this.apiUrl}/user/forgot-password`,
      data
    );
  }

  public resetPassword(data: any): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(
      `${this.apiUrl}/user/reset-password`,
      data
    );
  }
  public signUpUser(data: any): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(
      `${this.apiUrl}/user/create`,
      data
    );
  }


  public updateEmployee(idUser: string, data: FormData): Observable<LoginResponse> {
    return this.http.put<LoginResponse>(`${this.apiUrl}/user/update/${idUser}`, data);
  }

  public getProfile(id: string) {
    return this.http.get(`${this.apiUrl}/user/profile/${id}`);
  }


  userDetails = signal<any>(this.getUserFromStorage());

  private getUserFromStorage(): any {
    if (!isPlatformBrowser(this.platformId)) {
      return null;
    }
    const user = sessionStorage.getItem('user_details');
    return user ? JSON.parse(user) : null;
  }

  setUser(user: any): void {
    this.userDetails.set(user);
    if (isPlatformBrowser(this.platformId)) {
      sessionStorage.setItem(
        'user_details',
        JSON.stringify(user)
      );
    }
  }

}
