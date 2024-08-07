import { enableProdMode, importProvidersFrom } from '@angular/core';
import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';
import { ProductFormComponent } from './app/components/product-form/product-form.component';
import { HttpClientModule } from '@angular/common/http';
import { ReactiveFormsModule } from '@angular/forms';
import { ProductListComponent } from './app/components/product-list/product-list.component';


// bootstrapApplication(ProductFormComponent, {
//   providers: [
//     importProvidersFrom(HttpClientModule, ReactiveFormsModule)
//   ]
// });

bootstrapApplication(ProductListComponent, {
  providers: [
    importProvidersFrom(HttpClientModule, ReactiveFormsModule)
  ]
});
