import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';
import { Router } from '@angular/router';
import { LoginService } from './login-service';
import { ToastService } from '../../toast/toast-service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './login.html',
  styleUrl: './login.scss'
})
export class Login implements OnInit {

  loginForm!: FormGroup;
  otpForm!: FormGroup;

  isOtpLogin = false;
  otpSent = false;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private loginService: LoginService,
    private toastService: ToastService
  ) { }

  ngOnInit(): void {

    this.loginForm = this.fb.group({
      email: [
        '',
        [
          Validators.required,
          Validators.email
        ]
      ],

      password: [
        '',
        [
          Validators.required,
          Validators.minLength(5)
        ]
      ]
    });

    this.otpForm = this.fb.group({
      otp: [
        '',
        [
          Validators.required,
          Validators.pattern(/^[0-9]{6}$/)
        ]
      ]
    });
  }

  hasMinLength(): boolean {
    const password =
      this.loginForm.get('password')?.value || '';

    return password.length >= 8;
  }

  hasUppercase(): boolean {
    const password =
      this.loginForm.get('password')?.value || '';

    return /[A-Z]/.test(password);
  }

  hasLowercase(): boolean {
    const password =
      this.loginForm.get('password')?.value || '';

    return /[a-z]/.test(password);
  }

  hasNumber(): boolean {
    const password =
      this.loginForm.get('password')?.value || '';

    return /\d/.test(password);
  }

  hasSpecialChar(): boolean {
    const password =
      this.loginForm.get('password')?.value || '';

    return /[@$!%*?&]/.test(password);
  }

  public loginDetails(): void {

    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    this.loginService.login(
      this.loginForm.value
    ).subscribe({

      next: (response: any) => {

        console.log(
          'Login successful:',
          response
        );

        sessionStorage.setItem(
          'authToken',
          response.token
        );

        sessionStorage.setItem(
          'user_details',
          JSON.stringify(response.data)
        );

        this.loginService.setUser(
          response.data
        );

        this.toastService.success(
          'Login successful'
        );

        const role =
          response.data?.role;

        console.log(
          'User role:',
          role
        );

        this.navigateByRole(role);
      },

      error: (error) => {

        console.error(
          'Login failed:',
          error
        );

        this.toastService.error(
          error?.error?.message ||
          'Login failed'
        );
      }

    });
  }

  public showOtpLogin(): void {

    this.isOtpLogin = true;
    this.otpSent = false;

    this.otpForm.reset();

    this.loginForm.get('password')?.clearValidators();

    this.loginForm
      .get('password')
      ?.updateValueAndValidity();
  }

  public showPasswordLogin(): void {

    this.isOtpLogin = false;
    this.otpSent = false;

    this.otpForm.reset();

    this.loginForm
      .get('password')
      ?.setValidators([
        Validators.required,
        Validators.minLength(5)
      ]);

    this.loginForm
      .get('password')
      ?.updateValueAndValidity();
  }

  public sendOtp(): void {

    const emailControl =
      this.loginForm.get('email');

    if (
      !emailControl?.value ||
      emailControl.hasError('required') ||
      emailControl.hasError('email')
    ) {

      emailControl?.markAsTouched();

      this.toastService.error(
        'Please enter a valid email address'
      );

      return;
    }

    const email =
      emailControl.value.trim().toLowerCase();

    this.loginService.sendLoginOtp({
      email
    }).subscribe({

      next: (response) => {

        console.log(
          'OTP sent successfully:',
          response
        );

        this.otpSent = true;

        this.toastService.success(
          'OTP sent successfully'
        );
      },

      error: (error) => {

        console.error(
          'Send OTP failed:',
          error
        );

        this.toastService.error(
          error?.error?.message ||
          'Failed to send OTP'
        );
      }

    });
  }

  public verifyOtp(): void {

    if (this.otpForm.invalid) {

      this.otpForm.markAllAsTouched();

      return;
    }

    const email =
      this.loginForm.get('email')?.value
        ?.trim()
        .toLowerCase();

    const otp =
      this.otpForm.get('otp')?.value;

    this.loginService.verifyLoginOtp({
      email,
      otp
    }).subscribe({

      next: (response) => {

        console.log(
          'OTP login successful:',
          response
        );

        sessionStorage.setItem(
          'authToken',
          response.token
        );

        sessionStorage.setItem(
          'user_details',
          JSON.stringify(response.user)
        );

        this.loginService.setUser(
          response.user
        );

        this.toastService.success(
          'Login successful'
        );

        const role =
          response.user?.role;

        console.log(
          'User role:',
          role
        );

        this.navigateByRole(role);
      },

      error: (error) => {

        console.error(
          'OTP verification failed:',
          error
        );

        this.toastService.error(
          error?.error?.message ||
          'Invalid OTP'
        );
      }

    });
  }

  private navigateByRole(role: string): void {

    if (role === 'CUSTOMER') {

      this.router.navigate([
        '/customer-dashboard'
      ]);

    } else if (role === 'STAFF') {

      this.router.navigate([
        '/staff-dashboard'
      ]);

    } else if (role === 'ADMIN') {

      this.router.navigate([
        '/admin-dashboard'
      ]);

    } else {

      console.error(
        'Unknown role:',
        role
      );

      sessionStorage.removeItem(
        'authToken'
      );

      sessionStorage.removeItem(
        'user_details'
      );

      this.toastService.error(
        'Invalid user role'
      );

      this.router.navigate([
        '/login'
      ]);
    }
  }

  goToForgotPassword(): void {
    this.router.navigate([
      '/forgot-password'
    ]);
  }

  goToSignUp(): void {
    this.router.navigate([
      '/signup'
    ]);
  }
}