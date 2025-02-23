import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CartService } from '../../../core/services/cart.service';
import { animate, style, transition, trigger } from '@angular/animations';
import { Router } from '@angular/router';
import { take } from 'rxjs/operators';

@Component({
  selector: 'app-modal-cart',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './modal-cart.component.html',
  animations: [
    trigger('modalAnimation', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateX(100%)' }),
        animate('200ms ease-out', style({ opacity: 1, transform: 'translateX(0)' }))
      ]),
      transition(':leave', [
        animate('200ms ease-in', style({ opacity: 0, transform: 'translateX(100%)' }))
      ])
    ]),
    trigger('overlayAnimation', [
      transition(':enter', [
        style({ opacity: 0 }),
        animate('200ms ease-out', style({ opacity: 0.5 }))
      ]),
      transition(':leave', [
        animate('200ms ease-in', style({ opacity: 0 }))
      ])
    ])
  ]
})
export class ModalCartComponent {
  @Input() isOpen = false;
  @Output() isOpenChange = new EventEmitter<boolean>();

  cart$ = this.cartService.cart$;
  total$ = this.cartService.getTotal();

  constructor(
    public cartService: CartService,
    private router: Router
  ) {}

  updateQuantity(productId: number, quantity: number): void {
    if (quantity <= 0) {
      this.removeItem(productId);
    } else {
      this.cartService.updateQuantity(productId, quantity);
    }
  }

  removeItem(productId: number): void {
    this.cartService.removeFromCart(productId);
  }

  clearCart(): void {
    this.cartService.clearCart();
  }

  checkout(): void {
    // Utiliser l'Observable cart$ pour obtenir les éléments du panier
    this.cart$.pipe(take(1)).subscribe(cartItems => {
      // Construire les paramètres de l'URL de commande
      const queryParams = {
        items: JSON.stringify(cartItems.map(item => ({
          product_id: item.id,
          quantity: item.quantity
        })))
      };

      // Fermer le modal
      this.close();

      // Naviguer vers la page de commande avec les paramètres
      this.router.navigate(['/checkout'], { queryParams });
    });
  }

  close(): void {
    this.isOpen = false;
    this.isOpenChange.emit(false);
  }
}
