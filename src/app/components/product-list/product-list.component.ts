import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { Product } from '../../models/product.model';
import { ProductService } from '../../services/product.service';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.scss'],
  standalone: true,
  imports: [CommonModule, HttpClientModule, FormsModule],
})
export class ProductListComponent implements OnInit {
  products: Product[] = [];
  searchQuery: string = '';
  isMenuOpen: boolean = false;
  isModalOpen: boolean = false;
  selectedProduct: Product | null = null;
  openMenuProductId: string | null = null;
  pageSize: number = 5;
  pageSizes: number[] = [5, 10, 20];
  currentPage: number = 1;

  constructor(private productService: ProductService, private router: Router) {}

  ngOnInit(): void {
    this.productService.getProducts().subscribe({
      next: (data: Product[]) => (this.products = data),
      error: (error) => console.error('Error fetching products', error),
    });
  }

  get filteredProducts(): Product[] {
    const filtered = this.products.filter((product) =>
      product.name.toLowerCase().includes(this.searchQuery.toLowerCase())
    );
    const start = (this.currentPage - 1) * this.pageSize;
    const end = start + this.pageSize;
    return filtered.slice(start, end);
  }

  onAddProduct(): void {
    this.router.navigate(['/register']);
  }

  toggleMenu(productId: string): void {
    if (this.openMenuProductId === productId) {
      this.openMenuProductId = null; 
    } else {
      this.openMenuProductId = productId;
    }
  }

  openModal(product: Product): void {
    this.selectedProduct = product;
    this.isModalOpen = true;
  }

  closeModal(): void {
    this.isModalOpen = false;
    this.selectedProduct = null;
  }

  confirmDelete(): void {
    if (this.selectedProduct) {
      this.productService.deleteProduct(this.selectedProduct.id).subscribe({
        next: () => {
          this.products = this.products.filter(
            (p) => p.id !== this.selectedProduct?.id
          );
          this.closeModal();
          console.log(
            `Producto ${this.selectedProduct?.name} eliminado con éxito.`
          );
        },
        error: (error) => console.error('Error eliminando el producto', error),
      });
    }
  }

  editProduct(id: string) {
    this.router.navigate(['/edit', id]);
    console.log(id,'-<-<-<-<-<-<-')
  }

  onPageSizeChange(event: any): void {
    this.pageSize = +event.target.value;
    this.currentPage = 1;
  }

  onPageChange(page: number): void {
    this.currentPage = page;
  }
}
