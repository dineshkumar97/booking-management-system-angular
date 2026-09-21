import { Component, OnInit, signal, computed } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CustomerService } from '../customer-service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-customer-service-list',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './customer-service-list.html',
  styleUrl: './customer-service-list.scss',
})
export class CustomerServiceList implements OnInit {

  // All services from API
  servicesList = signal<any[]>([]);

  // Search text
  searchText = signal<string>('');

  // Selected service
  selectedService = signal<any>(null);

  // Filtered services
  filteredServices = computed(() => {

    const services = this.servicesList();

    const search =
      this.searchText()
        .toLowerCase()
        .trim();

    if (!search) {
      return services;
    }

    return services.filter(
      (service: any) =>
        service?.name
          ?.toLowerCase()
          .includes(search)
    );
  });

  constructor(
    private customerService: CustomerService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.getServiceAll();
  }

  // Get all services
  getServiceAll(): void {

    this.customerService.getServiceAll().subscribe({

      next: (response: any) => {

        console.log(
          'Service API Response:',
          response
        );

        const services =
          Array.isArray(response?.data)
            ? response.data
            : [];

        this.servicesList.set(services);

      },

      error: (error) => {

        console.error(
          'Service API Error:',
          error
        );

        this.servicesList.set([]);
      }

    });
  }

  // Search
  onSearchChange(value: string): void {

    this.searchText.set(value);
  }

  // Open details
  openDetails(service: any): void {

    this.selectedService.set(service);
  }

  // Close details
  closeDetails(): void {

    this.selectedService.set(null);
  }

  // Continue booking
  selectStaffAndContinue(): void {

    const service =
      this.selectedService();

    if (!service) {
      return;
    }

    console.log(
      'Selected Service:',
      service
    );

    console.log(
      'Service ID:',
      service._id
    );

    this.router.navigate(
      ['/customer-booking-list'],
      {
        queryParams: {
          serviceId: service._id
        }
      }
    );
  }
}