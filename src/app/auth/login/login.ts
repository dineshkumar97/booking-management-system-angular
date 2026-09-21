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
  constructor(
    private fb: FormBuilder,
    private router: Router,
    private loginService: LoginService,
    private toastService: ToastService
  ) { }

  ngOnInit(): void {

    this.loginForm = this.fb.group({
      email: ['', [
        Validators.required,
        Validators.email
      ]],

      password: [
        '',
        [
          Validators.required,
          Validators.minLength(5),
          // Validators.maxLength(20),
          // Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).+$/)
        ]
      ],

      // rememberMe: [false]
    });

  }


  hasMinLength(): boolean {
    const password = this.loginForm.get('password')?.value || '';
    return password.length >= 8;
  }

  hasUppercase(): boolean {
    const password = this.loginForm.get('password')?.value || '';
    return /[A-Z]/.test(password);
  }

  hasLowercase(): boolean {
    const password = this.loginForm.get('password')?.value || '';
    return /[a-z]/.test(password);
  }

  hasNumber(): boolean {
    const password = this.loginForm.get('password')?.value || '';
    return /\d/.test(password);
  }

  hasSpecialChar(): boolean {
    const password = this.loginForm.get('password')?.value || '';
    return /[@$!%*?&]/.test(password);
  }

public loginDetails(): void {

  if (this.loginForm.invalid) {
    this.loginForm.markAllAsTouched();
    return;
  }

  this.loginService.login(this.loginForm.value).subscribe({

    next: (response: any) => {
      console.log('Login successful:', response);
      // Store token
      sessionStorage.setItem(
        'authToken',
        response.token
      );
      // Store user details including role
      sessionStorage.setItem(
        'user_details',
        JSON.stringify(response.data)
      );
      this.toastService.success('Login successful');
      // Get role
      const role = response.data?.role;
      console.log('User role:', role);
      // Role based navigation
      if (role === 'CUSTOMER') {
        this.router.navigate(['/customer-dashboard']);
      } else if (role === 'STAFF') {
        this.router.navigate(['/staff-dashboard']);
      } else if (role === 'ADMIN') {
        this.router.navigate(['/admin-dashboard']);
      } else {
        console.error('Unknown role:', role);
        sessionStorage.removeItem('authToken');
        sessionStorage.removeItem('user_details');
        this.toastService.error('Invalid user role');
        this.router.navigate(['/login']);
      }

    },

    error: (error) => {

      console.error('Login failed:', error);

      this.toastService.error(
        error?.error?.message || 'Login failed'
      );

    }

  });
}

  goToForgotPassword() {
    this.router.navigate(['/forgot-password']);
  }

  goToSignUp() {
    this.router.navigate(['/signup']);
  }
}



// npm install @emnapi/core@1.11.3 @emnapi/runtime@1.11.3 @emnapi/wasi-threads@1.2.3


// npm run build


// git add package.json package-lock.json
// git commit -m "Fix npm dependencies"
// git push