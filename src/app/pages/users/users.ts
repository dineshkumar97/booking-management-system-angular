import {
  Component,
  inject,
  OnInit,
  PLATFORM_ID,
  signal
} from '@angular/core';

import { isPlatformBrowser } from '@angular/common';

import {
  FormBuilder,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';

import { UserService, User } from './user-service';


@Component({
  selector: 'app-users',
  standalone: true,
  imports: [
    ReactiveFormsModule
  ],
  templateUrl: './users.html',
  styleUrl: './users.scss'
})
export class Users implements OnInit {

  users = signal<User[]>([]);

  private platformId = inject(PLATFORM_ID);

  private fb = inject(FormBuilder);


  // Show / hide create edit form
  showCreateForm = signal(false);

  // Create / Edit mode
  isEditMode = signal(false);

  // Selected user
  selectedUserId = signal<string | null>(null);


  // User form
  userForm = this.fb.group({

    name: [
      '',
      [
        Validators.required,
        Validators.minLength(2)
      ]
    ],

    email: [
      '',
      [
        Validators.required,
        Validators.email
      ]
    ],

    phone: [
      '',
      [
        Validators.required,
        Validators.pattern(/^[0-9]{10}$/)
      ]
    ],

    password: [
      '',
     
    ],

    role: [
      'CUSTOMER',
     
    ],

    designation: [
      ''
    ]

  });


  constructor(
    private userService: UserService
  ) { }


  ngOnInit(): void {

    if (isPlatformBrowser(this.platformId)) {
      this.getUsers();
    }

  }


  // =========================
  // GET USERS
  // =========================

  getUsers(): void {

    this.userService.getUsers().subscribe({

      next: (response) => {

        console.log(
          'Users API response:',
          response
        );
        const staffUsers = response.filter(user => user.role === 'CUSTOMER');
        this.users.set(staffUsers);

      },

      error: (error) => {

        console.error(
          'Users API error:',
          error
        );

      }

    });

  }


  // =========================
  // CREATE USER
  // =========================

  createUser(): void {

    this.isEditMode.set(false);

    this.selectedUserId.set(null);

    this.userForm.reset({

      name: '',
      email: '',
      phone: '',
      password: '',
      role: 'CUSTOMER',
      designation: ''

    });


    // Password required for create
    this.userForm
      .get('password')
      ?.setValidators([
        Validators.required,
        Validators.minLength(5)
      ]);

    this.userForm
      .get('password')
      ?.updateValueAndValidity();


    this.showCreateForm.set(true);

  }
  showDeletePopup = signal(false);
  selectedDeleteUser = signal<User | null>(null);

  // =========================
  // EDIT USER
  // =========================

  editUser(user: User): void {

    console.log(
      'Edit user:',
      user
    );


    this.isEditMode.set(true);

    this.selectedUserId.set(
      user._id
    );


    this.userForm.patchValue({

      name: user.name || '',

      email: user.email || '',

      phone: user.phone || '',

      password: '',

      role: user.role || 'CUSTOMER',

      designation: user.designation || ''

    });


    // Password NOT required while editing
    this.userForm
      .get('password')
      ?.clearValidators();

    this.userForm
      .get('password')
      ?.updateValueAndValidity();


    this.showCreateForm.set(true);

  }


  // =========================
  // DELETE USER
  // =========================

  deleteUser(user: User): void {

    this.selectedDeleteUser.set(user);

    this.showDeletePopup.set(true);
  }


  // =========================
  // CLOSE FORM
  // =========================

  closeForm(): void {

    this.showCreateForm.set(false);

    this.isEditMode.set(false);

    this.selectedUserId.set(null);

    this.userForm.reset({

      name: '',
      email: '',
      phone: '',
      password: '',
      role: 'CUSTOMER',
      designation: ''

    });

  }


  // =========================
  // SUBMIT FORM
  // =========================
  submitUser(): void {

    if (this.userForm.invalid) {
      this.userForm.markAllAsTouched();
      return;
    }

    const formData = this.userForm.getRawValue();

    // =========================
    // CREATE USER
    // =========================
    if (!this.isEditMode()) {

      this.userService.createUser(formData).subscribe({

        next: (response) => {

          console.log(
            'User created successfully:',
            response
          );

          this.closeForm();
          this.getUsers();

        },

        error: (error) => {

          console.error(
            'Create user error:',
            error
          );

        }

      });

      return;
    }


    // =========================
    // UPDATE USER
    // =========================

    const userId = this.selectedUserId();

    if (!userId) {
      return;
    }

    // Remove empty password during edit
    const updateData: any = {
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
      role: formData.role,
      designation: formData.designation
    };

    if (formData.password) {
      updateData.password = formData.password;
    }

    this.userService.updateUser(
      userId,
      updateData
    ).subscribe({

      next: (response) => {

        console.log(
          'User updated successfully:',
          response
        );

        this.closeForm();
        this.getUsers();

      },

      error: (error) => {

        console.error(
          'Update user error:',
          error
        );

      }

    });
  }

  cancelDelete(): void {

    this.showDeletePopup.set(false);
    this.selectedDeleteUser.set(null);
  }


  confirmDelete(): void {

    const user = this.selectedDeleteUser();

    if (!user) {
      return;
    }

    this.userService.deleteUser(user._id).subscribe({

      next: (response) => {

        console.log(
          'User deleted successfully:',
          response
        );

        this.showDeletePopup.set(false);
        this.selectedDeleteUser.set(null);

        this.getUsers();

      },

      error: (error) => {

        console.error(
          'Delete user error:',
          error
        );

      }

    });
  }

}