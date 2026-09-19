import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  AbstractControl,
  ReactiveFormsModule,
  Validators,
  ValidationErrors
} from '@angular/forms';
import { Router } from '@angular/router';
import { ToastService } from '../../toast/toast-service';
import { LoginService } from '../../auth/login/login-service';
@Component({
  selector: 'app-singup',
  imports: [ReactiveFormsModule],
  templateUrl: './singup.html',
  styleUrl: './singup.scss',
})
export class Singup implements OnInit {

  signupForm!: FormGroup;
  constructor(
    private fb: FormBuilder,
    private router: Router,
    private loginService: LoginService,
    private toastService: ToastService
  ) { }

  ngOnInit(): void {

    this.signupForm = this.fb.group(
      {
        name: ['', Validators.required],

        email: ['', [
          Validators.required,
          Validators.email
        ]],
        phone: ['', [
          Validators.required,
          Validators.minLength(10)
        ]],

        password: ['', [
          Validators.required,
          Validators.minLength(8)
        ]],

        confirmPassword: [
          '',
          [
            Validators.required
          ]
        ]
      },
      {
        validators: this.passwordMatchValidator
      })
  }

  passwordMatchValidator(
    control: AbstractControl
  ): ValidationErrors | null {

    const password =
      control.get('password')?.value;

    const confirmPassword =
      control.get('confirmPassword')?.value;

    // Don't show mismatch when fields are empty
    if (!password || !confirmPassword) {
      return null;
    }

    // Passwords match
    if (password === confirmPassword) {
      return null;
    }

    // Passwords don't match
    return {
      passwordMismatch: true
    };
  }


  hasMinLength(): boolean {
    const password = this.signupForm.get('password')?.value || '';
    return password.length >= 8;
  }

  hasUppercase(): boolean {
    const password = this.signupForm.get('password')?.value || '';
    return /[A-Z]/.test(password);
  }

  hasLowercase(): boolean {
    const password = this.signupForm.get('password')?.value || '';
    return /[a-z]/.test(password);
  }

  hasNumber(): boolean {
    const password = this.signupForm.get('password')?.value || '';
    return /\d/.test(password);
  }

  hasSpecialChar(): boolean {
    const password = this.signupForm.get('password')?.value || '';
    return /[@$!%*?&]/.test(password);
  }

  public submit(): void {

    if (this.signupForm.invalid) {
      this.signupForm.markAllAsTouched();
      return;
    }

    this.loginService.signUpUser(this.signupForm.value).subscribe({
      next: (response: any) => {
        this.toastService.success(response.message);

        // Navigate after token is stored
        this.router.navigate(['/login']);
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

  gotoLogin(): void {
    this.router.navigate(['/login']);
  }



}

