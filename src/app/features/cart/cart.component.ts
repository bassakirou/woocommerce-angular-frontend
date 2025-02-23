import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CartService } from '../../core/services/cart.service';
import { Observable } from 'rxjs';
import { CartItem } from '../../core/services/cart.service';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  standalone: true,
  imports: [CommonModule]
})
export class CartComponent implements OnInit {
  cartItems$ = this.cartService.cart$;
  total$ = this.cartService.getTotal();

  constructor(private cartService: CartService) {}

  ngOnInit(): void {}

  updateQuantity(itemId: number, quantity: number): void {
    this.cartService.updateQuantity(itemId, quantity);
  }

  removeFromCart(itemId: number): void {
    this.cartService.removeFromCart(itemId);
  }

  clearCart(): void {
    this.cartService.clearCart();
  }

  getImageUrl(item: CartItem): string {
    return item.images?.[0]?.src || '';
  }

  getItemTotal(item: CartItem): number {
    const price = typeof item.price === 'string' 
      ? parseFloat(item.price.replace(/[^0-9.-]+/g, ''))
      : item.price;
    return (price || 0) * (item.quantity || 0);
  }
}
