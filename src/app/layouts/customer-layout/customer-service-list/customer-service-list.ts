import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-customer-service-list',
  imports: [FormsModule],
  templateUrl: './customer-service-list.html',
  styleUrl: './customer-service-list.scss',
})
export class CustomerServiceList {
    selectedService: any = null;
  services = [
    {
      id: '1',
      name: 'Hair Cut',
      description: 'Professional haircut and styling.',
      duration: 30,
      price: 500
    },
    {
      id: '2',
      name: 'Facial',
      description: 'Relaxing facial treatment for healthy skin.',
      duration: 45,
      price: 800
    },
    {
      id: '3',
      name: 'Massage',
      description: 'Full body relaxing massage.',
      duration: 60,
      price: 1200
    },
    {
      id: '4',
      name: 'Hair Spa',
      description: 'Hair treatment and deep conditioning.',
      duration: 45,
      price: 1000
    }
  ];

  searchText = '';

  get filteredServices() {
    const search = this.searchText.toLowerCase().trim();

    if (!search) {
      return this.services;
    }

    return this.services.filter(service =>
      service.name.toLowerCase().includes(search)
    );
  }
    openDetails(service: any): void {
    this.selectedService = service;
  }

  closeDetails(): void {
    this.selectedService = null;
  }

}
