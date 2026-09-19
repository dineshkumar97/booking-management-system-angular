import { Component, computed, signal } from '@angular/core';
interface Product {
  sku: string;
  name: string;
  category: string;
  stock: number;
  reorderPoint: number;
  status: 'Low Stock' | 'Out of Stock';
}
@Component({
  selector: 'app-dashboard',
  imports: [],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss',
})
export class Dashboard {

    reorder(product: Product) {
    console.log('Reorder:', product);
  }
   userName = signal('Dinesh');

   totalRevenue = signal(284592);

  totalOrders = signal(1847);

  lowStockItems = signal(23);

  activeProducts = signal(856);
   revenueData = signal([
    { month: 'Jan', value: 43 },
    { month: 'Feb', value: 38 },
    { month: 'Mar', value: 52 },
    { month: 'Apr', value: 48 },
    { month: 'May', value: 57 },
    { month: 'Jun', value: 63 },
    { month: 'Jul', value: 60 },
    { month: 'Aug', value: 67 },
    { month: 'Sep', value: 72 },
    { month: 'Oct', value: 69 },
    { month: 'Nov', value: 76 },
    { month: 'Dec', value: 86 }
  ]);

  maxRevenue = computed(() => {
    return Math.max(
      ...this.revenueData().map(item => item.value)
    );
  });

    inventoryData = signal([
    {
      month: 'Jan',
      inStock: 850,
      lowStock: 25,
      outOfStock: 10
    },
    {
      month: 'Feb',
      inStock: 870,
      lowStock: 20,
      outOfStock: 8
    },
    {
      month: 'Mar',
      inStock: 865,
      lowStock: 22,
      outOfStock: 12
    },
    {
      month: 'Apr',
      inStock: 880,
      lowStock: 18,
      outOfStock: 7
    },
    {
      month: 'May',
      inStock: 875,
      lowStock: 24,
      outOfStock: 9
    },
    {
      month: 'Jun',
      inStock: 890,
      lowStock: 20,
      outOfStock: 8
    },
    {
      month: 'Jul',
      inStock: 885,
      lowStock: 23,
      outOfStock: 11
    },
    {
      month: 'Aug',
      inStock: 900,
      lowStock: 19,
      outOfStock: 6
    },
    {
      month: 'Sep',
      inStock: 905,
      lowStock: 21,
      outOfStock: 9
    },
    {
      month: 'Oct',
      inStock: 895,
      lowStock: 20,
      outOfStock: 8
    },
    {
      month: 'Nov',
      inStock: 880,
      lowStock: 24,
      outOfStock: 10
    },
    {
      month: 'Dec',
      inStock: 860,
      lowStock: 23,
      outOfStock: 12
    }
  ]);

  // ============================
  // PRODUCTS NEEDING ATTENTION
  // ============================

  products = signal<Product[]>([
    {
      sku: 'SKU-1842',
      name: 'Wireless Bluetooth Headphones',
      category: 'Electronics',
      stock: 8,
      reorderPoint: 20,
      status: 'Low Stock'
    },
    {
      sku: 'SKU-2956',
      name: 'Organic Cotton T-Shirt (M)',
      category: 'Apparel',
      stock: 0,
      reorderPoint: 50,
      status: 'Out of Stock'
    },
    {
      sku: 'SKU-3421',
      name: 'Stainless Steel Water Bottle',
      category: 'Accessories',
      stock: 12,
      reorderPoint: 30,
      status: 'Low Stock'
    },
    {
      sku: 'SKU-4127',
      name: 'Leather Laptop Bag',
      category: 'Accessories',
      stock: 5,
      reorderPoint: 15,
      status: 'Low Stock'
    }
  ]);

  attentionCount = computed(() => this.products().length);


}
