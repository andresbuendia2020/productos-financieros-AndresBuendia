import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { Product } from '../../models/product.model';
import { ProductService } from '../../services/product.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.scss'],
  standalone: true,
  imports: [CommonModule, HttpClientModule],
})
export class ProductListComponent implements OnInit {
  products: Product[] = [];
  searchQuery: string = '';

  constructor(private productService: ProductService, private router: Router) {}

  ngOnInit(): void {
      this.productService.getProducts().subscribe({
        next: (data: Product[]) => this.products = data,
        error: (error) => console.error('Error fetching products', error)
      });
    }

    filteredProducts(): Product[] {
      return this.products.filter((product) =>
        product.name.toLowerCase().includes(this.searchQuery.toLowerCase())
      );
    }

    onAddProduct(): void {
      this.router.navigate(['/register']);
    }
  }
