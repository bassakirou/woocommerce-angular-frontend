import { Routes } from '@angular/router';
import { ProductListComponent } from './features/products/product-list/product-list.component';
import { CheckoutComponent } from './features/checkout/checkout/checkout.component';
import { ThankYouComponent } from './features/checkout/thank-you/thank-you.component';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'products',
    pathMatch: 'full'
  },
  {
    path: 'products',
    loadComponent: () => import('./features/products/product-list/product-list.component')
      .then(m => m.ProductListComponent)
  },
  {
    path: 'category/:id',
    loadComponent: () => import('./features/products/product-list/product-list.component')
      .then(m => m.ProductListComponent)
  },
  {
    path: 'cart',
    loadComponent: () => import('./features/cart/cart.component')
      .then(m => m.CartComponent)
  },
  {
    path: 'checkout',
    loadComponent: () => import('./features/checkout/checkout/checkout.component')
      .then(m => m.CheckoutComponent)
  },
  {
    path: 'thank-you',
    loadComponent: () => import('./features/checkout/thank-you/thank-you.component')
      .then(m => m.ThankYouComponent)
  }
];
