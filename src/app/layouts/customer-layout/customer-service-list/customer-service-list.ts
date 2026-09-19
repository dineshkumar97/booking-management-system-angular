import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CustomerService } from '../customer-service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-customer-service-list',
  imports: [FormsModule],
  templateUrl: './customer-service-list.html',
  styleUrl: './customer-service-list.scss',
})
export class CustomerServiceList implements OnInit {
  servicesList: any;

  constructor(private customerService: CustomerService, private router:Router) { }
  ngOnInit(): void {
    this.getServiceAll();
  }


  getServiceAll(): void {
    this.customerService.getServiceAll().subscribe({
      next: (response: any) => {
        this.servicesList = response.data;
      },
      error: (error) => {
      }
    });

  }
  selectedService: any = null;
 

  searchText = '';

  get filteredServices() {
    const search = this.searchText.toLowerCase().trim();

    if (!search) {
      return this.servicesList;
    }

    return this.servicesList.filter((service:any) =>
      service.name.toLowerCase().includes(search)
    );
  }
  openDetails(service: any): void {
    this.selectedService = service;
  }

  closeDetails(): void {
    this.selectedService = null;
  }

  selectStaffAndContinue(): void {

  if (!this.selectedService) {
    return;
  }

  console.log('Selected Service:', this.selectedService);
  console.log('Service ID:', this.selectedService._id);

  this.router.navigate(['/customer-booking-list'],{
      queryParams: {
        serviceId: this.selectedService._id
      }
    }
  );
}

}
