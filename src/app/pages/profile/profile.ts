
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
import { LoginService } from '../login/login-service';

@Component({
  selector: 'app-profile',
  imports: [ReactiveFormsModule],
  templateUrl: './profile.html',
  styleUrl: './profile.scss',
})
export class Profile implements OnInit {
  selectedImage!: File;
  profileForm!: FormGroup;
  userId = '';
  isEditMode = false;
  constructor(
    private fb: FormBuilder,
    private router: Router,
    private loginService: LoginService,
    private toastService: ToastService
  ) { }

  ngOnInit(): void {

    this.profileForm = this.fb.group(
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
      })
    const user = JSON.parse(
      sessionStorage.getItem('user_details') || '{}'
    );
    this.userId = user._id;

    // Patch user data into form
    this.profileForm.patchValue({
      name: user.name || '',
      email: user.email || '',
      phone: user.phone || ''
    });
    if (user?._id) {
      this.getProfile();
    }
  }


  public submit(): void {
    if (this.profileForm.invalid) {
      this.profileForm.markAllAsTouched();
      return;
    }
    const user = JSON.parse(sessionStorage.getItem('user_details') || '{}');
    const formData = new FormData();

    formData.append('name', this.profileForm.value.name);
    formData.append('email', this.profileForm.value.email);
    formData.append('phone', this.profileForm.value.phone);

    if (this.selectedImage) {
      formData.append(
        'profileImage',
        this.selectedImage,
        this.selectedImage.name
      );
    }

    this.loginService
      .updateEmployee(user._id, formData)
      .subscribe({
        next: (response: any) => {
          this.toastService.success(response.message);
          this.isEditMode = false;
          this.getProfile();
          this.router.navigate(['/dashboard']);
        },
        error: (error) => {
          this.toastService.error(
            error?.error?.message || 'Profile failed'
          );
        }

      });
  }

  profileImage = '';

  onImageSelected(event: Event): void {

    const input = event.target as HTMLInputElement;

    if (input.files?.length) {
      this.selectedImage = input.files[0];

      const reader = new FileReader();

      reader.onload = () => {
        this.profileImage = reader.result as string;
      };

      reader.readAsDataURL(this.selectedImage);
    }
  }

  getProfile(): void {
    this.loginService.getProfile(this.userId).subscribe({
      next: (response: any) => {
        const user = response.data;
        this.profileForm.patchValue({
          name: user.name || '',
          email: user.email || '',
          phone: user.phone || ''
        });
        if (user.profileImage) {
          this.profileImage = user.profileImage;
          this.loginService.setUser(response.data);

        }
      },

      error: (error) => {
        console.error('Get profile failed:', error);

        this.toastService.error(
          error?.error?.message || 'Unable to load profile'
        );
      }
    });
  }
  enableEdit(): void {
    this.isEditMode = true;
  }
  cancelEdit(): void {
    this.isEditMode = false;

    // Reload original profile values
    this.getProfile();
  }

}

