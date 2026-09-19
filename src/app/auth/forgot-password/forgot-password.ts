import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  Validators,
  ReactiveFormsModule,
  FormGroup
} from '@angular/forms';
import { LoginService } from '../../auth/login/login-service';
import { ToastService } from '../../toast/toast-service';

@Component({
  selector: 'app-forgot-password',
  imports: [
    ReactiveFormsModule
  ],
  templateUrl: './forgot-password.html',
  styleUrl: './forgot-password.scss',
})
export class ForgotPassword implements OnInit {
  forgotForm!: FormGroup
  loading = false;

  constructor(
    private fb: FormBuilder,
    private loginService: LoginService,
    private toastService: ToastService
  ) { }

  ngOnInit(): void {
    this.forgotForm = this.fb.group({
      email: ['', [
        Validators.required,
        Validators.email
      ]],
    });
  }

  submit() {
    if (this.forgotForm.invalid) {
      this.forgotForm.markAllAsTouched();
      return;
    }
    this.loginService.forgotPassword(this.forgotForm.value).subscribe({
      next: (response: any) => {
        this.toastService.success(response.message);
        window.location.href = 'https://mail.google.com/mail/u/0/#inbox';
      },
      error: (error) => {
        this.toastService.error(error?.error?.message);
      }
    });
  }
}
