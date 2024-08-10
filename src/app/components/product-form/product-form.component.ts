// import { Component } from '@angular/core';
// import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
// import { HttpClientModule } from '@angular/common/http';
// import { CommonModule } from '@angular/common';
// import { ProductService } from '../../services/product.service';
// import { Product } from '../../models/product.model';
// import { Router } from '@angular/router';

// @Component({
//   selector: 'app-product-form',
//   templateUrl: './product-form.component.html',
//   styleUrls: ['./product-form.component.scss'],
//   standalone: true,
//   imports: [ReactiveFormsModule, HttpClientModule, CommonModule]
// })
// export class ProductFormComponent {
//   productForm: FormGroup;

//   constructor(private fb: FormBuilder, private productService: ProductService, private router: Router) {
//     this.productForm = this.fb.group({
//       id: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(10)]],
//       name: ['', [Validators.required, Validators.minLength(5), Validators.maxLength(100)]],
//       description: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(200)]],
//       logo: ['', Validators.required],
//       date_release: ['', Validators.required],
//       date_revision: [{ value: '', disabled: true }, Validators.required]
//     });

//     this.productForm.get('date_release')?.valueChanges.subscribe(date => {
//       if (date) {
//         const date_revision = new Date(date);
//         date_revision.setFullYear(date_revision.getFullYear() + 1);
//         this.productForm.get('date_revision')?.setValue(date_revision.toISOString().substring(0, 10));
//       }
//     });
//   }

//   onSubmit() {
//     if (this.productForm.valid) {
//       const product: Product = this.productForm.getRawValue();
//       this.productService.addProduct(product).subscribe({
//         next: (response) => {
//           console.log('Product added successfully', response),
//           this.router.navigate(['/products']);
//         },
//         error: (error) => console.error('There was an error!', error)
//       });
//     }
//   }

//   resetForm() {
//     this.productForm.reset();
//   }
// }

import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { ProductService } from '../../services/product.service';
import { Product } from '../../models/product.model';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-product-form',
  templateUrl: './product-form.component.html',
  styleUrls: ['./product-form.component.scss'],
  standalone: true,
  imports: [ReactiveFormsModule, HttpClientModule, CommonModule]
})
export class ProductFormComponent implements OnInit {
  productForm: FormGroup;
  isEditMode: boolean = false;
  productId: string | null = null;

  constructor(
    private fb: FormBuilder,
    private productService: ProductService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.productForm = this.fb.group({
      id: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(10)]],
      name: ['', [Validators.required, Validators.minLength(5), Validators.maxLength(100)]],
      description: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(200)]],
      logo: ['', Validators.required],
      date_release: ['', Validators.required],
      date_revision: [{ value: '', disabled: true }, Validators.required]
    });

    this.productForm.get('date_release')?.valueChanges.subscribe(date => {
      if (date) {
        const date_revision = new Date(date);
        date_revision.setFullYear(date_revision.getFullYear() + 1);
        this.productForm.get('date_revision')?.setValue(date_revision.toISOString().substring(0, 10));
      }
    });
  }

  ngOnInit(): void {
    this.productId = this.route.snapshot.paramMap.get('id');
    this.isEditMode = !!this.productId;

    if (this.isEditMode && this.productId) {
      this.loadProduct(this.productId);
    }
  }

  loadProduct(id: string) {
    this.productService.getProductById(id).subscribe({
      next: (product: Product) => {
        this.productForm.patchValue(product);
        this.productForm.get('id')?.disable();
      },
      error: (error) => console.error('Error loading product', error)
    });
  }

  onSubmit() {
    if (this.productForm.valid) {
      const product: Product = this.productForm.getRawValue();

      if (this.isEditMode) {
        this.productService.updateProduct(this.productId!, product).subscribe({
          next: (response) => {
            console.log('Product updated successfully', response);
            this.router.navigate(['/products']);
          },
          error: (error) => console.error('There was an error!', error)
        });
      } else {
        this.productService.addProduct(product).subscribe({
          next: (response) => {
            console.log('Product added successfully', response);
            this.router.navigate(['/products']);
          },
          error: (error) => console.error('There was an error!', error)
        });
      }
    }
  }

  resetForm() {
    this.productForm.reset();
    if (this.isEditMode && this.productId) {
      this.loadProduct(this.productId);
    }
  }
}
