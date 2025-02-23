import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { CartService } from '../../services/cart.service';
import { map, Observable } from 'rxjs';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './header.component.html'
})
export class HeaderComponent {
  menuItems = [
    { label: 'Boutique', link: '/products' },
    { label: 'Tutoriels', link: '/tutorials' },
    { label: 'À propos', link: '/about' },
    { label: 'Panier', link: '/cart' }
  ];
  cartItemCount$: Observable<number>;

  constructor(private cartService: CartService) {
    this.cartItemCount$ = this.cartService.cart$.pipe(
      map(items => items.reduce((total, item) => total + item.quantity, 0))
    );
  }
}
