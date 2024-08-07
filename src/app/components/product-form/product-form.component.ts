import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { ProductService } from '../../services/product.service';
import { Product } from '../../models/product.model';

@Component({
  selector: 'app-product-form',
  templateUrl: './product-form.component.html',
  styleUrls: ['./product-form.component.scss'],
  standalone: true,
  imports: [ReactiveFormsModule, HttpClientModule, CommonModule]
})
export class ProductFormComponent {
  productForm: FormGroup;

  constructor(private fb: FormBuilder, private productService: ProductService) {
    this.productForm = this.fb.group({
      id: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(10)]],
      name: ['', [Validators.required, Validators.minLength(5), Validators.maxLength(100)]],
      description: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(200)]],
      logo: ['', Validators.required],
      releaseDate: ['', Validators.required],
      reviewDate: [{ value: '', disabled: true }, Validators.required]
    });

    this.productForm.get('releaseDate')?.valueChanges.subscribe(date => {
      if (date) {
        const reviewDate = new Date(date);
        reviewDate.setFullYear(reviewDate.getFullYear() + 1);
        this.productForm.get('reviewDate')?.setValue(reviewDate.toISOString().substring(0, 10));
      }
    });
  }

  onSubmit() {
    if (this.productForm.valid) {
      const product: Product = this.productForm.getRawValue();
      this.productService.addProduct(product).subscribe({
        next: (response) => console.log('Product added successfully', response),
        error: (error) => console.error('There was an error!', error)
      });
    }
  }

  resetForm() {
    this.productForm.reset();
  }
}
