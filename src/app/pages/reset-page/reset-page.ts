import { Component,OnInit } from '@angular/core';

import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  ValidationErrors,
  Validators
} from '@angular/forms';

import {
  ActivatedRoute,
  Router
} from '@angular/router';
import { ToastService } from '../../toast/toast-service';
import { LoginService } from '../login/login-service';

@Component({
  selector: 'app-reset-page',
  imports: [ReactiveFormsModule],
  templateUrl: './reset-page.html',
  styleUrl: './reset-page.scss',
})
export class ResetPage implements OnInit {


  token = '';
  resetForm!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
       private loginService: LoginService,
    private toastService: ToastService
  ) {

    // Get token from URL
    // /reset-password?token=abc123
    this.route.queryParams.subscribe(params => {
      this.token = params['token'] || '';
    });

    // Reset form

  }
  ngOnInit(): void {
    this.resetForm = this.fb.group(
      {
        password: [
          '',
          [
            Validators.required,
            Validators.minLength(5)
          ]
        ],

        confirmPassword: [
          '',
          [
            Validators.required
          ]
        ]
      },
      {
        validators: this.passwordMatchValidator
      }
    );
  }

  // Password match validator
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


  submit() {
    // Validate form
    if (this.resetForm.invalid) {
      this.resetForm.markAllAsTouched();
      return;
    }

    // Token validation
    if (!this.token) {
      this.toastService.error('Invalid or missing reset token');
      return;
    }

    const password = this.resetForm.value.password;
    console.log('Token:', this.token);
    console.log('Password:', password);
    let json={
       token: this.token,
    password:password
    }
    this.loginService.resetPassword(json).subscribe({
      next: (response: any) => {
        this.toastService.success(response.message);
      },
      error: (error) => {
        this.toastService.error(error?.error?.message);
      }
    });

    // API call here

  }
}