import { bootstrapApplication } from '@angular/platform-browser';
import { Routes, provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { ProductListComponent } from './app/components/product-list/product-list.component';
import { ProductFormComponent } from './app/components/product-form/product-form.component';
import { AppComponent } from './app/app.component';

const routes: Routes = [
  { path: 'products', component: ProductListComponent },
  { path: 'register', component: ProductFormComponent },
  { path: '', redirectTo: '/products', pathMatch: 'full' },
  { path: '**', redirectTo: '/products' },
];

bootstrapApplication(AppComponent, {
  providers: [
    provideRouter(routes),
    provideHttpClient()
  ]
});