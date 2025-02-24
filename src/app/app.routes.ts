import { Routes } from '@angular/router';
import { ProductListComponent } from './features/products/product-list/product-list.component';
import { CheckoutComponent } from './features/checkout/checkout/checkout.component';
import { ThankYouComponent } from './features/checkout/thank-you/thank-you.component';
import { CartComponent } from './features/cart/cart.component';
import { BlogListComponent } from './features/blog/blog-list/blog-list.component';
import { BlogPostComponent } from './features/blog/blog-post/blog-post.component';

export const routes: Routes = [
  { path: '', component: ProductListComponent },
  { path: 'cart', component: CartComponent },
  { path: 'checkout', component: CheckoutComponent },
  { path: 'thank-you', component: ThankYouComponent },
  { 
    path: 'blog',
    loadComponent: () => import('./features/blog/blog-list/blog-list.component')
      .then(m => m.BlogListComponent)
  },
  { 
    path: 'blog/:id',
    loadComponent: () => import('./features/blog/blog-post/blog-post.component')
      .then(m => m.BlogPostComponent)
  },
  { path: '**', redirectTo: '' }
];
